import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaArrowRight } from "react-icons/fa6";
import { useAuth } from "../../context/AuthContext";

const OurHandles = () => {
  const { adminData, currentUser } = useAuth();

  const handles = [
    {
      name: "Facebook",
      handle: "@docszar",
      url: "https://facebook.com/docszar",
      icon: <FaFacebook size={26} className="text-blue-600" />,
      color: "hover:border-blue-300 hover:shadow-blue-100",
    },
    {
      name: "Twitter / X",
      handle: "@DocsZARTech",
      url: "https://x.com/DocsZARTech/",
      icon: <FaTwitter size={26} className="text-sky-500" />,
      color: "hover:border-sky-300 hover:shadow-sky-100",
    },
    {
      name: "Instagram",
      handle: "@docszar_tech",
      url: "https://www.instagram.com/docszar_tech/",
      icon: <FaInstagram size={26} className="text-pink-600" />,
      color: "hover:border-pink-300 hover:shadow-pink-100",
    },
  ];

  return (
    <section className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Big CTA Banner */}
        <div className="rounded-3xl bg-emerald-700 text-white p-8 sm:p-14 shadow-sm border border-emerald-800">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Ready to Monetize or Scale Your Online Presence?
            </h2>
            <p className="mt-4 text-emerald-100 text-base sm:text-lg leading-relaxed">
              Join thousands of creators, brands, and everyday earners using {adminData?.appName || "DocsZAR"} every day.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to={currentUser ? "/dashboard" : "/signup"}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-emerald-800 font-bold text-sm shadow-md hover:bg-emerald-50 transition-all duration-200"
              >
                <span>{currentUser ? "Open Dashboard" : "Create Free Account"}</span>
                <FaArrowRight size={14} />
              </Link>
              {!currentUser && (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-800/60 hover:bg-emerald-800 text-white font-semibold text-sm border border-emerald-400/30 transition-all duration-200"
                >
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Social Handles Showcase */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-200/60 text-slate-700 text-xs font-semibold tracking-wide uppercase mb-3">
            Join Our Community
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Follow Us on Social Media
          </h3>
          <p className="text-slate-600 text-sm mt-2">
            Get the latest updates, bonus reward drops, and marketing tips.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mt-8">
            {handles.map((h, i) => (
              <a
                key={i}
                href={h.url}
                target="_blank"
                rel="noreferrer"
                className={`p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center group ${h.color}`}
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-3">
                  {h.icon}
                </div>
                <div className="font-bold text-slate-900 text-base">{h.name}</div>
                <div className="text-xs text-slate-500 mt-0.5">{h.handle}</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurHandles;
