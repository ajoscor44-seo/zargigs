import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";
import logo from "../../assets/png/logo-color.png";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";

const LandingNavBar = () => {
  const { currentUser } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        mobileMenuOpen || isScrolled
          ? "bg-white shadow-md border-b border-slate-200/80 py-2.5 sm:py-3"
          : "bg-white/95 sm:bg-white/80 backdrop-blur-md border-b border-slate-100/80 py-3 sm:py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src={logo}
              alt="DocsZar"
              className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 font-primary font-medium text-sm text-slate-600">
            <button
              onClick={() => scrollTo("services")}
              className="hover:text-emerald-600 transition-colors cursor-pointer"
            >
              For Advertisers
            </button>
            <button
              onClick={() => scrollTo("members")}
              className="hover:text-emerald-600 transition-colors cursor-pointer"
            >
              For Earners
            </button>
            <button
              onClick={() => scrollTo("about")}
              className="hover:text-emerald-600 transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="hover:text-emerald-600 transition-colors cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <Link
                to="/dashboard"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-all duration-200"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-slate-700 hover:text-emerald-600 font-semibold text-sm transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm shadow-emerald-500/20 hover:shadow-md transition-all duration-200"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <HiX size={24} className="text-emerald-600" /> : <HiMenuAlt3 size={24} />}
            </button>
          </div>
        </div>

        {/* Solid Mobile Dropdown Menu (No Transparency Bleed) */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 pt-3 pb-4 border-t border-slate-100 space-y-2.5 font-primary bg-white">
            <button
              onClick={() => scrollTo("services")}
              className="block w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50 active:bg-slate-100 transition-colors"
            >
              For Advertisers
            </button>
            <button
              onClick={() => scrollTo("members")}
              className="block w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50 active:bg-slate-100 transition-colors"
            >
              For Earners
            </button>
            <button
              onClick={() => scrollTo("about")}
              className="block w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50 active:bg-slate-100 transition-colors"
            >
              About Us
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="block w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50 active:bg-slate-100 transition-colors"
            >
              Contact
            </button>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {currentUser ? (
                <Link
                  to="/dashboard"
                  className="w-full text-center py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-md shadow-emerald-600/20"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-slate-800 font-bold text-sm hover:bg-slate-50 active:bg-slate-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="w-full text-center py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm shadow-md shadow-emerald-600/20"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default LandingNavBar;
