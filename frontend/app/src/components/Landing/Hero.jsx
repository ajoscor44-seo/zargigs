import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";
import girl_pointing from "../../assets/images/girl-pointing.png";
import { FaShieldHalved, FaArrowRight, FaUsers, FaCoins, FaBolt, FaArrowTrendUp } from "react-icons/fa6";
import { useAuth } from "../../context/AuthContext";

const Hero = () => {
  const { adminData, currentUser } = useAuth();
  const appName = adminData?.appName || "DocsZAR";

  return (
    <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Top Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-emerald-200/80 shadow-xs mb-6">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-800 tracking-wide">
                Nigeria's #1 Social Micro-Task & Monetization Hub
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Monetize Your Socials.{" "}
              <span className="text-emerald-600">
                Supercharge Your Brand.
              </span>
            </h1>

            {/* Subheading */}
            <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Join thousands of active users on <span className="font-semibold text-slate-900">{appName}</span> earning daily cash by performing micro-social tasks, or launch viral brand campaigns that reach verified, authentic human audiences.
            </p>

            {/* Call To Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to={currentUser ? "/dashboard" : "/signup"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-emerald-600 text-white font-semibold text-base shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
              >
                <span>{currentUser ? "Go to Dashboard" : "Start Earning Now"}</span>
                <FaArrowRight size={14} />
              </Link>
              <Link
                to="/marketplace"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-base border border-emerald-300 shadow-sm hover:bg-emerald-100 transition-all duration-200"
              >
                <span>🔥 Explore Marketplace</span>
              </Link>
              <Link
                to={currentUser ? "/advertise" : "/signup"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-slate-700 font-semibold text-base border border-slate-200 shadow-sm hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all duration-200"
              >
                <span>Advertise</span>
              </Link>
            </div>

            {/* Live Metrics Strip */}
            <div className="mt-12 pt-8 border-t border-slate-200/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">100K+</div>
                <div className="text-xs sm:text-sm text-slate-500 mt-0.5">Active Members</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">₦50M+</div>
                <div className="text-xs sm:text-sm text-slate-500 mt-0.5">Earnings Paid</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">99.9%</div>
                <div className="text-xs sm:text-sm text-slate-500 mt-0.5">Instant Payouts</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Graphic */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-none">
              {/* Background solid decorative card */}
              <div className="absolute inset-0 bg-emerald-100/50 rounded-3xl -rotate-3 transform scale-95 -z-10" />

              <img
                src={girl_pointing}
                alt="Earn with DocsZAR"
                className="relative z-10 w-full max-h-[520px] object-contain drop-shadow-2xl mx-auto"
              />

              {/* Floating Pill Card 1: Verified Earner */}
              <div className="absolute top-10 -left-4 sm:left-0 z-20 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3 animate-bounce-slow">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <FaCoins size={18} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500">Daily Task Paid</div>
                  <div className="text-sm font-bold text-slate-900">+₦2,500 Credited</div>
                </div>
              </div>

              {/* Floating Pill Card 2: Campaign Reach */}
              <div className="absolute bottom-8 -right-4 sm:right-0 z-20 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center">
                  <FaArrowTrendUp size={18} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500">Campaign Growth</div>
                  <div className="text-sm font-bold text-emerald-600">+12.4K Real Followers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
