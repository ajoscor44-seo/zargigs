import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";
import formatDate from "../../hooks/formatDate";
import ItemIcon from "../ItemIcon/ItemIcon";

const Task = ({ task }) => {
  const status = task.status?.replace(/\s+/g, "")?.toLowerCase();

  const statusBadge =
    status === "pending"
      ? "bg-amber-50 text-amber-700 border-amber-200/60"
      : status === "in-review"
      ? "bg-sky-50 text-sky-700 border-sky-200/60"
      : status === "completed"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
      : "bg-red-50 text-red-700 border-red-200/60";

  return (
    <div className="bg-white border border-slate-200/80 hover:border-emerald-400/80 rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:shadow-md hover:shadow-emerald-500/5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200/60 p-2 flex items-center justify-center flex-shrink-0">
          <ItemIcon
            platform={task?.taskPlatform}
            size={28}
            playstoreSize="w-7 h-7"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate">
              {task?.title}
            </h3>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusBadge}`}
            >
              {task?.status}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
            <span>
              Reward: <strong className="text-emerald-600 font-bold">₦{task?.earningPerTask}</strong>
            </span>
            <span className="text-slate-400">{formatDate(task?.createdAt)}</span>
          </div>
        </div>
      </div>

      <Link
        to={
          task.isMarketplace || task.taskId
            ? `/workspace/${task.taskId || task.id}`
            : `/earn/${task.taskType || "task"}/${task.slug || null}/${task.taskPlatform || "web"}/${task.status}/${task?.id}`
        }
        className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-emerald-600 transition-colors shadow-sm flex-shrink-0"
      >
        View Details →
      </Link>
    </div>
  );
};

export default Task;
