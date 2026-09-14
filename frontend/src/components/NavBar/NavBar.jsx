import React from "react";
import { useAuth } from "../../context/LandingContext";

const NavBar = ({
  menuOpen,
  setMenuOpen,
  activeTab,
  setActiveTab,
  tabs,
  scrollTo,
}) => {
  const { adminData } = useAuth();
  const app_url =
    import.meta.env.VITE_DEV_APP_URL ||
    (import.meta.env.VITE_NODE_ENV !== "production"
      ? "http://localhost:5173"
      : import.meta.env.VITE_PROD_APP_URL || "https://app.docszar.com");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo(0)}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-black text-xl shadow-md shadow-emerald-500/20">
            {adminData?.appLogo ? (
              <img src={adminData.appLogo} alt="Logo" className="w-full h-full rounded-xl object-cover" />
            ) : (
              "G"
            )}
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-800 uppercase font-primary">
            {adminData?.appName || "DocsZar"}<span className="text-emerald-500">.</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 px-2 py-1.5 rounded-full border border-slate-200/60">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.name.toLowerCase();
            return (
              <button
                key={tab.name}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                }`}
                onClick={() => {
                  setActiveTab(tab.name.toLowerCase());
                  scrollTo(tab.toBig);
                }}
              >
                {tab.name}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href={`${app_url}/login`}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-600 hover:bg-slate-50 transition-colors"
          >
            Sign In
          </a>
          <a
            href={`${app_url}/signup`}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 hover:-translate-y-0.5 transition-all duration-200"
          >
            Get Started Free
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          {!menuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-emerald-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 shadow-2xl px-4 pt-2 pb-6 animate-fadeIn">
          <div className="flex flex-col gap-1 py-2">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                  activeTab === tab.name.toLowerCase()
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
                onClick={() => {
                  setActiveTab(tab.name.toLowerCase());
                  scrollTo(tab.to);
                  setMenuOpen(false);
                }}
              >
                {tab.name}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-slate-100">
            <a
              href={`${app_url}/login`}
              className="w-full py-3 text-center border border-slate-200 text-slate-700 font-bold rounded-xl text-sm"
            >
              Sign In
            </a>
            <a
              href={`${app_url}/signup`}
              className="w-full py-3 text-center bg-emerald-600 text-white font-bold rounded-xl text-sm shadow-md"
            >
              Create Free Account
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
