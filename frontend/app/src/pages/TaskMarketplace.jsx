import React, { useEffect, useState } from "react";
import ClientLayout from "../components/ClientLayout/ClientLayout";
import { Link, useHistory, useLocation } from "react-router-dom/cjs/react-router-dom";
import { useAuth } from "../context/AuthContext";
import { taskService } from "../services/supabaseService";
import axios from "axios";
import numeral from "numeral";
import {
  FaMagnifyingGlass,
  FaFilter,
  FaBoltLightning,
  FaClock,
  FaUsers,
  FaShieldHalved,
  FaArrowRight,
  FaCheck,
  FaPlus,
  FaMobileScreen,
  FaLocationDot,
  FaChartSimple,
  FaListCheck,
  FaGamepad,
  FaPenNib,
  FaMicrophone,
  FaVideo,
  FaBasketShopping,
  FaLayerGroup,
} from "react-icons/fa6";
import { MdPoll, MdAssignmentTurnedIn, MdOutlineVerified } from "react-icons/md";

const categories = [
  { id: "all", label: "All Tasks", icon: <FaLayerGroup size={15} /> },
  { id: "survey", label: "Surveys & Polls", icon: <MdPoll size={17} /> },
  { id: "website_testing", label: "Website Testing", icon: <FaChartSimple size={15} /> },
  { id: "app_testing", label: "App Testing", icon: <FaMobileScreen size={15} /> },
  { id: "data_collection", label: "Data Collection", icon: <FaListCheck size={15} /> },
  { id: "ugc_media", label: "UGC & Videos", icon: <FaVideo size={15} /> },
  { id: "voice_recording", label: "Voice / Audio", icon: <FaMicrophone size={15} /> },
  { id: "research", label: "Research & Info", icon: <FaPenNib size={15} /> },
  { id: "mystery_shopping", label: "Mystery Shopping", icon: <FaBasketShopping size={15} /> },
];

