import React from "react";
import CountdownTimer from "../components/CountDownTimer/CountDownTimer";
import { FiTool, FiClock, FiHome } from "react-icons/fi";
import { Link } from "react-router-dom/cjs/react-router-dom";

function timeDifferenceInSeconds() {
  const currentTime = new Date();
  let targetTime = new Date();
  targetTime.setHours(23, 59, 59, 0);
  const differenceInMilliseconds = targetTime - currentTime;
  return Math.max(0, Math.floor(differenceInMilliseconds / 1000));
}

const UnderConstruction = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100/80 max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
          <FiTool size={36} />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            System Maintenance
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight pt-2">
            Upgrading Platform
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
            We are rolling out major performance and security enhancements. We will be back online shortly!
          </p>
        </div>

        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500">
            <FiClock size={14} className="text-amber-600" />
            <span>Estimated Resumption In:</span>
          </div>
          <div className="flex justify-center">
            <CountdownTimer totalSeconds={timeDifferenceInSeconds()} />
          </div>
        </div>

        <Link
          to="/"
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
        >
          <FiHome size={16} />
          <span>Refresh Page</span>
        </Link>
      </div>
    </div>
  );
};

export default UnderConstruction;

