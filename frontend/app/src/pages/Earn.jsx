import React, { useEffect, useState } from "react";
import ClientLayout from "../components/ClientLayout/ClientLayout";
import { FaHistory } from "react-icons/fa";
import { IoInformationCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom/cjs/react-router-dom";
import EarnWithAds from "../components/EarnWithAds/EarnWithAds";
import EarnWithTasks from "../components/EarnWithTasks/EarnWithTasks";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FaSpinner } from "react-icons/fa6";

const Earn = () => {
  const { getEngagementEarners, getAdvertEarners, dashboardMode, switchDashboardMode } = useAuth();
  const [activeTab, setActiveTab] = useState("postAds");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusTotal, setStatusTotal] = useState({});
  const [totalAvailableAdvertTasks, setTotalAvailableAdvertTasks] = useState(0);
  const [totalAvailableNormalTasks, setTotalAvailableNormalTasks] = useState(0);

  const getTasksTotalsBasedOnStatus = async () => {
    try {
      setLoading(true);
      const [userTotalsRes, allTotalsRes] = await Promise.allSettled([
        axios.get("/api/v1/tasks/user-total"),
        axios.get("/api/v1/tasks/total"),
      ]);

      if (userTotalsRes.status === "fulfilled") {
        setStatusTotal(userTotalsRes.value.data || {});
      }
      if (allTotalsRes.status === "fulfilled" && allTotalsRes.value.data) {
        setTotalAvailableAdvertTasks(allTotalsRes.value.data.totalAdvert || 0);
        setTotalAvailableNormalTasks(allTotalsRes.value.data.totalEngagement || 0);
      }
      setLoading(false);
    } catch (error) {
      setError("Oops, an error occurred");
      setLoading(false);
    }
  };

  useEffect(() => {
    getTasksTotalsBasedOnStatus();
    getEngagementEarners();
    getAdvertEarners();
  }, []);

  return (
    <ClientLayout>
      <div className="space-y-6 font-primary">
        {dashboardMode === "advertiser" && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">⚠️</span>
              <p className="text-xs sm:text-sm font-semibold">
                You are currently in <strong className="font-bold">Advertiser Mode</strong>. To complete tasks and earn money, switch to Earner Mode.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => switchDashboardMode("earner")}
                className="shrink-0 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs transition-colors cursor-pointer"
              >
                ⚡ Switch to Earner
              </button>
              <Link
                to="/advertise"
                className="shrink-0 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-xs transition-colors"
              >
                📢 Advertiser Hub
              </Link>
            </div>
          </div>
        )}
        {/* Compact Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/70">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Daily Earn Center
              </h1>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Social Tasks
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Post verified adverts or complete simple social tasks to earn daily cash.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <Link
              to="/tasks-history"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 font-bold text-xs shadow-2xs transition-all"
            >
              <FaHistory size={12} className="text-slate-500" />
              <span>Task History</span>
            </Link>
          </div>
        </div>

        {/* In-Review Alert */}
        {statusTotal["in-review"] > 0 && (
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3.5 mb-6 text-amber-900 shadow-sm">
            <IoInformationCircleOutline size={22} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed flex-1">
              <span className="font-bold">
                You have {statusTotal["in-review"]} task{statusTotal["in-review"] > 1 ? "s" : ""} in review.
              </span>{" "}
              Our moderators will verify your submission shortly.{" "}
              <Link to="/tasks-history" className="font-bold underline text-amber-950 hover:text-emerald-700">
                View submission progress →
              </Link>
            </div>
          </div>
        )}

        {/* Segmented Control Tabs */}
        <div className="bg-slate-200/70 p-1.5 rounded-2xl flex gap-1.5 mb-6 max-w-md mx-auto">
          <button
            type="button"
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
              activeTab === "postAds"
                ? "bg-white text-emerald-600 shadow-sm shadow-slate-900/5"
                : "text-slate-600 hover:text-slate-900"
            }`}
            onClick={() => setActiveTab("postAds")}
          >
            <span>📢 Post Adverts</span>
            {totalAvailableAdvertTasks > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black shadow-sm shadow-rose-500/30 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                <span>{totalAvailableAdvertTasks}</span>
              </span>
            )}
          </button>

          <button
            type="button"
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
              activeTab === "doTasks"
                ? "bg-white text-emerald-600 shadow-sm shadow-slate-900/5"
                : "text-slate-600 hover:text-slate-900"
            }`}
            onClick={() => setActiveTab("doTasks")}
          >
            <span>⚡ Social Tasks</span>
            {totalAvailableNormalTasks > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black shadow-sm shadow-rose-500/30 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                <span>{totalAvailableNormalTasks}</span>
              </span>
            )}
          </button>
        </div>

        {/* Main Content Area */}
        {loading ? (
          <div className="min-h-[300px] flex flex-col justify-center items-center gap-3">
            <FaSpinner size={28} className="text-emerald-500 animate-spin" />
            <p className="text-xs font-semibold text-slate-400">Loading earning opportunities...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeTab === "postAds" ? (
              <EarnWithAds
                setTotalAvailableNormalTasks={setTotalAvailableNormalTasks}
                setTotalAvailableAdvertTasks={setTotalAvailableAdvertTasks}
                setActiveTab={setActiveTab}
              />
            ) : (
              <EarnWithTasks
                setTotalAvailableNormalTasks={setTotalAvailableNormalTasks}
                setTotalAvailableAdvertTasks={setTotalAvailableAdvertTasks}
                setActiveTab={setActiveTab}
              />
            )}
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default Earn;
