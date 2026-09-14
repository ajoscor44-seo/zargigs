import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { FiArrowLeft, FiCompass, FiHome } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const NotFound = () => {
  const { adminData } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100/80 max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <FiCompass size={40} className="animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Error 404
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight pt-2">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
            The page you're looking for doesn't exist, was relocated, or you entered an incorrect URL.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-3">
          <Link
            to="/"
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
          >
            <FiHome size={16} />
            <span>Return to Homepage</span>
          </Link>

          <Link
            to="/dashboard"
            className="w-full py-3.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold rounded-2xl transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm"
          >
            <FiArrowLeft size={16} />
            <span>Go to Dashboard</span>
          </Link>
        </div>

        <p className="text-[11px] text-slate-400 font-medium">
          {adminData?.appName || "Zargigs"} • All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default NotFound;

