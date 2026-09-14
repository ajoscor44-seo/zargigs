import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";
import EarningWay from "../EarningWay/EarningWay";
import { useAuth } from "../../context/AuthContext";
import { BsArrowRight } from "react-icons/bs";

const fallbackEngagementEarners = [
  {
    id: "earn_ig_follow",
    title: "Follow Instagram Account",
    platformName: "instagram",
    amountToEarn: 5,
    reward: 5,
    whatTheyDo: "Instagram accounts you follow",
    pathToPage: "/earn/instagram-followers",
    platforms: ["instagram"],
    description: "Earn ₦5.00 for every Instagram account you follow with your profile.",
  },
  {
    id: "earn_ig_like",
    title: "Like Instagram Posts",
    platformName: "instagram",
    amountToEarn: 3,
    reward: 3,
    whatTheyDo: "Instagram posts you like",
    pathToPage: "/earn/instagram-likes",
    platforms: ["instagram"],
    description: "Earn ₦3.00 for liking photos, reels, and carousel posts on Instagram.",
  },
  {
    id: "earn_ig_comment",
    title: "Comment on Instagram Posts",
    platformName: "instagram",
    amountToEarn: 10,
    reward: 10,
    whatTheyDo: "comments you post",
    pathToPage: "/earn/instagram-comments",
    platforms: ["instagram"],
    description: "Earn ₦10.00 for posting a relevant comment on sponsored Instagram posts.",
  },
  {
    id: "earn_tiktok_follow",
    title: "Follow TikTok Accounts",
    platformName: "tiktok",
    amountToEarn: 5,
    reward: 5,
    whatTheyDo: "TikTok accounts you follow",
    pathToPage: "/earn/tiktok-followers",
    platforms: ["tiktok"],
    description: "Earn ₦5.00 for each TikTok account you follow.",
  },
  {
    id: "earn_tiktok_like",
    title: "Like TikTok Videos",
    platformName: "tiktok",
    amountToEarn: 3,
    reward: 3,
    whatTheyDo: "TikTok videos you like",
    pathToPage: "/earn/tiktok-likes",
    platforms: ["tiktok"],
    description: "Earn ₦3.00 for liking specified TikTok video links.",
  },
  {
    id: "earn_yt_sub",
    title: "Subscribe to YouTube Channels",
    platformName: "youtube",
    amountToEarn: 15,
    reward: 15,
    whatTheyDo: "channels you subscribe to",
    pathToPage: "/earn/youtube-subscribers",
    platforms: ["youtube"],
    description: "Earn ₦15.00 for subscribing to creator YouTube channels.",
  },
  {
    id: "earn_twitter_follow",
    title: "Follow on Twitter / X",
    platformName: "twitter",
    amountToEarn: 5,
    reward: 5,
    whatTheyDo: "accounts you follow on X",
    pathToPage: "/earn/twitter-followers",
    platforms: ["twitter"],
    description: "Earn ₦5.00 for following Twitter / X profiles.",
  },
  {
    id: "earn_twitter_rt",
    title: "Retweet on Twitter / X",
    platformName: "twitter",
    amountToEarn: 8,
    reward: 8,
    whatTheyDo: "tweets you retweet",
    pathToPage: "/earn/twitter-retweets",
    platforms: ["twitter"],
    description: "Earn ₦8.00 for retweeting and quoting campaign tweets on X.",
  },
  {
    id: "earn_fb_follow",
    title: "Follow Facebook Pages",
    platformName: "facebook",
    amountToEarn: 5,
    reward: 5,
    whatTheyDo: "pages you follow on Facebook",
    pathToPage: "/earn/facebook-follows",
    platforms: ["facebook"],
    description: "Earn ₦5.00 for following Facebook brand pages.",
  },
  {
    id: "earn_app_review",
    title: "Download & Review Mobile Apps",
    platformName: "playstore",
    amountToEarn: 25,
    reward: 25,
    whatTheyDo: "apps you review",
    pathToPage: "/earn/playstore-reviews",
    platforms: ["playstore", "applestore"],
    description: "Earn ₦25.00 for downloading mobile apps from PlayStore and writing honest reviews.",
  },
  {
    id: "earn_spotify_stream",
    title: "Listen to Music on Spotify",
    platformName: "spotify",
    amountToEarn: 10,
    reward: 10,
    whatTheyDo: "songs you stream",
    pathToPage: "/earn/spotify-streams",
    platforms: ["spotify", "audiomack"],
    description: "Earn ₦10.00 for streaming songs and following artist profiles on Spotify & Audiomack.",
  },
];

const EarnWithTasks = ({
  setActiveTab,
  setTotalAvailableNormalTasks,
  setTotalAvailableAdvertTasks,
}) => {
  const { currentUser, engagementEarner } = useAuth();

  const displayWays =
    engagementEarner && engagementEarner.length > 0
      ? engagementEarner
      : fallbackEngagementEarners;

  return (
    <div className="space-y-4">
      <div className="bg-emerald-50 border border-emerald-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex items-center gap-2.5 text-emerald-950 font-medium">
          <span className="text-base">⚡</span>
          <span>
            <strong>Free Unlimited Social Tasks:</strong> Follow accounts, like posts, comment, and stream music to earn instant cash daily with zero restrictions.
          </span>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab("postAds")}
          className="inline-flex items-center gap-1.5 font-extrabold text-emerald-700 hover:text-emerald-800 whitespace-nowrap bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shadow-2xs transition-all"
        >
          View PRO Adverts <BsArrowRight />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayWays.map((way, index) => {
          const targetUrl =
            way.pathToPage ||
            (way.slug ? `/earn/${way.slug}` : `/earn/instagram-followers`);

          return (
            <Link
              to={targetUrl}
              key={way.id || way.pathToPage || index}
              className="block text-decoration-none group"
            >
              <EarningWay
                way={way}
                type="engagement"
                addSelectBtn={true}
                setTotalAvailableAdvertTasks={setTotalAvailableAdvertTasks}
                setTotalAvailableNormalTasks={setTotalAvailableNormalTasks}
                wayDescription={
                  way.description ||
                  `${way.title || "Social task"}. The more ${
                    way.whatTheyDo || "tasks you complete"
                  }, the more you earn.`
                }
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default EarnWithTasks;
