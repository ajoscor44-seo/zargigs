import React, { useState } from "react";
import cardChip from "../../assets/images/card_chip.png";
import numeral from "numeral";
import { FaEye, FaEyeSlash, FaWifi, FaShieldHalved } from "react-icons/fa6";

const ClientDashboardCard = ({ firstname, lastname, userBalance }) => {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <div className="relative rounded-3xl bg-slate-900 p-6 sm:p-7 text-white shadow-md border border-slate-800 select-none">
      <div className="relative z-10 flex flex-col justify-between min-h-[165px]">
        {/* Top Row: Chip, Contactless Wave & Status Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={cardChip}
              className="w-10 h-auto object-contain brightness-110"
              alt="EMV Chip"
            />
            <FaWifi className="text-slate-400 rotate-90" size={14} />
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                Active Wallet
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowBalance(!showBalance)}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={showBalance ? "Hide Balance" : "Show Balance"}
            >
              {showBalance ? <FaEye size={13} /> : <FaEyeSlash size={13} />}
            </button>
          </div>
        </div>

        {/* Center: Available Balance */}
        <div className="my-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <span>Available Balance</span>
            <FaShieldHalved size={10} className="text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black tracking-tight mt-0.5 text-white">
            {showBalance ? `₦${numeral(userBalance || 0).format("0,0.00")}` : "••••••••"}
          </div>
        </div>

        {/* Bottom Bar: Embossed Cardholder Name & Network Badge */}
        <div className="flex items-center justify-between pt-2.5 border-t border-slate-800">
          <div>
            <span className="text-[8px] font-bold uppercase tracking-wider text-slate-500 block leading-tight">
              Cardholder
            </span>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200 truncate block max-w-[170px]">
              {firstname} {lastname}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[8px] font-bold uppercase tracking-wider text-slate-500 block leading-tight">
              Network
            </span>
            <span className="text-xs font-black tracking-widest text-emerald-400 uppercase">
              DOCSZAR
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboardCard;
