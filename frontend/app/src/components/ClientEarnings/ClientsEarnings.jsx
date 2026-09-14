import numeral from "numeral";
import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { FaArrowTrendUp, FaClockRotateLeft, FaBuildingColumns, FaBagShopping, FaArrowRight } from "react-icons/fa6";

const ClientsEarnings = ({
  totalEarnings,
  pendingEarnings,
  amountWithdrawn,
  amountSpent,
}) => {
  const stats = [
    {
      label: "Total Earned",
      amount: totalEarnings,
      icon: <FaArrowTrendUp size={12} className="text-emerald-600" />,
      textColor: "text-slate-900",
      bg: "bg-emerald-50",
    },
    {
      label: "Pending Escrow",
      amount: pendingEarnings,
      icon: <FaClockRotateLeft size={12} className="text-slate-600" />,
      textColor: "text-slate-900",
      bg: "bg-slate-100",
    },
    {
      label: "Withdrawn",
      amount: amountWithdrawn,
      icon: <FaBuildingColumns size={12} className="text-slate-600" />,
      textColor: "text-slate-900",
      bg: "bg-slate-100",
    },
    {
      label: "Spent on Ads",
      amount: amountSpent,
      icon: <FaBagShopping size={12} className="text-slate-600" />,
      textColor: "text-slate-900",
      bg: "bg-slate-100",
    },
  ];

  return (
    <div className="bg-white p-3.5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
          Financial Overview
        </span>
        <Link
          to="/transaction-history"
          className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1 transition-colors"
        >
          <span>History</span>
          <FaArrowRight size={9} />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col justify-between"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 ${item.bg}`}>
                {item.icon}
              </div>
              <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">
                {item.label}
              </span>
            </div>
            <div className={`text-sm font-black tracking-tight ${item.textColor}`}>
              ₦{numeral(item.amount || 0).format("0,0.00")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientsEarnings;
