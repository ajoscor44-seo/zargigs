import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { FiCreditCard, FiArrowRight, FiArrowLeft, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
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
  const { currentUser } = useAuth();
  const [bankList, setBankList] = useState(FALLBACK_BANKS);
  const [selectedBankCode, setSelectedBankCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [verificationError, setVerificationError] = useState(null);

  // Fetch complete bank list from API
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const res = await axios.get("/api/v1/wallet/public-banks");
        if (res.data?.banks && res.data.banks.length > 0) {
          setBankList(res.data.banks);
        }
      } catch (err) {
        console.warn("Using fallback bank list:", err.message);
      }
    };
    fetchBanks();
  }, []);

  const handleBankChange = (e) => {
    const bankName = e.target.value;
    setSelectedBank(bankName);
    const found = bankList.find((b) => b.name === bankName);
    const code = found ? found.code : "";
    setSelectedBankCode(code);
    setVerificationSuccess(false);
    setVerificationError(null);

    // Auto verify if 10-digit account number is already typed
    if (bankDetails?.accountNumber?.length === 10) {
      verifyAccount(bankDetails.accountNumber, code || bankName);
    }
  };

  const handleBankDetailsChange = (e) => {
    const { name, value } = e.target;
    const cleanValue = name === "accountNumber" ? value.replace(/[^0-9]/g, "") : value;

    setBankDetails({
      ...bankDetails,
      [name]: cleanValue,
    });

    if (name === "accountNumber") {
      setVerificationSuccess(false);
      setVerificationError(null);

      if (cleanValue.length === 10 && selectedBank) {
        verifyAccount(cleanValue, selectedBankCode || selectedBank);
      }
    }
  };

  const verifyAccount = async (accountNum, bankIdent) => {
    if (!accountNum || accountNum.length !== 10 || !bankIdent) return;

    try {
      setVerifying(true);
      setVerificationError(null);
      setError(null);

      const res = await axios.post("/api/v1/wallet/public-verify-account", {
        accountNumber: accountNum,
        bankCode: bankIdent,
        bankName: selectedBank,
      });

      if (res.data?.status === "success" && res.data.accountName) {
        setVerificationSuccess(true);
        setBankDetails((prev) => ({
          ...prev,
          accountNumber: accountNum,
          accountName: res.data.accountName,
        }));
      } else {
        setVerificationSuccess(false);
        setVerificationError("Could not verify account name. Please verify bank and account number.");
      }
    } catch (err) {
      setVerificationSuccess(false);
      const errMsg = err.response?.data?.message || "Account verification failed. Please check the account number.";
      setVerificationError(errMsg);
    } finally {
      setVerifying(false);
    }
  };

  const setDetails = () => {
    if (!selectedBank) {
      return setError("Please select your bank.");
    }
    if (!bankDetails?.accountNumber || bankDetails.accountNumber.length !== 10) {
      return setError("Please provide a valid 10-digit account number.");
    }
    if (!bankDetails?.accountName) {
      return setError("Please wait for account name verification or enter your registered name.");
    }

    setError(null);
    setActivePage("birth-religion");
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100/80 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <button
          onClick={() => setActivePage("upload-profile-pic")}
          className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
        >
          <FiArrowLeft size={16} />
          <span>Back</span>
        </button>

        <button
          onClick={() => setActivePage("birth-religion")}
          className="text-xs font-bold text-slate-400 hover:text-emerald-600 transition-colors py-1 px-3"
        >
          Skip for now
        </button>
      </div>

      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <FiCreditCard size={28} />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900">
          Payout Bank Details
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
          Provide your Nigerian bank account. We automatically verify your account details with the banking network.
        </p>
      </div>

      <div className="space-y-4 pt-2">
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5">
            Bank Name
          </label>
          <select
            value={selectedBank || ""}
            onChange={handleBankChange}
            className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-800 font-semibold text-sm px-4 py-3.5 rounded-2xl border border-slate-200 focus:border-emerald-500 outline-none transition-all"
          >
            <option value="">Select your bank</option>
            {bankList.map((b, idx) => (
              <option key={`${b.code || b.name}-${idx}`} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-600">
              10-Digit Account Number
            </label>
            {verifying && (
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <FaSpinner className="animate-spin" size={12} />
                <span>Verifying with bank...</span>
              </span>
            )}
          </div>
          <input
            type="text"
            maxLength={10}
            name="accountNumber"
            value={bankDetails?.accountNumber || ""}
            onChange={handleBankDetailsChange}
            placeholder="e.g. 0123456789"
            className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-800 font-semibold text-sm px-4 py-3.5 rounded-2xl border border-slate-200 focus:border-emerald-500 outline-none transition-all font-mono"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-600">
              Verified Account Name
            </label>
            {verificationSuccess && (
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <FiCheckCircle size={13} />
                <span>Verified by Bank</span>
              </span>
            )}
          </div>
          <input
            type="text"
            name="accountName"
            value={bankDetails?.accountName || ""}
            onChange={handleBankDetailsChange}
            placeholder={verifying ? "Verifying name..." : "e.g. John Adebayo Doe"}
            className={`w-full text-slate-800 font-semibold text-sm px-4 py-3.5 rounded-2xl border outline-none transition-all ${
              verificationSuccess
                ? "bg-emerald-50/50 border-emerald-300 text-emerald-900 font-bold"
                : "bg-slate-50 hover:bg-slate-100/60 focus:bg-white border-slate-200 focus:border-emerald-500"
            }`}
          />
          {verificationError && (
            <p className="text-[11px] text-rose-500 font-semibold mt-1.5 flex items-center gap-1">
              <FiAlertCircle size={13} />
              <span>{verificationError}</span>
            </p>
          )}
          {!verificationError && (
            <p className="text-[11px] text-slate-400 mt-1">
              {verificationSuccess
                ? "✓ Account verified successfully with banking network."
                : "Enter your 10-digit number to automatically verify account holder name."}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={setDetails}
        disabled={verifying}
        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm disabled:opacity-50"
      >
        <span>Save Bank & Continue</span>
        <FiArrowRight size={16} />
      </button>
    </div>
  );
};

export default SetBankDetails;
