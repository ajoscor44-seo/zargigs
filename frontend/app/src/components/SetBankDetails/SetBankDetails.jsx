import React, { useState, useEffect, useMemo, useRef } from "react";
import { FiArrowRight, FiArrowLeft, FiCheckCircle, FiSearch, FiAlertCircle, FiEdit3 } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa6";
import { bankService } from "../../services/supabaseService";
import { NIGERIAN_BANKS } from "../../data/nigerianBanks";

const SetBankDetails = ({
  setActivePage,
  setError,
  bankDetails,
  setBankDetails,
  selectedBank,
  setSelectedBank,
}) => {
  const [bankList] = useState(NIGERIAN_BANKS);
  const [bankSearch, setBankSearch] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(
    Boolean(
      bankDetails?.accountName &&
      !bankDetails.accountName.toLowerCase().includes("unknown") &&
      !bankDetails.accountName.toLowerCase().includes("invalid")
    )
  );
  const [validationError, setValidationError] = useState(null);
  const [manualNameMode, setManualNameMode] = useState(false);
  const debounceRef = useRef(null);

  // Clear any corrupted 'Unknown' account names on mount
  useEffect(() => {
    if (
      bankDetails?.accountName &&
      (bankDetails.accountName.toLowerCase().includes("unknown") ||
       bankDetails.accountName.toLowerCase().includes("invalid"))
    ) {
      setBankDetails((prev) => ({ ...prev, accountName: "" }));
      setIsVerified(false);
    }
  }, []);

  // Filter banks by search keyword
  const filteredBanks = useMemo(() => {
    if (!bankSearch.trim()) return bankList;
    const search = bankSearch.toLowerCase().trim();
    return bankList.filter(
      (b) =>
        b.name.toLowerCase().includes(search) ||
        (b.code && b.code.includes(search))
    );
  }, [bankList, bankSearch]);

  const verifyWithPocketFi = async (accNum, bankName) => {
    if (!accNum || accNum.length !== 10 || !bankName) return;
    const foundBank = bankList.find(
      (b) => b.name.toLowerCase() === bankName.toLowerCase()
    );
    const bankCode = foundBank?.code || "";

    try {
      setVerifying(true);
      setValidationError(null);

      const result = await bankService.verifyAccount(accNum, bankCode, bankName);

      if (
        result?.status === "success" &&
        result.accountName &&
        !result.accountName.toLowerCase().includes("unknown") &&
        !result.accountName.toLowerCase().includes("invalid")
      ) {
        setBankDetails((prev) => ({
          ...prev,
          bankName: bankName,
          bankCode: result.bankCode || bankCode,
          accountNumber: accNum,
          accountName: result.accountName,
        }));
        setIsVerified(true);
        setManualNameMode(false);
        setValidationError(null);
      } else {
        setIsVerified(false);
        setValidationError("Could not verify account name for this bank. Please check your bank selection or enter your name manually.");
        setManualNameMode(true);
      }
    } catch (err) {
      setIsVerified(false);
      setValidationError(err.message || "Could not verify account. You can type your account name manually below.");
      setManualNameMode(true);
    } finally {
      setVerifying(false);
    }
  };

  const handleBankChange = (e) => {
    const newBank = e.target.value;
    setSelectedBank(newBank);
    setIsVerified(false);
    setValidationError(null);
    setBankDetails((prev) => ({
      ...prev,
      bankName: newBank,
      accountName: "",
    }));

    const targetAcct = bankDetails?.accountNumber;
    if (targetAcct && targetAcct.length === 10 && newBank) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        verifyWithPocketFi(targetAcct, newBank);
      }, 350);
    }
  };

  const handleAccountNumberChange = (e) => {
    const cleanNum = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
    setBankDetails((prev) => ({
      ...prev,
      accountNumber: cleanNum,
      accountName: cleanNum.length < 10 ? "" : prev.accountName,
    }));
    setIsVerified(false);
    setValidationError(null);

    if (cleanNum.length === 10 && selectedBank) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        verifyWithPocketFi(cleanNum, selectedBank);
      }, 350);
    }
  };

  const handleManualAccountName = (e) => {
    const name = e.target.value;
    setBankDetails((prev) => ({
      ...prev,
      accountName: name,
    }));
    if (name.trim().length >= 3) {
      setIsVerified(true);
    }
  };

  const setDetails = () => {
    if (setError) setError(null);
    setActivePage("birth-religion");
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-5 font-primary">
      {/* Top Header & Navigation */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <button
          type="button"
          onClick={() => setActivePage("upload-profile-pic")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100/80 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
        >
          <FiArrowLeft size={12} />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={() => setActivePage("birth-religion")}
          className="text-xs font-bold text-slate-400 hover:text-emerald-600 transition-colors py-1 px-2 cursor-pointer"
        >
          Skip for now
        </button>
      </div>

      {/* PocketFi Verified Banking Title Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200 mb-1.5">
          ⚡ PocketFi Verified Banking
        </div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Link Receiving Bank Account
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Connect your Nigerian bank account for automated earnings validation and withdrawals.
        </p>
      </div>

      {/* Form Fields matching Image 1 */}
      <div className="space-y-4">
        {/* 1. Select Nigerian Bank */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Select Nigerian Bank
          </label>

          {/* Search Input */}
          <div className="relative mb-2">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <FiSearch size={14} />
            </div>
            <input
              type="text"
              placeholder="Search bank name (e.g. PalmPay, Opay, GTB, Zenith, Moniepoint)..."
              value={bankSearch}
              onChange={(e) => setBankSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 focus:bg-white text-slate-800 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Bank Select Dropdown */}
          <select
            value={selectedBank || ""}
            onChange={handleBankChange}
            className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-900 font-bold text-xs sm:text-sm px-3.5 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all cursor-pointer"
          >
            <option value="">-- Choose your bank ({filteredBanks.length} available) --</option>
            {filteredBanks.map((b, idx) => (
              <option key={`${b.code || b.name}-${idx}`} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* 2. 10-Digit Bank Account Number */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-700">
              10-Digit Bank Account Number
            </label>
            {verifying && (
              <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                <FaSpinner className="animate-spin" size={11} />
                <span>Verifying with PocketFi...</span>
              </span>
            )}
          </div>
          <input
            type="text"
            inputMode="numeric"
            maxLength={10}
            name="accountNumber"
            value={bankDetails?.accountNumber || ""}
            onChange={handleAccountNumberChange}
            placeholder="e.g. 8103460237"
            className="w-full bg-slate-50 focus:bg-white text-slate-900 font-black text-base sm:text-lg px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-mono tracking-wider placeholder:text-slate-300 placeholder:font-normal"
          />
        </div>

        {/* 3. Verified Account Name Card */}
        {isVerified && bankDetails?.accountName && !manualNameMode && (
          <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-emerald-950 flex items-center gap-3.5 shadow-xs animate-in fade-in zoom-in-95 duration-200">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-600/20">
              <FiCheckCircle size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                Verified Account Name
              </div>
              <div className="text-sm sm:text-base font-black text-slate-900 truncate mt-0.5">
                {bankDetails.accountName}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setManualNameMode(true)}
              className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline cursor-pointer p-1"
            >
              Edit
            </button>
          </div>
        )}

        {/* 4. Manual Account Name Input (when editing or fallback) */}
        {(manualNameMode || (!isVerified && bankDetails?.accountNumber?.length === 10 && !verifying)) && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                <FiEdit3 size={13} className="text-emerald-600" />
                <span>Account Name</span>
              </label>
              <span className="text-[10px] text-slate-400">As shown on your bank app</span>
            </div>
            <input
              type="text"
              value={bankDetails?.accountName || ""}
              onChange={handleManualAccountName}
              placeholder="e.g. ADEKIYA IBUKUN JOSCOR"
              className="w-full bg-slate-50 focus:bg-white text-slate-900 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-400 uppercase"
            />
          </div>
        )}

        {/* Validation Error Alert */}
        {validationError && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-2">
            <FiAlertCircle size={15} className="shrink-0 text-amber-600" />
            <span className="flex-1">{validationError}</span>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => setActivePage("upload-profile-pic")}
          className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-700 font-bold rounded-xl text-xs sm:text-sm transition-all cursor-pointer text-center"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={setDetails}
          disabled={verifying}
          className="flex-2 py-3.5 px-5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black rounded-xl shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm disabled:opacity-50"
        >
          <span>Save Bank Account</span>
          <FiArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default SetBankDetails;

