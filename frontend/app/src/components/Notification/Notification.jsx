import React from "react";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import { IoNotifications } from "react-icons/io5";
import { TiWarning } from "react-icons/ti";
import { MdTaskAlt } from "react-icons/md";
import { FcAdvertising } from "react-icons/fc";
import { BiMoneyWithdraw } from "react-icons/bi";
import { GiWallet } from "react-icons/gi";
import { RiVerifiedBadgeFill } from "react-icons/ri";

const Notification = ({ notification, markAsRead }) => {
  const stateStyle = notification.read
    ? "border"
    : "border-l-4 border-green-500";
  return (
    <div
      onClick={() => markAsRead(notification._id)}
      className={
        stateStyle +
        " hover:bg-slate-100 grid grid-flow-col gap-3 items-start font-primary p-4 cursor-pointer"
      }
    >
      <div className="w-12 h-12 rounded-full border-2 flex justify-center items-center overflow-hidden">
        {notification.type == "announcement" ? (
          <HiMiniSpeakerWave
            size={30}
            className="object-cover text-orange-600"
          />
        ) : notification.type == "warning" ? (
          <TiWarning size={30} className="object-cover text-red-600" />
        ) : notification.type == "task" ? (
          <MdTaskAlt size={30} className="object-cover text-green-600" />
        ) : notification.type == "advert" ? (
          <FcAdvertising size={30} className="object-cover" />
        ) : notification.type == "withdraw" ? (
          <BiMoneyWithdraw size={30} className="object-cover text-green-300" />
        ) : notification.type == "fund" ? (
          <GiWallet size={30} className="object-cover text-sky-400" />
        ) : notification.type == "verification" ? (
          <RiVerifiedBadgeFill
            size={30}
            className="object-cover text-green-500"
          />
        ) : (
          <IoNotifications size={30} className="object-cover text-blue-400" />
        )}
      </div>
      <div className="flex flex-col">
        <h2 className="font-bold">{notification.title}</h2>
        <span className="text-sm">{notification.message}</span>
      </div>
    </div>
  );
};

export default Notification;
