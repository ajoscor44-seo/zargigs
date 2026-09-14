import React, { useState, useEffect, useMemo } from "react";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom";
import { useAuth } from "../context/AuthContext";
import { taskService } from "../services/supabaseService";
import logo from "../assets/png/logo-color.png";
import {
  FaMagnifyingGlass,
  FaFilter,
  FaBoltLightning,
  FaClock,
  FaUsers,
  FaShieldHalved,
  FaArrowRight,
  FaCheck,
  FaWhatsapp,
  FaTiktok,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
  FaSpotify,
  FaTelegram,
  FaGooglePlay,
  FaGlobe,
  FaShareNodes,
  FaStar,
  FaFire,
  FaArrowTrendUp,
  FaXmark,
  FaWallet,
  FaUserCheck,
} from "react-icons/fa6";

const PLATFORMS = [
  { id: "all", label: "All Platforms", icon: <FaGlobe className="text-emerald-500" /> },
  { id: "whatsapp", label: "WhatsApp", icon: <FaWhatsapp className="text-green-500" /> },
  { id: "tiktok", label: "TikTok", icon: <FaTiktok className="text-slate-900 dark:text-white" /> },
  { id: "instagram", label: "Instagram", icon: <FaInstagram className="text-pink-500" /> },
  { id: "twitter", label: "Twitter / X", icon: <FaXTwitter className="text-slate-800 dark:text-slate-200" /> },
  { id: "youtube", label: "YouTube", icon: <FaYoutube className="text-red-600" /> },
  { id: "spotify", label: "Spotify", icon: <FaSpotify className="text-emerald-400" /> },
  { id: "telegram", label: "Telegram", icon: <FaTelegram className="text-sky-500" /> },
  { id: "playstore", label: "Google Play", icon: <FaGooglePlay className="text-emerald-600" /> },
];

const CATEGORIES = [
  { id: "all", label: "All Categories" },
  { id: "social", label: "Social Adverts" },
  { id: "engagement", label: "Engagements & Follows" },
  { id: "app", label: "App Installs & Reviews" },
  { id: "survey", label: "Surveys & Insights" },
];

