import React from "react";
import { BiSolidCheckCircle } from "react-icons/bi";
import { FaSpinner, FaClock, FaCircleExclamation, FaXmark } from "react-icons/fa6";
import CountdownTimer from "../CountDownTimer/CountDownTimer";
import formatDate from "../../hooks/formatDate";
import { Link } from "react-router-dom/cjs/react-router-dom";
import ItemIcon from "../ItemIcon/ItemIcon";

const PendingTaskSubtask = ({
  task,
  cancelTask,
  slug,
  platform,
  type,
  status,
  hideBtn,
}) => {
  return (
    <div className="font-primary p-4 sm:p-6 space-y-5">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
        <div className="flex items-center gap-3.5">
          <div className="shrink-0 w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-100 flex items-center justify-center">
            <ItemIcon
              platform={task?.taskPlatform}
              size={28}
              playstoreSize={"w-10 h-10"}
            />
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-slate-400">
              {formatDate(task?.createdAt)}
            </span>
            <h2 className="text-sm sm:text-base font-black text-slate-900 line-clamp-1">
              {task?.title}
            </h2>
            <div className="text-xs text-slate-600 font-semibold">
              Reward:{" "}
              <span className="text-emerald-600 font-extrabold text-sm">
                ₦{task?.earningPerTask}
              </span>{" "}
              <span className="text-slate-400 font-medium">per {task?.taskType}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          {hideBtn ? (
            <FaSpinner className="animate-spin text-emerald-600" size={20} />
          ) : (
            <Link
              to={`/earn/${type}/${slug}/${platform}/${status}/${task?.id}`}
              className="inline-flex"
            >
              <button
                type="button"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white text-xs sm:text-sm font-black rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <BiSolidCheckCircle size={18} />
                <span>Do Task Now</span>
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Countdown Timer Banner */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-900 w-full sm:w-auto justify-center sm:justify-start">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-700 shrink-0">
            <FaClock size={14} />
          </div>
          <span className="tracking-tight">Task Timer Remaining:</span>
        </div>
        <div className="w-full sm:w-auto flex justify-center sm:justify-end">
          <CountdownTimer totalSeconds={Math.round(task?.timeLeftS)} />
        </div>
      </div>

      {/* Cancel Task Notice Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-xs font-black text-slate-700">Don't want to perform this task?</h4>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-lg">
            You can cancel this task without penalty to generate a different task.
          </p>
        </div>
        <button
          type="button"
          onClick={() => cancelTask("pending")}
          className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 hover:border-rose-300 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
        >
          <FaXmark size={14} />
          <span>Cancel Task</span>
        </button>
      </div>

      {!hideBtn && (
        <div className="p-3 rounded-xl bg-slate-100/70 text-[11px] text-slate-500 text-center font-medium flex items-center justify-center gap-1.5">
          <FaCircleExclamation className="text-slate-400" size={13} />
          <span>Complete and submit proof for this task before it expires to receive your reward.</span>
        </div>
      )}
    </div>
  );
};

export default PendingTaskSubtask;
