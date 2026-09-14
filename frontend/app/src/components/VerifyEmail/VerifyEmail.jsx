import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { FaArrowLeft, FaCircleCheck, FaSpinner, FaShieldHalved } from "react-icons/fa6";
import { MdEmail, MdRefresh } from "react-icons/md";
import OtpInput from "../OTPInput/OTPInput";
import { Link, useHistory, useLocation } from "react-router-dom/cjs/react-router-dom";
import { supabase } from "../../config/supabase.config";

const VerifyEmail = ({ isLoginPage, setNotVerified }) => {
  const { verifyUserEmail, adminData, resendOTP, fetchUserData } = useAuth();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [email, setEmail] = useState(() => sessionStorage.getItem("auth-user-email") || "");
  const [emailVerified, setEmailVerified] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const appName = adminData?.appName || "DocsZar";

  // Check URL parameters / hash fragments for email verification callbacks
  useEffect(() => {
    const handleUrlVerification = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const tokenHash = queryParams.get("token_hash");
        const type = queryParams.get("type");

        if (tokenHash && (type === "signup" || type === "email")) {
          setLoading(true);
          await verifyUserEmail(null, null, tokenHash, type);
          setEmailVerified(true);
          setLoading(false);
          return;
        }

        // Check if session exists from confirmation redirect
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user?.email_confirmed_at) {
          await fetchUserData();
          setEmailVerified(true);
        }
      } catch (err) {
        setLoading(false);
        console.warn("Auto verification check:", err.message);
      }
    };

    handleUrlVerification();
  }, [location]);

  const showLoginContent = () => {
    if (isLoginPage && setNotVerified) {
      return setNotVerified(false);
    }
    history.push("/login");
  };

  const verifyEmail = async (e) => {
    if (e) e.preventDefault();
    const token = otp.join("").trim();
    if (token.length < 6) {
      return setError("Please enter the full 6-digit verification code.");
    }
    if (!email) {
      return setError("Please enter your registered email address.");
    }

    try {
      setLoading(true);
      setError(null);
      await verifyUserEmail(email.trim(), token, null, "signup");
      sessionStorage.removeItem("auth-user-email");
      setLoading(false);
      setEmailVerified(true);
    } catch (err) {
      setLoading(false);
      setEmailVerified(false);
      return setError(err.message || "Invalid or expired verification code.");
    }
  };

  const resendNewOTP = async () => {
    if (!email) {
      return setError("Please enter your email address to resend code.");
    }
    try {
      setResending(true);
      setError(null);
      setMessage(null);
      const res = await resendOTP(email.trim(), "signup");
      setResending(false);
      setMessage(res.message || "A fresh verification code has been sent to your email.");
    } catch (err) {
      setResending(false);
      setMessage(null);
      setError(err.message || "Failed to resend verification code.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-primary">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-6 sm:p-8">
        {emailVerified ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
              <FaCircleCheck size={36} />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Email Verified Successfully!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
              Your {appName} account is active and ready. You can now access your dashboard to start earning or creating tasks.
            </p>
            <div className="pt-2">
              <button
                onClick={() => history.push("/dashboard")}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <button
                type="button"
                onClick={showLoginContent}
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer"
              >
                <FaArrowLeft size={12} />
                <span>Back to Login</span>
              </button>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Verification
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
                We sent a 6-digit confirmation code and link to:
              </p>
              
              {email ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-bold font-mono mt-2">
                  <MdEmail size={14} className="text-slate-500" />
                  <span>{email}</span>
                </div>
              ) : (
                <div className="mt-3">
                  <input
                    type="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 text-center"
                  />
                </div>
              )}
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
            <form onSubmit={verifyEmail} className="space-y-4">
              <div className="flex justify-center py-2">
                <OtpInput otp={otp} setOtp={setOtp} error={error} />
              </div>

              <button
                type="submit"
                disabled={loading || otp.join("").length < 6}
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
            </form>

            {/* Resend and Info */}
            <div className="pt-2 text-center space-y-3">
              <p className="text-xs text-slate-500">
                Didn't receive the email? Check your spam folder or{" "}
                <button
                  type="button"
                  onClick={resendNewOTP}
                  disabled={resending}
                  className="text-emerald-600 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  {resending ? (
                    <FaSpinner className="animate-spin" size={11} />
                  ) : (
                    <MdRefresh size={14} />
                  )}
                  <span>Resend Email</span>
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
