import React from "react";
import ItemIcon from "../ItemIcon/ItemIcon";

const RecentActivity = ({ recentActivity }) => {
  const taskDone =
    recentActivity?.taskType === "review"
      ? "reviewing an app"
      : recentActivity?.taskType === "like"
      ? "liking a post"
      : recentActivity?.taskType === "comment"
      ? "commenting on a post"
      : "performing a task";

  const lga = recentActivity?.userLocation?.LGA || recentActivity?.userLocation?.lga || "Nigeria";
  const state = recentActivity?.userLocation?.state || "";

  return (
    <div className="border border-slate-100 bg-white hover:bg-slate-50/80 p-3 rounded-2xl flex items-center gap-3 transition-colors">
      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center shrink-0">
        <ItemIcon
          platform={recentActivity?.category || recentActivity?.taskPlatform || "website"}
          size={20}
          playstoreSize={"w-6 h-6"}
        />
      </div>
      <div className="activityInfo font-primary flex-1 min-w-0">
        <h3 className="font-bold text-xs sm:text-sm text-slate-800 capitalize truncate">
          {recentActivity?.category || recentActivity?.taskPlatform || "Microtask"}
        </h3>
        <p className="text-[11px] text-slate-500 leading-snug">
          @{recentActivity?.username || "earner"} {state ? `from ${lga}, ${state}` : ""} just earned{" "}
          <span className="font-black text-emerald-600">₦{recentActivity?.amountEarned || 0}</span> for{" "}
          {taskDone}
        </p>
      </div>
    </div>
  );
};

export default RecentActivity;

