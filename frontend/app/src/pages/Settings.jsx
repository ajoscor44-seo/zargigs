import React, { useState } from "react";
import ClientLayout from "../components/ClientLayout/ClientLayout";
import Setting from "../components/Setting/Setting";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom";
import {
  FiUser,
  FiShoppingBag,
  FiDollarSign,
  FiCreditCard,
  FiClock,
  FiBell,
  FiShare2,
  FiHelpCircle,
  FiShield,
  FiFileText,
  FiInfo,
  FiLogOut,
  FiChevronRight,
  FiMapPin,
  FiCheckCircle,
} from "react-icons/fi";
import { RiMegaphoneLine } from "react-icons/ri";
import { useAuth } from "../context/AuthContext";

const Settings = () => {
  const [error, setError] = useState(null);
  const history = useHistory();
  const { currentUser, logoutUser, adminData } = useAuth();

  const accountSettings = [
    {
      icon: <FiUser className="text-emerald-600" size={18} />,
      name: "Edit Profile",
      desc: "Manage personal and bank details",
      path: "/edit-profile",
    },
    {
      icon: <FiMapPin className="text-emerald-600" size={18} />,
      name: "Update Location",
      desc: "State and LGA preferences",
      path: "/update-location",
    },
    {
      icon: <FiShare2 className="text-emerald-600" size={18} />,
      name: "Invite Friends",
      desc: "Earn 60% referral commissions",
      path: "/invite",
    },
  ];

  const financialSettings = [
    {
      icon: <FiShoppingBag className="text-blue-600" size={18} />,
      name: "My Orders",
      desc: "Track created social engagements",
      path: "/order-history",
    },
    {
      icon: <FiDollarSign className="text-emerald-600" size={18} />,
      name: "Fund Wallet",
      desc: "Add money via PocketFi, dedicated virtual account or transfer",
      path: "/fund-wallet",
    },
    {
      icon: <FiCreditCard className="text-purple-600" size={18} />,
      name: "Withdraw Funds",
      desc: "Transfer earnings directly to your bank",
      path: "/withdraw",
    },
    {
      icon: <FiClock className="text-amber-600" size={18} />,
      name: "Transaction History",
      desc: "View all credit and debit records",
      path: "/transaction-history",
    },
    {
      icon: <RiMegaphoneLine className="text-rose-600" size={18} />,
      name: "My Adverts",
      desc: "Manage running promotion banners",
      path: "/advertisements",
    },
    {
      icon: <FiBell className="text-indigo-600" size={18} />,
      name: "Notifications",
      desc: "Task alerts and account updates",
      path: "/notifications",
    },
  ];

  const supportSettings = [
    {
      icon: <FiHelpCircle className="text-teal-600" size={18} />,
      name: "Help & Live Support",
      desc: "24/7 dedicated customer assistance",
      path: "/help-support",
    },
    {
      icon: <FiShield className="text-cyan-600" size={18} />,
      name: "Privacy Policy",
      desc: "How we protect and use your data",
      path: "/privacy-policy",
    },
    {
      icon: <FiInfo className="text-sky-600" size={18} />,
      name: `About ${adminData?.appName || "Zargigs"}`,
      desc: "Our mission, vision and ecosystem",
      path: "/about-us",
    },
    {
      icon: <FiFileText className="text-slate-600" size={18} />,
      name: "Terms of Use",
      desc: "Rules and user agreements",
      path: "/terms",
    },
  ];

  const logout = async () => {
    const logoutRes = await logoutUser();
    if (logoutRes?.failed) setError(logoutRes.message);
    return history.push("/login");
  };

  return (
    <ClientLayout>
      <div className="font-primary text-slate-800 space-y-6">
        {/* Page Header */}
        <div className="pb-2 border-b border-slate-200/70">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Account Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Manage your personal profile, security preferences, and wallet configurations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column (5 cols): User Card, Support & Sign Out */}
          <div className="md:col-span-5 space-y-6">
            {/* User Card */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 transition-all hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={
                        currentUser?.image ||
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      }
                      alt={currentUser?.firstname || "User"}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/20 shadow-xs"
                    />
                    {currentUser?.isMember && (
                      <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-xs">
                        <FiCheckCircle size={14} />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-black text-base text-slate-900">
                        {currentUser?.firstname} {currentUser?.lastname}
                      </h2>
                      {currentUser?.isMember ? (
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                          PRO
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded-full">
                          FREE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-bold mt-0.5">
                      @{currentUser?.username?.toLowerCase()}
                    </p>
                    <p className="text-xs text-slate-500 truncate max-w-[180px]">
                      {currentUser?.email}
                    </p>
                  </div>
                </div>
                <Link
                  to="/edit-profile"
                  className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl font-bold text-xs transition-colors"
                >
                  Edit
                </Link>
              </div>
            </div>

            {/* Section 3: Support & Information */}
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider px-2 mb-2">
                Support & Legal
              </h3>
              <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden divide-y divide-slate-100">
                {supportSettings.map((item) => (
                  <Setting
                    key={item.name}
                    path={item.path}
                    settingName={item.name}
                    desc={item.desc}
                    icon={item.icon}
                  />
                ))}
              </div>
            </div>

            {/* Section 4: Log Out */}
            <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden">
              <button
                onClick={logout}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-rose-50/60 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 group-hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors">
                    <FiLogOut size={18} />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-rose-600">
                      Log Out
                    </span>
                    <p className="text-xs text-slate-400">
                      Safely sign out of your account
                    </p>
                  </div>
                </div>
                <FiChevronRight className="text-slate-300 group-hover:text-rose-400 transition-colors" size={18} />
              </button>
            </div>

            <p className="text-center text-[11px] text-slate-400 font-medium">
              {adminData?.appName || "Zargigs"} • Version 2.4.0
            </p>
          </div>

          {/* Right Column (7 cols): Profile, Account, Wallet & Operations */}
          <div className="md:col-span-7 space-y-6">
            {/* Section 1: Profile & Preferences */}
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider px-2 mb-2">
                Profile & Account
              </h3>
              <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden divide-y divide-slate-100">
                {accountSettings.map((item) => (
                  <Setting
                    key={item.name}
                    path={item.path}
                    settingName={item.name}
                    desc={item.desc}
                    icon={item.icon}
                  />
                ))}
              </div>
            </div>

            {/* Section 2: Wallet & Operations */}
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider px-2 mb-2">
                Wallet & Activities
              </h3>
              <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden divide-y divide-slate-100">
                {financialSettings.map((item) => (
                  <Setting
                    key={item.name}
                    path={item.path}
                    settingName={item.name}
                    desc={item.desc}
                    icon={item.icon}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default Settings;
