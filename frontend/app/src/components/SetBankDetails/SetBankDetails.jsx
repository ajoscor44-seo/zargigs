import React, { useState, useEffect, useMemo } from "react";
import { FiCreditCard, FiArrowRight, FiArrowLeft, FiCheckCircle, FiSearch, FiAlertCircle } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa6";
import { bankService } from "../../services/supabaseService";

const SetBankDetails = ({
  setActivePage,
  setError,
  bankDetails,
  setBankDetails,
  selectedBank,
  setSelectedBank,
}) => {
  const [bankList, setBankList] = useState([]);
  const [bankSearch, setBankSearch] = useState("");
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(Boolean(bankDetails?.accountName));
  const [validationError, setValidationError] = useState(null);

  // Fetch live PocketFi bank list (674+ Nigerian banks)
  useEffect(() => {
    let isMounted = true;
    const loadBanks = async () => {
      try {
        setLoadingBanks(true);
        const banks = await bankService.getBanks();
        if (isMounted && banks && banks.length > 0) {
          setBankList(banks);
        }
      } catch (err) {
        console.warn("Failed to load PocketFi banks:", err.message);
      } finally {
        if (isMounted) setLoadingBanks(false);
      }
    };
    loadBanks();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter banks by search keyword
  const filteredBanks = useMemo(() => {
    if (!bankSearch.trim()) return bankList;
    const search = bankSearch.toLowerCase().trim();
    return bankList.filter(
      (b) =>
        b.name.toLowerCase().includes(search) ||
        b.code.includes(search)
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

      if (result?.status === "success" && result.accountName) {
        setBankDetails({
          ...bankDetails,
          bankName: bankName,
          bankCode: result.bankCode || bankCode,
          accountNumber: accNum,
          accountName: result.accountName,
        });
        setIsVerified(true);
        setValidationError(null);
      } else {
        setIsVerified(false);
        setValidationError("Could not resolve account name. Please verify bank details.");
      }
    } catch (err) {
      setIsVerified(false);
      setValidationError(err.message || "Could not verify account with PocketFi.");
    } finally {
      setVerifying(false);
    }
  };

  const handleBankChange = (e) => {
    const newBank = e.target.value;
    setSelectedBank(newBank);
    setIsVerified(false);
    setValidationError(null);

    const targetAcct = bankDetails?.accountNumber;
    if (targetAcct && targetAcct.length === 10 && newBank) {
      verifyWithPocketFi(targetAcct, newBank);
    }
  };

  const handleAccountNumberChange = (e) => {
    const cleanNum = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
    setBankDetails({
      ...bankDetails,
      accountNumber: cleanNum,
    });
    setIsVerified(false);
    setValidationError(null);

    if (cleanNum.length === 10 && selectedBank) {
      verifyWithPocketFi(cleanNum, selectedBank);
    }
  };

  const handleAccountNameChange = (e) => {
    setBankDetails({
      ...bankDetails,
      accountName: e.target.value,
    });
  };

  const setDetails = () => {
    if (setError) setError(null);
    setActivePage("birth-religion");
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-100/80 space-y-4">
      {/* Step Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <button
          type="button"
          onClick={() => setActivePage("upload-profile-pic")}
          className="p-1 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
        >
          <FiArrowLeft size={14} />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={() => setActivePage("birth-religion")}
          className="text-xs font-bold text-slate-400 hover:text-emerald-600 transition-colors py-0.5 px-2 cursor-pointer"
        >
          Skip for now
        </button>
      </div>

      {/* Main Title */}
      <div className="text-center space-y-1">
        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
          <FiCreditCard size={20} />
        </div>
        <h2 className="text-lg font-black text-slate-900 tracking-tight">
          Payout Bank Details
        </h2>
        <p className="text-[11px] sm:text-xs text-slate-500 max-w-sm mx-auto">
          Add your bank account for automated earnings validation & payouts via PocketFi.
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-3.5 pt-1">
        {/* Bank Selection with Search Filter */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">
              Select Bank ({loadingBanks ? "Loading from PocketFi..." : `${bankList.length} Nigerian Banks`})
            </label>
            {loadingBanks && (
              <span className="flex items-center gap-1 text-[9px] text-emerald-600 font-semibold">
                <FaSpinner className="animate-spin" size={9} />
                <span>Fetching PocketFi...</span>
              </span>
            )}
          </div>

          {/* Search box to easily filter the 674 banks */}
          <div className="relative mb-1.5">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
              <FiSearch size={12} />
            </div>
            <input
              type="text"
              placeholder="Type to search bank (e.g. Opay, Kuda, Moniepoint, Access...)"
              value={bankSearch}
              onChange={(e) => setBankSearch(e.target.value)}
              className="w-full pl-7 pr-3 py-1.5 bg-slate-50 focus:bg-white text-slate-800 text-xs rounded-lg border border-slate-200 focus:border-emerald-500 focus:outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          <select
            value={selectedBank || ""}
            onChange={handleBankChange}
            className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-800 font-semibold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-all cursor-pointer"
          >
            <option value="">-- Choose your bank ({filteredBanks.length} available) --</option>
            {filteredBanks.map((b, idx) => (
              <option key={`${b.code || b.name}-${idx}`} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Account Number & Account Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                Account Number
              </label>
              {verifying && (
                <span className="flex items-center gap-1 text-[9px] text-emerald-600 font-bold">
                  <FaSpinner className="animate-spin" size={9} />
                  <span>PocketFi Resolving...</span>
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
              placeholder="10-digit NUBAN"
              className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-800 font-semibold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-all font-mono tracking-wider"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                Account Name
              </label>
              {isVerified && (
                <span className="flex items-center gap-0.5 text-[9px] text-emerald-600 font-bold">
                  <FiCheckCircle size={10} />
                  <span>PocketFi Verified</span>
                </span>
              )}
            </div>
            <input
              type="text"
              name="accountName"
              value={bankDetails?.accountName || ""}
              onChange={handleAccountNameChange}
              placeholder={verifying ? "Resolving with PocketFi..." : "Account holder name"}
              className={`w-full font-semibold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border outline-none transition-all ${
                isVerified
                  ? "bg-emerald-50/60 border-emerald-300 text-emerald-950 font-bold"
                  : "bg-slate-50 hover:bg-slate-100/60 focus:bg-white border-slate-200 text-slate-800 focus:border-emerald-500"
              }`}
            />
          </div>
        </div>

        {/* Validation Error Alert */}
        {validationError && (
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
            <FiAlertCircle size={14} className="shrink-0 text-amber-600" />
            <span className="text-[11px] font-medium">{validationError}</span>
          </div>
        )}
      </div>

      {/* Next Step Button */}
      <button
        type="button"
        onClick={setDetails}
        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs sm:text-sm mt-2"
      >
        <span>Save Bank & Continue</span>
        <FiArrowRight size={14} />
      </button>
    </div>
  );
};

export default SetBankDetails;
