import React, { useState } from "react";
import BackNav from "../components/BackNav/BackNav";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";
import userImage from "../assets/images/user-image.png";
import Setting from "../components/Setting/Setting";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom";
import { FaEye } from "react-icons/fa6";
import { BsCart2 } from "react-icons/bs";
import { BiMoneyWithdraw } from "react-icons/bi";
import { TfiMenuAlt } from "react-icons/tfi";
import { PiWalletLight } from "react-icons/pi";
import { IoLocationOutline } from "react-icons/io5";
import { GrNotification, GrTransaction } from "react-icons/gr";
import {
  CiBank,
  CiPower,
  CiCircleInfo,
  CiLock,
  CiLogout,
  CiUser,
} from "react-icons/ci";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { FcAbout } from "react-icons/fc";
import { useAuth } from "../context/AuthContext";

const Settings = () => {
  const [error, setError] = useState(null);
  const history = useHistory();
  const { currentUser, logoutUser, adminData } = useAuth();
  const settings = [
    {
      icon: <BsCart2 size={20} />,
      name: "My Order",
      path: "/order-history",
    },
    {
      icon: <PiWalletLight size={20} />,
      name: "Fund Wallet",
      path: "/fund-wallet",
    },
    {
      icon: <BiMoneyWithdraw size={20} />,
      name: "Place Withdrawals",
      path: "/withdraw",
    },
    {
      icon: <GrTransaction size={15} />,
      name: "Transaction History",
      path: "/transaction-history",
    },
    {
      icon: <GrNotification size={15} />,
      name: "My Notifications",
      path: "/notifications",
    },
    {
      icon: <CiUser size={20} />,
      name: "Edit Profile",
      path: "/edit-profile",
    },
    {
      icon: <CiLock size={20} />,
      name: "Update Password",
      path: "/update-password",
    },
    {
      icon: <IoLocationOutline size={20} />,
      name: "Update Location",
      path: "/update-location",
    },
    {
      icon: <CiBank size={20} />,
      name: "Update Bank Details",
      path: "/update-bank-details",
    },
    {
      icon: <IoLocationOutline size={20} />,
      name: "Chat With Support",
      path: "/help-support",
    },
    {
      icon: <MdOutlinePrivacyTip size={20} />,
      name: "Privacy policy",
      path: "/privacy-policy",
    },
    {
      icon: <FcAbout size={20} />,
      name: `About ${adminData?.appName}`,
      path: "/about-us",
    },
    {
      icon: <CiCircleInfo size={20} />,
      name: "Terms Of Use",
      path: "/term-of-use",
    },
    {
      icon: <CiPower size={20} />,
      name: "Logout",
      path: "#",
    },
  ];
  const logout = async () => {
    const logoutRes = await logoutUser();

    if (logoutRes.failed) setError(logoutRes.message);

    return history.push("/login");
  };

  return (
    <div>
      <BackNav pageName={"Settings"} pathToGo={"/"} usePath={true} />
      <div
        onClick={logout}
        className="py-2 px-3 bg-red-500 rounded-full flex justify-center items-center gap-1 text-white fixed top-3 z-20 right-2 font-bold font-primary"
      >
        <span className="text-sm">Logout</span>
        <CiLogout size={20} />
      </div>
      <div className="underBackNav font-primary">
        <div className="p-2 flex border bg-slate-50">
          <div className="flex items-center justify-center">
            <img
              src={
                currentUser?.image ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              className="object-cover w-16 h-16 me-2"
            />
          </div>
          <div className="flex flex-1 items-center justify-between">
            <div>
              <h2 className="font-semibold text-xl text-slate-600">
                {currentUser.firstname + " " + currentUser.lastname}
              </h2>
              <span className="text-md text-slate-400">
                @{currentUser.username.toLowerCase()}
              </span>
            </div>
            <Link to="/user-details">
              <div className="cursor-pointer hover:bg-slate-100 w-12 h-12 rounded-full px-3 flex justify-center items-center">
                <FaEye className="text-slate-500" size={30} />
              </div>
            </Link>
          </div>
        </div>

        <div className="mb-16">
          {settings.map((setting) => {
            return (
              <Setting
                key={setting.name}
                path={setting.path}
                settingName={setting.name}
                icon={setting.icon}
                logout={logout}
              />
            );
          })}
        </div>
      </div>
      <ClientMenuBar />
    </div>
  );
};

export default Settings;
