import React, { useEffect, useState, useMemo } from "react";
import ClientLayout from "../components/ClientLayout/ClientLayout";
import { Link, useParams } from "react-router-dom/cjs/react-router-dom";
import EarningWay from "../components/EarningWay/EarningWay";
import InReviewSubtask from "../components/InReviewSubtask/InReviewSubtask";
import PendingSubtask from "../components/PendingSubtask/PendingSubtask";
import FailedSubtask from "../components/FailedSubtask/FailedSubtask";
import CompletedSubtask from "../components/CompletedSubtask/CompletedSubtask";
import CancelledSubtasks from "../components/CancelledSubtasks/CancelledSubtasks";
import axios from "axios";
import { FaSpinner } from "react-icons/fa6";
import NoData from "../components/NoData/NoData";
import { RiErrorWarningFill } from "react-icons/ri";
import { useAuth } from "../context/AuthContext";
import { taskService } from "../services/supabaseService";

const EarnWithTasks = () => {
  const { advertEarner, engagementEarner, currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const tabs = ["pending", "in-review", "failed", "completed", "cancelled"];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [generatedTask, setGeneratedTask] = useState(undefined);
  const [taskList, setTaskList] = useState(undefined);
  const [statusTotals, setStatusTotal] = useState({});
  const { slug } = useParams();

  const isAdvertSlug =
    slug === "whatsapp-status" ||
    slug === "instagram-post" ||
    slug === "facebook-post" ||
    slug === "twitter-post" ||
    slug === "tiktok-post" ||
    slug?.endsWith("-status") ||
    slug?.endsWith("-post") ||
    slug?.endsWith("-advert");

  const taskType = isAdvertSlug ? "advert" : "engagement";
  const waysToEarn = isAdvertSlug ? (advertEarner || []) : (engagementEarner || []);

  // Safe fallback resolution for wayToEarn so it never crashes or delays render
  const wayToEarn = useMemo(() => {
    const found = waysToEarn.find(
      (way) => way.pathToPage === "/earn/" + slug || way.slug === slug
    );
    if (found) return found;

    const rawPlatform = (slug || "task")
      .replace(/^earn-/, "")
      .replace(/^post-/, "")
      .replace(/-advert$/, "")
      .replace(/-post$/, "")
      .replace(/-status$/, "")
      .replace(/-followers$/, "")
      .replace(/-likes$/, "")
      .replace(/-comments$/, "")
      .replace(/-subscribers$/, "")
      .replace(/-retweets$/, "")
      .replace(/-follows$/, "")
      .replace(/-streams$/, "")
      .replace(/-reviews$/, "")
      .toLowerCase();

    const isComment = slug?.includes("comment");
    const isLike = slug?.includes("like");
    const isFollow = slug?.includes("follow");
    const isSub = slug?.includes("sub");
    const isReview = slug?.includes("review");
    const isStream = slug?.includes("stream");

    const defaultTitle = isComment
      ? `Comment on ${rawPlatform.toUpperCase()} Posts`
      : isLike
      ? `Like ${rawPlatform.toUpperCase()} Posts`
      : isFollow
      ? `Follow ${rawPlatform.toUpperCase()} Account`
      : isSub
      ? `Subscribe to ${rawPlatform.toUpperCase()} Channel`
      : isReview
      ? `Download & Review App`
      : isStream
      ? `Stream Music on ${rawPlatform.toUpperCase()}`
      : taskType === "advert"
      ? `Post Adverts on ${rawPlatform.toUpperCase()} Status`
      : `${rawPlatform.toUpperCase()} Task`;

    const defaultReward = isReview
      ? 25
      : isSub
      ? 15
      : isComment
      ? 10
      : isStream
      ? 10
      : isAdvertSlug
      ? 100
      : 5;

    return {
      title: defaultTitle,
      platformName: rawPlatform || "instagram",
      description: `Complete simple ${rawPlatform} tasks and earn cash directly to your wallet.`,
      amountToEarn: defaultReward,
      reward: defaultReward,
      platforms: [rawPlatform || "instagram"],
    };
  }, [waysToEarn, slug, taskType, isAdvertSlug]);

  const platformName = (wayToEarn?.platformName || "whatsapp").toLowerCase();

  // Generates the task
  const generateNewTask = async () => {
    try {
      setLoading(true);
      setError(null);
      const queryParams = new URLSearchParams({
        type: taskType || "advert",
        platform: platformName || "whatsapp",
        slug: slug || "",
        title: wayToEarn?.title || "",
        userId: currentUser?.id || "",
        email: currentUser?.email || "",
        username: currentUser?.username || "",
      }).toString();

      const response = await axios.get(`/api/v1/tasks/generate?${queryParams}`, {
        headers: {
          "x-user-id": currentUser?.id,
        },
        timeout: 8000,
      });
      if (response.data && response.data.id && !response.data.failed) {
        setGeneratedTask(response.data);
        setError(null);
      } else {
        setGeneratedTask(null);
        setError(response.data?.message || "There are currently no tasks available for this platform.");
      }
    } catch (err) {
      console.warn("generateNewTask error:", err);
      setGeneratedTask(null);
      setError(err.response?.data?.message || err.message || "Failed to generate task.");
    } finally {
      setLoading(false);
    }
  };

  const getAllTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const queryParams = new URLSearchParams({
        type: taskType || "advert",
        status: activeTab.toLowerCase(),
        platform: platformName || "whatsapp",
        slug: slug || "",
        title: wayToEarn?.title || "",
        userId: currentUser?.id || "",
        email: currentUser?.email || "",
        username: currentUser?.username || "",
      }).toString();

      const response = await axios.get(`/api/v1/tasks?${queryParams}`, {
        headers: {
          "x-user-id": currentUser?.id,
        },
        timeout: 8000,
      });
      setTaskList(response.data?.data || response.data || []);
    } catch (err) {
      console.warn("getAllTasks error:", err);
      // Empty task stream is normal
      setTaskList([]);
    } finally {
      setLoading(false);
    }
  };

  const cancelGeneratedTask = async (status) => {
    if (status?.toLowerCase() !== "pending") return;
    try {
      setLoading(true);

      if (generatedTask?.id && currentUser?.id) {
        await taskService.cancelTask({
          taskId: generatedTask.id,
          userId: currentUser.id,
          taskType: taskType || "advert",
          reason: "User cancelled pending task from generation queue",
        });
      }

      const queryParams = new URLSearchParams({
        type: taskType || "advert",
        platform: platformName || "whatsapp",
        userId: currentUser?.id || "",
      }).toString();

      await axios.delete(`/api/v1/tasks/cancel-task?${queryParams}`, {
        headers: {
          "x-user-id": currentUser?.id,
        },
        timeout: 8000,
      }).catch(() => null);
    } catch (err) {
      console.warn("cancelGeneratedTask error:", err);
    } finally {
      setGeneratedTask(null);
      setLoading(false);
      getAllTasks();
    }
  };

  const getTasksTotalsBasedOnStatus = async () => {
    try {
      const queryParams = new URLSearchParams({
        type: taskType || "advert",
        platform: platformName || "whatsapp",
        userId: currentUser?.id || "",
      }).toString();

      const response = await axios.get(`/api/v1/tasks/user-total?${queryParams}`, {
        headers: {
          "x-user-id": currentUser?.id,
        },
        timeout: 8000,
      });
      if (response.data) {
        setStatusTotal(response.data);
      }
    } catch (err) {
      // Ignored
    }
  };

  useEffect(() => {
    getAllTasks();
    getTasksTotalsBasedOnStatus();
  }, [activeTab, slug, platformName]);

  const isProTask = isAdvertSlug || wayToEarn?.amountToEarn >= 25 || wayToEarn?.reward >= 25;
  const isLockedForFreeUser = isProTask && !currentUser?.isMember;

  return (
    <ClientLayout>
      <div className="w-full font-primary space-y-6">
        <EarningWay
          way={wayToEarn}
          type={taskType}
          setTotalAvailableNormalTasks={null}
          setTotalAvailableAdvertTasks={null}
        />

        {isLockedForFreeUser ? (
          <div className="bg-white rounded-3xl border border-orange-200 p-6 sm:p-10 shadow-sm text-center max-w-2xl mx-auto space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto text-2xl shadow-sm">
              👑
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-orange-100 text-orange-800 border border-orange-200">
                PRO Member Exclusive
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Unlock High-Paying Daily Tasks
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Posting adverts on WhatsApp Status and high-reward campaigns (₦100+ per task) are exclusively reserved for verified PRO members.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs text-slate-600 max-w-md mx-auto text-left space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <span>⚡ Free Account Access:</span>
                <span className="text-emerald-600">Unlimited Follows, Likes & Comments</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <span>👑 PRO Member Access:</span>
                <span className="text-orange-600">₦100+ Daily Adverts + Unlimited Withdrawals</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/become-a-member"
                className="w-full sm:w-auto px-7 py-3 bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md shadow-orange-600/25 transition-all text-center"
              >
                Upgrade to PRO (₦1,000 Lifetime) →
              </Link>
              <Link
                to="/earn"
                className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-all text-center"
              >
                Back to Free Social Tasks
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Responsive Tab Bar */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80 shadow-2xs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.toLowerCase();
            const count = statusTotals[tab.toString()];
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-slate-900 text-white shadow-sm scale-102"
                    : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80 shadow-2xs"
                }`}
              >
                <span className="capitalize">{tab}</span>
                {count > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                      isActive
                        ? "bg-emerald-400 text-slate-950"
                        : "bg-slate-200 text-slate-800"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 shadow-xs">
          {loading ? (
            <div className="flex flex-col justify-center items-center py-12 gap-3 text-slate-400">
              <FaSpinner className="text-emerald-500 animate-spin" size={24} />
              <span className="text-xs font-semibold">Loading tasks...</span>
            </div>
          ) : error && error.toLowerCase() !== "no data available." ? (
            <div className="text-rose-500 text-center py-10 flex flex-col justify-center items-center gap-2">
              <RiErrorWarningFill size={36} />
              <p className="text-xs sm:text-sm font-bold">{error}</p>
            </div>
          ) : (
            <div>
              {activeTab === "pending" ? (
                <PendingSubtask
                  generateNewTask={generateNewTask}
                  tasks={generatedTask}
                  cancelGeneratedTask={cancelGeneratedTask}
                  slug={slug}
                  platform={platformName}
                  status={activeTab}
                  type={taskType}
                  wayToEarn={wayToEarn}
                />
              ) : activeTab === "in-review" ? (
                <InReviewSubtask
                  inReviewSubtasks={taskList}
                  slug={slug}
                  platform={platformName}
                  status={activeTab}
                  type={taskType}
                />
              ) : activeTab === "failed" ? (
                <FailedSubtask
                  failedSubtasks={taskList}
                  slug={slug}
                  platform={platformName}
                  status={activeTab}
                  type={taskType}
                />
              ) : activeTab === "completed" ? (
                <CompletedSubtask
                  completedSubtasks={taskList}
                  slug={slug}
                  platform={platformName}
                  status={activeTab}
                  type={taskType}
                />
              ) : (
                <CancelledSubtasks
                  cancelledSubtasks={taskList}
                  slug={slug}
                  type={taskType}
                  platform={platformName}
                  status={activeTab}
                />
              )}
            </div>
          )}
        </div>
        </>
      )}
      </div>
    </ClientLayout>
  );
};

export default EarnWithTasks;
