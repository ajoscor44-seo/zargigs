import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { FaArrowLeft, FaCircleCheck, FaSpinner, FaShieldHalved } from "react-icons/fa6";
import { MdEmail, MdRefresh } from "react-icons/md";
import OtpInput from "../OTPInput/OTPInput";
import { Link } from "react-router-dom/cjs/react-router-dom";

const VerifyEmail = ({ isLoginPage, setNotVerified }) => {
  const { verifyUserEmail, adminData, resendOTP } = useAuth();
  const [otp, setOtp] = useState(Array(4).fill(""));
  const email = sessionStorage.getItem("auth-user-email");
  const [emailVerified, setEmailVerified] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const appName = adminData?.appName || "DocsZar";

  const showLoginContent = () => {
    if (isLoginPage) {
      return setNotVerified(false);
    }
  };

  const verifyEmail = async () => {
    try {
      setLoading(true);
      setError(null);
      await verifyUserEmail(email, otp.join(""));
      sessionStorage.removeItem("auth-user-email");
      setLoading(false);
      return setEmailVerified(true);
    } catch (err) {
      setLoading(false);
      setEmailVerified(false);
      sessionStorage.setItem("auth-user-email", email);
      return setError(err.message || "Invalid OTP code");
    }
  };

  const resendNewOTP = async () => {
    try {
      setResending(true);
      setError(null);
      const res = await resendOTP(email);
      setResending(false);
      return setMessage(res.message || "New OTP code sent to your email.");
    } catch (err) {
      setResending(false);
      setMessage(null);
      return setError(err.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-primary">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-6 sm:p-8">
        {emailVerified ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
              <FaCheckCircle size={36} />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Email Verified Successfully!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
              Your {appName} account is active and ready. You can now log in to start earning and managing your gigs.
            </p>
            <div className="pt-2">
              <Link to="/login">
                <button
                  onClick={showLoginContent}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  Proceed to Login
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <button
                type="button"
                onClick={showLoginContent}
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
              >
                <FaArrowLeft size={12} />
                <span>Back to Login</span>
              </button>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Security
              </span>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <FaShieldHalved size={26} />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Verify Your Email
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xs mx-auto">
                We sent a 4-digit verification code to:
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-bold font-mono mt-2">
                <MdEmail size={14} className="text-slate-500" />
                <span>{email || "your registered email"}</span>
              </div>
            </div>

            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span>{message}</span>
              </div>
            )}

            {/* OTP Input and Submit */}
            <div className="space-y-4">
              <div className="flex justify-center py-2">
                <OtpInput otp={otp} setOtp={setOtp} error={error} />
              </div>

              <button
                onClick={verifyEmail}
                disabled={loading || otp.join("").length < 4}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" size={16} />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <span>Verify Account</span>
                )}
              </button>
            </div>

            {/* Resend and Info */}
            <div className="pt-2 text-center space-y-3">
              <p className="text-xs text-slate-500">
                Didn't receive the code? Check spam or{" "}
                <button
                  type="button"
                  onClick={resendNewOTP}
                  disabled={resending}
                  className="text-emerald-600 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  {resending ? (
                    <FaSpinner className="animate-spin" size={11} />
                  ) : (
                    <MdRefresh size={14} />
                  )}
                  <span>Resend Code</span>
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;

