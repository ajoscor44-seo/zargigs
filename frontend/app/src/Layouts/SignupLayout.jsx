import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/png/logo-color.png";
import { FaArrowLeft, FaGift } from "react-icons/fa6";

const SignupLayout = ({ children, referralUsername }) => {
  const { adminData } = useAuth();
  const appName = adminData?.appName || "DocsZar";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-4 sm:py-8 px-3 sm:px-6 font-primary">
      {/* Top Header: Brand & Back to Home */}
      <div className="w-full max-w-md sm:max-w-lg mx-auto flex items-center justify-between mb-3 sm:mb-5">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors bg-white px-2.5 py-1 rounded-full border border-slate-200/80 shadow-xs"
        >
          <FaArrowLeft size={10} />
          <span>Home</span>
        </Link>

        <Link to="/" className="flex items-center gap-1.5">
          <img src={logo} alt={appName} className="h-7 w-auto rounded-md" />
          <span className="font-black text-base sm:text-lg text-slate-900 tracking-tight">
            {appName}
          </span>
        </Link>
      </div>

      {/* Main Centered Signup Card */}
      <div className="w-full max-w-md sm:max-w-lg mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-4 sm:p-7 transition-all">
        {/* Referral Welcome Banner if available */}
        {referralUsername && (
          <div className="mb-3.5 p-2.5 sm:p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 shadow-xs">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black flex items-center justify-center text-[11px] uppercase shrink-0">
              <FaGift size={12} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] sm:text-xs font-bold text-slate-800 truncate">
                  Invited by @{referralUsername}
                </span>
                <span className="text-[9px] bg-emerald-100 text-emerald-700 font-extrabold px-1.5 py-0.2 rounded-full">
                  Bonus Active
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step Form Content */}
        {children}

        {/* Card Footer */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 text-center space-y-1.5">
          <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight max-w-sm mx-auto">
            By signing up, you agree to our{" "}
            <Link
              to="/terms"
              className="text-emerald-600 font-semibold hover:underline"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy-policy"
              className="text-emerald-600 font-semibold hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </p>
          <p className="text-xs text-slate-600 font-medium">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupLayout;
