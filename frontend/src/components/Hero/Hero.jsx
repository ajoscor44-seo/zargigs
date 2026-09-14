import React, { useState } from "react";
import hero_img from "../../assets/images/girl-pointing.png";
import NavBar from "../NavBar/NavBar";
import { FaShieldAlt, FaBolt, FaWallet, FaArrowRight } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";

const Hero = () => {
  const app_url =
    import.meta.env.VITE_DEV_APP_URL ||
    (import.meta.env.VITE_NODE_ENV !== "production"
      ? "http://localhost:5173"
      : import.meta.env.VITE_PROD_APP_URL || "https://app.docszar.com");

  const [activeTab, setActiveTab] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const tabs = [
    { name: "Home", to: 0, toBig: 0 },
    { name: "For Advertisers", to: 800, toBig: 700 },
    { name: "For Members", to: 1700, toBig: 1400 },
    { name: "About Us", to: 2500, toBig: 2000 },
    { name: "Contact", to: 3300, toBig: 2700 },
  ];

  const scrollTo = (to) => {
    window.scrollTo({
      top: to,
      behavior: "smooth",
    });
  };

  const stats = [
    { label: "Active Earners", value: "50,000+" },
    { label: "Tasks Completed", value: "150,000+" },
    { label: "Total Paid Out", value: "₦50,000,000+" },
    { label: "Avg. Payout Time", value: "< 15 Mins" },
  ];

  return (
    <div className="relative pt-20 overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-slate-50">
      <NavBar
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={tabs}
        scrollTo={scrollTo}
      />

      {/* Hero Section Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/80 border border-emerald-200/80 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
              <HiSparkles className="text-emerald-600 text-sm" />
              <span>The #1 Social Task & Earning Marketplace</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Get Paid Daily for <br />
              <span className="gradient-text">Posting & Engaging</span> <br />
              on Social Media.
            </h1>

            {/* Sub-headline */}
            <p className="mt-6 text-base sm:text-lg text-slate-600 font-medium max-w-xl leading-relaxed">
              Join thousands of verified earners performing simple social media tasks, or amplify your brand reach with real, authentic engagement from genuine followers.
            </p>

            {/* Dual CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <a
                href={`${app_url}/signup`}
                className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Start Earning Free</span>
                <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href={`${app_url}/login`}
                className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 hover:text-emerald-700 font-bold text-sm rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <FaBolt className="text-amber-500" />
                <span>Post An Advert</span>
              </a>
            </div>

            {/* Guarantee points */}
            <div className="mt-8 flex flex-wrap justify-center lg:justify-start items-center gap-6 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-1.5">
                <FaShieldAlt className="text-emerald-600 text-sm" />
                <span>Instant Withdrawal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FaWallet className="text-emerald-600 text-sm" />
                <span>Zero Hidden Fees</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FaBolt className="text-amber-500 text-sm" />
                <span>100% Real Engagement</span>
              </div>
            </div>
          </div>

          {/* Right Hero Image & Visual Card */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            {/* Ambient Background Glow */}
            <div className="absolute w-72 h-72 bg-emerald-300/30 rounded-full blur-3xl -top-10 -left-10 pointer-events-none"></div>
            <div className="absolute w-72 h-72 bg-teal-300/30 rounded-full blur-3xl -bottom-10 -right-10 pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-md">
              <img
                src={hero_img}
                alt="DocsZar Hero Banner"
                className="w-full h-auto drop-shadow-2xl rounded-2xl transform hover:scale-[1.02] transition-transform duration-300"
              />

              {/* Floating Stat Pill 1 */}
              <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                  ₦
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-bold">Recent Payout</div>
                  <div className="text-sm font-extrabold text-slate-800">₦25,400 to @chidi_k</div>
                </div>
              </div>

              {/* Floating Stat Pill 2 */}
              <div className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-700">1,420+ Tasks Active</span>
              </div>
            </div>
          </div>

        </div>

        {/* Global Statistics Strip */}
        <div className="mt-16 pt-12 border-t border-slate-200/70">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/60 border border-slate-200/60 shadow-sm hover:bg-white transition-colors">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-primary">
                  {stat.value}
                </div>
                <div className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Hero;
