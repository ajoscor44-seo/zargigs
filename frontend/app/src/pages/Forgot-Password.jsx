import React, { useState, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom/cjs/react-router-dom";
import { FaArrowLeft, FaCircleCheck, FaSpinner, FaLock, FaEnvelope } from "react-icons/fa6";
import logo from "../assets/png/logo-color.png";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../config/supabase.config";

const ForgotPassword = () => {
  const { resetUserPassword, updateUserPassword, adminData } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const appName = adminData?.appName || "DocsZAR";

  // Detect recovery session from URL hash or query params
  useEffect(() => {
    const checkRecoverySession = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const type = hashParams.get("type") || new URLSearchParams(location.search).get("type");
      const accessToken = hashParams.get("access_token");

      if (type === "recovery" || accessToken) {
        setIsRecoveryMode(true);
      }

      // Supabase onAuthStateChange for PASSWORD_RECOVERY
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "PASSWORD_RECOVERY" || (session && type === "recovery")) {
          setIsRecoveryMode(true);
        }
      });

      return () => {
        subscription?.unsubscribe();
      };
    };

    checkRecoverySession();
  }, [location]);

  const handleRequestReset = async (e) => {
    if (e) e.preventDefault();
    if (!email) {
      return setError("Please enter your registered email address.");
    }

    try {
      setError(null);
      setLoading(true);
      const res = await resetUserPassword(email.trim());
      setLoading(false);
      setSuccessMessage(
        res.message || "A password reset link has been sent to your email address."
      );
    } catch (err) {
      setLoading(false);
      setError(err.message || "Failed to request password reset.");
    }
  };

  const handleUpdatePassword = async (e) => {
    if (e) e.preventDefault();
    if (!password) {
      return setError("Please enter your new password.");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters long.");
    }
    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      setError(null);
      setLoading(true);
      await updateUserPassword(password);
      setLoading(false);
      setSuccessMessage("Your password has been successfully updated!");
      setTimeout(() => {
        history.push("/login");
      }, 2000);
    } catch (err) {
      setLoading(false);
      setError(err.message || "Failed to update password. Your recovery link may have expired.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-primary">
      <div className="max-w-md w-full mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-10">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer"
          >
            <FaArrowLeft size={12} />
            <span>Back to Login</span>
          </Link>
          <img src={logo} alt={appName} className="h-8 w-auto object-contain" />
        </div>

        {isRecoveryMode ? (
          <div>
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200/60">
                New Password
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Choose New Password
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Enter your new secure password below to regain access.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            {successMessage && (
              <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <FaCircleCheck className="text-emerald-600 shrink-0" size={16} />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FaLock size={15} />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FaLock size={15} />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm shadow-md shadow-emerald-500/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? <FaSpinner className="animate-spin" size={16} /> : "Update Password"}
              </button>
            </form>
          </div>
        ) : successMessage ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
              <FaCircleCheck size={32} />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Check Your Email</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
              {successMessage}
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="w-full inline-block py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all text-center"
              >
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200/60">
              Account Recovery
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Forgot Password?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-6">
              Enter your registered email address and we'll send you a password recovery email.
            </p>

            {error && (
              <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleRequestReset} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FaEnvelope size={15} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm shadow-md shadow-emerald-500/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" size={16} />
                    <span>Sending Reset Email...</span>
                  </>
                ) : (
                  "Send Reset Email"
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
