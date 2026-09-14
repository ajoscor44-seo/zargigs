import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { FaMoneyBillTrendUp, FaBullhorn, FaArrowRight } from "react-icons/fa6";

const EarningMethods = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
      {/* Earn Micro Tasks Card */}
      <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 flex flex-col justify-between">
        <div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
            <FaMoneyBillTrendUp size={22} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            For Earners
          </span>
          <h3 className="font-bold text-slate-900 text-lg mt-2.5 mb-1.5">
            Perform Social Micro-Tasks
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
            Earn cash every day by liking posts, following social media profiles, retweeting, and subscribing to channels.
          </p>
        </div>
        <div>
          <Link
            to="/earn"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all"
          >
            <span>Start Performing Tasks</span>
            <FaArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Post Adverts Card */}
      <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 flex flex-col justify-between">
        <div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4">
            <FaBullhorn size={22} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
            For Advertisers
          </span>
          <h3 className="font-bold text-slate-900 text-lg mt-2.5 mb-1.5">
            Create Ad & Growth Campaigns
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
            Hire thousands of active real users to repost your banners, boost followers, and generate authentic organic engagements.
          </p>
        </div>
        <div>
          <Link
            to="/advertise"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm shadow-md shadow-slate-900/10 transition-all"
          >
            <span>Create Campaign</span>
            <FaArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EarningMethods;
