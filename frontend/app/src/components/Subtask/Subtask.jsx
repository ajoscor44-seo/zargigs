import React from "react";
import { FaSpinner } from "react-icons/fa6";
import { Link } from "react-router-dom/cjs/react-router-dom";
import formatDate from "../../hooks/formatDate";
import ItemIcon from "../ItemIcon/ItemIcon";

const Subtask = ({ task, slug, platform, status, hideBtn, type }) => {
  const resolvedType = task?.taskType || type || "advert";
  const resolvedPlatform =
    task?.taskPlatform || task?.platform || platform || "whatsapp";
  const resolvedStatus = (
    task?.status ||
    status ||
    "pending"
  ).toLowerCase();

  const earningAmount =
    task?.earningPerTask !== undefined && task?.earningPerTask !== null && task?.earningPerTask !== ""
      ? task.earningPerTask
      : task?.earner_fee !== undefined && task?.earner_fee !== null && task?.earner_fee !== ""
      ? task.earner_fee
      : task?.earnerFee !== undefined && task?.earnerFee !== null && task?.earnerFee !== ""
      ? task.earnerFee
      : task?.reward !== undefined && task?.reward !== null && task?.reward !== ""
      ? task.reward
      : resolvedType === "advert"
      ? 100
      : 25;

  const resolvedTitle =
    task?.title ||
    (resolvedType === "advert"
      ? `Post Advert on ${resolvedPlatform.toUpperCase()} Status`
      : `Perform Verified ${resolvedPlatform.toUpperCase()} Task`);

  const statusBadgeConfig = {
    pending: {
      bg: "bg-amber-500/10 text-amber-700 border-amber-500/20",
      text: "Pending",
    },
    "in-review": {
      bg: "bg-sky-500/10 text-sky-700 border-sky-500/20",
      text: "In Review",
    },
    completed: {
      bg: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
      text: "Completed",
    },
    failed: {
      bg: "bg-rose-500/10 text-rose-700 border-rose-500/20",
      text: "Failed",
    },
    cancelled: {
      bg: "bg-slate-500/10 text-slate-700 border-slate-500/20",
      text: "Cancelled",
    },
  };

  const badgeStyle =
    statusBadgeConfig[resolvedStatus] || {
      bg: "bg-slate-100 text-slate-700 border-slate-200",
      text: resolvedStatus,
    };

  const taskId = task?.id || task?._id || "task";

  return (
    <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-slate-50/80 border border-slate-100 transition-all gap-3.5 font-primary my-2 shadow-2xs">
      <div className="flex items-center gap-3 min-w-0">
        <div className="shrink-0 w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-2xs">
          <ItemIcon
            platform={resolvedPlatform}
            size={24}
            playstoreSize={"w-8 h-8"}
          />
        </div>
        <div className="space-y-0.5 min-w-0">
          <span className="text-[11px] font-bold text-slate-400 block">
            {formatDate(task?.createdAt || task?.created_at)}
          </span>
          <h2 className="text-xs sm:text-sm font-black text-slate-900 truncate">
            {resolvedTitle}
          </h2>
          <div className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
            <span>Earning:</span>
            <span className="text-emerald-600 font-extrabold text-xs sm:text-sm">
              ₦{earningAmount}
            </span>
            <span className="text-slate-400 font-medium">per {resolvedType}</span>
          </div>
        </div>
      </div>

      <div className="shrink-0 flex items-center">
        {hideBtn ? (
          <span
            className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold border ${badgeStyle.bg}`}
          >
            {badgeStyle.text}
          </span>
        ) : (
          <Link
            to={`/earn/${resolvedType}/${slug || "general"}/${resolvedPlatform}/${resolvedStatus}/${taskId}`}
          >
            <button
              type="button"
              className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${badgeStyle.bg}`}
            >
              {resolvedStatus === "in-review" ? (
                <span className="flex items-center gap-1.5">
                  <FaSpinner className="animate-spin text-sky-600" size={13} />
                  <span>In Review</span>
                </span>
              ) : (
                <span className="capitalize">{badgeStyle.text}</span>
              )}
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Subtask;
