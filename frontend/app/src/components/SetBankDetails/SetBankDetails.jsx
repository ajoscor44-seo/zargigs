import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { FiCreditCard, FiArrowRight, FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa6";
import axios from "axios";

const FALLBACK_BANKS = [
  { name: "Opay Digital Services Limited", code: "100004" },
  { name: "PALMPAY", code: "100033" },
  { name: "Moniepoint Microfinance Bank", code: "090405" },
  { name: "Kuda Bank", code: "090267" },
  { name: "Access Bank", code: "000014" },
  { name: "Guaranty Trust Bank (GTB)", code: "000013" },
  { name: "First Bank of Nigeria", code: "000016" },
  { name: "United Bank For Africa (UBA)", code: "000004" },
  { name: "Zenith Bank", code: "000015" },
  { name: "Fidelity Bank", code: "000007" },
  { name: "Wema Bank", code: "000017" },
  { name: "Sterling Bank", code: "000001" },
  { name: "Stanbic IBTC Bank", code: "000012" },
  { name: "Union Bank Of Nigeria", code: "000018" },
  { name: "First City Monument Bank (FCMB)", code: "000003" },
  { name: "Polaris Bank", code: "000008" },
  { name: "Ecobank Nigeria", code: "000010" },
  { name: "VFD Microfinance Bank", code: "090110" },
  { name: "Providus Bank", code: "000023" },
  { name: "Jaiz Bank", code: "000006" },
  { name: "Taj Bank", code: "000026" },
  { name: "9 Payment Service Bank (9PSB)", code: "120001" },
];

const SetBankDetails = ({
  setActivePage,
  setError,
  bankDetails,
  setBankDetails,
  selectedBank,
  setSelectedBank,
}) => {
  const [bankList, setBankList] = useState(FALLBACK_BANKS);
  const [verifying, setVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(Boolean(bankDetails?.accountName));
  const [validationError, setValidationError] = useState(null);

  // Fetch live bank list if available
  useEffect(() => {
    const fetchLiveBanks = async () => {
      try {
        const res = await axios.get("/api/v1/wallet/public-banks");
        if (res.data?.banks && Array.isArray(res.data.banks) && res.data.banks.length > 0) {
          setBankList(res.data.banks);
        }
      } catch {
        // Fallback already in state
      }
    };
    fetchLiveBanks();
  }, []);

  const verifyWithPocketFi = async (accNum, bankName) => {
    if (!accNum || accNum.length !== 10 || !bankName) return;
    const foundBank = bankList.find((b) => b.name === bankName);
    const bankCode = foundBank?.code || bankName;

    try {
      setVerifying(true);
      setValidationError(null);

      const res = await axios.post("/api/v1/wallet/public-verify-account", {
        accountNumber: accNum,
        bankCode,
        bankName,
      });

      if (res.data?.status === "success" && res.data.accountName) {
        setBankDetails({
          ...bankDetails,
          accountNumber: accNum,
          accountName: res.data.accountName,
        });
        setIsVerified(true);
        setValidationError(null);
      } else {
        setIsVerified(false);
        setValidationError(res.data?.message || "Could not verify account name with PocketFi.");
      }
    } catch (err) {
      setIsVerified(false);
      // Soft validation fallback: allow manual name if API endpoint is unreachable
      console.warn("PocketFi validation note:", err.message);
    } finally {
      setVerifying(false);
    }
  };

  const handleBankChange = (e) => {
    const newBank = e.target.value;
    setSelectedBank(newBank);
    setIsVerified(false);
    if (bankDetails?.accountNumber?.length === 10 && newBank) {
      verifyWithPocketFi(bankDetails.accountNumber, newBank);
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
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <button
          onClick={() => setActivePage("upload-profile-pic")}
          className="p-1 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
        >
          <FiArrowLeft size={14} />
          <span>Back</span>
        </button>

        <button
          onClick={() => setActivePage("birth-religion")}
          className="text-xs font-bold text-slate-400 hover:text-emerald-600 transition-colors py-0.5 px-2 cursor-pointer"
        >
          Skip for now
        </button>
      </div>

      <div className="text-center space-y-1">
        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
          <FiCreditCard size={20} />
        </div>
        <h2 className="text-lg font-black text-slate-900 tracking-tight">
          Payout Bank Details
        </h2>
        <p className="text-[11px] sm:text-xs text-slate-500 max-w-sm mx-auto">
          Add your bank account for instant PocketFi earnings validation & payouts.
        </p>
      </div>

      <div className="space-y-3 pt-1">
        <div>
          <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
            Bank Name
          </label>
          <select
            value={selectedBank || ""}
            onChange={handleBankChange}
            className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-800 font-semibold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-all cursor-pointer"
          >
            <option value="">Select bank</option>
            {bankList.map((b, idx) => (
              <option key={`${b.code || b.name}-${idx}`} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                Account Number
              </label>
              {verifying && (
                <span className="flex items-center gap-1 text-[9px] text-emerald-600 font-bold">
                  <FaSpinner className="animate-spin" size={9} />
                  <span>Validating PocketFi...</span>
                </span>
              )}
            </div>
            <input
              type="text"
              maxLength={10}
              name="accountNumber"
              value={bankDetails?.accountNumber || ""}
              onChange={handleAccountNumberChange}
              placeholder="0123456789"
              className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-800 font-semibold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-all font-mono"
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
              placeholder="Account holder name"
              className={`w-full font-semibold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border outline-none transition-all ${
                isVerified
                  ? "bg-emerald-50/50 border-emerald-300 text-emerald-900 font-bold"
                  : "bg-slate-50 hover:bg-slate-100/60 focus:bg-white border-slate-200 text-slate-800 focus:border-emerald-500"
              }`}
            />
          </div>
        </div>

        {validationError && (
          <p className="text-[10px] text-amber-600 font-semibold">
            {validationError}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={setDetails}
        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs sm:text-sm"
      >
        <span>Save Bank & Continue</span>
        <FiArrowRight size={14} />
      </button>
    </div>
  );
};

export default SetBankDetails;
