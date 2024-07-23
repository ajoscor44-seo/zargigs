import React, { useEffect, useState } from "react";
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
  FaSpotify,
  FaLink,
} from "react-icons/fa6";
import { IoLogoAppleAppstore } from "react-icons/io5";
import { SiAudiomack } from "react-icons/si";
import { SlUserFollowing } from "react-icons/sl";
import playStoreImage from "../../assets/images/playstore-icon.png";
import axios from "axios";
import { MdGetApp } from "react-icons/md";

const EarningWay = ({
  way,
  addSelectBtn,
  wayDescription,
  type,
  setTotalAvailableAdvertTasks,
  setTotalAvailableNormalTasks,
}) => {
  const [totalTasks, setTotalTasks] = useState(0);

  const getTotal = async () => {
    return await axios
      .get(
        `/api/v1/tasks/total?type=${type}&platform=${way.platformName.toLowerCase()}`
      )
      .then((response) => {
        return setTotalTasks(response.data.total);
      })
      .catch((error) => error);
  };

  useEffect(() => {
    getTotal();
    if (
      totalTasks &&
      (setTotalAvailableNormalTasks || setTotalAvailableAdvertTasks)
    )
      if (type === "advert") {
        return setTotalAvailableAdvertTasks((prev) => prev + 1);
      } else {
        return setTotalAvailableNormalTasks((prev) => prev + 1);
      }
  }, [totalTasks]);
  return (
    <div className="hover:bg-slate-50 p-4 flex gap-2">
      <div className="flex flex-col items-center gap-2">
        {way?.platformName?.toLowerCase() === "facebook" ? (
          <FaFacebook className="text-blue-600" size={60} />
        ) : way?.platformName?.toLowerCase() === "instagram" ? (
          <FaInstagram
            size={60}
            className="text-white bg-instagram-gradient rounded"
          />
        ) : way?.platformName?.toLowerCase() === "allfollow" ? (
          <SlUserFollowing
            size={60}
            className="text-white bg-blue-400 rounded p-2"
          />
        ) : way?.platformName?.toLowerCase() === "tiktok" ? (
          <FaTiktok size={60} className="text-white bg-black rounded p-1" />
        ) : way?.platformName?.toLowerCase() === "audiomack" ? (
          <SiAudiomack
            size={60}
            className="text-orange-500 bg-black rounded p-2"
          />
        ) : way?.platformName?.toLowerCase() === "applestore" ? (
          <IoLogoAppleAppstore
            size={60}
            className="text-blue-500 bg-white rounded-full"
          />
        ) : way?.platformName?.toLowerCase() === "playstore" ? (
          <img src={playStoreImage} className="w-20 h-20 object-cover" />
        ) : way?.platformName?.toLowerCase() === "spotify" ? (
          <FaSpotify
            size={60}
            className="text-green-500 bg-white rounded-full"
          />
        ) : way?.platformName?.toLowerCase() === "allretweets" ? (
          <FaRetweet
            size={60}
            className="text-blue-500 bg-white rounded-full"
          />
        ) : way?.platformName?.toLowerCase() === "allshare" ? (
          <FaShare
            size={60}
            className="text-white bg-white rounded-full bg-instagram-gradient p-3"
          />
        ) : way?.platformName?.toLowerCase() === "allcomments" ? (
          <FaCommentDots size={60} className="text-green-400 bg-white" />
        ) : way?.platformName?.toLowerCase() === "telegram" ? (
          <FaTelegram size={60} className="text-blue-400 bg-white" />
        ) : way?.platformName?.toLowerCase() === "app" ? (
          <MdGetApp size={60} className="text-red-400 bg-white" />
        ) : way?.platformName.toLowerCase() === "website" ? (
          <FaLink size={60} className="text-green-400 bg-white" />
        ) : way?.platformName?.toLowerCase() === "alllike" ? (
          <BiLike
            size={60}
            className="text-white bg-blue-500 rounded-full p-2"
          />
        ) : way?.platformName?.toLowerCase() === "youtube" ? (
          <FaYoutube size={60} className="text-red-500" />
        ) : way?.platformName?.toLowerCase() === "whatsapp" ? (
          <FaWhatsapp
            size={60}
            className="bg-green-500 text-white rounded p-1"
          />
        ) : (
          <FaTwitter className="text-blue-400" size={60} />
        )}

        {addSelectBtn ? (
          <button className="btn border">SELECT</button>
        ) : (
          <span></span>
        )}
      </div>
      <div className="flex-1">
        <div className="flex flex-col gap-1 border-b pb-1">
          <h1 className="text-md font-extrabold">{way.title}</h1>
          <span className="text-xs">
            Earnings:{" "}
            <span className="font-bold">
              ₦{way.amountToEarn} per {type}
            </span>
          </span>
        </div>
        <div>
          <p className="font-semibold leading-4 mt-2 methodNote">
            {wayDescription}
          </p>
          <div className="methodNote font-extrabold mt-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>Platforms: </span>
              <span className="flex items-center gap-1">
                {way.platforms.map((platform, i) =>
                  platform.toLowerCase() === "facebook" ? (
                    <FaFacebook key={i} className="text-blue-600" size={15} />
                  ) : platform.toLowerCase() === "instagram" ? (
                    <FaInstagram
                      size={15}
                      key={i}
                      className="text-white bg-instagram-gradient rounded"
                    />
                  ) : platform.toLowerCase() === "whatsapp" ? (
                    <FaWhatsapp
                      key={i}
                      size={15}
                      className="text-green-500 rounded"
                    />
                  ) : platform.toLowerCase() === "tiktok" ? (
                    <FaTiktok
                      size={15}
                      key={i}
                      className="text-white bg-black rounded p-1"
                    />
                  ) : platform.toLowerCase() === "audiomack" ? (
                    <SiAudiomack
                      size={15}
                      key={i}
                      className="text-orange-500 bg-black rounded"
                    />
                  ) : platform.toLowerCase() === "applestore" ? (
                    <IoLogoAppleAppstore
                      size={15}
                      key={i}
                      className="text-blue-500 bg-white rounded-full"
                    />
                  ) : platform.toLowerCase() === "playstore" ? (
                    <img
                      key={i}
                      src={playStoreImage}
                      className="w-5 h-5 object-cover"
                    />
                  ) : platform.toLowerCase() === "youtube" ? (
                    <FaYoutube key={i} size={15} className="text-red-500" />
                  ) : platform.toLowerCase() === "telegram" ? (
                    <FaTelegram
                      key={i}
                      size={15}
                      className="text-blue-400 bg-white"
                    />
                  ) : platform.toLowerCase() === "app" ? (
                    <MdGetApp
                      key={i}
                      size={15}
                      className="text-red-400 bg-white"
                    />
                  ) : platform.toLowerCase() === "website" ? (
                    <FaLink
                      key={i}
                      size={15}
                      className="text-green-400 bg-white"
                    />
                  ) : platform.toLowerCase() === "spotify" ? (
                    <FaSpotify
                      key={i}
                      size={15}
                      className="text-green-600 bg-white"
                    />
                  ) : (
                    <FaTwitter key={i} className="text-blue-400" size={15} />
                  )
                )}
              </span>
            </div>

            {totalTasks ? (
              <div className="bg-green-500 px-1 rounded text-white">
                {totalTasks} Tasks Available
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningWay;
