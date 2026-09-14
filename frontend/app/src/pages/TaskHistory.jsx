import React, { useEffect, useState } from "react";
import ClientLayout from "../components/ClientLayout/ClientLayout";
import { FaSpinner } from "react-icons/fa6";
import NoData from "../components/NoData/NoData";
import axios from "axios";
import { RiErrorWarningFill } from "react-icons/ri";
import Task from "../components/Task/Task";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../config/supabase.config";

const TaskHistory = () => {
  const { currentUser } = useAuth();
  const [taskHistory, setTaskHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const tabs = ["in-review", "pending", "completed", "failed", "cancelled"];
  const [activeTab, setActiveTab] = useState("in-review");

  const userRecordId = currentUser?.id || currentUser?._id;

  const fetchtaskHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const combined = [];

      // 1. Fetch from Supabase task_submissions
      if (userRecordId) {
        try {
          let statusFilter = ["pending"];
          if (activeTab === "completed") statusFilter = ["approved", "auto_approved"];
          else if (activeTab === "failed" || activeTab === "cancelled") statusFilter = ["rejected", "disputed"];
          else if (activeTab === "in-review" || activeTab === "pending") statusFilter = ["pending"];

          const { data: subs } = await supabase
            .from("task_submissions")
            .select(`
              *,
              task:task_id (
                id,
                title,
                category,
                reward_per_worker,
                guidelines
              )
            `)
            .eq("worker_id", userRecordId)
            .in("status", statusFilter)
            .order("created_at", { ascending: false });

          if (subs && subs.length > 0) {
            combined.push(
              ...subs.map((s) => ({
                id: s.id,
                _id: s.id,
                taskId: s.task_id,
                isMarketplace: true,
                title: s.task?.title || "Marketplace Task",
                category: s.task?.category || "custom",
                taskPlatform: s.task?.guidelines?.app_name || s.task?.category || "web",
                taskType: "marketplace",
                earningPerTask: Number(s.reward_amount || s.task?.reward_per_worker || 100),
                status:
                  s.status === "approved" || s.status === "auto_approved"
                    ? "completed"
                    : s.status === "rejected"
                    ? "failed"
                    : "in-review",
                createdAt: s.reviewed_at || s.created_at,
                created_at: s.reviewed_at || s.created_at,
              }))
            );
          }
        } catch (subErr) {
          console.warn("task_submissions history notice:", subErr);
        }
      }

      // 2. Fetch from traditional API history endpoint
      try {
        const response = await axios.get(`/api/v1/tasks/history?status=${activeTab}`).catch(() => null);
        let list = [];
        if (Array.isArray(response?.data)) {
          list = response.data;
        } else if (response?.data && typeof response.data === "object") {
          list = response.data[activeTab] || response.data.data || response.data.inReview || [];
        }
        if (list && list.length > 0) {
          combined.push(...list);
        }
      } catch {}

      // Deduplicate by ID
      const uniqueMap = new Map();
      combined.forEach((t) => {
        if (t.id && !uniqueMap.has(t.id)) {
          uniqueMap.set(t.id, t);
        }
      });

      const sorted = Array.from(uniqueMap.values()).sort(
        (a, b) => new Date(b.createdAt || b.created_at || 0) - new Date(a.createdAt || a.created_at || 0)
      );

      setTaskHistory(sorted);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch task history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchtaskHistory();
  }, [activeTab, userRecordId]);

  return (
    <ClientLayout>
      <div className="font-primary text-slate-800 space-y-6">
        {/* Page Header & Tabs */}
        <div className="pb-2 border-b border-slate-200/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              My Task Submissions
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Track review stages, proof status, and payouts for your completed tasks.
            </p>
          </div>

          {/* Responsive Scrollable Tab Bar */}
          <div className="w-full sm:w-auto overflow-x-auto pb-1 scrollbar-none">
            <div className="bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 flex items-center gap-1.5 w-max sm:w-auto min-w-full">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`py-2 px-3.5 rounded-xl text-xs font-black capitalize transition-all whitespace-nowrap cursor-pointer flex-1 sm:flex-initial text-center ${
                    activeTab === tab
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="min-h-[300px] flex flex-col justify-center items-center gap-3 bg-white rounded-3xl border border-slate-200/80">
            <FaSpinner size={28} className="text-emerald-500 animate-spin" />
            <p className="text-xs font-semibold text-slate-400">Loading {activeTab} tasks...</p>
          </div>
        ) : error ? (
          <div className="min-h-[300px] flex flex-col justify-center items-center bg-white border border-slate-200/80 rounded-3xl p-8 text-center text-red-500">
            <RiErrorWarningFill size={48} className="mb-2" />
            <p className="text-xs font-bold">{error}</p>
          </div>
        ) : !taskHistory.length ? (
          <div className="min-h-[300px] flex justify-center items-center bg-white border border-slate-200/80 rounded-3xl p-8">
            <NoData textBelow={`No ${activeTab.replace("-", " ")} tasks found`} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {taskHistory.map((task, index) => (
              <Task key={task.id || index} task={task} />
            ))}
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default TaskHistory;
