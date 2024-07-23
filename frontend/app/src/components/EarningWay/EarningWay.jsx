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
import ItemIcon from "../ItemIcon/ItemIcon";

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
        <ItemIcon
          platform={way?.platformName}
          size={60}
          playstoreSize={"w-20 h-20"}
        />

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
                {way.platforms.map((platform, i) => (
                  <ItemIcon
                    platform={platform}
                    size={15}
                    playstoreSize={"w-5 h-5"}
                  />
                ))}
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
