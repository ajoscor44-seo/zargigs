import React from "react";
import { FiLifeBuoy } from "react-icons/fi";

const SupportMsg = () => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/80">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <FiLifeBuoy size={20} />
        </div>
        <div>
          <h3 className="font-bold text-base text-slate-900 mb-1">
            24/7 Dedicated Support System
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
            If you experience any challenge while earning, withdrawing, or creating campaigns, our support team is on standby to assist you. Responses are typically provided within 15 minutes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupportMsg;

