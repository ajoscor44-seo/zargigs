import React, { useEffect, useState } from "react";
import ClientLayout from "../components/ClientLayout/ClientLayout";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { FaHistory } from "react-icons/fa";
import PricingWay from "../components/PricingWay/PricingWay";
import { useAuth } from "../context/AuthContext";
import { FaSpinner } from "react-icons/fa6";
import numeral from "numeral";

const fallbackAdvertPackages = [
  {
    id: "adv_whatsapp",
    title: "Post Advert on WhatsApp Status",
    platformName: "whatsapp",
    amountToPay: 150,
    amountToEarn: 100,
    pathToPage: "/advertise/whatsapp-status",
    platforms: ["whatsapp"],
    description: "Get verified Nigerian earners with 1,000+ status contacts to post your advert.",
  },
  {
    id: "adv_instagram",
    title: "Post Advert on Instagram Story & Feed",
    platformName: "instagram",
    amountToPay: 200,
    amountToEarn: 120,
    pathToPage: "/advertise/instagram-post",
    platforms: ["instagram"],
    description: "Have real creators publish your product banner or promotional reel on Instagram.",
  },
  {
    id: "adv_facebook",
    title: "Post Advert on Facebook Profile / Group",
    platformName: "facebook",
    amountToPay: 150,
    amountToEarn: 100,
    pathToPage: "/advertise/facebook-post",
    platforms: ["facebook"],
    description: "Broadcast your brand message directly to active Facebook communities.",
  },
  {
    id: "adv_twitter",
    title: "Post Advert on Twitter / X",
    platformName: "twitter",
    amountToPay: 180,
    amountToEarn: 110,
    pathToPage: "/advertise/twitter-post",
    platforms: ["twitter"],
    description: "Get users to tweet your marketing banner, link, and hashtags to their followers.",
  },
  {
    id: "adv_tiktok",
    title: "Post Advert on TikTok",
    platformName: "tiktok",
    amountToPay: 250,
    amountToEarn: 150,
    pathToPage: "/advertise/tiktok-post",
    platforms: ["tiktok"],
    description: "Pay creators to post your promotional video or audio on TikTok.",
  },
];

const Advertise = () => {
  const [loading, setLoading] = useState(false);
  const { advertCreator, getAdvertCreator, adminData, dashboardMode } = useAuth();

  useEffect(() => {
    getAdvertCreator();
  }, []);

  const displayPackages =
    advertCreator && advertCreator.length > 0
      ? advertCreator
      : fallbackAdvertPackages;

  return (
    <ClientLayout>
      <div className="font-primary space-y-6">
        {dashboardMode === "earner" && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">💡</span>
              <p className="text-xs sm:text-sm font-semibold">
                You are currently viewing the <strong className="font-bold">Advertiser Order Hub</strong> (for creating adverts). If you want to perform tasks and earn cash, visit the Earner Portal.
              </p>
            </div>
            <Link
              to="/earn"
              className="shrink-0 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-xs transition-colors"
            >
              ⚡ Go to Earn Tasks
            </Link>
          </div>
        )}

        {/* Header Hero Card */}
        <div className="rounded-3xl bg-slate-900 p-6 sm:p-8 text-white shadow-sm border border-slate-800 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700 mb-2">
                🚀 Creator Marketplace
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                Get Targeted Social Reach
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
                Hire real people with at least {numeral(adminData?.minimumFollowers || 1000).format("0,0")} active followers to repost your adverts and broadcast your brand.
              </p>
            </div>

            <Link
              to="/order-history"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors"
            >
              <FaHistory size={14} />
              <span>Track Orders</span>
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-200/70 p-1.5 rounded-2xl flex gap-1.5 mb-6 max-w-md mx-auto">
          <button
            type="button"
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold bg-white text-emerald-600 shadow-sm shadow-slate-900/5 transition-all"
          >
            📢 Advert Tasks
          </button>

          <Link
            to="/order"
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold text-slate-600 hover:text-slate-900 text-center transition-all flex items-center justify-center"
          >
            ⚡ Engagement Tasks
          </Link>
        </div>

        {/* Pricing Cards List */}
        {loading ? (
          <div className="min-h-[300px] flex flex-col justify-center items-center gap-3">
            <FaSpinner size={28} className="text-emerald-500 animate-spin" />
            <p className="text-xs font-semibold text-slate-400">Loading advert packages...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayPackages.map((way) => (
              <Link to={way.pathToPage} key={way.pathToPage} className="block text-decoration-none group">
                <PricingWay
                  way={way}
                  addSelectBtn={true}
                  wayDescription={way.description}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default Advertise;