const TaskMarketplace = () => {
  const { currentUser, adminData, dashboardMode, switchDashboardMode } = useAuth();
  const history = useHistory();
  const location = useLocation();

  const isAdvertiser = dashboardMode === "advertiser";

  const queryParams = new URLSearchParams(location.search);
  const initialCat = queryParams.get("category") || "all";

  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [searchQuery, setSearchQuery] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reservingId, setReservingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const userRecordId = currentUser?.id || currentUser?._id || null;
      const data = await taskService.getTasks({
        category: selectedCategory,
        search: searchQuery,
        workerUserId: userRecordId,
      });
      setTasks(data || []);
    } catch (err) {
      console.error("Failed to load tasks:", err);
      setErrorMsg("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [selectedCategory, currentUser?.id, currentUser?._id]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTasks();
  };

  const handleStartTask = (task) => {
    if (!currentUser) {
      return history.push("/login");
    }

    const currentUserId = currentUser?.id || currentUser?._id;
    if (task?.creator_id && currentUserId && String(task.creator_id) === String(currentUserId)) {
      return history.push(`/creator/campaigns/${task.id}`);
    }

    if (task.hasSubmitted) {
      alert("You have already completed and submitted proof for this task. Duplicate submissions are not allowed.");
      return;
    }

    if (dashboardMode === "advertiser") {
      switchDashboardMode("earner");
    }

    const reward = Number(
      task?.reward_per_worker ||
        task?.earner_fee ||
        task?.cost_per_task ||
        task?.reward ||
        task?.amount_to_earn ||
        0
    );

    const isProTask =
      task?.is_pro ||
      reward >= 50 ||
      task?.category === "survey" ||
      task?.category === "advert";

    if (isProTask && !currentUser?.isMember) {
      return history.push("/become-a-member");
    }

    const platform = (task?.platform || "whatsapp").toLowerCase();
    const category = (task?.category || "advert").toLowerCase();

    if (category === "advert") {
      const slug = platform === "whatsapp" ? "whatsapp-status" : `${platform}-post`;
      return history.push(`/earn/${slug}`);
    }

    if (category === "engagement") {
      const titleLower = (task?.title || "").toLowerCase();
      const slug = titleLower.includes("comment")
        ? `${platform}-comments`
        : titleLower.includes("like")
        ? `${platform}-likes`
        : titleLower.includes("sub")
        ? `${platform}-subscribers`
        : titleLower.includes("retweet")
        ? `${platform}-retweets`
        : `${platform}-followers`;
      return history.push(`/earn/${slug}`);
    }

    history.push(`/workspace/${task.id}`);
  };

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Compact Marketplace Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/70">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Microtask Marketplace
              </h1>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Live Tasks
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isAdvertiser
                ? "Browse live marketplace campaigns or launch tasks to hire thousands of verified Nigerian workers."
                : "Complete simple online jobs, surveys, and app tasks to earn cash."}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            {isAdvertiser ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/order-history"
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors"
                >
                  <span>My Campaigns</span>
                </Link>
                <Link
                  to="/create-task"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-xs transition-colors"
                >
                  <FaPlus size={11} />
                  <span>+ Post Task Campaign</span>
                </Link>
              </div>
            ) : (
              <Link
                to="/earn"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs transition-all"
              >
                <FaBoltLightning size={11} />
                <span>Daily Social Tasks →</span>
              </Link>
            )}
          </div>
        </div>

        {/* Advertiser Mode Notice Banner */}
        {isAdvertiser && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-500/30">
                📢
              </div>
              <div>
                <div className="text-xs font-black text-white">
                  Advertiser Preview Mode
                </div>
                <div className="text-[11px] text-slate-300">
                  This marketplace shows all live tasks available to earners. You can review current rates or post your campaign.
                </div>
              </div>
            </div>
            <Link
              to="/create-task"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shrink-0 transition-colors"
            >
              <FaPlus size={11} />
              <span>Create Campaign</span>
            </Link>
          </div>
        )}

        {/* Search & Category Pills Filter */}
        <div className="mb-6 space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <FaMagnifyingGlass size={15} />
              </div>
              <input
                type="text"
                placeholder="Search tasks by title, category, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200/90 rounded-2xl text-xs sm:text-sm shadow-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-sm transition-all"
            >
              Search
            </button>
          </form>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                      : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80 shadow-2xs"
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Task Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="p-6 rounded-3xl bg-white border border-slate-200/70 shadow-xs animate-pulse space-y-4"
              >
                <div className="h-4 bg-slate-200 rounded-md w-1/3" />
                <div className="h-6 bg-slate-200 rounded-md w-3/4" />
                <div className="h-16 bg-slate-100 rounded-xl" />
                <div className="h-10 bg-slate-200 rounded-xl" />
              </div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
              <MdAssignmentTurnedIn size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {isAdvertiser ? "No active campaigns in this category" : "No available tasks in this category"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              {isAdvertiser
                ? "Be the first to post a task in this category or check back shortly."
                : "All slots in this category are currently filled. New tasks are published regularly throughout the day!"}
            </p>
            {isAdvertiser ? (
              <div>
                <Link
                  to="/create-task"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-colors"
                >
                  <FaPlus size={12} />
                  <span>Create a Task</span>
                </Link>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <span>View All Tasks</span>
                </button>
                <Link
                  to="/earn"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  <FaBoltLightning size={11} />
                  <span>Perform Social Tasks</span>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {tasks.map((task) => {
              const totalSlots = Number(
                task.total_slots ||
                  task.totalSlots ||
                  task.number_of_tasks ||
                  task.total_participants ||
                  100
              );
              const tasksDone = Number(
                task.tasks_done ||
                  task.tasksDone ||
                  task.completed_count ||
                  task.completedTasks ||
                  0
              );
              const slotsLeft = Math.max(
                0,
                task.slots_remaining !== undefined && task.slots_remaining !== null
                  ? Number(task.slots_remaining)
                  : totalSlots - tasksDone
              );
              const slotsPercent = Math.round((tasksDone / Math.max(1, totalSlots)) * 100) || 0;
              const reward = Number(
                task.reward_per_worker ||
                  task.earner_fee ||
                  task.cost_per_task ||
                  task.costPerTask ||
                  task.reward ||
                  task.amount_to_earn ||
                  task.amountToEarn ||
                  (task.category === "advert" ? 100 : 25)
              );

              const currentUserId = currentUser?.id || currentUser?._id;
              const isMyTask = Boolean(task?.creator_id && currentUserId && String(task.creator_id) === String(currentUserId));

              return (
                <div
                  key={task.id}
                  className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold uppercase tracking-wider">
                          {task.category?.replace(/_/g, " ")}
                        </span>
                        {(reward >= 50 || task.category === "survey" || task.category === "advert") && (
                          <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-extrabold uppercase">
                            👑 PRO
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                        <FaClock size={12} />
                        <span>~{task.estimated_minutes || 10} mins</span>
                      </div>
                    </div>

                    {/* Task Title */}
                    <h3 className="font-extrabold text-base sm:text-lg text-slate-900 group-hover:text-emerald-900 transition-colors line-clamp-2">
                      {task.title}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {task.description || task.instructions}
                    </p>

                    {/* Slots Progress Bar */}
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-slate-500">Slots Remaining</span>
                        <span className={slotsLeft > 5 ? "text-emerald-600" : "text-amber-600"}>
                          {slotsLeft} / {totalSlots} left
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(10, slotsPercent))}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Reward & Action */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Worker Payout
                      </span>
                      <span className="text-xl font-black text-emerald-600">
                        ₦{numeral(reward).format("0,0")}
                      </span>
                    </div>

                    {isMyTask ? (
                      <Link
                        to={`/creator/campaigns/${task.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md shadow-slate-900/20 active:scale-98 transition-all"
                      >
                        <span>Manage Campaign</span>
                        <FaArrowRight size={11} />
                      </Link>
                    ) : task.hasSubmitted ? (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs font-black uppercase">
                          <FaCheck size={11} className="text-emerald-600" />
                          <span>Submitted</span>
                        </span>
                        <Link
                          to={`/workspace/${task.id}`}
                          className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                        >
                          View
                        </Link>
                      </div>
                    ) : task.isReserved ? (
                      <Link
                        to={`/workspace/${task.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 active:scale-98 transition-all"
                      >
                        <span>Resume</span>
                        <FaArrowRight size={11} />
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleStartTask(task)}
                        disabled={slotsLeft <= 0 || reservingId === task.id}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {reservingId === task.id ? (
                          <span>Reserving...</span>
                        ) : (
                          <>
                            <span>Start Task</span>
                            <FaArrowRight size={11} />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default TaskMarketplace;
