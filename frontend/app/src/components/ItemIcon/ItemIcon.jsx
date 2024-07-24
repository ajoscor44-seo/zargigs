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
  return (
    <div className="flex justify-center items-center">
      {platform.toLowerCase() === "facebook" ? (
        <FaFacebook className="text-blue-600" size={size} />
      ) : platform.toLowerCase() === "instagram" ? (
        <FaInstagram
          size={size}
          className="text-white bg-instagram-gradient rounded"
        />
      ) : platform.toLowerCase() === "whatsapptv" ? (
        <IoTvSharp size={size} className="text-green-400" />
      ) : platform.toLowerCase() === "websurvey" ? (
        <RiSurveyFill size={size} className="text-green-400" />
      ) : platform.toLowerCase() === "allfollow" ? (
        <SlUserFollowing size={size} className="text-blue-400" />
      ) : platform.toLowerCase() === "tiktok" ? (
        <FaTiktok size={size} className="text-white bg-black" />
      ) : platform.toLowerCase() === "audiomack" ? (
        <SiAudiomack size={size} className="text-orange-500 bg-black" />
      ) : platform.toLowerCase() === "twitter" ? (
        <FaTwitter size={size} className="text-sky-500" />
      ) : platform.toLowerCase() === "applestore" ? (
        <IoLogoAppleAppstore
          size={size}
          className="text-blue-500 bg-white rounded-full"
        />
      ) : platform.toLowerCase() === "applemusic" ? (
        <SiApplemusic
          size={size}
          className="text-red-500 bg-white rounded-full"
        />
      ) : platform.toLowerCase() === "playstore" ? (
        <img src={playStoreImage} className={`${playstoreSize} object-cover`} />
      ) : platform.toLowerCase() === "allretweets" ? (
        <FaRetweet size={size} className="text-blue-500 bg-white" />
      ) : platform.toLowerCase() === "allshare" ? (
        <FaShare
          size={size}
          className="text-white rounded-full bg-instagram-gradient"
        />
      ) : platform.toLowerCase() === "allcomments" ? (
        <FaCommentDots size={size} className="text-green-400 bg-white" />
      ) : platform.toLowerCase() === "spotify" ? (
        <FaSpotify size={size} className="text-green-600 bg-white" />
      ) : platform.toLowerCase() === "googlepage" ? (
        <MdOutlineReviews size={size} className="text-blue-600 bg-white" />
      ) : platform.toLowerCase() === "telegram" ? (
        <FaTelegram size={size} className="text-blue-400 bg-white" />
      ) : platform.toLowerCase() === "app" ? (
        <MdGetApp size={size} className="text-red-400 bg-white" />
      ) : platform.toLowerCase() === "alllike" ? (
        <BiLike size={size} className="bg-white text-blue-500" />
      ) : platform.toLowerCase() === "website" ? (
        <IoGlobe size={size} className="bg-white text-green-500" />
      ) : platform.toLowerCase() === "websight" ? (
        <IoGlobe size={size} className="bg-white text-green-500" />
      ) : platform.toLowerCase() === "youtube" ? (
        <FaYoutube size={size} className="text-red-500" />
      ) : platform.toLowerCase() === "vlctube" ? (
        <FaYoutube size={size} className="text-red-500" />
      ) : platform.toLowerCase() === "whatsapp" ? (
        <FaWhatsapp size={size} className="text-green-500" />
      ) : (
        <IoShareSocialOutline className="text-green-500" size={size} />
      )}
    </div>
  );
};

export default ItemIcon;
