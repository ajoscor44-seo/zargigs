import React from "react";
import { BiLike } from "react-icons/bi";
import {
  FaCommentDots,
  FaFacebook,
  FaInstagram,
  FaLink,
  FaRetweet,
  FaShare,
  FaSpotify,
  FaTelegram,
  FaTiktok,
  FaTwitter,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa6";
import { IoLogoAppleAppstore } from "react-icons/io5";
import { SiAudiomack } from "react-icons/si";
import { SlUserFollowing } from "react-icons/sl";
import playStoreImage from "../../assets/images/playstore-icon.png";
import { MdGetApp } from "react-icons/md";
import ItemIcon from "../ItemIcon/ItemIcon";

const PricingWay = ({ way, addSelectBtn, wayDescription }) => {
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
          <h1 className="text-sm font-extrabold">{way.title}</h1>
          <span className="text-xs">
            Pricings:{" "}
            <span className="font-extrabold">
              ₦{way.amountToPay} per engagement
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
                    key={i}
                    platform={platform}
                    size={15}
                    playstoreSize={"w-5 h-5"}
                  />
                ))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingWay;
