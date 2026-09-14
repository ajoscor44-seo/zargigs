import React from "react";
import { FaMoneyBillTransfer, FaWallet, FaBuildingColumns } from "react-icons/fa6";
import { Link } from "react-router-dom/cjs/react-router-dom";

const MoneyTransaction = () => {
  return (
    <div className="grid grid-cols-3 gap-2">
      <Link
        to="/fund-wallet"
        className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-200/90 shadow-2xs transition-all hover:border-slate-300"
      >
        <FaWallet size={12} className="text-emerald-600 shrink-0" />
        <span className="truncate">Fund</span>
      </Link>

      <Link
        to="/withdraw"
        className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-200/90 shadow-2xs transition-all hover:border-slate-300"
      >
        <FaBuildingColumns size={12} className="text-slate-700 shrink-0" />
        <span className="truncate">Withdraw</span>
      </Link>

      <Link
        to="/transfer"
        className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-200/90 shadow-2xs transition-all hover:border-slate-300"
      >
        <FaMoneyBillTransfer size={12} className="text-slate-700 shrink-0" />
        <span className="truncate">Transfer</span>
      </Link>
    </div>
  );
};

export default MoneyTransaction;
