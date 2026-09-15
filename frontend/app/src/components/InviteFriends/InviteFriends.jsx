import React, { useRef, useState } from "react";
import ClientLayout from "../ClientLayout/ClientLayout";
import {
  FiCopy,
  FiCheck,
  FiShare2,
  FiGift,
  FiUsers,
  FiExternalLink,
} from "react-icons/fi";
import { FaWhatsapp, FaTwitter, FaFacebook, FaLinkedin, FaTelegram } from "react-icons/fa6";
import userPic from "../../assets/images/user-image.png";
import CopyToClipboard from "../../hooks/CopyToClipboard";
import { useAuth } from "../../context/AuthContext";

const InviteFriends = () => {
  const { currentUser, adminData } = useAuth();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const messageRef = useRef(null);

  const app_url =
    import.meta.env.VITE_NODE_ENV !== "production"
      ? import.meta.env.VITE_DEV_APP_URL || "http://localhost:5173"
      : import.meta.env.VITE_PROD_APP_URL || "https://www.docszar.com";

  const referralLink = `${app_url}/ref/${currentUser?.username || "user"}`;

  const message = `Introducing ${adminData?.appName || "DocsZar"}: Where Engagement Meets Earning and Growth! Dive into a platform that rewards you for social tasks like liking, following, and commenting while elevating your social media influence.\n\nEarn daily rewards, withdraw directly to your bank account, or advertise your business to thousands of verified users.\n\nRegister using my link to get started: ${referralLink}`;

  const briefMessage = `Discover ${adminData?.appName || "DocsZar"}, earn daily by completing simple social media tasks or advertise to thousands! Join today: ${referralLink}`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleCopyMessage = () => {
    if (messageRef.current) {
      CopyToClipboard(messageRef);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 3000);
    }
  };

  const encodedText = encodeURIComponent(message);
  const encodedBriefText = encodeURIComponent(briefMessage);
  const whatsappLink = `https://api.whatsapp.com/send?text=${encodedText}`;
  const twitterLink = `https://twitter.com/share?text=${encodedBriefText}`;
  const linkedInLink = `https://www.linkedin.com/sharing/share-offsite/?text=${encodedBriefText}`;
  const telegramLink = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodedBriefText}`;
  const facebookLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="pb-2 border-b border-slate-200/70">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Invite & Earn (60% Commission)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Share your unique referral link and earn instant 60% cash rewards whenever your friends upgrade to VIP membership.
          </p>
        </div>

        {/* 2-Column Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column (7 cols): Main Hero & Ready-to-Post Pitch */}
          <div className="lg:col-span-7 space-y-6">
            {/* Hero Card */}
            <div className="bg-emerald-700 rounded-3xl p-6 sm:p-7 text-white shadow-sm border border-emerald-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-800 flex items-center justify-center">
                  <FiGift size={20} className="text-white" />
                </div>
                <span className="text-xs font-black tracking-wider uppercase text-emerald-200">
                  Affiliate Program
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
                Earn 60% Commission on Every Referral!
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed font-normal mb-5">
                Share your personal invite link. When your friends register and upgrade to a Pro member, you get paid instant cash bonuses directly into your wallet.
              </p>

              {/* Quick Copy Link Box */}
              <div className="bg-emerald-800 rounded-2xl p-2 sm:p-2.5 flex items-center justify-between border border-emerald-600/40 gap-2">
                <span className="text-xs font-mono font-semibold truncate text-emerald-100 px-2">
                  {referralLink}
                </span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-white text-emerald-800 hover:bg-emerald-50 active:scale-95 font-black text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <FiCheck size={14} className="text-emerald-700" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <FiCopy size={14} />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Personalized Pitch Message */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    Ready-to-Post Pitch
                  </h3>
                  <p className="text-xs text-slate-400">
                    Copy and paste on your social feeds, WhatsApp group, or status
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  {copiedMessage ? (
                    <>
                      <FiCheck size={14} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <FiCopy size={14} />
                      <span>Copy Pitch</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                ref={messageRef}
                rows={6}
                readOnly
                className="w-full p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs text-slate-700 leading-relaxed font-mono outline-hidden resize-none focus:bg-white focus:border-emerald-500 transition-all select-all"
                defaultValue={message}
              />
            </div>
          </div>

          {/* Right Column (5 cols): Social Share & How It Works */}
          <div className="lg:col-span-5 space-y-6">
            {/* Social Share Grid */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-4">
              <div className="pb-2 border-b border-slate-100">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  Instant 1-Click Social Share
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click any platform to share your pre-formatted referral pitch
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-all group border border-emerald-100 hover:scale-102"
                >
                  <FaWhatsapp size={24} className="group-hover:scale-110 transition-transform text-emerald-600" />
                  <span className="text-xs font-bold mt-1.5 text-slate-700">WhatsApp</span>
                </a>
                <a
                  href={telegramLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-700 transition-all group border border-sky-100 hover:scale-102"
                >
                  <FaTelegram size={24} className="group-hover:scale-110 transition-transform text-sky-500" />
                  <span className="text-xs font-bold mt-1.5 text-slate-700">Telegram</span>
                </a>
                <a
                  href={twitterLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 transition-all group border border-slate-200 hover:scale-102"
                >
                  <FaTwitter size={24} className="group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold mt-1.5 text-slate-700">X / Twitter</span>
                </a>
                <a
                  href={facebookLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition-all group border border-blue-100 hover:scale-102"
                >
                  <FaFacebook size={24} className="group-hover:scale-110 transition-transform text-blue-600" />
                  <span className="text-xs font-bold mt-1.5 text-slate-700">Facebook</span>
                </a>
                <a
                  href={linkedInLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-all group border border-indigo-100 hover:scale-102"
                >
                  <FaLinkedin size={24} className="group-hover:scale-110 transition-transform text-indigo-600" />
                  <span className="text-xs font-bold mt-1.5 text-slate-700">LinkedIn</span>
                </a>
              </div>
            </div>

            {/* How It Works 3-Step Card */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-lg space-y-4">
              <div className="flex items-center gap-2">
                <FiUsers className="text-emerald-400" size={18} />
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                  Two Ways You Earn From Referrals
                </h3>
              </div>
              <div className="space-y-3.5 text-xs text-slate-300">
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[11px] border border-emerald-500/30">
                    1
                  </span>
                  <p>
                    <strong className="text-white">₦600 on VIP Upgrades:</strong> When your referral upgrades to VIP Member (₦1,000 activation), you get an instant <strong>60% (₦600.00)</strong> cash commission.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px] border border-amber-500/30">
                    2
                  </span>
                  <p>
                    <strong className="text-white">10% on Free User 1st Withdrawal:</strong> If they earn on the Free tier, you receive <strong>10% of their very first withdrawal</strong> straight into your wallet!
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0 text-[11px] border border-blue-500/30">
                    3
                  </span>
                  <p>
                    <strong className="text-white">Instant Bank Withdrawals:</strong> All commission earnings are immediately available for direct withdrawal to any Nigerian bank.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default InviteFriends;

