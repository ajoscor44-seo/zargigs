import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";
import EarningWay from "../EarningWay/EarningWay";
import { useAuth } from "../../context/AuthContext";
import { BsArrowRight } from "react-icons/bs";

const fallbackAdvertEarners = [
  {
    id: "earn_adv_whatsapp",
    title: "Post Adverts on WhatsApp Status",
    platformName: "whatsapp",
    amountToEarn: 100,
    reward: 100,
    pathToPage: "/earn/whatsapp-status",
    platforms: ["whatsapp"],
    description: "Earn ₦100.00 per post by uploading our daily campaign image & caption to your WhatsApp Status.",
  },
  {
    id: "earn_adv_instagram",
    title: "Post Adverts on Instagram Story & Feed",
    platformName: "instagram",
    amountToEarn: 120,
    reward: 120,
    pathToPage: "/earn/instagram-post",
    platforms: ["instagram"],
    description: "Earn ₦120.00 per post by publishing campaign photos or reels to your Instagram.",
  },
  {
    id: "earn_adv_facebook",
    title: "Post Adverts on Facebook",
    platformName: "facebook",
    amountToEarn: 100,
    reward: 100,
    pathToPage: "/earn/facebook-post",
    platforms: ["facebook"],
    description: "Earn ₦100.00 per post by publishing sponsor banners on your Facebook page or profile.",
  },
  {
    id: "earn_adv_twitter",
    title: "Post Adverts on Twitter / X",
    platformName: "twitter",
    amountToEarn: 110,
    reward: 110,
    pathToPage: "/earn/twitter-post",
    platforms: ["twitter"],
    description: "Earn ₦110.00 by tweeting promotional messages and media to your followers.",
  },
  {
    id: "earn_adv_tiktok",
    title: "Post Adverts on TikTok",
    platformName: "tiktok",
    amountToEarn: 150,
    reward: 150,
    pathToPage: "/earn/tiktok-post",
    platforms: ["tiktok"],
    description: "Earn ₦150.00 by uploading sponsored sound tracks and videos on TikTok.",
  },
];

const EarnWithAds = ({
  setActiveTab,
  setTotalAvailableAdvertTasks,
  setTotalAvailableNormalTasks,
}) => {
  const { currentUser, advertEarner } = useAuth();

  const displayWays =
    advertEarner && advertEarner.length > 0
      ? advertEarner
      : fallbackAdvertEarners;

  return (
    <div className="space-y-4">
      {!currentUser?.isMember && (
        <div className="bg-orange-50 border border-orange-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-2xs">
          <div className="flex items-center gap-2.5 text-orange-950 font-medium">
            <span className="text-base">👑</span>
            <span>
              <strong>PRO High-Paying Opportunity:</strong> Post daily WhatsApp & social adverts to earn ₦100+ per post. One-time lifetime activation required.
            </span>
          </div>
          <Link
            to="/become-a-member"
            className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs whitespace-nowrap shadow-2xs transition-all"
          >
            Unlock PRO Now →
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayWays.map((way, index) => {
          const targetUrl =
            way.pathToPage ||
            (way.slug ? `/earn/${way.slug}` : `/earn/whatsapp-status`);

          return (
            <Link
              to={targetUrl}
              key={way.id || way.pathToPage || index}
              className="block text-decoration-none group"
            >
              <EarningWay
                way={way}
                type="advert"
                addSelectBtn={true}
                setTotalAvailableNormalTasks={setTotalAvailableNormalTasks}
                setTotalAvailableAdvertTasks={setTotalAvailableAdvertTasks}
                wayDescription={
                  way.description ||
                  `Post verified adverts of businesses on your ${
                    way.platformName || "WhatsApp status"
                  } and earn ₦${
                    way.amountToEarn || way.reward || 100
                  } per post. Account must have active followers/contacts.`
                }
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default EarnWithAds;
