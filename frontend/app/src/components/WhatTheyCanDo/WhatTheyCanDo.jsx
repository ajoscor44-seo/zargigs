import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { FaArrowRight, FaBullhorn, FaMoneyBillWave } from "react-icons/fa6";

const WhatTheyCanDo = ({
  btnText,
  actionDesription,
  actionTitle,
  actionPersonnel,
  pathTo,
}) => {
  const isAdvertiser = actionPersonnel?.toLowerCase().includes("advert");

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span
            className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
              isAdvertiser
                ? "bg-blue-50 text-blue-700"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            For {actionPersonnel}
          </span>
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isAdvertiser
                ? "bg-blue-50 text-blue-600"
                : "bg-emerald-50 text-emerald-600"
            }`}
          >
            {isAdvertiser ? <FaBullhorn size={18} /> : <FaMoneyBillWave size={18} />}
          </div>
        </div>

        <h3 className="font-extrabold text-slate-900 text-lg leading-snug">
          {actionTitle}
        </h3>
        <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
          {actionDesription}
        </p>
      </div>

      <div className="mt-6">
        <Link
          to={pathTo}
          className={`w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-bold text-xs sm:text-sm shadow-md transition-all ${
            isAdvertiser
              ? "bg-slate-900 hover:bg-slate-800 shadow-slate-900/10"
              : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
          }`}
        >
          <span>{btnText}</span>
          <FaArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
};

export default WhatTheyCanDo;
