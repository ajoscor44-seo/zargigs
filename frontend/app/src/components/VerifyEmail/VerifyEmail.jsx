import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { FaArrowLeft, FaCircleCheck, FaSpinner, FaShieldHalved, FaPenToSquare } from "react-icons/fa6";
import { MdEmail, MdRefresh } from "react-icons/md";
import OtpInput from "../OTPInput/OTPInput";
import { Link, useHistory, useLocation } from "react-router-dom/cjs/react-router-dom";
import { supabase } from "../../config/supabase.config";
import logo from "../../assets/png/logo-color.png";

const isValidEmail = (emailStr) => {
  return typeof emailStr === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr.trim());
};

const getInitialEmail = (search, currentUser) => {
  const params = new URLSearchParams(search);
  const fromQuery = params.get("email");
  if (fromQuery && isValidEmail(fromQuery)) return fromQuery.trim();

  const fromLocal = localStorage.getItem("auth_pending_email");
  if (fromLocal && isValidEmail(fromLocal)) return fromLocal.trim();

  const fromSession = sessionStorage.getItem("auth-user-email") || sessionStorage.getItem("auth_pending_email");
  if (fromSession && isValidEmail(fromSession)) return fromSession.trim();

  if (currentUser?.email && isValidEmail(currentUser.email)) return currentUser.email.trim();

  return fromQuery || fromSession || fromLocal || "";
};