const PublicMarketplace = () => {
  const history = useHistory();
  const { currentUser } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [selectedCategory, selectedPlatform]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await taskService.getTasks({
        category: selectedCategory,
        platform: selectedPlatform,
        search: search.trim(),
      });
      setTasks(data || []);
    } catch (err) {
      console.error("Error fetching public tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTasks();
  };

  // Filter and sort tasks client-side
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.platform?.toLowerCase().includes(q)
      );
    }

    if (sortBy === "reward-high") {
      result.sort((a, b) => (b.reward_per_worker || 0) - (a.reward_per_worker || 0));
    } else if (sortBy === "reward-low") {
      result.sort((a, b) => (a.reward_per_worker || 0) - (b.reward_per_worker || 0));
    } else if (sortBy === "spots-left") {
      result.sort((a, b) => (b.spots_remaining || 0) - (a.spots_remaining || 0));
    }

    return result;
  }, [tasks, search, sortBy]);

  const getPlatformIcon = (platform) => {
    switch ((platform || "").toLowerCase()) {
      case "whatsapp":
        return <FaWhatsapp className="text-green-500" />;
      case "tiktok":
        return <FaTiktok className="text-slate-900" />;
      case "instagram":
        return <FaInstagram className="text-pink-500" />;
      case "twitter":
      case "x":
        return <FaXTwitter className="text-slate-800" />;
      case "youtube":
        return <FaYoutube className="text-red-600" />;
      case "spotify":
        return <FaSpotify className="text-emerald-500" />;
      case "telegram":
        return <FaTelegram className="text-sky-500" />;
      case "playstore":
        return <FaGooglePlay className="text-emerald-600" />;
      default:
        return <FaGlobe className="text-slate-600" />;
    }
  };

  const handlePerformTask = (task) => {
    if (!currentUser) {
      // Prompt modal or redirect with task reference
      setSelectedTask(task);
    } else {
      history.push(`/workspace/${task.id || task._id}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-primary text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logo} alt="DocsZar" className="h-9 w-auto object-contain transition-transform group-hover:scale-105" />
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
            <Link to="/marketplace" className="text-emerald-600 font-semibold flex items-center gap-1.5">
              <FaFire className="text-orange-500" /> Marketplace
            </Link>
            <Link to="/about-us" className="hover:text-emerald-600 transition-colors">About</Link>
          </nav>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/create-task"
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-emerald-600/30 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-semibold text-xs tracking-wide transition-all"
                >
                  <FaBoltLightning className="text-emerald-600" /> Post a Gig
                </Link>
                <Link
                  to="/dashboard"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-all"
                >
                  Dashboard
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-slate-700 hover:text-emerald-600 font-semibold text-sm transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm shadow-emerald-500/20 hover:shadow-md transition-all duration-200"
                >
                  Start Earning Free
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Showcase Section */}
      <section className="bg-slate-900 text-white py-14 sm:py-16 px-4 border-b border-slate-800">
        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-semibold tracking-wide uppercase">
            <FaBoltLightning /> Live Real-Time Task Marketplace
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
            Complete Simple Tasks. <br className="hidden sm:inline" />
            <span className="text-emerald-400">
              Earn Instant Cash Daily.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed">
            Browse hundreds of verified social gigs, surveys, app reviews, and promoter tasks. Perform in minutes and withdraw earnings instantly via automated PocketFi bank transfers.
          </p>

          {/* Quick Stats Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-slate-300">
            <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3.5 py-1.5 rounded-lg border border-white/10">
              <FaCheck className="text-emerald-400" /> Instant Bank Payouts
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3.5 py-1.5 rounded-lg border border-white/10">
              <FaShieldHalved className="text-teal-400" /> 100% Escrow Guaranteed
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3.5 py-1.5 rounded-lg border border-white/10">
              <FaStar className="text-amber-400" /> Zero Experience Required
            </span>
          </div>

          {/* Interactive Search Bar */}
          <form onSubmit={handleSearchSubmit} className="pt-4 max-w-2xl mx-auto">
            <div className="relative flex items-center shadow-2xl rounded-2xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 p-1.5">
              <FaMagnifyingGlass className="text-slate-400 ml-4 mr-3 text-lg" />
              <input
                type="text"
                placeholder="Search gigs by keyword (e.g. WhatsApp, TikTok, Survey, App Review)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-white placeholder-slate-400 focus:outline-none text-sm sm:text-base px-2 py-2"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg hover:shadow-emerald-500/25 shrink-0"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Platform & Category Navigation Bar */}
        <div className="space-y-4">
          {/* Platform Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {PLATFORMS.map((p) => {
              const active = selectedPlatform === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlatform(p.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border ${
                    active
                      ? "bg-slate-900 text-white border-slate-900 shadow-md scale-105"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100/70"
                  }`}
                >
                  {p.icon}
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>

          {/* Secondary Filter & Sort Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-slate-200">
            <div className="flex flex-wrap items-center gap-2">
              {CATEGORIES.map((c) => {
                const active = selectedCategory === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      active
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-slate-200/80 text-slate-700 hover:bg-slate-300"
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-600 w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-slate-500 font-bold">
                {filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"} available
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="newest">Sort by: Newest</option>
                <option value="reward-high">Reward: High to Low</option>
                <option value="reward-low">Reward: Low to High</option>
                <option value="spots-left">Most Spots Left</option>
              </select>
            </div>
          </div>
        </div>

        {/* Task Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse space-y-4 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div className="h-6 w-24 bg-slate-200 rounded-full" />
                  <div className="h-6 w-16 bg-slate-200 rounded-full" />
                </div>
                <div className="h-5 w-3/4 bg-slate-200 rounded" />
                <div className="h-12 w-full bg-slate-200 rounded" />
                <div className="h-10 w-full bg-slate-200 rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-2xl mx-auto">
              <FaFilter />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No tasks found matching your filters</h3>
            <p className="text-sm text-slate-500">
              Try adjusting your search keyword, category, or platform selection.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedPlatform("all");
                setSelectedCategory("all");
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {filteredTasks.map((task) => {
              const reward = task.reward_per_worker || task.rewardAmount || 50;
              const total = task.total_quota || 100;
              const completed = task.completed_count || 0;
              const spots = task.spots_remaining !== undefined ? task.spots_remaining : Math.max(0, total - completed);
              const progressPct = Math.min(100, Math.round((completed / Math.max(1, total)) * 100));

              return (
                <div
                  key={task.id || task._id}
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  {/* Card Header */}
                  <div className="p-6 space-y-4 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider">
                        {getPlatformIcon(task.platform)}
                        <span>{task.platform || "Gig"}</span>
                      </div>

                      <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs font-black">
                        <span>₦{numeral(reward).format("0,0")}</span>
                      </div>
                    </div>

                    <div>
                      <h3
                        onClick={() => setSelectedTask(task)}
                        className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 cursor-pointer"
                      >
                        {task.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                        {task.description}
                      </p>
                    </div>

                    {/* Requirements Tags */}
                    {task.requirements && task.requirements.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {task.requirements.slice(0, 2).map((req, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-50 text-slate-600 border border-slate-200/60 px-2 py-0.5 rounded-md"
                          >
                            <FaCheck className="text-emerald-500 text-[9px]" /> {req}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 space-y-3">
                    {/* Progress */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-medium text-slate-500">
                        <span>{spots} spots left</span>
                        <span>{progressPct}% filled</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handlePerformTask(task)}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200 shadow-sm"
                    >
                      <span>Perform Task & Earn ₦{numeral(reward).format("0,0")}</span>
                      <FaArrowRight size={11} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Advertiser / Creator Promo Banner */}
        <section className="bg-emerald-700 rounded-3xl p-8 sm:p-12 text-white shadow-sm border border-emerald-800 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              For Businesses & Influencers
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Need 1,000+ People to Share Your Status, App or Video?
            </h2>
            <p className="text-sm text-emerald-100/90 leading-relaxed">
              Launch targeted campaigns in 2 minutes. Reach real, verified Nigerian social media users with guaranteed proof of performance.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to={currentUser ? "/create-task" : "/signup"}
                className="px-6 py-3 rounded-xl bg-white text-emerald-900 font-bold text-sm shadow-md hover:bg-emerald-50 transition-all"
              >
                Create Campaign Now
              </Link>
              <Link
                to="/about-us"
                className="px-5 py-3 rounded-xl bg-emerald-700/50 hover:bg-emerald-700 text-white font-semibold text-sm transition-all"
              >
                Learn How It Works
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Task Preview & Claim Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedTask(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-all"
            >
              <FaXmark size={16} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-black">
                {getPlatformIcon(selectedTask.platform)}
              </div>
              <div>
                <span className="text-xs font-bold uppercase text-emerald-600 tracking-wider">
                  {selectedTask.platform} Gig
                </span>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {selectedTask.title}
                </h3>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Worker Payout
                </span>
                <p className="text-2xl font-black text-emerald-600">
                  ₦{numeral(selectedTask.reward_per_worker || selectedTask.rewardAmount || 50).format("0,0")}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Remaining Spots
                </span>
                <p className="text-lg font-bold text-slate-800">
                  {selectedTask.spots_remaining || 50} left
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Task Instructions
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-3.5 rounded-xl border border-slate-100">
                {selectedTask.description}
              </p>
            </div>

            {selectedTask.requirements && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  Requirements
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {selectedTask.requirements.map((req, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <FaCheck className="text-emerald-500 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-2">
              {currentUser ? (
                <button
                  onClick={() => {
                    history.push(`/workspace/${selectedTask.id || selectedTask._id}`);
                  }}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Open Task Workspace</span>
                  <FaArrowRight size={13} />
                </button>
              ) : (
                <div className="space-y-3 text-center">
                  <Link
                    to="/signup"
                    className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Create Free Account to Claim ₦{numeral(selectedTask.reward_per_worker || selectedTask.rewardAmount || 50).format("0,0")}</span>
                    <FaArrowRight size={13} />
                  </Link>
                  <p className="text-xs text-slate-400">
                    Already registered?{" "}
                    <Link to="/login" className="text-emerald-600 font-semibold hover:underline">
                      Log In here
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} DocsZar. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicMarketplace;
