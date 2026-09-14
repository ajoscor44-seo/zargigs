import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";
import Modal from "../Modal/Modal";
import PendingTaskSubtask from "../PendingtaskSubtask/PendingTaskSubtask";
import { FaSpinner, FaBoltLightning, FaCircleInfo, FaClock, FaFire } from "react-icons/fa6";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const PendingSubtask = ({
  tasks,
  generateNewTask,
  cancelGeneratedTask,
  slug,
  platform,
  status,
  type,
  wayToEarn,
}) => {
  const { currentUser } = useAuth();
  const [isOpen, setModalState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalAvailable, setTotalAvailable] = useState(0);

  const userId = currentUser?.id || currentUser?._id;

  const fetchTotal = async () => {
    try {
      const cleanSlug = (slug || "").replace("/earn/", "");
      const res = await axios.get(
        `/api/v1/tasks/total?type=${type}&platform=${(platform || "whatsapp").toLowerCase()}&slug=${encodeURIComponent(
          cleanSlug
        )}&userId=${userId || ""}`,
        {
          headers: {
            "x-user-id": userId || "",
          },
        }
      );
      if (res.data?.total !== undefined) {
        setTotalAvailable(res.data.total);
      }
    } catch {
      // Graceful fallback
    }
  };

  useEffect(() => {
    fetchTotal();
  }, [type, platform, slug, userId]);

  const toggleModal = () => {
    setModalState(!isOpen);
  };

  const generateTask = async () => {
    toggleModal();
    setLoading(true);
    await generateNewTask();
    return setLoading(false);
  };

  const rewardAmount =
    wayToEarn?.amountToEarn ||
    wayToEarn?.reward ||
    (type === "advert" ? 100 : 5);

  const platformDisplayName = platform ? platform.toUpperCase() : "THIS PLATFORM";

  return (
    <div className="font-primary">
      {tasks?.id ? (
        <div>
          <PendingTaskSubtask
            task={tasks}
            cancelTask={cancelGeneratedTask}
            slug={slug}
            platform={platform}
            status={status}
            type={type}
          />
        </div>
      ) : totalAvailable === 0 ? (
        <div className="py-8 sm:py-10 px-4 flex flex-col items-center justify-center text-center max-w-lg mx-auto space-y-5">
          {/* Availability Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-black shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>No Tasks Available Right Now</span>
          </div>

          <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-500 flex items-center justify-center shadow-xs text-2xl">
            📭
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              No Tasks Available for {platformDisplayName}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              There are currently no active tasks for this platform. Advertisers post new campaigns regularly — please explore other available tasks or check back later!
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 w-full max-w-md p-3 bg-slate-50 rounded-2xl border border-slate-200/70 text-center">
            <div className="p-2">
              <span className="block text-[10px] font-bold uppercase text-slate-400">Available</span>
              <span className="text-xs sm:text-sm font-black text-slate-500">
                0 Tasks
              </span>
            </div>
            <div className="p-2 border-x border-slate-200/80">
              <span className="block text-[10px] font-bold uppercase text-slate-400">Payout</span>
              <span className="text-xs sm:text-sm font-black text-emerald-600">
                ₦{rewardAmount}
              </span>
            </div>
            <div className="p-2">
              <span className="block text-[10px] font-bold uppercase text-slate-400">Status</span>
              <span className="text-xs sm:text-sm font-black text-amber-600">
                Queue Empty
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md pt-2">
            <Link
              to="/earn"
              className="w-full sm:w-auto flex-1 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md shadow-emerald-600/25 transition-all text-center flex items-center justify-center gap-2"
            >
              <span>⚡</span>
              <span>Explore Other Tasks</span>
            </Link>
            <button
              type="button"
              onClick={fetchTotal}
              disabled={loading}
              className="w-full sm:w-auto px-5 py-3.5 bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-700 font-bold text-xs sm:text-sm rounded-2xl transition-all cursor-pointer"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      ) : (
        <div className="py-6 sm:py-8 px-4 flex flex-col items-center justify-center text-center max-w-lg mx-auto space-y-5">
          {/* Live Task Availability Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {totalAvailable} Task{totalAvailable === 1 ? "" : "s"} Available Right Now
            </span>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
            <FaBoltLightning size={24} />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              Ready to Earn?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Click the button below to generate your next active {type === "advert" ? "advert" : "social"} task. You will have an allocated time window to complete it and submit proof.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 w-full max-w-md p-3 bg-slate-50 rounded-2xl border border-slate-200/70 text-center">
            <div className="p-2">
              <span className="block text-[10px] font-bold uppercase text-slate-400">Available</span>
              <span className="text-xs sm:text-sm font-black text-slate-900">
                {totalAvailable} Tasks
              </span>
            </div>
            <div className="p-2 border-x border-slate-200/80">
              <span className="block text-[10px] font-bold uppercase text-slate-400">Payout</span>
              <span className="text-xs sm:text-sm font-black text-emerald-600">
                ₦{rewardAmount}
              </span>
            </div>
            <div className="p-2">
              <span className="block text-[10px] font-bold uppercase text-slate-400">Est. Time</span>
              <span className="text-xs sm:text-sm font-black text-slate-900">
                ~2 mins
              </span>
            </div>
          </div>

          {isOpen && (
            <Modal
              title={`Generate New ${type === "advert" ? "Advert" : "Social"} Task?`}
              content={
                "Are you sure you want to generate your next task now? You will have an active countdown timer to perform the task and submit proof."
              }
              posBtnText={"Yes, Generate"}
              negBtnText={"Cancel"}
              onNegClick={toggleModal}
              onPosClick={generateTask}
            />
          )}

          <button
            type="button"
            onClick={toggleModal}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" size={16} />
                <span>Generating Task...</span>
              </>
            ) : (
              <>
                <FaBoltLightning size={14} />
                <span>Generate A New Task ({totalAvailable} Available)</span>
              </>
            )}
          </button>

          <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <FaCircleInfo size={12} className="text-slate-400" />
            <span>Tasks are allocated one at a time for quality verification.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingSubtask;
