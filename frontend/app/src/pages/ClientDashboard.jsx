import React, { useEffect, useState } from "react";
import ClientLayout from "../components/ClientLayout/ClientLayout";
import ClientDashboardCard from "../components/ClientDashboardCard/ClientDashboardCard";
import ClientsEarnings from "../components/ClientEarnings/ClientsEarnings";
import MoneyTransaction from "../components/MoneyTransaction/MoneyTransaction";
import Announcements from "../components/Announcements/Announcements";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom/cjs/react-router-dom";
import numeral from "numeral";
import {
  FaCrown,
  FaArrowRight,
  FaPlus,
  FaCopy,
  FaCheck,
  FaUsers,
  FaBullhorn,
  FaThumbsUp,
  FaMobileScreen,
  FaChartSimple,
  FaClipboardList,
  FaMoneyBillWave,
  FaWhatsapp,
  FaInstagram,
  FaTiktok,
  FaXTwitter,
  FaFacebook,
  FaYoutube,
  FaGooglePlay,
  FaSpotify,
  FaWallet,
  FaArrowTrendUp,
  FaClockRotateLeft,
  FaBuildingColumns,
  FaBagShopping,
  FaRocket,
  FaShieldHalved,
} from "react-icons/fa6";
import {
  MdPoll,
  MdOutlineRateReview,
  MdAssignmentTurnedIn,
  MdAddCircleOutline,
  MdVerified,
  MdOutlineCampaign,
  MdManageAccounts,
} from "react-icons/md";
import {
  FiZap,
  FiShoppingBag,
  FiCheckSquare,
  FiPlusCircle,
  FiTrendingUp,
  FiAward,
  FiX,
} from "react-icons/fi";

import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom";

