import React from "react";
import { Link, useLocation, useHistory } from "react-router-dom/cjs/react-router-dom";
import { useAuth } from "../../context/AuthContext";
import numeral from "numeral";
import {
  FiHome,
  FiZap,
  FiCheckSquare,
  FiShoppingBag,
  FiPlusCircle,
  FiCreditCard,
  FiBell,
  FiUser,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiAward,
  FiChevronRight,
  FiTrendingUp,
} from "react-icons/fi";
import {
  FaCrown,
  FaBullhorn,
  FaListCheck,
  FaWallet,
} from "react-icons/fa6";

const AppSidebar = () => {
  const { currentUser, adminData, logoutUser, dashboardMode, switchDashboardMode } = useAuth();
  const location = useLocation();
  const history = useHistory();

  const balance = currentUser?.userEarnings?.balance ?? currentUser?.balance ?? 0;
  const userImageURL =
    currentUser?.image ||
    currentUser?.avatarUrl ||
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const handleLogout = async () => {
    try {
      await logoutUser();
      history.push("/login");
    } catch (e) {
      history.push("/login");
    }
  };

  const isEarner = dashboardMode === "earner";

  // Earner-focused navigation
  const earnerNav = [
    { label: "Earner Dashboard", path: "/dashboard", icon: <FiHome size={17} /> },
    { label: "Earn Daily Tasks", path: "/earn", icon: <FiZap size={17} className="text-orange-500" /> },
    { label: "Microtasks & Surveys", path: "/tasks", icon: <FiCheckSquare size={17} className="text-emerald-600" /> },
    { label: "My Task Submissions", path: "/tasks-history", icon: <FaListCheck size={16} className="text-slate-700" /> },
    { label: "Withdraw Earnings", path: "/withdraw", icon: <FaWallet size={16} className="text-emerald-600" /> },
    { label: "Invite & Earn (60%)", path: "/invite", icon: <FiAward size={17} className="text-orange-500" /> },
  ];

  // Advertiser-focused navigation
  const advertiserNav = [
    { label: "Advertiser Dashboard", path: "/dashboard", icon: <FiHome size={17} /> },
    { label: "+ Create Microtask / Survey", path: "/create-task", icon: <FiPlusCircle size={17} className="text-emerald-600" />, isSpecial: true },
    { label: "Post Social Adverts", path: "/advertise", icon: <FaBullhorn size={16} className="text-orange-500" /> },
    { label: "Get Followers & Growth", path: "/order", icon: <FiTrendingUp size={17} className="text-emerald-600" /> },
    { label: "My Campaigns & Orders", path: "/order-history", icon: <FiShoppingBag size={17} className="text-slate-700" /> },
    { label: "Fund Wallet", path: "/fund-wallet", icon: <FaWallet size={16} className="text-emerald-600" /> },
  ];

  const generalNav = [
    { label: "My Profile", path: "/user-details", icon: <FiUser size={15} /> },
    { label: "Notifications", path: "/notifications", icon: <FiBell size={15} /> },
    { label: "Settings", path: "/account-settings", icon: <FiSettings size={15} /> },
    { label: "Help & Support", path: "/help-support", icon: <FiHelpCircle size={15} /> },
  ];

  const handleModeSwitch = (mode) => {
    switchDashboardMode(mode, history, location.pathname);
  };

  return (
    <aside className="w-64 xl:w-72 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col h-[calc(100vh-5.5rem)] sticky top-20 hidden lg:flex select-none z-20 shrink-0 overflow-hidden">
      <div className="p-3.5 space-y-3.5 flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        
        {/* Mode Switcher */}
        <div className="p-1 rounded-2xl bg-slate-100 border border-slate-200/80 flex items-center justify-between">
          <button
            type="button"
            onClick={() => handleModeSwitch("earner")}
            className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              isEarner
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>⚡</span>
            <span>Earner</span>
          </button>
          <button
            type="button"
            onClick={() => handleModeSwitch("advertiser")}
            className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              !isEarner
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>📢</span>
            <span>Advertiser</span>
          </button>
        </div>

        {/* User Mini Profile Card */}
        <Link
          to="/user-details"
          className="flex items-center gap-2.5 p-2 rounded-2xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-100 transition-all group"
        >
          <div className="relative shrink-0">
            <img
              src={userImageURL}
              alt={currentUser?.firstname || "User"}
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-emerald-500/20"
            />
            {currentUser?.isMember ? (
              <span className="absolute -bottom-1 -right-1 bg-orange-500 text-white rounded-full p-0.5 shadow-xs">
                <FaCrown size={8} />
              </span>
            ) : null}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs text-slate-900 truncate group-hover:text-emerald-700">
                {currentUser?.firstname} {currentUser?.lastname}
              </span>
              {currentUser?.isMember && (
                <span className="text-[8px] font-black bg-orange-100 text-orange-800 px-1 py-0.2 rounded-md">
                  PRO
                </span>
              )}
            </div>
            <p className="text-[10px] font-bold text-slate-400 truncate">
              @{currentUser?.username?.toLowerCase() || "user"}
            </p>
          </div>
          <FiChevronRight size={14} className="text-slate-300 group-hover:text-emerald-600 transition-colors" />
        </Link>

        {/* Live Balance Bar */}
        <div className="p-2.5 rounded-2xl text-white shadow-2xs flex items-center justify-between transition-colors bg-slate-900 border border-slate-800">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block leading-tight">
              {isEarner ? "Earner Balance" : "Advertiser Balance"}
            </span>
            <span className="text-sm sm:text-base font-black tracking-tight text-emerald-400">
              ₦{numeral(balance).format("0,0.00")}
            </span>
          </div>
          <Link
            to={isEarner ? "/withdraw" : "/fund-wallet"}
            className="px-2.5 py-1 rounded-xl text-white font-extrabold text-[10px] shadow-xs transition-colors bg-emerald-600 hover:bg-emerald-500"
          >
            {isEarner ? "Withdraw" : "+ Fund"}
          </Link>
        </div>

        {/* Dynamic Primary Navigation (Earner vs Advertiser) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              {isEarner ? "⚡ Earner Menu" : "📢 Advertiser Menu"}
            </span>
            <span className="text-[8px] font-black px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
              {isEarner ? "WORKER" : "ADVERTISER"}
            </span>
          </div>
          {(isEarner ? earnerNav : advertiserNav).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label + item.path}
                to={item.path}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? isEarner
                      ? "bg-emerald-50 text-emerald-700 font-extrabold shadow-2xs"
                      : "bg-slate-100 text-slate-900 font-extrabold shadow-2xs"
                    : item.isSpecial
                    ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-extrabold border border-emerald-200/60"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <span className="shrink-0">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* General Account Navigation */}
        <div className="space-y-1 pt-2 border-t border-slate-100">
          <span className="px-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
            Account & Hub
          </span>
          {currentUser?.role === "admin" && (
            <Link
              to="/admin"
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-black transition-all ${
                location.pathname.startsWith("/admin")
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-emerald-50/80 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="truncate">🛡️ Admin Portal</span>
            </Link>
          )}
          {generalNav.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-slate-100 text-slate-900 font-extrabold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <span className="shrink-0 text-slate-400">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer Logout (Pinned at bottom) */}
      <div className="p-3 border-t border-slate-100 bg-white mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-rose-50 text-rose-600 font-bold text-xs transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <FiLogOut size={15} />
            <span>Sign Out</span>
          </div>
          <span className="text-[9px] font-semibold text-slate-400">
            v2.4
          </span>
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
