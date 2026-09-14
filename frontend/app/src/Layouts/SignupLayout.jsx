import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/png/logo-color.png";
import { FaArrowLeft, FaGift } from "react-icons/fa6";

const SignupLayout = ({ children, referralUsername }) => {
  const { adminData } = useAuth();
  const appName = adminData?.appName || "Zargigs";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-8 sm:py-12 px-4 sm:px-6 font-primary">
      {/* Top Header: Brand & Back to Home */}
      <div className="w-full max-w-lg sm:max-w-xl mx-auto flex items-center justify-between mb-6">
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

      {/* Main Centered Signup Card */}
      <div className="w-full max-w-lg sm:max-w-xl mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-8 transition-all">
        {/* Referral Welcome Banner if available */}
        {referralUsername && (
          <div className="mb-6 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-xs uppercase shrink-0 shadow-xs">
              <FaGift size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-800">
                  Invited by @{referralUsername}
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 font-extrabold px-1.5 py-0.5 rounded-full">
                  Special Bonus
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                Sign up to claim daily earning rewards & payouts.
              </p>
            </div>
          </div>
        )}

        {/* Step Form Content */}
        {children}

        {/* Card Footer */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center space-y-2.5">
          <p className="text-[11px] text-slate-400 leading-relaxed max-w-sm mx-auto">
            By registering, you agree to our{" "}
            <Link
              to="/terms"
              className="text-emerald-600 font-semibold hover:underline"
            >
              Terms of Service
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
