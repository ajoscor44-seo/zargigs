import React, { useEffect, useState } from "react";
import ClientLayout from "../components/ClientLayout/ClientLayout";
import numeral from "numeral";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IoClose } from "react-icons/io5";
import {
  FiSettings,
  FiMapPin,
  FiUsers,
  FiUserCheck,
  FiUserPlus,
  FiChevronDown,
  FiChevronUp,
  FiCheckCircle,
  FiCopy,
  FiCheck,
  FiEdit3,
  FiCreditCard,
  FiShield,
  FiMail,
  FiPhone,
  FiAward,
  FiArrowUpRight,
} from "react-icons/fi";
import {
  FaWallet,
  FaMoneyBillTransfer,
  FaBuildingColumns,
  FaWhatsapp,
  FaCrown,
  FaClockRotateLeft,
  FaListCheck,
  FaBullhorn,
  FaAndroid,
  FaApple,
  FaMobileScreenButton,
} from "react-icons/fa6";

const UserDetails = () => {
  const { currentUser, adminData, fetchUserData } = useAuth();
  const [modalData, setModalData] = useState([]);
  const [modalState, setModalState] = useState(false);
  const [modalTitle, setModalTitle] = useState("Referrals");
  const [showEarnings, setShowEarnings] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const totalEarnings = currentUser?.userEarnings?.totalEarnings || currentUser?.balance || 0;
  const pendingEarnings = currentUser?.userEarnings?.pendingEarnings || currentUser?.pendingBalance || 0;
  const amountWithdrawn = currentUser?.userEarnings?.amountWithdrawn || 0;
  const amountSpent = currentUser?.userEarnings?.amountSpent || 0;
  const balance = currentUser?.userEarnings?.balance ?? currentUser?.balance ?? 0;

  const referrals = currentUser?.referrals || [];
  const followers = referrals.filter((referral) => referral.isMember);
  const userPeoples = {
    referrals: referrals.length,
    followers: followers.length,
    following: 1,
  };

  const location = {
    LGA: currentUser?.location?.LGA || currentUser?.lga || "Lagos Island",
    state: currentUser?.location?.state || currentUser?.state || "Lagos",
    country: "Nigeria",
  };

  const bankName =
    currentUser?.walletDetails?.bankName ||
    currentUser?.bankName ||
    currentUser?.bank_name ||
    "";
  const accountNumber =
    currentUser?.walletDetails?.accountNumber ||
    currentUser?.accountNumber ||
    currentUser?.account_number ||
    "";
  const accountName =
    currentUser?.walletDetails?.accountName ||
    currentUser?.accountName ||
    currentUser?.account_name ||
    "";

  const userImageURL =
    currentUser?.image ||
    currentUser?.avatarUrl ||
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const referralCode = currentUser?.username || "user";
  const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(
      `Hey! Earn daily income by completing simple microtasks, surveys, and social tasks on ${adminData?.appName || "DocsZAR"}. Sign up here: ${referralLink}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const showModal = (data, title) => {
    setModalData(data || []);
    setModalTitle(title);
    setModalState(true);
  };

  return (
    <ClientLayout>
      <div className="font-primary text-slate-800 space-y-6">
        {/* Top Header */}
        <div className="pb-2 border-b border-slate-200/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              My Profile & Account Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Personal credentials, financial summary, and connected accounts.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/edit-profile"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-200/60 transition-colors"
            >
              <FiEdit3 size={14} />
              <span>Edit Profile</span>
            </Link>
            <Link
              to="/account-settings"
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 transition-colors"
              title="Account Settings"
            >
              <FiSettings size={16} />
            </Link>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (8 cols): Profile Hero, Wallet, Shortcuts */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Profile Hero Card */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/80 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 relative z-10">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left w-full sm:w-auto">
                  {/* Avatar */}
                  <div className="relative group shrink-0">
                    <img
                      src={userImageURL}
                      alt={currentUser?.firstname || "User"}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-xs group-hover:scale-105 transition-all"
                    />
                    {currentUser?.isMember ? (
                      <div
                        className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 rounded-full p-1 shadow-xs"
                        title="Verified Pro Member"
                      >
                        <FaCrown size={10} />
                      </div>
                    ) : (
                      <div
                        className="absolute -bottom-1 -right-1 bg-slate-400 text-white rounded-full p-1 shadow-xs"
                        title="Free User"
                      >
                        <FiShield size={10} />
                      </div>
                    )}
                  </div>

                  {/* Name, Handle, Badges */}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mb-0.5">
                      <h2 className="font-black text-lg sm:text-xl text-slate-900 tracking-tight truncate">
                        {currentUser?.firstname} {currentUser?.lastname}
                      </h2>
                      {currentUser?.isMember ? (
                        <span className="inline-flex items-center gap-1 bg-orange-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                          <FaCrown size={8} /> PRO MEMBER
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded-full border border-slate-200">
                          FREE PLAN
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-bold text-emerald-600 mb-2">
                      @{currentUser?.username?.toLowerCase()}
                    </p>

                    {/* Badges Row */}
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-50 text-slate-600 text-[11px] font-semibold rounded-lg border border-slate-200/80">
                        <FiMail size={11} className="text-slate-400 shrink-0" />
                        <span className="truncate max-w-[170px]">{currentUser?.email}</span>
                      </span>

                      {currentUser?.phone && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-50 text-slate-600 text-[11px] font-semibold rounded-lg border border-slate-200/80">
                          <FiPhone size={11} className="text-slate-400 shrink-0" />
                          <span>{currentUser?.phone}</span>
                        </span>
                      )}

                      <Link
                        to="/update-location"
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold rounded-lg border border-emerald-200/60 transition-colors"
                      >
                        <FiMapPin size={11} className="shrink-0" />
                        <span className="truncate max-w-[150px]">
                          {location.LGA}, {location.state}
                        </span>
                      </Link>

                      {(currentUser?.device || currentUser?.device_type) && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-50 text-slate-700 text-[11px] font-bold rounded-lg border border-slate-200/80">
                          {String(currentUser?.device || currentUser?.device_type).toLowerCase().includes("iphone") ||
                          String(currentUser?.device || currentUser?.device_type).toLowerCase().includes("ios") ? (
                            <FaApple size={11} className="text-slate-800" />
                          ) : String(currentUser?.device || currentUser?.device_type).toLowerCase().includes("android") ? (
                            <FaAndroid size={11} className="text-emerald-500" />
                          ) : (
                            <FaMobileScreenButton size={11} className="text-emerald-600" />
                          )}
                          <span>{currentUser?.device || currentUser?.device_type}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Stats Row */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full pt-3.5 mt-3.5 border-t border-slate-100 relative z-10">
                <button
                  type="button"
                  onClick={() => showModal(referrals, "Total Referrals")}
                  className="p-2 sm:p-2.5 bg-slate-50 hover:bg-emerald-50/60 rounded-xl border border-slate-100 transition-all group flex flex-col items-center cursor-pointer"
                >
                  <div className="flex items-center gap-1 text-slate-400 group-hover:text-emerald-600 mb-0.5">
                    <FiUsers size={12} />
                    <span className="text-[10px] sm:text-[11px] font-bold">Referrals</span>
                  </div>
                  <span className="text-base sm:text-lg font-black text-slate-900 group-hover:text-emerald-700 leading-tight">
                    {userPeoples.referrals}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => showModal(followers, "Active Pro Referrals")}
                  className="p-2 sm:p-2.5 bg-slate-50 hover:bg-emerald-50/60 rounded-xl border border-slate-100 transition-all group flex flex-col items-center cursor-pointer"
                >
                  <div className="flex items-center gap-1 text-slate-400 group-hover:text-emerald-600 mb-0.5">
                    <FiUserCheck size={12} />
                    <span className="text-[10px] sm:text-[11px] font-bold">PRO Members</span>
                  </div>
                  <span className="text-base sm:text-lg font-black text-slate-900 group-hover:text-emerald-700 leading-tight">
                    {userPeoples.followers}
                  </span>
                </button>

                <div className="p-2 sm:p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center">
                  <div className="flex items-center gap-1 text-slate-400 mb-0.5">
                    <FiUserPlus size={12} />
                    <span className="text-[10px] sm:text-[11px] font-bold">Following</span>
                  </div>
                  <span className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    {userPeoples.following}
                  </span>
                </div>
              </div>
            </div>

            {/* VIP Activation Banner (if unverified) */}
            {!currentUser?.isMember && (
              <div className="rounded-2xl bg-orange-600 border border-orange-700 p-4 sm:p-5 text-white shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-700 flex items-center justify-center shrink-0">
                      <FaCrown size={18} className="text-orange-200" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base">
                        Activate VIP Membership
                      </h3>
                      <p className="text-orange-100 text-xs mt-0.5">
                        Unlock unlimited tasks, instant payouts, and 60% referral bonuses.
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/become-a-member"
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-black text-xs shadow-xs transition-all text-center shrink-0"
                  >
                    Activate Now →
                  </Link>
                </div>
              </div>
            )}

            {/* 2. Wallet & Balance Overview Card */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/80 space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
                <div className="text-center sm:text-left">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Available Wallet Balance
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">
                    ₦{numeral(balance).format("0,0.00")}
                  </h3>
                  {pendingEarnings > 0 && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 mt-1">
                      ⏳ ₦{numeral(pendingEarnings).format("0,0.00")} Pending Escrow
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEarnings(!showEarnings)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-emerald-700 py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-emerald-50 transition-colors cursor-pointer"
                  >
                    <span>{showEarnings ? "Hide Breakdown" : "Breakdown"}</span>
                    {showEarnings ? <FiChevronUp size={13} /> : <FiChevronDown size={13} />}
                  </button>

                  <Link
                    to="/transaction-history"
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <FaClockRotateLeft size={11} />
                    <span>History</span>
                  </Link>
                </div>
              </div>

              {/* Collapsible Earnings Breakdown */}
              {showEarnings && (
                <div className="py-3 border-b border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2.5 animate-fadeIn">
                  <div className="p-2.5 bg-emerald-50/50 rounded-xl border border-emerald-100">
                    <span className="block text-[10px] font-bold text-emerald-600">Total Earned</span>
                    <span className="text-xs sm:text-sm font-black text-emerald-900">
                      ₦{numeral(totalEarnings).format("0,0.00")}
                    </span>
                  </div>
                  <div className="p-2.5 bg-amber-50/50 rounded-xl border border-amber-100">
                    <span className="block text-[10px] font-bold text-amber-600">Pending Escrow</span>
                    <span className="text-xs sm:text-sm font-black text-amber-900">
                      ₦{numeral(pendingEarnings).format("0,0.00")}
                    </span>
                  </div>
                  <div className="p-2.5 bg-blue-50/50 rounded-xl border border-blue-100">
                    <span className="block text-[10px] font-bold text-blue-600">Total Withdrawn</span>
                    <span className="text-xs sm:text-sm font-black text-blue-900">
                      ₦{numeral(amountWithdrawn).format("0,0.00")}
                    </span>
                  </div>
                  <div className="p-2.5 bg-purple-50/50 rounded-xl border border-purple-100">
                    <span className="block text-[10px] font-bold text-purple-600">Tasks / Ads Spent</span>
                    <span className="text-xs sm:text-sm font-black text-purple-900">
                      ₦{numeral(amountSpent).format("0,0.00")}
                    </span>
                  </div>
                </div>
              )}

              {/* Fast Action Buttons */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <Link
                  to="/fund-wallet"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs transition-all active:scale-98"
                >
                  <FaWallet size={13} />
                  <span>Fund</span>
                </Link>

                <Link
                  to="/withdraw"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-2xs transition-all active:scale-98"
                >
                  <FaBuildingColumns size={13} />
                  <span>Withdraw</span>
                </Link>

                <Link
                  to="/transfer"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-xs border border-indigo-200/60 shadow-2xs transition-all active:scale-98"
                >
                  <FaMoneyBillTransfer size={13} />
                  <span>Transfer</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Bank Account & Referral */}
          <div className="lg:col-span-4 space-y-6">
            {/* 3. Linked Bank Account */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <FiCreditCard size={16} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">
                      Payout Bank
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Where withdrawals are sent
                    </p>
                  </div>
                </div>

                <Link
                  to="/edit-profile"
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-xl transition-colors"
                >
                  {bankName ? "Edit" : "+ Add"}
                </Link>
              </div>

              {bankName ? (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2.5">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-black text-slate-900 text-sm">
                        {bankName}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded-md">
                        <FiCheckCircle size={9} /> Verified
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-600 tracking-wider">
                      {accountNumber}
                    </p>
                    <p className="text-[11px] text-slate-400 uppercase mt-0.5 truncate">
                      {accountName || `${currentUser?.firstname} ${currentUser?.lastname}`}
                    </p>
                  </div>

                  <Link
                    to="/withdraw"
                    className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 hover:text-emerald-600 bg-white py-2 rounded-xl border border-slate-200 shadow-2xs transition-colors"
                  >
                    <span>Request Payout</span>
                    <FiArrowUpRight size={14} />
                  </Link>
                </div>
              ) : (
                <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200/60 space-y-2">
                  <p className="text-xs text-amber-800 font-medium">
                    No bank account linked yet. Link your Nigerian bank account to withdraw earnings.
                  </p>
                  <Link
                    to="/edit-profile"
                    className="block text-center px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-2xs"
                  >
                    Add Bank Now
                  </Link>
                </div>
              )}
            </div>

            {/* 4. 60% Referral Program & Instant Link */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <FiAward size={16} />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    Refer & Earn (60%)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Earn ₦500+ per friend activation
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2.5">
                <span className="block text-[10px] font-black text-slate-700 uppercase tracking-wider">
                  Your Personal Invite Link
                </span>

                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-semibold focus:outline-none select-all"
                />

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={copyReferralLink}
                    className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    {copied ? <FiCheck size={13} className="text-emerald-400" /> : <FiCopy size={13} />}
                    <span>{copied ? "Copied!" : "Copy Link"}</span>
                  </button>

                  <button
                    onClick={shareOnWhatsApp}
                    className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    title="Share on WhatsApp"
                  >
                    <FaWhatsapp size={15} />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Referrals & Followers */}
      {modalState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-scaleIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">{modalTitle}</h3>
              <button
                onClick={() => setModalState(false)}
                className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
              >
                <IoClose size={22} />
              </button>
            </div>

            <div className="mt-4 max-h-80 overflow-y-auto space-y-2 pr-1">
              {modalData.length ? (
                modalData.map((item, i) => {
                  const fullName =
                    item.firstname || item.lastname
                      ? `${item.firstname || ""} ${item.lastname || ""}`.trim()
                      : item.username || "Verified User";
                  const handle = item.username
                    ? `@${item.username.toLowerCase()}`
                    : item.email
                    ? item.email
                    : "Active Member";

                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-3 p-3 bg-slate-50 hover:bg-slate-100/70 rounded-2xl border border-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0 bg-white"
                          src={
                            item.image ||
                            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                          }
                          alt={item.username || "User"}
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                            {fullName}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate">{handle}</p>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {item.isMember ? (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1 shadow-2xs">
                            <span>👑</span>
                            <span>PRO</span>
                          </span>
                        ) : (
                          <span className="bg-slate-200/80 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Free
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xl">
                    👥
                  </div>
                  <p className="text-xs font-bold text-slate-700">No referrals found yet</p>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                    Share your invite link to earn instant 60% cash rewards on membership activations!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </ClientLayout>
  );
};

export default UserDetails;

