import React, { useEffect, useState } from "react";
import { TfiHelpAlt } from "react-icons/tfi";
import { IoNotificationsOutline } from "react-icons/io5";
import { FaCrown } from "react-icons/fa6";
import { Link, useLocation, useHistory } from "react-router-dom/cjs/react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import logo from "../../assets/png/logo-color.png";

const ClientNavbar = () => {
  const { currentUser, adminData, dashboardMode, switchDashboardMode } = useAuth();
  const location = useLocation();
  const history = useHistory();
  const [userImageURL, setUserImageURL] = useState(
    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  );
  const [newNotificationsNumber, setNewNotificationsNumber] = useState(0);

  const handleModeSwitch = (mode) => {
    switchDashboardMode(mode, history, location.pathname);
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("/api/v1/notifications/unread");
      return setNewNotificationsNumber(response.data?.unreads || 0);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (currentUser?.avatarUrl || currentUser?.image) {
      setUserImageURL(currentUser.avatarUrl || currentUser.image);
    }
    fetchNotifications();

    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchNotifications();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [currentUser]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs w-full">
      <div className="max-w-7xl xl:max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 text-decoration-none group">
            <img
              src={logo}
              alt={adminData?.appName || "DocsZAR"}
              className="h-8 sm:h-9 w-auto object-contain group-hover:scale-105 transition-transform"
            />
          </Link>
        </div>

        {/* Center: Global Dashboard Mode Switcher (Earner vs Advertiser) */}
        <div className="hidden md:flex items-center p-1 rounded-2xl bg-slate-100/90 border border-slate-200/80 shadow-2xs">
          <button
            type="button"
            onClick={() => handleModeSwitch("earner")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              dashboardMode === "earner"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>⚡</span>
            <span>Earner Mode</span>
          </button>
          <button
            type="button"
            onClick={() => handleModeSwitch("advertiser")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              dashboardMode === "advertiser" || dashboardMode === "retailer"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>📢</span>
            <span>Advertiser Mode</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Admin Command Link */}
          {currentUser?.role === "admin" && (
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all border border-slate-700 hover:scale-105"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Admin Portal</span>
            </Link>
          )}

          {/* Membership Trigger */}
          {!currentUser?.isMember ? (
            <Link
              to="/become-a-member"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs rounded-xl shadow-xs transition-colors"
            >
              <FaCrown size={12} className="text-orange-200" />
              <span className="hidden sm:inline">Become a Member</span>
              <span className="sm:hidden">VIP</span>
            </Link>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-extrabold text-[11px] border border-emerald-200">
              <FaCrown size={11} className="text-emerald-500" />
              <span>PRO</span>
            </span>
          )}

          <Link
            to="/help-support"
            className="p-2 text-slate-500 hover:text-green-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Help & Support"
          >
            <TfiHelpAlt size={19} />
          </Link>

          <Link
            to="/notifications"
            className="p-2 text-slate-500 hover:text-green-600 hover:bg-slate-100 rounded-lg transition-colors relative"
            title="Notifications"
          >
            <IoNotificationsOutline size={21} />
            {newNotificationsNumber > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                {newNotificationsNumber}
              </span>
            )}
          </Link>

          <Link
            to="/user-details"
            className="flex items-center gap-2 pl-2 border-l border-slate-200 hover:opacity-90 transition-opacity"
          >
            <img
              src={userImageURL}
              alt="Profile"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-green-500/30"
            />
            <span className="hidden xl:block text-xs font-bold text-slate-700 max-w-[90px] truncate">
              {currentUser?.username || "Account"}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default ClientNavbar;