const ClientDashboard = () => {
  const { currentUser, adminData, dashboardMode, switchDashboardMode } = useAuth();
  const history = useHistory();
  const location = useLocation();
  const [hideProBanner, setHideProBanner] = useState(
    () => localStorage.getItem("hide_verified_pro_banner") === "true"
  );
  const [recentActivities, setRecentActivities] = useState([]);
  const [myCampaigns, setMyCampaigns] = useState([]);
  const [copied, setCopied] = useState(false);
  const appName = adminData?.appName || "DocsZar";
  const membershipFee = adminData?.membershipFee || 1000;
  const refLink = `${window.location.origin}/signup?ref=${currentUser?.username || ""}`;

  const isEarner = dashboardMode === "earner";

  const fetchDashboardData = async () => {
    try {
      const [actRes, campRes] = await Promise.allSettled([
        axios.get("/api/v1/activities/recent-activities"),
        axios.get("/api/v1/marketplace/creator/campaigns"),
      ]);

      if (actRes.status === "fulfilled" && Array.isArray(actRes.value.data)) {
        setRecentActivities(actRes.value.data);
      }
      if (campRes.status === "fulfilled" && campRes.value.data?.success) {
        setMyCampaigns(campRes.value.data.data || []);
      }
    } catch (err) {
      // Handled gracefully
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const copyReferralLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(refLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(
      `Earn daily cash completing simple tasks and posting adverts on your WhatsApp status with ${appName}! Sign up here: ${refLink}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Top Announcements */}
        <Announcements />

        {/* 1. VIP MEMBERSHIP PROMOTION BANNER (Shown for non-members) */}
        {!currentUser?.isMember ? (
          <div className="relative overflow-hidden rounded-2xl bg-orange-600 p-5 sm:p-6 text-white shadow-sm border border-orange-700">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div className="space-y-1.5 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-700 text-orange-100 text-xs font-black">
                  <FaCrown size={12} className="text-orange-200" />
                  <span>VIP MEMBER ACTIVATION</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  Turn Your Social Media Into Daily Income — Activate Membership
                </h2>
                <p className="text-xs sm:text-sm text-orange-100 leading-relaxed font-medium">
                  Pay a one-time activation fee of <strong>₦{numeral(membershipFee).format("0,0.00")}</strong> to unlock unlimited daily tasks, post adverts, earn 60% referral bonuses (₦600+ per friend), and withdraw earnings anytime directly to your bank account.
                </p>
              </div>

              <div className="shrink-0 w-full md:w-auto">
                <Link
                  to="/become-a-member"
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                >
                  <FaCrown size={14} className="text-amber-400" />
                  <span>Activate Membership (₦{numeral(membershipFee).format("0,0")})</span>
                  <FaArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        ) : !hideProBanner ? (
          <div className="relative bg-emerald-50 border border-emerald-200/90 rounded-2xl p-4 sm:p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 shadow-2xs">
            <div className="flex items-start sm:items-center gap-3 pr-6 sm:pr-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5 sm:mt-0">
                <MdVerified size={20} />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-emerald-950 leading-snug">
                You are a <strong className="text-emerald-800 font-extrabold">Verified Pro Member</strong>. You have full access to daily earnings and instant withdrawals.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <Link
                to="/invite"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-extrabold shadow-xs transition-all"
              >
                <span>Invite Friends (Earn 60%)</span>
                <FaArrowRight size={11} />
              </Link>
              <button
                type="button"
                onClick={() => {
                  setHideProBanner(true);
                  localStorage.setItem("hide_verified_pro_banner", "true");
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-emerald-200/50 rounded-lg transition-colors cursor-pointer"
                title="Dismiss banner"
                aria-label="Dismiss banner"
              >
                <FiX size={16} />
              </button>
            </div>
          </div>
        ) : null}

        {/* 2. DASHBOARD HEADER WITH MODE TOGGLE */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-200/70">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Hello, {currentUser?.firstname || currentUser?.username || "User"} 👋
              </h1>
              <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {isEarner ? "⚡ Earner View" : "📢 Advertiser View"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEarner
                ? "Complete tasks, post status adverts, answer surveys, and withdraw your daily earnings."
                : "Promote your business, order authentic Nigerian followers & likes, and launch microtasks."}
            </p>
          </div>

          {/* Mode Switcher Segmented Control */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl shrink-0 self-start sm:self-auto border border-slate-200/80">
            <button
              type="button"
              onClick={() => switchDashboardMode("earner", history, location.pathname)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                isEarner
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>⚡</span>
              <span>Earner Mode</span>
            </button>
            <button
              type="button"
              onClick={() => switchDashboardMode("advertiser", history, location.pathname)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                !isEarner
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>📢</span>
              <span>Advertiser Mode</span>
            </button>
          </div>
        </div>

        {/* 3. MAIN DASHBOARD GRID (CONTENT + SIDEBAR) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
          
          {/* ============================================================ */}
          {/* LEFT COLUMN: 8 Columns Tailored to Earner / Advertiser Mode   */}
          {/* ============================================================ */}
          <div className="order-2 lg:order-1 lg:col-span-8 space-y-4">

            {/* ------------------------------------------------------------ */}
            {/* VIEW A: EARNER DASHBOARD EXPERIENCE                           */}
            {/* ------------------------------------------------------------ */}
            {isEarner ? (
              <>
                {/* 1. Earner Hub Banner */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase text-emerald-600 tracking-wider">
                        <FaMoneyBillWave size={12} />
                        <span>Daily Earning Channels</span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                        Start Earning Money Right Now
                      </h2>
                      <p className="text-xs text-slate-500">
                        Pick any category below to perform tasks and get credited directly to your wallet.
                      </p>
                    </div>
                    <Link
                      to="/tasks"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors self-start sm:self-auto"
                    >
                      <span>Browse All Tasks</span>
                      <FaArrowRight size={11} />
                    </Link>
                  </div>

                  {/* 4 Earning Methods Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Method 1: Social Media Tasks */}
                    <Link
                      to="/earn"
                      className="p-4 rounded-2xl bg-white hover:bg-slate-50/80 border border-slate-200/80 hover:border-emerald-400 transition-all flex items-start gap-3.5 group text-decoration-none shadow-2xs"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border border-emerald-100">
                        <FaThumbsUp size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                            Perform Social Tasks
                          </h3>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                            Daily Jobs
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          Follow accounts, like posts, comment, and subscribe on YouTube, Instagram, and TikTok. Earn ₦20 - ₦100 per action.
                        </p>
                      </div>
                    </Link>

                    {/* Method 2: Post WhatsApp Status Adverts */}
                    <Link
                      to="/earn"
                      className="p-4 rounded-2xl bg-white hover:bg-slate-50/80 border border-slate-200/80 hover:border-emerald-400 transition-all flex items-start gap-3.5 group text-decoration-none shadow-2xs"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border border-emerald-100">
                        <FaBullhorn size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                            Post Status Adverts
                          </h3>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                            ₦100+ / Post
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          Share sponsor flyers and advert text on your WhatsApp status. Submit screenshot proof for fast payout.
                        </p>
                      </div>
                    </Link>

                    {/* Method 3: Paid Micro-Surveys */}
                    <Link
                      to="/tasks?category=survey"
                      className="p-4 rounded-2xl bg-white hover:bg-slate-50/80 border border-slate-200/80 hover:border-emerald-400 transition-all flex items-start gap-3.5 group text-decoration-none shadow-2xs"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border border-emerald-100">
                        <MdPoll size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                            Micro-Surveys & Research
                          </h3>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                            ₦200 - ₦1,500
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          Give consumer opinions, test websites, rate apps, and complete research questionnaires.
                        </p>
                      </div>
                    </Link>

                    {/* Method 4: Refer & Earn 60% */}
                    <Link
                      to="/invite"
                      className="p-4 rounded-2xl bg-white hover:bg-slate-50/80 border border-slate-200/80 hover:border-orange-400 transition-all flex items-start gap-3.5 group text-decoration-none shadow-2xs"
                    >
                      <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border border-orange-100">
                        <FaUsers size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-sm text-slate-900 group-hover:text-orange-700 transition-colors">
                            Refer & Earn 60%
                          </h3>
                          <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                            ₦600+ / Friend
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          Get 60% instant commission on every friend who registers and activates. Direct bank withdrawal.
                        </p>
                      </div>
                    </Link>
                  </div>

                  {/* Earner Quick History Bar */}
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <FaClipboardList className="text-emerald-600" size={16} />
                      <span className="text-xs font-bold text-slate-700">
                        Check your submitted task proofs and earnings progress.
                      </span>
                    </div>
                    <Link
                      to="/tasks-history"
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl transition-colors self-start sm:self-auto shrink-0 shadow-2xs"
                    >
                      My Task Submissions →
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              /* ------------------------------------------------------------ */
              /* VIEW B: ADVERTISER DASHBOARD EXPERIENCE                      */
              /* ------------------------------------------------------------ */
              <>
                {/* 1. Advertiser Hub Banner */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase text-slate-800 tracking-wider">
                        <FaBullhorn size={12} className="text-orange-500" />
                        <span>Advertiser & Growth Suite</span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                        Promote Your Business & Order Engagement
                      </h2>
                      <p className="text-xs text-slate-500">
                        Reach tens of thousands of verified real Nigerians across WhatsApp, Instagram, Facebook, TikTok, and web.
                      </p>
                    </div>
                    <Link
                      to="/create-task"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors self-start sm:self-auto"
                    >
                      <FaPlus size={11} />
                      <span>Post New Campaign</span>
                    </Link>
                  </div>

                  {/* 3 Advertising Pillars */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {/* Option 1: Post Social Adverts */}
                    <div className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between group">
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-emerald-100">
                          <FaBullhorn size={18} />
                        </div>
                        <h3 className="font-extrabold text-sm text-slate-900 mb-1">
                          Post Social Adverts
                        </h3>
                        <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                          Pay verified users with 1,000+ followers to repost your advert on their WhatsApp Status, Instagram, and Facebook.
                        </p>
                      </div>
                      <Link
                        to="/advertise"
                        className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs text-center transition-colors shadow-2xs"
                      >
                        Create Advert →
                      </Link>
                    </div>

                    {/* Option 2: Buy Social Engagements */}
                    <div className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between group">
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-emerald-100">
                          <FaThumbsUp size={18} />
                        </div>
                        <h3 className="font-extrabold text-sm text-slate-900 mb-1">
                          Social Engagements
                        </h3>
                        <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                          Get authentic real Nigerian followers, likes, positive comments, app downloads, YouTube subscribers, and retweets.
                        </p>
                      </div>
                      <Link
                        to="/order"
                        className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs text-center transition-colors shadow-2xs"
                      >
                        Order Followers & Likes →
                      </Link>
                    </div>

                    {/* Option 3: Custom Microtasks & Surveys */}
                    <div className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-orange-400 hover:shadow-md transition-all flex flex-col justify-between group">
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-orange-100">
                          <MdAssignmentTurnedIn size={20} />
                        </div>
                        <h3 className="font-extrabold text-sm text-slate-900 mb-1">
                          Microtasks & Surveys
                        </h3>
                        <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                          Run surveys, website usability testing, app signups, and custom gig tasks with automated escrow protection.
                        </p>
                      </div>
                      <Link
                        to="/create-task"
                        className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs text-center transition-colors shadow-2xs"
                      >
                        Launch Task →
                      </Link>
                    </div>
                  </div>

                  {/* Campaign Tracker Bar */}
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <MdOutlineCampaign className="text-purple-600" size={18} />
                      <span className="text-xs font-bold text-slate-700">
                        Managing existing campaigns? Track order fulfillment and review worker submissions.
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        to="/order-history"
                        className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl transition-colors shadow-2xs"
                      >
                        Order History
                      </Link>
                      <Link
                        to="/advertisements"
                        className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl transition-colors shadow-2xs"
                      >
                        My Adverts
                      </Link>
                    </div>
                  </div>
                </div>

              </>
            )}
          </div>

          {/* ============================================================ */}
          {/* RIGHT COLUMN: 4 Columns Tailored to Earner / Advertiser Mode  */}
          {/* ============================================================ */}
          <div className="order-1 lg:order-2 lg:col-span-4 space-y-6">
            {/* 1. Wallet Balance Card */}
            <ClientDashboardCard
              firstname={currentUser?.firstname || "User"}
              lastname={currentUser?.lastname || ""}
              userBalance={currentUser?.balance || currentUser?.userEarnings?.balance || 0}
            />

            {/* 2. Quick Action Financial Buttons */}
            {/* 2. Quick Action Financial Buttons */}
            <MoneyTransaction />

            {/* 3. Financial Metrics Box */}
            <ClientsEarnings
              totalEarnings={currentUser?.userEarnings?.totalEarnings || currentUser?.balance || 0}
              pendingEarnings={currentUser?.pendingBalance || currentUser?.userEarnings?.pendingEarnings || 0}
              amountWithdrawn={currentUser?.userEarnings?.amountWithdrawn || 0}
              amountSpent={currentUser?.userEarnings?.amountSpent || 0}
            />
          </div>
        </div>

        {/* ============================================================ */}
        {/* COMPACT FULL-WIDTH GROWTH & AFFILIATE STRIP                  */}
        {/* ============================================================ */}
        {isEarner ? (
          <div className="w-full px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl bg-slate-900 text-white shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
            {/* Left: Compact Info */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-800/60">
                <FaUsers size={14} />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-black text-white">
                    Affiliate: Earn ₦{numeral(membershipFee * 0.6).format("0,0")} / Referral
                  </span>
                  <span className="text-[9px] font-black text-emerald-300 bg-emerald-950 px-1.5 py-0.5 rounded-md border border-emerald-800 uppercase">
                    60% Commission
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 hidden sm:block">
                  Share your link to receive instant wallet deposits when friends activate.
                </p>
              </div>
            </div>

            {/* Right: Inline Link Copy & WhatsApp */}
            <div className="flex items-center gap-2 flex-1 md:max-w-md justify-end">
              <div className="relative flex-1 min-w-[200px]">
                <input
                  type="text"
                  readOnly
                  value={refLink}
                  className="w-full py-1.5 pl-2.5 pr-16 bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-xs font-mono select-all focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={copyReferralLink}
                  className="absolute right-1 top-1 bottom-1 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-md flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copied ? <FaCheck size={10} /> : <FaCopy size={10} />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <button
                type="button"
                onClick={shareOnWhatsApp}
                className="py-1.5 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                title="Share on WhatsApp"
              >
                <FaWhatsapp size={14} className="text-emerald-300" />
                <span className="hidden sm:inline">WhatsApp</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl bg-slate-900 text-white shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 border border-slate-700">
                <FaShieldHalved size={14} />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-black text-white">Escrow Protection Guarantee</span>
                  <span className="text-[9px] font-black text-emerald-300 bg-emerald-950 px-1.5 py-0.5 rounded-md border border-emerald-800 uppercase">
                    100% Protected
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Only pay for genuine, screenshot-verified submissions.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/fund-wallet"
                className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors text-center"
              >
                <FaWallet size={12} />
                <span>Fund Wallet</span>
              </Link>
              <Link
                to="/help-support"
                className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs transition-colors text-center border border-slate-700"
              >
                <span>Enterprise Support</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default ClientDashboard;
