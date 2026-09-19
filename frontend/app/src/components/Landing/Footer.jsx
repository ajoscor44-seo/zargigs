import React from "react";
import { FaTwitter, FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa6";
import { Link } from "react-router-dom/cjs/react-router-dom";
import logo from "../../assets/png/logo-white.png";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-slate-800">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <img src={logo} alt="DocsZAR Logo" className="h-9 w-auto brightness-0 invert" />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The premier social media monetization and advertising platform. Connecting brands with active real users for organic engagement and sustainable online earnings.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com/docszar"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook size={16} />
              </a>
              <a
                href="https://x.com/DocsZARTech/"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter size={16} />
              </a>
              <a
                href="https://www.instagram.com/docszar_tech/"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={16} />
              </a>
              <a
                href="https://wa.me/2349027662488"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={16} />
              </a>
            </div>
          </div>

          {/* Col 2: Company */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about-us" className="hover:text-emerald-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-emerald-400 transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-emerald-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-emerald-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/signup" className="hover:text-emerald-400 transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/advertise" className="hover:text-emerald-400 transition-colors">
                  Advertise Now
                </Link>
              </li>
              <li>
                <Link to="/earn" className="hover:text-emerald-400 transition-colors">
                  Start Earning
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Support */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Help & Support</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="https://wa.me/2349027662488" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">
                  WhatsApp Support (090 2766 2488)
                </a>
              </li>
              <li>
                <a href="https://medium.com/@contactdocszar" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">
                  Knowledgebase & FAQ
                </a>
              </li>
              <li>
                <a href="mailto:contactdocszar@gmail.com" className="hover:text-emerald-400 transition-colors truncate block">
                  Email Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            &copy; {new Date().getFullYear()} DocsZAR Technologies. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-slate-400">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-400">Terms of Service</Link>
            <Link to="/refund-policy" className="hover:text-slate-400">Refunds</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
