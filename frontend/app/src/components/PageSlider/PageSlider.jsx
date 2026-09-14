import React, { useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaSpinner,
  FaCheck,
  FaShieldHalved,
  FaUser,
  FaLock,
  FaPhone,
  FaUsers,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import OAuth from "../OAuth/OAuth";

const PageSlider = ({
  errorMsg,
  setError,
  isLoading,
  pages,
  handleChange,
  handleSubmit,
  handleInputError,
  formData,
  referralUsername,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const stepLabels = [
    { name: "Account Details", step: 1 },
    { name: "Security & Handle", step: 2 },
  ];

  const nextPage = (e) => {
    if (e) e.preventDefault();
    const inputError = handleInputError(currentPage);
    if (inputError) {
      return;
    }
    if (currentPage === pages.length - 1) {
      return handleSubmit();
    }
    if (setError) setError(null);
    setCurrentPage((prev) => Math.min(prev + 1, pages.length - 1));
  };

  const prevPage = () => {
    if (currentPage === 0) return;
    if (setError) setError(null);
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const activePage = pages[currentPage];

  return (
    <div className="flex flex-col">
      {/* Ultra Compact Step Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between gap-2">
          {stepLabels.map((step, idx) => {
            const isDone = idx < currentPage;
            const isCurrent = idx === currentPage;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (idx < currentPage) {
                    if (setError) setError(null);
                    setCurrentPage(idx);
                  }
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
                  isCurrent
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : isDone
                    ? "bg-slate-100 text-emerald-700 hover:bg-slate-200 cursor-pointer"
                    : "bg-slate-50 text-slate-400 opacity-60"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                    isDone
                      ? "bg-emerald-600 text-white"
                      : isCurrent
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {isDone ? <FaCheck size={8} /> : idx + 1}
                </span>
                <span className="truncate">{step.name}</span>
              </button>
            );
          })}
        </div>

        <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentPage + 1) / pages.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Title Header */}
      <div className="text-center mb-3">
        <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
          {activePage.title}
        </h2>
        <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
          {activePage.info}
        </p>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="mb-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
          <span className="truncate">{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: Account Intent & Basic Info */}
      {currentPage === 0 && (
        <form onSubmit={nextPage} className="space-y-3">
          {/* Account Role Selector */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  handleChange({ target: { name: "accountType", value: "earner" } })
                }
                className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                  (formData?.accountType || "earner") === "earner"
                    ? "border-emerald-500 bg-emerald-50/70 ring-1 ring-emerald-500/20 shadow-xs"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <span className="text-sm">⚡</span>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs text-slate-900">Task Earner</div>
                  <div className="text-[9px] text-slate-500 truncate">Earn daily cash</div>
                </div>
                {(formData?.accountType || "earner") === "earner" && (
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[7px] shrink-0">
                    <FaCheck />
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  handleChange({ target: { name: "accountType", value: "advertiser" } })
                }
                className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                  formData?.accountType === "advertiser"
                    ? "border-purple-500 bg-purple-50/70 ring-1 ring-purple-500/20 shadow-xs"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <span className="text-sm">📢</span>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs text-slate-900">Advertiser</div>
                  <div className="text-[9px] text-slate-500 truncate">Promote campaigns</div>
                </div>
                {formData?.accountType === "advertiser" && (
                  <span className="w-3.5 h-3.5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[7px] shrink-0">
                    <FaCheck />
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* First Name & Last Name (Side by Side) */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Firstname
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                  <FaUser size={11} />
                </div>
                <input
                  type="text"
                  name="firstname"
                  required
                  placeholder="John"
                  value={formData?.firstname || ""}
                  onChange={handleChange}
                  className="w-full pl-7 pr-2.5 py-2 sm:py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Lastname
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                  <FaUser size={11} />
                </div>
                <input
                  type="text"
                  name="lastname"
                  required
                  placeholder="Doe"
                  value={formData?.lastname || ""}
                  onChange={handleChange}
                  className="w-full pl-7 pr-2.5 py-2 sm:py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                <MdEmail size={14} />
              </div>
              <input
                type="email"
                name="email"
                required
                placeholder="john.doe@example.com"
                value={formData?.email || ""}
                onChange={handleChange}
                className="w-full pl-7 pr-3 py-2 sm:py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Phone Number & Referrer (Side by Side) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                  <FaPhone size={11} />
                </div>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="08012345678"
                  value={formData?.phone || ""}
                  onChange={handleChange}
                  className="w-full pl-7 pr-3 py-2 sm:py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Referral Code (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                  <FaUsers size={12} />
                </div>
                <input
                  type="text"
                  name="referredBy"
                  placeholder="admin"
                  disabled={!!referralUsername}
                  value={formData?.referredBy || ""}
                  onChange={handleChange}
                  className="w-full pl-7 pr-3 py-2 sm:py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all disabled:opacity-60"
                />
              </div>
            </div>
          </div>

          {/* Navigation Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={nextPage}
              className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-500/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Next: Set Password</span>
              <FaArrowRight size={11} />
            </button>
          </div>

          {/* Google OAuth on Step 1 */}
          <div className="pt-2 border-t border-slate-100">
            <OAuth setError={setError} text="Sign up with Google" />
          </div>
        </form>
      )}

      {/* STEP 2: Handle & Security */}
      {currentPage === 1 && (
        <form onSubmit={nextPage} className="space-y-3">
          {/* Username */}
          <div>
            <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Username Handle
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400 font-mono text-xs">
                @
              </div>
              <input
                type="text"
                name="username"
                required
                placeholder="yourhandle"
                value={formData?.username || ""}
                onChange={handleChange}
                className="w-full pl-7 pr-3 py-2 sm:py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Create Password (min. 6 characters)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                <FaLock size={11} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="••••••••"
                value={formData?.password || ""}
                onChange={handleChange}
                className="w-full pl-7 pr-9 py-2 sm:py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                <FaLock size={11} />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                required
                placeholder="••••••••"
                value={formData?.confirmPassword || ""}
                onChange={handleChange}
                className="w-full pl-7 pr-9 py-2 sm:py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                {showConfirmPassword ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
              </button>
            </div>
          </div>

          {/* Buttons: Back & Complete */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={prevPage}
              className="py-2.5 px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-98 text-slate-700 font-bold text-xs transition-all flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <FaArrowLeft size={10} />
              <span>Back</span>
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 sm:py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-500/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" size={14} />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <FaShieldHalved size={13} />
                  <span>Complete Free Signup</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PageSlider;
