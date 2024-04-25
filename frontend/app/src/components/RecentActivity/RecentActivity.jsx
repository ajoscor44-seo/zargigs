import React from "react";
import { BiLike } from "react-icons/bi";
import {
  FaCommentDots,
  FaFacebook,
  FaInstagram,
  FaRetweet,
  FaShare,
  FaTelegram,
  FaTiktok,
  FaTwitter,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa6";
import googlePlayIcon from "../../assets/png/google-play-icon.png";
import { IoLogoAppleAppstore } from "react-icons/io5";
import { SiAudiomack } from "react-icons/si";
import { SlUserFollowing } from "react-icons/sl";

const RecentActivity = ({ recentActivity }) => {
  const taskDone =
    recentActivity.taskType === "review"
      ? "reviewing an app"
      : recentActivity.taskType === "like"
      ? "liking a post"
      : recentActivity.taskType === "comment"
      ? "commenting on a post"
      : "sharing a post";

  return (
    <div className="border bg-white hover:bg-slate-100 p-2 grid grid-flow-col gap-2">
      <div className="activityIcon">
        {recentActivity.category.toLowerCase() === "facebook" ? (
          <FaFacebook className="text-blue-600" size={45} />
        ) : recentActivity.category.toLowerCase() === "instagram" ? (
          <FaInstagram
            size={45}
            className="text-white bg-instagram-gradient rounded-lg p-1"
          />
        ) : recentActivity.category.toLowerCase() === "allfollow" ? (
          <SlUserFollowing
            size={45}
            className="text-white bg-blue-400 rounded p-2"
          />
        ) : recentActivity.category.toLowerCase() === "tiktok" ? (
          <FaTiktok size={45} className="text-white bg-black rounded p-1" />
        ) : recentActivity.category.toLowerCase() === "audiomack" ? (
          <SiAudiomack
            size={45}
            className="text-orange-500 bg-black rounded p-2"
          />
        ) : recentActivity.category.toLowerCase() === "applestore" ? (
          <IoLogoAppleAppstore
            size={45}
            className="text-blue-500 bg-white rounded-full"
          />
        ) : recentActivity.category.toLowerCase() === "playstore" ? (
          <img src={googlePlayIcon} className="w-12 h-12 object-cover" />
        ) : recentActivity.category.toLowerCase() === "allretweets" ? (
          <FaRetweet
            size={45}
            className="text-blue-500 bg-white rounded-full"
          />
        ) : recentActivity.category.toLowerCase() === "allshare" ? (
          <FaShare
            size={45}
            className="text-white bg-white rounded-full bg-instagram-gradient p-3"
          />
        ) : recentActivity.category.toLowerCase() === "allcomments" ? (
          <FaCommentDots size={45} className="text-green-400 bg-white" />
        ) : recentActivity.category.toLowerCase() === "telegram" ? (
          <FaTelegram size={45} className="text-blue-400 bg-white" />
        ) : recentActivity.category.toLowerCase() === "alllike" ? (
          <BiLike
            size={45}
            className="text-white bg-blue-500 rounded-full p-2"
          />
        ) : recentActivity.category.toLowerCase() === "youtube" ? (
          <FaYoutube size={45} className="text-red-500" />
        ) : recentActivity.category.toLowerCase() === "whatsapp" ? (
          <FaWhatsapp
            size={45}
            className="bg-green-500 text-white rounded p-1"
          />
        ) : (
          <FaTwitter className="text-blue-400" size={45} />
        )}
      </div>
      <div className="activityInfo font-primary">
        <h3 className="font-bold text-md">{recentActivity.category}</h3>
        <p className="text-sm">
          @{recentActivity.username} from{" "}
          <span className="text-primary font-semibold">
            {recentActivity.userLocation.LGA},{" "}
            {recentActivity.userLocation.state}
          </span>{" "}
          just earned{" "}
          <span className="font-bold">₦{recentActivity.amountEarned}</span> for{" "}
          {taskDone} on {recentActivity.taskPlatform}
        </p>
      </div>
    </div>
  );
};

export default RecentActivity;
