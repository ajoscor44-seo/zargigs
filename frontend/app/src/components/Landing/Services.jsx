import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { FaUsers, FaMoneyBillTrendUp, FaArrowRight, FaBullhorn, FaCircleCheck } from "react-icons/fa6";
import { MdAddReaction } from "react-icons/md";
import lady_advertiser from "../../assets/images/lady-advertiser.jpg";
import { useAuth } from "../../context/AuthContext";

const Services = () => {
  const { adminData, currentUser } = useAuth();

  const features = [
    {
      icon: <FaUsers size={22} className="text-emerald-500" />,
      bg: "bg-emerald-50 border-emerald-100",
      title: "Real Followers & True Audience",
      desc: "Gain verified, organic followers on Instagram, Twitter, Facebook, and TikTok at the most competitive rates.",
    },
    {
      icon: <MdAddReaction size={22} className="text-amber-500" />,
      bg: "bg-amber-50 border-amber-100",
      title: "High-Impact Targeted Engagement",
      desc: "Access our vast network ready to like, comment, retweet, and amplify your brand messaging across the web.",
    },
    {
      icon: <FaBullhorn size={22} className="text-blue-500" />,
      bg: "bg-blue-50 border-blue-100",
      title: "Authentic Broadcast & Reposts",
      desc: "Have thousands of real users broadcast your campaign flyers, promotional videos, and announcements on their feeds.",
    },
    {
      icon: <FaMoneyBillTrendUp size={22} className="text-purple-500" />,
      bg: "bg-purple-50 border-purple-100",
      title: "ROI-Optimized Cost Solutions",
      desc: `Pay only for verified task completions. With ${adminData?.appName || "Zargigs"}, zero ad budget is wasted on bot clicks.`,
    },
  ];

  return (
    <section id="services" className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Image & Feature Pill */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <img
                src={lady_advertiser}
                alt="Grow with Zargigs"
                className="w-full rounded-2xl shadow-sm object-cover ring-1 ring-slate-900/5 aspect-4/5"
              />

              {/* Floating Stat Card */}
              <div className="absolute -bottom-6 -right-4 sm:right-6 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <FaCircleCheck size={20} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500">Task Completion</div>
                  <div className="text-base font-bold text-slate-900">99.8% Success Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Content & Features */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold tracking-wide uppercase mb-4">
              For Advertisers & Brands
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Scale Your Brand Reach With <span className="text-emerald-600">Verified Humans</span>
            </h2>
            <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
              Ditch robotic clicks and inflated metrics. Put your brand directly in front of thousands of active social media users who genuinely share, like, and promote your products.
            </p>

            {/* Feature List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">
              {features.map((item, index) => (
                <div
                  key={index}
                  className="p-5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:shadow-md hover:border-emerald-200 transition-all duration-300 flex flex-col"
                >
                  <div className={`w-11 h-11 rounded-lg border flex items-center justify-center mb-3 ${item.bg}`}>
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8 flex items-center gap-4">
              <Link
                to={currentUser ? "/advertise" : "/signup"}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 shadow-md shadow-emerald-500/20 hover:shadow-lg transition-all duration-200"
              >
                <span>Launch Your Campaign</span>
                <FaArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
