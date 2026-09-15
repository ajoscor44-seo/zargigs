import React, { useState, useEffect } from "react";
import ClientNavbar from "../ClientNavbar/ClientNavbar";
import numeral from "numeral";
import {
  FaLock,
  FaBuilding,
  FaUser,
  FaHistory,
  FaShieldAlt,
  FaCheckCircle,
  FaTimes,
  FaSearch,
  FaCreditCard,
} from "react-icons/fa";
import { FaSpinner } from "react-icons/fa6";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { userService, bankService, walletService } from "../../services/supabaseService";
import { NIGERIAN_BANKS } from "../../data/nigerianBanks";
import ToastNotification from "../ToastNotification/ToastNotification";

const Withdraw = () => {
  const [toastNotifications, setToastNotifications] = useState([]);
  const { adminData, currentUser, fetchUserData, dashboardMode } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [amount, setAmount] = useState("");
  const [withdrawalError, setWithdrawalError] = useState(null);
  const [makingWithdrawal, setMakingWithdrawal] = useState(false);
  const [password, setPassword] = useState("");

  // PocketFi Bank Linking Modal States
  const [showBankModal, setShowBankModal] = useState(false);
  const [bankList, setBankList] = useState(NIGERIAN_BANKS);
  const [selectedBankName, setSelectedBankName] = useState("");
  const [selectedBankCode, setSelectedBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [bankSearch, setBankSearch] = useState("");
  const [verifyingBank, setVerifyingBank] = useState(false);
  const [bankVerified, setBankVerified] = useState(false);
  const [bankModalError, setBankModalError] = useState(null);
  const [savingBank, setSavingBank] = useState(false);

  const isMember = Boolean(currentUser?.isMember || currentUser?.is_member);
  const isAdvertiser = currentUser?.role === "advertiser" || currentUser?.accountType === "advertiser" || dashboardMode === "advertiser";
  const isRestrictedAdvertiser = isAdvertiser && !isMember;

  const minWithdrawal = adminData?.minWithdrawal || 300;
  const balance = currentUser?.balance || currentUser?.userEarnings?.balance || 0;
  const charges = adminData?.withdrawalCharges || 50;
  const amountWithdrawable = balance > charges ? balance - charges : 0;

  const currentBankName =
    currentUser?.bankDetails?.bankName ||
    currentUser?.bankName ||
    currentUser?.bank_name ||
    "";
  const currentAccountNumber =
    currentUser?.bankDetails?.accountNumber ||
    currentUser?.accountNumber ||
    currentUser?.account_number ||
    "";
  const currentAccountName =
    currentUser?.bankDetails?.accountName ||
    currentUser?.accountName ||
    currentUser?.account_name ||
    "";

  const hasBankAccount = Boolean(currentBankName && currentAccountNumber && currentAccountName);

  // Load live PocketFi bank list (674+ Nigerian banks)
  useEffect(() => {
    const fetchPocketfiBanks = async () => {
      try {
        const banks = await bankService.getBanks();
        if (banks && banks.length > 0) {
          setBankList(banks);
        }
      } catch (err) {
        console.warn("Using default PocketFi bank list:", err.message);
      }
    };
    fetchPocketfiBanks();
  }, []);

  // Initialize modal state from current user
  const openBankModal = () => {
    setSelectedBankName(currentBankName);
    const found = bankList.find((b) => b.name?.toLowerCase() === currentBankName?.toLowerCase());
    setSelectedBankCode(found?.code || "");
    setAccountNumber(currentAccountNumber);
    setAccountName(currentAccountName);
    setBankVerified(Boolean(currentAccountName));
    setBankModalError(null);
    setBankSearch("");
    setShowBankModal(true);
  };

  const closeBankModal = () => {
    setShowBankModal(false);
    setBankModalError(null);
  };

  const handleBankSelect = (bank) => {
    setSelectedBankName(bank.name);
    setSelectedBankCode(bank.code);
    setBankVerified(false);
    setBankModalError(null);

    if (accountNumber.length === 10) {
      verifyWithPocketfi(accountNumber, bank.code, bank.name);
    }
  };

  const handleAccountNumberChange = (e) => {
    const cleanNum = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
    setAccountNumber(cleanNum);
    setBankVerified(false);
    setBankModalError(null);

    if (cleanNum.length === 10 && (selectedBankCode || selectedBankName)) {
      verifyWithPocketfi(cleanNum, selectedBankCode, selectedBankName);
    }
  };

  const verifyWithPocketfi = async (accNum, code, name) => {
    if (!accNum || accNum.length !== 10 || (!code && !name)) return;
    try {
      setVerifyingBank(true);
      setBankModalError(null);

      const res = await bankService.verifyAccount(accNum, code, name);

      if (res?.status === "success" && res.accountName) {
        setAccountName(res.accountName);
        setBankVerified(true);
      } else {
        setBankVerified(false);
        setBankModalError("Could not verify account name with PocketFi.");
      }
    } catch (err) {
      setBankVerified(false);
      setBankModalError(
        err.message ||
          "PocketFi account verification failed. Please verify your account number and bank."
      );
    } finally {
      setVerifyingBank(false);
    }
  };

  const handleSaveBankDetails = async () => {
    try {
      if (!selectedBankName) {
        return setBankModalError("Please select your bank.");
      }
      if (!accountNumber || accountNumber.length !== 10) {
        return setBankModalError("Please enter a valid 10-digit account number.");
      }
      if (!accountName) {
        return setBankModalError("Please wait for PocketFi to verify the account name.");
      }

      setSavingBank(true);
      setBankModalError(null);

      await userService.updateBankDetails({
        userId: currentUser?.id,
        bankName: selectedBankName,
        accountNumber,
        accountName,
      });

      await fetchUserData();
      setSavingBank(false);
      closeBankModal();
      showToast({
        msg: "Receiving bank account linked successfully with PocketFi!",
        errorType: "success",
      });
    } catch (err) {
      setSavingBank(false);
      setBankModalError(err.response?.data?.message || err.message || "Failed to save bank details.");
    }
  };

  const showToast = (notificationObj) => {
    setToastNotifications([...toastNotifications, notificationObj]);
    setTimeout(() => {
      setToastNotifications([]);
    }, 3500);
  };

  const makeWithdrawal = async () => {
    try {
      if (isRestrictedAdvertiser) {
        return setWithdrawalError(
          "Advertisers cannot withdraw unspent advertising funds unless they pay the ₦1,000 membership fee."
        );
      }
      if (!hasBankAccount) {
        setWithdrawalError("Please link your receiving bank account before requesting withdrawal.");
        openBankModal();
        return;
      }
      if (!amount) {
        return setWithdrawalError("Please enter the amount you wish to withdraw.");
      }
      if (Number(amount) < minWithdrawal) {
        return setWithdrawalError(`Minimum withdrawal amount is ₦${numeral(minWithdrawal).format("0,0")}.`);
      }
      if (Number(balance) - Number(amount) - Number(charges) < 0) {
        return setWithdrawalError("Insufficient wallet balance (including withdrawal charges).");
      }

      setMakingWithdrawal(true);
      setWithdrawalError(null);

      await walletService.requestWithdrawal({
        userId: currentUser?.id,
        amount: Number(amount),
        bankName: currentBankName,
        accountNumber: currentAccountNumber,
        accountName: currentAccountName,
      });

      setMakingWithdrawal(false);
      setWithdrawalError(null);
      setAmount("");
      setPassword("");
      await fetchUserData();
      showToast({
        msg: "Withdrawal request submitted successfully! Funds will be transferred to your bank.",
        errorType: "success",
      });
    } catch (error) {
      setMakingWithdrawal(false);
      setWithdrawalError(
        error.message || "Failed to process withdrawal request"
      );
    }
  };

  const filteredBanks = bankList.filter((b) =>
    b.name.toLowerCase().includes(bankSearch.toLowerCase())
  );

  return (
    <div className="font-primary text-slate-800 space-y-6">
      {/* Top Header */}
      <div className="pb-2 border-b border-slate-200/70">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Withdraw Earnings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
          Transfer your available task and referral earnings directly to your verified Nigerian bank account.
        </p>
      </div>

      {/* Free Plan Reassurance Banner */}
      {!isAdvertiser && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs font-bold text-base">
            ✓
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-emerald-900">
              Free Plan Withdrawals Fully Supported
            </h3>
            <p className="text-[11px] sm:text-xs text-emerald-700 font-medium mt-0.5">
              You do not need a paid VIP plan to withdraw. Task earners can withdraw anytime directly to their bank account (minimum ₦{numeral(minWithdrawal).format("0,0")}).
            </p>
          </div>
        </div>
      )}

      {/* Advertiser Restriction Alert */}
      {isRestrictedAdvertiser && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="text-xl shrink-0">📢</span>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-amber-900">
                Advertiser Withdrawal Policy
              </h3>
              <p className="text-[11px] sm:text-xs text-amber-800 font-medium mt-0.5 leading-relaxed">
                Advertisers cannot withdraw unspent advertising balance unless they pay the <strong>₦1,000 membership fee</strong>.
              </p>
            </div>
          </div>
          <Link
            to="/become-a-member"
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs text-center shadow-xs transition-colors shrink-0"
          >
            Pay ₦1,000 Fee to Withdraw →
          </Link>
        </div>
      )}

      {/* Error Notification */}
      {withdrawalError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-xs font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
          <span>{withdrawalError}</span>
        </div>
      )}

      {/* 2-Column Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Mobile-Only Balance Card */}
        <div className="block md:hidden">
          <div className="relative rounded-2xl bg-slate-900 p-5 text-white shadow-sm border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                Total Wallet Balance
              </span>
              <span className="text-[10px] font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                Fee: ₦{numeral(charges).format("0,0.00")}
              </span>
            </div>

            <div className="text-2xl font-black text-white tracking-tight mt-1">
              ₦{numeral(balance).format("0,0.00")}
            </div>

            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
              <span>Max Withdrawable:</span>
              <span className="font-bold text-emerald-300">₦{numeral(amountWithdrawable).format("0,0.00")}</span>
            </div>
          </div>
        </div>
        
        {/* Left Column (7 cols): Withdrawal Input & Form */}
        <div className="md:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
            <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-400">
              Payout Details
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Withdrawal Amount (₦)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`Enter amount (min ₦${minWithdrawal})`}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-hidden text-base font-black text-slate-900 placeholder:text-slate-400 rounded-2xl transition-all"
                />
              </div>

              {/* Quick Amount Presets */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                {[300, 500, 1000, 2000, 5000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset.toString())}
                    className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 font-bold text-[11px] transition-colors cursor-pointer"
                  >
                    ₦{numeral(preset).format("0,0")}
                  </button>
                ))}
                {amountWithdrawable >= minWithdrawal && (
                  <button
                    type="button"
                    onClick={() => setAmount(amountWithdrawable.toString())}
                    className="px-2.5 py-1 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-[11px] transition-colors cursor-pointer"
                  >
                    Max (₦{numeral(amountWithdrawable).format("0,0")})
                  </button>
                )}
              </div>

              <p className="text-[11px] text-slate-400 mt-2">
                Transfer fee of ₦{numeral(charges).format("0,0.00")} applies automatically.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Account Login Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your account password"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-hidden text-sm font-medium placeholder:text-slate-400 pr-12 rounded-2xl transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <BsEyeSlashFill size={18} /> : <BsEyeFill size={18} />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Required for security verification on all payout disbursements.
              </p>
            </div>

            <div className="pt-2 space-y-3">
              {isRestrictedAdvertiser ? (
                <Link
                  to="/become-a-member"
                  className="w-full py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 active:scale-[0.99] text-white font-black text-sm flex items-center justify-center gap-2 shadow-sm transition-colors text-center cursor-pointer"
                >
                  Pay ₦1,000 Membership Fee to Withdraw
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={makeWithdrawal}
                  disabled={makingWithdrawal}
                  className={`w-full py-4 rounded-2xl text-white font-black text-sm flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer ${
                    makingWithdrawal
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                      : "bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99]"
                  }`}
                >
                  {makingWithdrawal ? (
                    <>
                      <FaSpinner className="animate-spin" size={16} />
                      <span>Processing Payout...</span>
                    </>
                  ) : (
                    "Confirm & Withdraw Funds"
                  )}
                </button>
              )}

              <Link
                to="/transaction-history"
                className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs"
              >
                <FaHistory size={12} />
                <span>View Withdrawal History</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Desktop Balance, Receiving Bank & Security */}
        <div className="md:col-span-5 space-y-6">
          {/* Desktop-Only Balance Card */}
          <div className="hidden md:block relative rounded-2xl bg-slate-900 p-6 text-white shadow-sm border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                Total Wallet Balance
              </span>
              <span className="text-[10px] font-bold text-slate-300 bg-white/10 px-2 py-0.5 rounded-full">
                Fee: ₦{numeral(charges).format("0,0.00")}
              </span>
            </div>

            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              ₦{numeral(balance).format("0,0.00")}
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
              <span>Max Withdrawable:</span>
              <span className="font-bold text-emerald-300">₦{numeral(amountWithdrawable).format("0,0.00")}</span>
            </div>
          </div>

          {/* Destination Bank Account Card */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Receiving Bank Account
                </span>
                <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  PocketFi Synced
                </span>
              </div>
              <button
                type="button"
                onClick={openBankModal}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
              >
                {hasBankAccount ? "Edit Bank →" : "+ Add Bank"}
              </button>
            </div>

            {hasBankAccount ? (
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200/60 flex items-center justify-center shrink-0">
                    <FaBuilding size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-extrabold text-slate-900 truncate">
                        {currentAccountName}
                      </h4>
                      <FaCheckCircle size={13} className="text-emerald-600 shrink-0" />
                    </div>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      {currentAccountNumber} • {currentBankName}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={openBankModal}
                  className="px-3 py-1.5 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors cursor-pointer shrink-0"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0 text-lg">
                    🏦
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      No account set
                    </h4>
                    <p className="text-xs text-slate-500">
                      Link your Nigerian bank to receive instant withdrawals.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={openBankModal}
                  className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  + Link Bank Account
                </button>
              </div>
            )}
          </div>

          {/* Security & Instant Processing Note */}
          <div className="p-5 rounded-3xl bg-slate-100/90 border border-slate-200/80 space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2 font-black text-slate-900">
              <FaShieldAlt className="text-emerald-600" size={14} />
              <span>Instant Bank Transfer Guarantee</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Approved payout requests are automatically dispatched via PocketFi directly to your bank account.
            </p>
          </div>
        </div>
      </div>

      {/* PocketFi Interactive Bank Linker Modal */}
      {showBankModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200 mb-1">
                  ⚡ PocketFi Verified Banking
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  Link Receiving Bank Account
                </h3>
              </div>
              <button
                type="button"
                onClick={closeBankModal}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <FaTimes size={14} />
              </button>
            </div>

            {/* Error Notification inside modal */}
            {bankModalError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold">
                {bankModalError}
              </div>
            )}

            {/* Bank Form */}
            <div className="space-y-4">
              {/* 1. Bank Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Nigerian Bank
                </label>

                {/* Bank Search Input */}
                <div className="relative mb-2">
                  <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                  <input
                    type="text"
                    value={bankSearch}
                    onChange={(e) => setBankSearch(e.target.value)}
                    placeholder="Search bank name (e.g. Opay, GTB, Zenith, Moniepoint)..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-hidden"
                  />
                </div>

                {/* Bank Dropdown Select */}
                <select
                  value={selectedBankName}
                  onChange={(e) => {
                    const found = bankList.find((b) => b.name === e.target.value);
                    if (found) handleBankSelect(found);
                    else setSelectedBankName(e.target.value);
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-hidden cursor-pointer"
                >
                  <option value="">-- Choose your bank ({filteredBanks.length} banks) --</option>
                  {filteredBanks.map((bank) => (
                    <option key={`${bank.name}_${bank.code}`} value={bank.name}>
                      {bank.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Account Number Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  10-Digit Bank Account Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    value={accountNumber}
                    onChange={handleAccountNumberChange}
                    placeholder="e.g. 0123456789"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-hidden text-base font-black tracking-widest text-slate-900 placeholder:text-slate-400 placeholder:tracking-normal rounded-2xl transition-all"
                  />
                  {verifyingBank && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                      <FaSpinner className="animate-spin" size={14} />
                      <span className="text-[10px]">Verifying...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Verified Account Name Display or Status */}
              {verifyingBank ? (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-2.5 text-xs text-slate-600 font-medium">
                  <FaSpinner className="animate-spin text-emerald-600" size={14} />
                  <span>Verifying account details with PocketFi...</span>
                </div>
              ) : bankVerified && accountName ? (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <FaCheckCircle size={16} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                      Verified Account Name
                    </span>
                    <span className="text-xs sm:text-sm font-black text-slate-900 truncate block">
                      {accountName}
                    </span>
                  </div>
                </div>
              ) : accountNumber.length === 10 && selectedBankName && !verifyingBank ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">Account not yet verified</span>
                  <button
                    type="button"
                    onClick={() => verifyWithPocketfi(accountNumber, selectedBankCode, selectedBankName)}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-all"
                  >
                    Verify Now
                  </button>
                </div>
              ) : null}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={closeBankModal}
                disabled={savingBank}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveBankDetails}
                disabled={savingBank || !selectedBankName || accountNumber.length !== 10 || verifyingBank || !bankVerified}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-extrabold text-xs shadow-md shadow-emerald-600/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {savingBank ? (
                  <>
                    <FaSpinner className="animate-spin" size={14} />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Bank Account</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="toast_cover">
        {toastNotifications?.map((toast, i) => (
          <ToastNotification key={i} toastNotification={toast} />
        ))}
      </div>
    </div>
  );
};

export default Withdraw;
