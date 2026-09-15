import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { FaArrowLeft, FaCircleCheck, FaSpinner, FaShieldHalved } from "react-icons/fa6";
import { MdEmail, MdRefresh } from "react-icons/md";
import OtpInput from "../OTPInput/OTPInput";
import { Link, useHistory, useLocation } from "react-router-dom/cjs/react-router-dom";
import { supabase } from "../../config/supabase.config";
import logo from "../../assets/png/logo-color.png";

const VerifyEmail = ({ isLoginPage, setNotVerified }) => {
  const { verifyUserEmail, adminData, resendOTP, fetchUserData, currentUser } = useAuth();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const history = useHistory();
  const location = useLocation();

  const [email, setEmail] = useState(() => {
    const params = new URLSearchParams(location.search);
    return (
      params.get("email") ||
      sessionStorage.getItem("auth-user-email") ||
      currentUser?.email ||
      ""
    );
  });

  const [emailVerified, setEmailVerified] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const appName = adminData?.appName || "DocsZar";

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Check URL parameters & hash fragments for email verification callbacks
  useEffect(() => {
    const handleUrlVerification = async () => {
      try {
        // If user is already logged in with verified email
        if (currentUser?.isEmailVerified) {
          setEmailVerified(true);
          return;
        }

        const queryParams = new URLSearchParams(location.search);
        const tokenHash = queryParams.get("token_hash");
        const type = queryParams.get("type");
        const code = queryParams.get("code");
        const urlEmail = queryParams.get("email");

        if (urlEmail && !email) {
          setEmail(urlEmail);
        }

        // 1. Supabase PKCE Code exchange
        if (code) {
          setLoading(true);
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (!exchangeError && data?.session) {
            await fetchUserData();
            setEmailVerified(true);
            setLoading(false);
            return;
          }
        }

        // 2. Token hash verification
        if (tokenHash && (type === "signup" || type === "email" || type === "recovery" || type === "invite")) {
          setLoading(true);
          await verifyUserEmail(null, null, tokenHash, type);
          setEmailVerified(true);
          setLoading(false);
          return;
        }

        // 3. Hash fragment parameters
        if (location.hash) {
          const hashParams = new URLSearchParams(location.hash.substring(1));
          const errorDescription = hashParams.get("error_description");
          const errorMsg = hashParams.get("error");
          if (errorDescription || errorMsg) {
            setError(decodeURIComponent(errorDescription || errorMsg).replace(/\+/g, " "));
          }
          const accessToken = hashParams.get("access_token");
          if (accessToken) {
            await fetchUserData();
            setEmailVerified(true);
          }
        }

        // 4. Check if session exists from confirmation redirect
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
  }, [location, currentUser]);

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
    if (!email || !email.trim()) {
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
    if (countdown > 0) return;
    if (!email || !email.trim()) {
      return setError("Please enter your email address to resend code.");
    }
    try {
      setResending(true);
      setError(null);
      setMessage(null);
      const res = await resendOTP(email.trim(), "signup");
      setResending(false);
      setCountdown(60);
      setMessage(res.message || "A fresh verification code has been sent to your email.");
    } catch (err) {
      setResending(false);
      setMessage(null);
      setError(err.message || "Failed to resend verification code.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-8 sm:py-12 px-4 sm:px-6 font-primary">
      {/* Top Header */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={showLoginContent}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors bg-white px-3 py-1.5 rounded-full border border-slate-200/80 shadow-xs cursor-pointer"
        >
          <FaArrowLeft size={11} />
          <span>Back to Login</span>
        </button>

        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt={appName} className="h-8 w-auto rounded-lg" />
          <span className="font-black text-lg text-slate-900 tracking-tight">
            {appName}
          </span>
        </Link>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-6 sm:p-8">
        {emailVerified ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
              <FaCircleCheck size={36} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Email Verified Successfully!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
              Your {appName} account is active and verified. You can now access your dashboard to start earning or creating campaigns.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={() => history.push("/dashboard")}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <FaShieldHalved size={26} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Verify Your Email
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xs mx-auto">
                We sent a 6-digit confirmation code and link to your email address:
              </p>

              {email ? (
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 text-slate-800 rounded-full text-xs font-bold font-mono mt-3 max-w-full truncate border border-slate-200/60">
                  <MdEmail size={14} className="text-emerald-600 shrink-0" />
                  <span className="truncate">{email}</span>
                </div>
              ) : (
                <div className="mt-3">
                  <input
                    type="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 text-center font-medium bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              )}
            </div>

            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                <span className="flex-1">{error}</span>
              </div>
            )}

            {message && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="flex-1">{message}</span>
              </div>
            )}

            {/* OTP Input Form */}
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

            {/* Resend and Actions */}
            <div className="pt-2 text-center space-y-3 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                Didn't receive the email? Check your spam folder or{" "}
                <button
                  type="button"
                  onClick={resendNewOTP}
                  disabled={resending || countdown > 0}
                  className="text-emerald-600 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  {resending ? (
                    <FaSpinner className="animate-spin" size={11} />
                  ) : (
                    <MdRefresh size={14} />
                  )}
                  <span>
                    {countdown > 0
                      ? `Resend in ${countdown}s`
                      : "Resend Code"}
                  </span>
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
