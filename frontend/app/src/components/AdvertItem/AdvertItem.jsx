import React from "react";
import CountdownTimer from "../CountDownTimer/CountDownTimer";
import { FiExternalLink, FiClock, FiCalendar } from "react-icons/fi";

const AdvertItem = ({ itemData }) => {
  const remainingSeconds = Math.max(
    0,
    Math.floor(
      (new Date(itemData.expiresAt).getTime() - new Date().getTime()) / 1000
    )
  );

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100/80 transition-all hover:shadow-md">
      <div className="relative h-48 sm:h-56 w-full bg-slate-100 overflow-hidden">
        <img
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          src={itemData.banner}
          alt={itemData.name}
        />
        <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
          <FiCalendar size={12} className="text-emerald-400" />
          <span>{itemData.duration} Days Plan</span>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900">
              {itemData.name}
            </h3>
            <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-1">
              {itemData.description}
            </p>
          </div>
          {itemData.link && (
            <a
              href={itemData.link}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-2xl transition-colors shrink-0 flex items-center gap-1 text-xs font-bold"
              title="Visit Destination"
            >
              <FiExternalLink size={16} />
            </a>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <FiClock size={15} className="text-amber-500 shrink-0" />
            <span>Time Remaining:</span>
          </div>
          <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 w-full sm:w-auto flex justify-center sm:justify-end">
            <CountdownTimer totalSeconds={remainingSeconds} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvertItem;

