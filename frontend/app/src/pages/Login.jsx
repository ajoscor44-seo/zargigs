import React, { useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom/cjs/react-router-dom";
import { MdOutlineLogin, MdEmail, MdLock } from "react-icons/md";
import {
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaArrowLeft,
  FaCheck,
} from "react-icons/fa6";
import logo from "../assets/png/logo-color.png";
import { useAuth } from "../context/AuthContext";
import OAuth from "../components/OAuth/OAuth";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { loginUser, fetchUserData, adminData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const history = useHistory();
  const location = useLocation();
  const appName = adminData?.appName || "DocsZar";
  const isRegisteredSuccess = location.search?.includes("registered=true");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const submitForm = async (e) => {
    if (e) e.preventDefault();
    try {
      setIsLoading(true);
      if (!formData.email || !formData.password) {
        setError("Please provide both email and password.");
        setIsLoading(false);
        return;
      }

      const res = await loginUser(formData.email.trim(), formData.password);

      if (res.failed) {
        setIsLoading(false);
        const errMsg = res.message || "Invalid credentials.";
        if (
          errMsg.toLowerCase().includes("not confirmed") ||
          errMsg.toLowerCase().includes("verify") ||
          errMsg.toLowerCase().includes("not verified")
        ) {
          sessionStorage.setItem("auth-user-email", formData.email.trim());
          return setError(
            <span>
              {errMsg}{" "}
              <Link
                to={`/verify-email?email=${encodeURIComponent(formData.email.trim())}`}
                className="font-bold underline text-emerald-700 hover:text-emerald-800 ml-1"
              >
                Verify email now →
              </Link>
            </span>
          );
        }
        return setError(errMsg);
      } else {
        setIsLoading(false);
        setError(null);
        sessionStorage.removeItem("auth-user-email");
        await fetchUserData();
        return history.push("/dashboard");
      }
    } catch (err) {
      setIsLoading(false);
      return setError(err.message || "Failed to log in.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-8 sm:py-12 px-4 sm:px-6 font-primary">
      {/* Top Header: Brand & Back to Home */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors bg-white px-3 py-1.5 rounded-full border border-slate-200/80 shadow-xs"
        >
          <FaArrowLeft size={11} />
          <span>Back to Home</span>
        </Link>

        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt={appName} className="h-8 w-auto rounded-lg" />
          <span className="font-black text-lg text-slate-900 tracking-tight">
            {appName}
          </span>
        </Link>
      </div>

      {/* Main Centered Login Card */}
      <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-8 transition-all">
        <div className="text-center mb-6">
          <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200/60">
            Welcome Back
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Sign In to {appName}
          </h2>
          <p className="mt-1 text-slate-500 text-xs sm:text-sm">
            Enter your credentials to access your account.
          </p>
        </div>

        {isRegisteredSuccess && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 text-[10px]">
              <FaCheck size={10} />
            </div>
            <span>Account created successfully! You can now log in below.</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={submitForm} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <MdEmail size={18} />
              </div>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="yourname@gmail.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <MdLock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm shadow-md shadow-emerald-500/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin" size={16} />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <MdOutlineLogin size={18} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Social OAuth with Supabase Google */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <OAuth setError={setError} text="Sign in with Google" />
        </div>

        {/* Card Footer */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-600 font-medium">
            Don't have an account yet?{" "}
            <Link
              to="/signup"
              className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              Create Free Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
