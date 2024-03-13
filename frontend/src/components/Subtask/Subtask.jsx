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
import playStoreImage from "../../assets/images/playstore-icon.png";
import { IoLogoAppleAppstore } from "react-icons/io5";
import { SiAudiomack } from "react-icons/si";
import { SlUserFollowing } from "react-icons/sl";

const Subtask = ({ task }) => {
  const btnBgColor =
    task.taskState.replace(/\s+/g, "").toLowerCase() == "pending"
      ? "bg-orange-400"
      : task.taskState.replace(/\s+/g, "").toLowerCase() == "inreview"
      ? "bg-sky-400"
      : task.taskState.replace(/\s+/g, "").toLowerCase() == "failed"
      ? "bg-red-400"
      : task.taskState.replace(/\s+/g, "").toLowerCase() == "cancelled"
      ? "bg-red-500"
      : "bg-primaryLight";

  return (
    <div className="flex items-center px-2 py-1 border-b gap-2 font-primary">
      <div>
        {task.platformName.toLowerCase() === "facebook" ? (
          <FaFacebook className="text-blue-600" size={45} />
        ) : task.platformName.toLowerCase() === "instagram" ? (
          <FaInstagram
            size={45}
            className="text-white bg-instagram-gradient rounded-lg p-1"
          />
        ) : task.platformName.toLowerCase() === "allfollow" ? (
          <SlUserFollowing
            size={45}
            className="text-white bg-blue-400 rounded p-2"
          />
        ) : task.platformName.toLowerCase() === "tiktok" ? (
          <FaTiktok size={45} className="text-white bg-black rounded p-1" />
        ) : task.platformName.toLowerCase() === "audiomack" ? (
          <SiAudiomack
            size={45}
            className="text-orange-500 bg-black rounded p-2"
          />
        ) : task.platformName.toLowerCase() === "applestore" ? (
          <IoLogoAppleAppstore
            size={45}
            className="text-blue-500 bg-white rounded-full"
          />
        ) : task.platformName.toLowerCase() === "playstore" ? (
          <img src={playStoreImage} className="w-20 h-20 object-cover" />
        ) : task.platformName.toLowerCase() === "allretweets" ? (
          <FaRetweet
            size={45}
            className="text-blue-500 bg-white rounded-full"
          />
        ) : task.platformName.toLowerCase() === "allshare" ? (
          <FaShare
            size={45}
            className="text-white bg-white rounded-full bg-instagram-gradient p-3"
          />
        ) : task.platformName.toLowerCase() === "allcomments" ? (
          <FaCommentDots size={45} className="text-green-400 bg-white" />
        ) : task.platformName.toLowerCase() === "telegram" ? (
          <FaTelegram size={45} className="text-blue-400 bg-white" />
        ) : task.platformName.toLowerCase() === "alllike" ? (
          <BiLike
            size={45}
            className="text-white bg-blue-500 rounded-full p-2"
          />
        ) : task.platformName.toLowerCase() === "youtube" ? (
          <FaYoutube size={45} className="text-red-500" />
        ) : task.platformName.toLowerCase() === "whatsapp" ? (
          <FaWhatsapp
            size={45}
            className="bg-green-500 text-white rounded p-1"
          />
        ) : (
          <FaTwitter className="text-blue-400" size={45} />
        )}
      </div>
      <div className="flex-1 flex justify-between items-center">
        <div className="flex flex-col py-1">
          <span className="methodNote text-gray-400 font-semibold">
            {task.date}
          </span>
          <h2 className="text-xs font-bold">{task.title}</h2>
          <span className="methodNote font-semibold">
            Earning:{" "}
            <span className="font-extrabold">
              ₦{task.earning} per {task.taskPerformed}
            </span>
          </span>
        </div>
        <div>
          <button
            className={
              btnBgColor + " capitalize p-1 text-sm text-white rounded"
            }
          >
            {task.taskState}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Subtask;
