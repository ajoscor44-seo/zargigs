import React, { useState } from "react";
import ToastNotification from "../ToastNotification/ToastNotification";
import BackNav from "../BackNav/BackNav";
import numeral from "numeral";
import { FaLock, FaUser, FaHistory, FaPaperPlane } from "react-icons/fa";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const Transfer = () => {
  const [toastNotifications, setToastNotifications] = useState([]);
  const { adminData, currentUser, fetchUserData } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [amount, setAmount] = useState("");
  const [receiverUsername, setReceiverUsername] = useState("");
  const [transferError, setTransferError] = useState(null);
  const [makingTransfer, setMakingTransfer] = useState(false);
  const [password, setPassword] = useState("");
  const balance = currentUser?.userEarnings?.balance || 0;
  const charges = adminData?.withdrawalCharges || 0;
  const amountTransferable = balance > charges ? balance - charges : 0;

  const showToast = (notificationObj) => {
    setToastNotifications([...toastNotifications, notificationObj]);
    setTimeout(() => {
      setToastNotifications([]);
      window.location.reload();
    }, 2800);
  };

  const makeTransfer = async () => {
    try {
      if (!amount || !password || !receiverUsername) {
        return setTransferError("Please fill in receiver username, amount, and your login password.");
      }
      if (Number(balance) - Number(amount) - Number(charges) < 0) {
        return setTransferError("Insufficient balance to cover transfer amount + fee.");
      }
      const transfer_data = {
        receiver: receiverUsername.trim().toLowerCase(),
        amount: Number(amount),
        password,
        charges,
      };
      setMakingTransfer(true);
      const response = await axios.post("/api/v1/transfer/make", transfer_data);

      setMakingTransfer(false);
      setTransferError(null);
      await fetchUserData();
      showToast({
        msg: `${response.data.message || "Transfer completed successfully"}`,
        errorType: "success",
      });
    } catch (error) {
      setMakingTransfer(false);
      setTransferError(
        error.response?.data?.message || "Failed to process transfer"
      );
    }
  };

  return (
    <div className="font-primary text-slate-800 space-y-6">
      {/* Top Header */}
      <div className="pb-2 border-b border-slate-200/70">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Transfer Funds
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
          Send funds instantly to any registered DocsZar user with zero escrow delay.
        </p>
      </div>

      {/* Error Notification */}
      {transferError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-xs font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
          <span>{transferError}</span>
        </div>
      )}

      {/* 2-Column Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Mobile-Only Balance Card (Shows at the very top on mobile) */}
        <div className="block md:hidden">
          <div className="relative rounded-2xl bg-slate-900 p-5 text-white shadow-sm border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                Transferrable Balance
              </span>
              <span className="text-[10px] font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                Fee: ₦{numeral(charges).format("0,0.00")}
              </span>
            </div>

            <div className="text-2xl font-black text-white tracking-tight mt-1">
              ₦{numeral(balance).format("0,0.00")}
            </div>

            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
              <span>Max Transfer:</span>
              <span className="font-bold text-indigo-300">₦{numeral(amountTransferable).format("0,0.00")}</span>
            </div>
          </div>
        </div>

        {/* Left Column (7 cols): Transfer Form */}
        <div className="md:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
            <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-400">
              Recipient & Transfer Amount
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Recipient Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={receiverUsername}
                  onChange={(e) => setReceiverUsername(e.target.value)}
                  placeholder="Enter exact recipient username"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-hidden text-sm font-bold placeholder:text-slate-400 rounded-2xl transition-all"
                />
              </div>
              <p className="text-[11px] text-amber-600 font-medium mt-1.5 flex items-center gap-1">
                <span>⚠️</span> Double check recipient username. Peer transfers are instant & irreversible.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Amount (₦)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter transfer amount"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-hidden text-base font-black text-slate-900 placeholder:text-slate-400 rounded-2xl transition-all"
                />
              </div>

              {/* Quick Amount Presets */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                {[500, 1000, 2000, 5000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset.toString())}
                    className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 font-bold text-[11px] transition-colors cursor-pointer"
                  >
                    ₦{numeral(preset).format("0,0")}
                  </button>
                ))}
                {amountTransferable > 0 && (
                  <button
                    type="button"
                    onClick={() => setAmount(amountTransferable.toString())}
                    className="px-2.5 py-1 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-bold text-[11px] transition-colors cursor-pointer"
                  >
                    Max (₦{numeral(amountTransferable).format("0,0")})
                  </button>
                )}
              </div>

              <p className="text-[11px] text-slate-400 mt-2">
                Transfer fee of ₦{numeral(charges).format("0,0.00")} will be deducted from your balance.
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
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-hidden text-sm font-medium placeholder:text-slate-400 pr-12 rounded-2xl transition-all"
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
                Required for transaction verification and security.
              </p>
            </div>

            <div className="pt-2 space-y-3">
              <button
                type="button"
                onClick={makeTransfer}
                disabled={makingTransfer}
                className={`w-full py-3.5 rounded-2xl text-xs sm:text-sm font-black text-white shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                  makingTransfer
                    ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99]"
                }`}
              >
                <FaPaperPlane size={14} />
                <span>{makingTransfer ? "Transferring Funds..." : "Confirm & Send Transfer"}</span>
              </button>

              <Link
                to="/transaction-history"
                className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs"
              >
                <FaHistory size={12} />
                <span>View Transfer History</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Desktop Balance Card & Transfer Guidelines */}
        <div className="md:col-span-5 space-y-6">
          {/* Desktop-Only Balance Card */}
          <div className="hidden md:block relative rounded-2xl bg-slate-900 p-6 text-white shadow-sm border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                Transferrable Balance
              </span>
              <span className="text-[10px] font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                Fee: ₦{numeral(charges).format("0,0.00")}
              </span>
            </div>

            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              ₦{numeral(balance).format("0,0.00")}
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
              <span>Max Transfer:</span>
              <span className="font-bold text-indigo-300">₦{numeral(amountTransferable).format("0,0.00")}</span>
            </div>
          </div>

          {/* Quick Transfer Policy (Renders below Balance on desktop, below Form on mobile) */}
          <div className="p-5 rounded-3xl bg-slate-100/90 border border-slate-200/80 space-y-3 text-xs text-slate-600">
            <h4 className="font-black text-slate-900 flex items-center gap-2">
              <span>⚡</span>
              <span>Instant User-to-User Transfer</span>
            </h4>
            <ul className="text-[11px] leading-relaxed text-slate-500 space-y-2 list-disc pl-4">
              <li>Transfers are processed instantly without any waiting or hold period.</li>
              <li>Recipient gets immediate access to their funds for tasks or withdrawal.</li>
              <li>Always double-check the recipient's username prior to submitting.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="toast_cover">
        {toastNotifications?.map((toast) => (
          <ToastNotification
            key={toast.id}
            toastNotification={toast}
          />
        ))}
      </div>
    </div>
  );
};

export default Transfer;
