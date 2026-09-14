import React from "react";
import { BiLike } from "react-icons/bi";
import { RiSurveyFill } from "react-icons/ri";
import {
  FaCommentDots,
  FaFacebook,
  FaInstagram,
  FaRetweet,
  FaShare,
  FaSpotify,
  FaTelegram,
  FaTiktok,
  FaTwitter,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa6";
import playStoreImage from "../../assets/images/playstore-icon.png";
import {
  IoGlobe,
  IoLogoAppleAppstore,
  IoShareSocialOutline,
  IoTvSharp,
} from "react-icons/io5";
import { MdGetApp, MdOutlineReviews } from "react-icons/md";
import { SiAudiomack, SiApplemusic } from "react-icons/si";
import { SlUserFollowing } from "react-icons/sl";

const ItemIcon = ({ platform, size, playstoreSize }) => {
  const p = (platform || "").toLowerCase();
  return (
    <div className="flex justify-center items-center">
      {p === "facebook" ? (
        <FaFacebook className="text-blue-600" size={size} />
      ) : p === "instagram" ? (
        <FaInstagram
          size={size}
          className="text-white bg-instagram-gradient rounded"
        />
      ) : p === "whatsapptv" ? (
        <IoTvSharp size={size} className="text-green-400" />
      ) : p === "websurvey" ? (
        <RiSurveyFill size={size} className="text-green-400" />
      ) : p === "allfollow" ? (
        <SlUserFollowing size={size} className="text-blue-400" />
      ) : p === "tiktok" ? (
        <FaTiktok size={size} className="text-white bg-black" />
      ) : p === "audiomack" ? (
        <SiAudiomack size={size} className="text-orange-500 bg-black" />
      ) : p === "twitter" ? (
        <FaTwitter size={size} className="text-sky-500" />
      ) : p === "applestore" ? (
        <IoLogoAppleAppstore
          size={size}
          className="text-blue-500 bg-white rounded-full"
        />
      ) : p === "applemusic" ? (
        <SiApplemusic
          size={size}
          className="text-red-500 bg-white rounded-full"
        />
      ) : p === "playstore" ? (
        <img src={playStoreImage} className={`${playstoreSize} object-cover`} />
      ) : p === "allretweets" ? (
        <FaRetweet size={size} className="text-blue-500 bg-white" />
      ) : p === "allshare" ? (
        <FaShare
          size={size}
          className="text-white rounded-full bg-instagram-gradient"
        />
      ) : p === "allcomments" ? (
        <FaCommentDots size={size} className="text-green-400 bg-white" />
      ) : p === "spotify" ? (
        <FaSpotify size={size} className="text-green-600 bg-white" />
      ) : p === "googlepage" ? (
        <MdOutlineReviews size={size} className="text-blue-600 bg-white" />
      ) : p === "telegram" ? (
        <FaTelegram size={size} className="text-blue-400 bg-white" />
      ) : p === "app" ? (
        <MdGetApp size={size} className="text-red-400 bg-white" />
      ) : p === "alllike" ? (
        <BiLike size={size} className="bg-white text-blue-500" />
      ) : p === "website" || p === "websight" ? (
        <IoGlobe size={size} className="bg-white text-green-500" />
      ) : p === "youtube" || p === "vlctube" ? (
        <FaYoutube size={size} className="text-red-500" />
      ) : p === "whatsapp" || p === "whatsappgroup" ? (
        <FaWhatsapp size={size} className="text-green-500" />
      ) : (
        <IoShareSocialOutline className="text-green-500" size={size} />
      )}
    </div>
  );
};

export default ItemIcon;