const VerifyEmail = ({ isLoginPage, setNotVerified }) => {
  const { verifyUserEmail, adminData, resendOTP, fetchUserData, currentUser } = useAuth();
  const history = useHistory();
  const location = useLocation();

  const [otpLength, setOtpLength] = useState(6);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [email, setEmail] = useState(() => getInitialEmail(location.search, currentUser));
  const [isEditingEmail, setIsEditingEmail] = useState(() => !isValidEmail(getInitialEmail(location.search, currentUser)));
  const [tempEmailInput, setTempEmailInput] = useState(() => getInitialEmail(location.search, currentUser));

  const [emailVerified, setEmailVerified] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const appName = adminData?.appName || "DocsZAR";

  // Switch OTP length (e.g. 6 or 8 digits)
  const handleOtpLengthChange = (newLen, prefillVal = "") => {
    setOtpLength(newLen);
    const newArr = Array(newLen).fill("");
    if (prefillVal) {
      for (let i = 0; i < Math.min(newLen, prefillVal.length); i++) {
        newArr[i] = prefillVal[i];
      }
    }
    setOtp(newArr);
  };

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Check URL parameters & hash fragments for email verification callbacks
  useEffect(() => {
    const handleUrlVerification = async () => {
      try {
        if (currentUser?.isEmailVerified) {
          setEmailVerified(true);
          return;
        }

        const queryParams = new URLSearchParams(location.search);
        const tokenHash = queryParams.get("token_hash");
        const type = queryParams.get("type");
        const code = queryParams.get("code");
        const urlEmail = queryParams.get("email");

        if (urlEmail && isValidEmail(urlEmail)) {
          setEmail(urlEmail.trim());
          setTempEmailInput(urlEmail.trim());
          setIsEditingEmail(false);
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

  const handleSaveEmail = () => {
    const clean = (tempEmailInput || "").trim().toLowerCase();
    if (!isValidEmail(clean)) {
      setError("Please enter a valid email address (e.g., yourname@example.com).");
      return;
    }
    setEmail(clean);
    localStorage.setItem("auth_pending_email", clean);
    sessionStorage.setItem("auth-user-email", clean);
    setIsEditingEmail(false);
    setError(null);
  };

  const verifyEmail = async (e) => {
    if (e) e.preventDefault();
    const token = otp.join("").trim();

    if (token.length < otpLength) {
      return setError(`Please enter the full ${otpLength}-character verification code.`);
    }

    const cleanEmail = (email || tempEmailInput || "").trim().toLowerCase();
    if (!isValidEmail(cleanEmail)) {
      setIsEditingEmail(true);
      return setError("Please enter a valid email address before submitting.");
    }

    try {
      setLoading(true);
      setError(null);
      await verifyUserEmail(cleanEmail, token, null, "signup");
      sessionStorage.removeItem("auth-user-email");
      sessionStorage.removeItem("auth_pending_email");
      localStorage.removeItem("auth_pending_email");
      setLoading(false);
      setEmailVerified(true);
    } catch (err) {
      setLoading(false);
      setEmailVerified(false);
      const rawMsg = err.message || "";
      if (rawMsg.toLowerCase().includes("rate limit") || rawMsg.toLowerCase().includes("over_email_send_rate_limit")) {
        setError("Rate limit reached. Please wait a few minutes before trying again or request a new code.");
      } else if (rawMsg.toLowerCase().includes("invalid email")) {
        setIsEditingEmail(true);
        setError("Invalid email format. Please check and re-enter your email.");
      } else if (rawMsg.toLowerCase().includes("expired") || rawMsg.toLowerCase().includes("invalid")) {
        setError("Invalid or expired verification code. Please check your email or click Resend Code.");
      } else {
        setError(rawMsg || "Failed to verify email. Please check your code.");
      }
    }
  };

  const resendNewOTP = async () => {
    if (countdown > 0) return;
    const cleanEmail = (email || tempEmailInput || "").trim().toLowerCase();
    if (!isValidEmail(cleanEmail)) {
      setIsEditingEmail(true);
      return setError("Please enter a valid email address to resend the code.");
    }

    try {
      setResending(true);
      setError(null);
      setMessage(null);
      const res = await resendOTP(cleanEmail, "signup");
      setResending(false);
      setCountdown(60);
      setMessage(res.message || "A fresh verification code has been sent to your email.");
    } catch (err) {
      setResending(false);
      setMessage(null);
      const rawMsg = err.message || "";
      if (rawMsg.toLowerCase().includes("rate limit") || rawMsg.toLowerCase().includes("over_email_send_rate_limit")) {
        setError("Rate limit reached on server. Please wait a few minutes before requesting another code.");
      } else {
        setError(rawMsg || "Failed to resend verification code.");
      }
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
                We sent a confirmation code and activation link to your email address:
              </p>

              {/* Editable Email Badge / Input Container */}
              <div className="mt-3">
                {!isEditingEmail && email ? (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-100 text-slate-800 rounded-full text-xs font-bold font-mono border border-slate-200/80 shadow-xs max-w-full">
                    <MdEmail size={14} className="text-emerald-600 shrink-0" />
                    <span className="truncate">{email}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setTempEmailInput(email);
                        setIsEditingEmail(true);
                        setError(null);
                      }}
                      className="text-slate-400 hover:text-emerald-600 ml-1 p-0.5 transition-colors cursor-pointer"
                      title="Change email"
                    >
                      <FaPenToSquare size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 max-w-xs mx-auto">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="email"
                        placeholder="Enter your registered email"
                        value={tempEmailInput}
                        onChange={(e) => {
                          setTempEmailInput(e.target.value);
                          if (error) setError(null);
                        }}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-center font-medium bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={handleSaveEmail}
                        className="px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shrink-0 cursor-pointer"
                      >
                        Set
                      </button>
                    </div>
                  </div>
                )}
              </div>
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

            {/* OTP Length Selector (6 or 8 digits) */}
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 px-1">
              <span>Enter verification code:</span>
              <div className="inline-flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200/60">
                <button
                  type="button"
                  onClick={() => handleOtpLengthChange(6)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                    otpLength === 6
                      ? "bg-white text-emerald-700 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  6-Digit
                </button>
                <button
                  type="button"
                  onClick={() => handleOtpLengthChange(8)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                    otpLength === 8
                      ? "bg-white text-emerald-700 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  8-Digit
                </button>
              </div>
            </div>

            {/* OTP Input Form */}
            <form onSubmit={verifyEmail} className="space-y-4">
              <div className="flex justify-center py-1">
                <OtpInput
                  otp={otp}
                  setOtp={setOtp}
                  length={otpLength}
                  error={error}
                  onLengthChange={handleOtpLengthChange}
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.join("").length < otpLength}
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

