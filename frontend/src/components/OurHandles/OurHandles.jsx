import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaArrowRight } from "react-icons/fa6";
import { useAuth } from "../../context/LandingContext";

const OurHandles = () => {
  const { adminData } = useAuth();
  const app_url =
    import.meta.env.VITE_NODE_ENV !== "production"
      ? import.meta.env.VITE_DEV_APP_URL
      : import.meta.env.VITE_PROD_APP_URL;

  const handles = [
    {
      name: "Facebook",
      handle: "@gigsflix",
      url: "https://facebook.com/gigsflix",
      icon: <FaFacebook size={26} className="text-blue-600" />,
      color: "hover:border-blue-300 hover:shadow-blue-100",
    },
    {
      name: "Twitter / X",
      handle: "@DocsZarTech",
      url: "https://x.com/DocsZarTech/",
      icon: <FaTwitter size={26} className="text-sky-500" />,
      color: "hover:border-sky-300 hover:shadow-sky-100",
    },
    {
      name: "Instagram",
      handle: "@gigsflix_tech",
      url: "https://www.instagram.com/gigsflix_tech/",
      icon: <FaInstagram size={26} className="text-pink-600" />,
      color: "hover:border-pink-300 hover:shadow-pink-100",
    },
  ];

  return (
    <section className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Big CTA Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 text-white p-8 sm:p-14 shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Ready to Monetize or Scale Your Online Presence?
            </h2>
            <p className="mt-4 text-emerald-100 text-base sm:text-lg leading-relaxed">
              Join thousands of creators, brands, and everyday earners using {adminData?.appName || "DocsZar"} every day.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={`${app_url}/signup`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-emerald-800 font-bold text-sm shadow-md hover:bg-emerald-50 transition-all duration-200"
              >
                <span>Create Free Account</span>
                <FaArrowRight size={14} />
              </a>
              <a
                href={`${app_url}/login`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-800/60 hover:bg-emerald-800 text-white font-semibold text-sm border border-emerald-400/30 transition-all duration-200"
              >
                <span>Log In to Dashboard</span>
              </a>
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
                className={`p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col items-center group ${h.color}`}
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
