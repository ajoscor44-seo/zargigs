import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";
import man_member from "../../assets/images/earner-showcase.jpg";
import { FaHeart, FaShareNodes, FaArrowRight, FaWallet, FaCoins } from "react-icons/fa6";
import { useAuth } from "../../context/AuthContext";

const WhatYouDo = () => {
  const { currentUser } = useAuth();

  const memberSteps = [
    {
      icon: <FaHeart size={20} className="text-rose-500" />,
      bg: "bg-rose-50 border-rose-100",
      title: "1. Like, Follow & Engage",
      desc: "Earn cash rewards instantly by simply following handles, liking posts, commenting, and subscribing to channels.",
    },
    {
      icon: <FaShareNodes size={20} className="text-blue-500" />,
      bg: "bg-blue-50 border-blue-100",
      title: "2. Post & Reshare Adverts",
      desc: "Post sponsor flyers and videos to your WhatsApp status, Facebook timeline, Twitter feed, or Instagram story.",
    },
    {
      icon: <FaWallet size={20} className="text-emerald-500" />,
      bg: "bg-emerald-50 border-emerald-100",
      title: "3. Direct Instant Withdrawals",
      desc: "Get your earnings transferred directly to your local bank account swiftly with zero hidden processing charges.",
    },
  ];

  return (
    <section id="members" className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Member Features */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold tracking-wide uppercase mb-4">
              For Earners & Social Media Users
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Turn Your Daily Screen Time Into <span className="text-emerald-600">Daily Cash</span>
            </h2>
            <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
              You already spend hours liking and sharing content every day. Now get paid directly for every single social action you perform on your favorite platforms.
            </p>

            {/* Steps Container */}
            <div className="mt-8 space-y-4">
              {memberSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex items-start gap-4"
                >
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${step.bg}`}>
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA button */}
            <div className="mt-8 flex items-center gap-4">
              <Link
                to={currentUser ? "/earn" : "/signup"}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 shadow-md shadow-slate-900/10 hover:shadow-lg transition-all duration-200"
              >
                <span>{currentUser ? "Start Earning" : "Join As An Earner"}</span>
                <FaArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <img
                src={man_member}
                alt="Earn with DocsZar"
                className="w-full rounded-2xl shadow-sm object-cover ring-1 ring-slate-900/5 aspect-4/5"
              />

              {/* Floating Earning Pill */}
              <div className="absolute -top-4 -left-4 sm:left-6 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                  <FaCoins size={18} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500">Daily Payouts</div>
                  <div className="text-base font-bold text-slate-900">Instant Wallet Crediting</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatYouDo;
