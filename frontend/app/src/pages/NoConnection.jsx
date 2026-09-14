import React from "react";
import { FiWifiOff, FiRefreshCw } from "react-icons/fi";

const NoConnection = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100/80 max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
          <FiWifiOff size={36} />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            Offline
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight pt-2">
            No Internet Connection
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
            Please check your network cables or Wi-Fi connection and try again.
          </p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
        >
          <FiRefreshCw size={16} />
          <span>Retry Connection</span>
        </button>
      </div>
    </div>
  );
};

export default NoConnection;

