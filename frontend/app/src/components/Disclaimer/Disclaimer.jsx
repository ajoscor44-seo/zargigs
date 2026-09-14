import React from "react";
import { FiAlertTriangle, FiShield } from "react-icons/fi";

const Disclaimer = ({ disclaimerMsg }) => {
  return (
    <div className="bg-rose-50 border border-rose-200/80 rounded-3xl p-5 sm:p-6 text-rose-900 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
          <FiAlertTriangle size={18} />
        </div>
        <h3 className="font-extrabold text-sm text-rose-900 tracking-tight">
          Security Advisory & Official Disclaimer
        </h3>
      </div>
      <p className="text-xs sm:text-sm text-rose-800/90 leading-relaxed font-medium pl-10">
        {disclaimerMsg}
      </p>
    </div>
  );
};

export default Disclaimer;

