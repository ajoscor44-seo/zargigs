import React, { useEffect, useState } from "react";
import ClientLayout from "../components/ClientLayout/ClientLayout";
import PricingWay from "../components/PricingWay/PricingWay";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { FaHistory } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { FaSpinner } from "react-icons/fa6";

const fallbackEngagementPackages = [
  {
    id: "eng_ig_follow",
    title: "Get Real Instagram Followers",
    platformName: "instagram",
    amountToPay: 10,
    amountToEarn: 5,
    pathToPage: "/order/instagram-followers",
    platforms: ["instagram"],
    description: "Get real, active Nigerian users to follow your Instagram page or brand account.",
  },
  {
    id: "eng_ig_like",
    title: "Get Instagram Post Likes",
    platformName: "instagram",
    amountToPay: 6,
    amountToEarn: 3,
    pathToPage: "/order/instagram-likes",
    platforms: ["instagram"],
    description: "Boost your Instagram photos, reels, and carousel posts with real likes.",
  },
  {
    id: "eng_ig_comment",
    title: "Get Custom Instagram Comments",
    platformName: "instagram",
    amountToPay: 20,
    amountToEarn: 10,
    pathToPage: "/order/instagram-comments",
    platforms: ["instagram"],
    description: "Get meaningful, relevant custom comments on your Instagram posts to drive conversation.",
  },
  {
    id: "eng_tiktok_follow",
    title: "Get TikTok Followers",
    platformName: "tiktok",
    amountToPay: 10,
    amountToEarn: 5,
    pathToPage: "/order/tiktok-followers",
    platforms: ["tiktok"],
    description: "Grow your TikTok profile rapidly with real Nigerian followers.",
  },
  {
    id: "eng_tiktok_like",
    title: "Get TikTok Video Likes",
    platformName: "tiktok",
    amountToPay: 6,
    amountToEarn: 3,
    pathToPage: "/order/tiktok-likes",
    platforms: ["tiktok"],
    description: "Trigger the TikTok FYP algorithm by getting real user likes on your videos.",
  },
  {
    id: "eng_yt_sub",
    title: "Get YouTube Subscribers",
    platformName: "youtube",
    amountToPay: 30,
    amountToEarn: 15,
    pathToPage: "/order/youtube-subscribers",
    platforms: ["youtube"],
    description: "Gain genuine channel subscribers to accelerate your YouTube monetization.",
  },
  {
    id: "eng_yt_like",
    title: "Get YouTube Video Likes",
    platformName: "youtube",
    amountToPay: 15,
    amountToEarn: 8,
    pathToPage: "/order/youtube-likes",
    platforms: ["youtube"],
    description: "Increase video rankings and engagement metrics on YouTube.",
  },
  {
    id: "eng_twitter_follow",
    title: "Get Twitter / X Followers",
    platformName: "twitter",
    amountToPay: 10,
    amountToEarn: 5,
    pathToPage: "/order/twitter-followers",
    platforms: ["twitter"],
    description: "Build social proof and authority on X (Twitter) with real followers.",
  },
  {
    id: "eng_twitter_rt",
    title: "Get Twitter / X Retweets & Quotes",
    platformName: "twitter",
    amountToPay: 15,
    amountToEarn: 8,
    pathToPage: "/order/twitter-retweets",
    platforms: ["twitter"],
    description: "Amplify your message across Nigerian Twitter with genuine retweets and quotes.",
  },
  {
    id: "eng_fb_follow",
    title: "Get Facebook Page Followers",
    platformName: "facebook",
    amountToPay: 10,
    amountToEarn: 5,
    pathToPage: "/order/facebook-follows",
    platforms: ["facebook"],
    description: "Increase follower count and credibility for your Facebook page.",
  },
  {
    id: "eng_app_review",
    title: "Download & Review Mobile App",
    platformName: "playstore",
    amountToPay: 50,
    amountToEarn: 25,
    pathToPage: "/order/playstore-reviews",
    platforms: ["playstore", "applestore"],
    description: "Get real users to download your Android or iOS app and leave positive reviews.",
  },
  {
    id: "eng_spotify_stream",
    title: "Spotify & Music Streams / Follows",
    platformName: "spotify",
    amountToPay: 20,
    amountToEarn: 10,
    pathToPage: "/order/spotify-streams",
    platforms: ["spotify", "audiomack"],
    description: "Boost your song stream count and artist profile saves across music platforms.",
  },
];

const Order = () => {
  const [loading, setLoading] = useState(false);
  const { engagementCreator, getEngagementCreator } = useAuth();

  useEffect(() => {
    getEngagementCreator();
  }, []);

  const displayPackages =
    engagementCreator && engagementCreator.length > 0
      ? engagementCreator
      : fallbackEngagementPackages;

  return (
    <ClientLayout>
      <div className="font-primary space-y-6">
        {/* Header Hero Card */}
        <div className="rounded-3xl bg-slate-900 p-6 sm:p-8 text-white shadow-sm border border-slate-800 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700 mb-2">
                ⚡ Instant Growth
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                Boost Your Engagement
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
                Get real organic likes, followers, positive comments, and shares on Instagram, TikTok, YouTube, X, Spotify, and more.
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
          <Link
            to="/advertise"
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold text-slate-600 hover:text-slate-900 text-center transition-all flex items-center justify-center"
          >
            📢 Advert Tasks
          </Link>

          <button
            type="button"
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold bg-white text-emerald-600 shadow-sm shadow-slate-900/5 transition-all"
          >
            ⚡ Engagement Tasks
          </button>
        </div>

        {/* Pricing Cards List */}
        {loading ? (
          <div className="min-h-[300px] flex flex-col justify-center items-center gap-3">
            <FaSpinner size={28} className="text-emerald-500 animate-spin" />
            <p className="text-xs font-semibold text-slate-400">Loading engagement options...</p>
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

export default Order;

