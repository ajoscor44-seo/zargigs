import React from "react";
import { FaHome } from "react-icons/fa";
import { PiWalletLight } from "react-icons/pi";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoCartOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa6";
import { Link } from "react-router-dom/cjs/react-router-dom";
import waysToEarnForAds from "../../data/waysToEarnForAdvert";
import waysToEarnForTasks from "../../data/waysToEarnForTasks";
import Notifier from "../Notifier/Notifier";
import user from "../../data/user";

const ClientMenuBar = () => {
  const advertTasks = waysToEarnForAds.reduce((total, wayToEarn) => {
    return total + wayToEarn.availableTasks.length;
  }, 0);
  const normalTasks = waysToEarnForTasks.reduce((total, wayToEarn) => {
    return total + wayToEarn.availableTasks.length;
  }, 0);

  return (
    <div className="fixed bottom-0 bg-white w-full py-2 px-5 border-t flex justify-between">
      <Link to="/dashboard">
        <div className="flex flex-col justify-between items-center cursor-pointer relative">
          <FaHome
            size={25}
            className="bg-slate-100 hover:bg-slate-200 w-8 h-8 rounded-full p-2"
          />
          <span className="text-sm">Home</span>
        </div>
      </Link>
      <Link to={user.isMember ? "/earn" : "/earn/become-a-member"}>
        <div className="flex flex-col justify-between items-center cursor-pointer relative">
          <PiWalletLight
            size={25}
            className="bg-slate-100 hover:bg-slate-200 w-8 h-8 rounded-full p-2"
          />
          <span className="text-sm">Earn</span>
          {advertTasks || normalTasks ? <Notifier /> : <div></div>}
        </div>
      </Link>
      <Link to="/advertise">
        <div className="flex flex-col justify-between items-center cursor-pointer relative">
          <IoIosAddCircleOutline
            size={25}
            className="hover:bg-slate-200 bg-slate-100 w-8 h-8 rounded-full p-1"
          />
          <span className="text-sm">Advertise</span>
        </div>
      </Link>
      <Link to="/order">
        <div className="flex flex-col justify-between items-center cursor-pointer relative">
          <IoCartOutline
            size={25}
            className="bg-slate-100 hover:bg-slate-200 w-8 h-8 rounded-full p-2"
          />
          <span className="text-sm">Order</span>
          {!normalTasks ? <Notifier /> : <div></div>}
        </div>
      </Link>
      <Link to="/account-settings">
        <div className="flex flex-col justify-between items-center cursor-pointer relative">
          <FaRegUser
            size={25}
            className="bg-slate-100 hover:bg-slate-200 w-8 h-8 rounded-full p-2"
          />
          <span className="text-sm">Me</span>
          {normalTasks ? (
            <Notifier useNumber={true} number={97} />
          ) : (
            <div></div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ClientMenuBar;
