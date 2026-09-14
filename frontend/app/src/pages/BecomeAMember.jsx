import React, { useState } from "react";
import ClientLayout from "../components/ClientLayout/ClientLayout";
import numeral from "numeral";
import { Link } from "react-router-dom/cjs/react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import ToastNotification from "../components/ToastNotification/ToastNotification";
import { FaCrown, FaCheckCircle, FaWallet, FaShieldAlt } from "react-icons/fa";

const BecomeAMember = () => {
  const [toastNotifications, setToastNotifications] = useState([]);
  const { adminData, currentUser, fetchUserData } = useAuth();
  const [disableBtn, setDisableBtn] = useState(false);
  const [justUpgraded, setJustUpgraded] = useState(false);

  // Toast Notification
  const showToast = (notificationObj) => {
    setToastNotifications([...toastNotifications, notificationObj]);

    const toastTimeout = setTimeout(() => {
      setToastNotifications([]);
      clearTimeout(toastTimeout);
    }, 4000);
  };

  const becomeAMember = async () => {
    try {
      setDisableBtn(true);
      await axios.put("/api/v1/user/become-a-member");
      await fetchUserData();
      setJustUpgraded(true);
      showToast({
        msg: "🎉 Congratulations! You are now a lifetime VIP PRO Member!",
        errorType: "success",
      });
      setDisableBtn(false);
    } catch (error) {
      showToast({
        msg: `${error?.response?.data?.message || "Payment failed. Please ensure wallet is funded."}`,
        errorType: "danger",
      });
      setDisableBtn(false);
    }
  };

  const benefits = [
    {
      title: "Unlock WhatsApp Status Adverts (₦100+ per post)",
      desc: "Get exclusive access to post daily sponsored brand adverts on your WhatsApp status and social media feed.",
    },
    {
      title: "High-Paying Paid Surveys & App Reviews",
      desc: "Participate in lucrative consumer research surveys and mobile app tests paying premium cash rewards.",
    },
    {
      title: `Instant ₦${numeral((adminData?.membershipFee || 1000) * 0.6).format("0,0")} Referral Bonus`,
      desc: `Earn 60% instant direct commission whenever you refer a new member to ${adminData?.appName || "Zargigs"}.`,
    },
    {
      title: "Direct & Unlimited Bank Withdrawals",
      desc: "Withdraw your earnings directly to any Nigerian bank account anytime with fast verification.",
    },
    {
      title: "Unlimited Lifetime Access",
      desc: "No monthly or yearly renewal fees. A single one-time activation gives you lifetime membership.",
    },
  ];

  return (
    <ClientLayout>
      <div className="font-primary text-slate-800 space-y-6">
        {/* Top Header */}
        <div className="pb-2 border-b border-slate-200/70">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            VIP Earner Membership
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Unlock unlimited daily task earnings, instant payouts, and 60% direct referral bonuses.
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column (7 cols): VIP Pitch & Benefits */}
          <div className="md:col-span-7 space-y-6">
            {/* VIP Hero Card */}
            <div className="relative rounded-2xl bg-slate-900 p-6 sm:p-8 text-white shadow-sm text-center border border-slate-800">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-500 text-white shadow-sm mb-3">
                <FaCrown size={24} />
              </div>

              <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-2">
                Turn Your Social Media Into A Daily Income Stream
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
                Activate your verified earner account today with a one-time membership fee and unlock lifetime daily tasks.
              </p>

              <div className="mt-5 inline-flex items-center gap-3 bg-slate-800 px-5 py-2.5 rounded-2xl border border-slate-700">
                <span className="text-xs text-slate-300">One-Time Lifetime Fee:</span>
                <span className="text-xl font-black text-emerald-400">
                  ₦{numeral(adminData?.membershipFee || 1000).format("0,0.00")}
                </span>
              </div>
            </div>

            {/* Benefits Grid */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 px-1">
                Membership Privileges & Benefits
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-emerald-300 transition-all flex items-start gap-3.5"
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <FaCheckCircle size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                        {benefit.title}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">
                        {benefit.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Checkout & Wallet Summary */}
          <div className="md:col-span-5 space-y-6">
            {currentUser?.isMember || justUpgraded ? (
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <FaCheckCircle size={24} />
                </div>
                <h3 className="text-base font-black text-slate-900">
                  You're a Verified Pro Member
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Your account has active lifetime VIP membership. You have full access to daily tasks, advertisements, and referral bonuses.
                </p>
                <div className="pt-2 flex flex-col gap-2.5">
                  <Link
                    to="/earn"
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Go to Daily Tasks →</span>
                  </Link>
                  <Link
                    to="/invite"
                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2"
                  >
                    <span>Invite Friends & Earn 60%</span>
                  </Link>
                </div>
              </div>
            ) : (
              /* Activation Checkout Card */
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-5">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">
                  Instant Activation Summary
                </h3>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Activation Package:</span>
                    <strong className="text-slate-900 font-bold">Pro Earner (Lifetime)</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">One-Time Price:</span>
                    <strong className="text-emerald-700 font-black text-sm">
                      ₦{numeral(adminData?.membershipFee || 1000).format("0,0.00")}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <span className="text-slate-500 font-medium">Wallet Balance:</span>
                    <span className="font-mono font-bold text-slate-800">
                      ₦{numeral(currentUser?.balance || currentUser?.userEarnings?.balance || 0).format("0,0.00")}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={becomeAMember}
                  disabled={disableBtn}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-sm active:scale-[0.99] transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <FaCrown size={16} className="text-white" />
                  <span>Activate Membership Now</span>
                </button>

                {/* Wallet funding reminder */}
                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <FaWallet size={14} />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-emerald-950">
                        Need to fund first?
                      </h5>
                      <p className="text-[10px] text-emerald-700">
                        Instant PocketFi or Bank Transfer.
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/fund-wallet"
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shrink-0 shadow-2xs"
                  >
                    Fund →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="toast_cover">
          {toastNotifications?.map((toastNotification) => (
            <ToastNotification
              key={toastNotification.id}
              toastNotification={toastNotification}
            />
          ))}
        </div>
      </div>
    </ClientLayout>
  );
};

export default BecomeAMember;
