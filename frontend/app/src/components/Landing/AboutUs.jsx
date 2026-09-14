import React from "react";
import { useAuth } from "../../context/AuthContext";
import { FaUsersRays, FaShieldHalved, FaBoltLightning } from "react-icons/fa6";

const AboutUs = () => {
  const { adminData } = useAuth();
  const appName = adminData?.appName || "DocsZar";

  const pillars = [
    {
      icon: <FaUsersRays size={24} className="text-emerald-500" />,
      title: "Community Driven",
      desc: "Built to empower creators and regular social media users by rewarding authentic daily activities.",
    },
    {
      icon: <FaShieldHalved size={24} className="text-blue-500" />,
      title: "100% Transparent",
      desc: "Zero hidden charges, verifiable task approvals, and direct payouts to registered local accounts.",
    },
    {
      icon: <FaBoltLightning size={24} className="text-amber-500" />,
      title: "Instant Scaling",
      desc: "Connect thousands of brand campaigns with active, high-intent audiences within minutes.",
    },
  ];

  return (
    <section id="about" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold tracking-wide uppercase mb-3">
            About Our Mission
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            The Future of <span className="text-emerald-600">Social Media Monetization</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Welcome to <span className="font-bold text-slate-900">{appName}</span> — the next-generation bridge connecting high-growth brands with verified social media creators and active everyday earners.
          </p>
        </div>

        {/* 3 Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-emerald-200 hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-center mb-4">
                {pillar.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {pillar.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
