import React, { useEffect, useState } from "react";
import axios from "axios";
import ItemIcon from "../ItemIcon/ItemIcon";

const EarningWay = ({
  way,
  addSelectBtn,
  wayDescription,
  type,
  setTotalAvailableAdvertTasks,
  setTotalAvailableNormalTasks,
}) => {
  const [totalTasks, setTotalTasks] = useState(0);

  const slug = (way?.pathToPage || way?.slug || way?.id || "")
    .replace("/earn/", "")
    .replace("/order/", "");

  const getTotal = async () => {
    try {
      const response = await axios.get(
        `/api/v1/tasks/total?type=${type}&platform=${way?.platformName?.toLowerCase()}&slug=${encodeURIComponent(
          slug
        )}&title=${encodeURIComponent(way?.title || "")}`
      );
      if (response?.data?.total !== undefined) {
        setTotalTasks(response.data.total);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTotal();
  }, []);

  const platformKey =
    way?.platformName ||
    (Array.isArray(way?.platforms) && way?.platforms[0]) ||
    "website";

  const platformsList =
    Array.isArray(way?.platforms) && way?.platforms.length > 0
      ? way.platforms
      : typeof way?.platforms === "string" && way.platforms
      ? way.platforms.split(",").map((s) => s.trim())
      : [platformKey];

  const reward =
    way?.amountToEarn ??
    way?.reward ??
    (type === "advert" ? 100 : 5);

  const isPro =
    way?.isPro ??
    (type === "advert" ||
      slug.includes("status") ||
      slug.includes("survey") ||
      slug.includes("review") ||
      reward >= 25);

  const cleanDescription =
    wayDescription ||
    way?.description ||
    `Post verified adverts or complete simple ${platformKey} tasks to earn ₦${reward} per submission.`;

  return (
    <div className="group relative bg-white border border-slate-200/80 hover:border-emerald-500 rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:shadow-md hover:shadow-emerald-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer">
      <div className="flex items-center gap-3.5 flex-1">
        <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-slate-50 border border-slate-200/60 p-2.5 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
          <ItemIcon
            platform={platformKey}
            size={36}
            playstoreSize={"w-9 h-9"}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-emerald-700 transition-colors">
              {way?.title || "Earn Task"}
            </h3>
            {isPro ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-orange-50 text-orange-700 border border-orange-200 shadow-2xs">
                👑 PRO VIP
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                ⚡ Free Unlimited
              </span>
            )}
            {totalTasks > 0 ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-red-50 text-red-700 border border-red-200 animate-pulse shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
                <span>{totalTasks} Active</span>
              </span>
            ) : null}
          </div>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-2">
            {cleanDescription}
          </p>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400">
              Supported:
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
            Earn per task
          </span>
          <span className="text-base sm:text-lg font-black text-emerald-600">
            ₦{reward}
          </span>
        </div>

        {addSelectBtn && (
          <span className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white group-hover:bg-emerald-600 transition-colors shadow-sm inline-flex items-center justify-center">
            Start Earning →
          </span>
        )}
      </div>
    </div>
  );
};

export default EarningWay;
