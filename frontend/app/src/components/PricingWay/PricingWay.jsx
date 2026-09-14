import React from "react";
import ItemIcon from "../ItemIcon/ItemIcon";

const PricingWay = ({ way, addSelectBtn, wayDescription }) => {
  const platformsList = Array.isArray(way?.platforms)
    ? way.platforms
    : typeof way?.platforms === "string"
    ? way.platforms.split(",").map((s) => s.trim())
    : [way?.platformName || "website"];

  const price = way?.amountToPay ?? way?.price ?? 10;

  return (
    <div className="group relative bg-white border border-slate-200/80 hover:border-emerald-400/80 rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:shadow-md hover:shadow-emerald-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3.5 flex-1">
        <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-slate-50 border border-slate-200/60 p-2.5 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
          <ItemIcon
            platform={way?.platformName || "website"}
            size={36}
            playstoreSize={"w-9 h-9"}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-emerald-700 transition-colors">
              {way?.title || "Task Package"}
            </h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              Verified Workers
            </span>
          </div>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-2">
            {wayDescription || way?.description || "Get high quality engagement from real users."}
          </p>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400">
              Platforms:
            </span>
            <div className="flex items-center gap-1">
              {platformsList.map((platform, i) => (
                <span
                  key={i}
                  className="p-1 bg-slate-50 border border-slate-200/60 rounded-lg flex items-center justify-center"
                  title={platform}
                >
                  <ItemIcon
                    platform={platform}
                    size={12}
                    playstoreSize={"w-3 h-3"}
                  />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 gap-2">
        <div className="text-left sm:text-right">
          <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Price per task
          </span>
          <span className="text-base sm:text-lg font-black text-slate-900">
            ₦{price}
          </span>
        </div>

        {addSelectBtn && (
          <button className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-600/20">
            Create Order →
          </button>
        )}
      </div>
    </div>
  );
};

export default PricingWay;
