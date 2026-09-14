import React, { useEffect, useState } from "react";
import { FaHouse, FaCompass, FaCirclePlus, FaWallet, FaRegUser, FaBoltLightning } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom/cjs/react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Notifier from "../Notifier/Notifier";
import axios from "axios";

const ClientMenuBar = () => {
  const { dashboardMode } = useAuth();
  const [unreads, setUnreads] = useState(0);
  const location = useLocation();

  const isEarner = dashboardMode === "earner";

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get(`/api/v1/notifications/unread`);
      setUnreads(response.data?.unreads || 0);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchUnreadCount();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const isHomeActive =
    location.pathname === "/" ||
    location.pathname === "/dashboard";

  const isTasksActive =
    location.pathname === "/tasks" ||
    location.pathname.startsWith("/workspace") ||
    location.pathname.startsWith("/creator/campaigns") ||
    location.pathname.startsWith("/tasks-history") ||
    location.pathname.startsWith("/order-history") ||
    location.pathname.startsWith("/order");

  const isEarnActive =
    location.pathname === "/earn" ||
    location.pathname.startsWith("/earn/");

  const isPostActive =
    location.pathname.startsWith("/create-task") ||
    location.pathname.startsWith("/advertise");

  const isWalletActive =
    location.pathname.startsWith("/fund-wallet") ||
    location.pathname.startsWith("/withdraw") ||
    location.pathname.startsWith("/transfer") ||
    location.pathname.startsWith("/transaction-history") ||
    location.pathname.startsWith("/fundings");

  const isProfileActive =
    location.pathname.startsWith("/user-details") ||
    location.pathname.startsWith("/edit-profile") ||
    location.pathname.startsWith("/account-settings") ||
    location.pathname.startsWith("/settings") ||
    location.pathname.startsWith("/help-support") ||
    location.pathname.startsWith("/notifications") ||
    location.pathname.startsWith("/invite") ||
    location.pathname.startsWith("/become-a-member") ||
    location.pathname.startsWith("/update-location");

  return (
    <nav aria-label="Mobile Navigation" className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md w-full py-2 px-3 border-t border-slate-200/90 flex justify-around items-center z-50 lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.06)] font-primary select-none pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]">
      {/* 1. Home */}
      <Link
        to="/dashboard"
        className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl transition-all active:scale-95 ${
          isHomeActive
            ? "text-emerald-600 font-bold"
            : "text-slate-500 hover:text-slate-800 font-medium"
        }`}
      >
        <FaHouse size={18} />
        <span className="text-[10px]">Home</span>
      </Link>

      {/* 2. Tasks */}
      <Link
        to="/tasks"
        className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl transition-all active:scale-95 ${
          isTasksActive
            ? "text-emerald-600 font-bold"
            : "text-slate-500 hover:text-slate-800 font-medium"
        }`}
      >
        <FaCompass size={18} />
        <span className="text-[10px]">Tasks</span>
      </Link>

      {/* 3. Center CTA: Earn (Earner) or Post (Advertiser) */}
      {isEarner ? (
        <Link
          to="/earn"
          className="flex flex-col items-center justify-center -mt-5 group"
          title="Earn Money"
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 active:scale-95 ${
            isEarnActive
              ? "bg-emerald-600 text-white ring-4 ring-emerald-100"
              : "bg-emerald-600 text-white"
          }`}>
            <FaBoltLightning size={20} />
          </div>
          <span className={`text-[10px] mt-0.5 ${isEarnActive ? "font-black text-emerald-700" : "font-bold text-slate-700"}`}>
            Earn
          </span>
        </Link>
      ) : (
        <Link
          to="/create-task"
          className="flex flex-col items-center justify-center -mt-5 group"
          title="Post a Task"
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 active:scale-95 ${
            isPostActive
              ? "bg-slate-950 text-white ring-4 ring-slate-200"
              : "bg-slate-900 text-white"
          }`}>
            <FaCirclePlus size={22} />
          </div>
          <span className={`text-[10px] mt-0.5 ${isPostActive ? "font-black text-slate-900" : "font-bold text-slate-700"}`}>
            Post
          </span>
        </Link>
      )}

      {/* 4. Wallet / Withdraw */}
      <Link
        to={isEarner ? "/withdraw" : "/fund-wallet"}
        className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl transition-all active:scale-95 ${
          isWalletActive
            ? "text-emerald-600 font-bold"
            : "text-slate-500 hover:text-slate-800 font-medium"
        }`}
      >
        <FaWallet size={18} />
        <span className="text-[10px]">{isEarner ? "Withdraw" : "Wallet"}</span>
      </Link>

      {/* 5. Profile */}
      <Link
        to="/user-details"
        className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl transition-all active:scale-95 relative ${
          isProfileActive
            ? "text-emerald-600 font-bold"
            : "text-slate-500 hover:text-slate-800 font-medium"
        }`}
      >
        <div className="relative">
          <FaRegUser size={18} />
          {unreads > 0 && <Notifier useNumber={true} number={unreads} />}
        </div>
        <span className="text-[10px]">Profile</span>
      </Link>
    </nav>
  );
};

export default ClientMenuBar;

