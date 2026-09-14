import numeral from "numeral";
import React from "react";
import { FaShieldAlt } from "react-icons/fa";

const PayAmountBar = ({ feeTitle, fee, btnText, handleClick, disable }) => {
  return (
    <aside aria-label="Order summary and payment" className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] py-3 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <FaShieldAlt className="text-emerald-500" size={10} />
            <span>{feeTitle || "Total Amount"}</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            ₦{numeral(fee || 0).format("0,0.00")}
          </div>
        </div>

        <button
          onClick={handleClick}
          disabled={disable}
          className={`px-6 sm:px-8 py-3 rounded-2xl text-xs sm:text-sm font-black text-white shadow-lg shadow-emerald-500/20 transition-all ${
            disable
              ? "bg-slate-300 cursor-not-allowed opacity-70"
              : "bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98]"
          }`}
        >
          {disable ? "Processing..." : btnText || "Pay Now"}
        </button>
      </div>
    </aside>
  );
};

export default PayAmountBar;
