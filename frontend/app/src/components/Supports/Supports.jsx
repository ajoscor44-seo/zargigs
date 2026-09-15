import React from "react";
import { FaWhatsapp } from "react-icons/fa6";
import { FiChevronRight } from "react-icons/fi";

const Supports = () => {
  return (
    <a
      href="https://wa.me/2349027662488?text=Hello%20DocsZar%20Support%2C%20I%20need%20assistance"
      target="_blank"
      rel="noreferrer"
      className="bg-white hover:bg-emerald-50/50 rounded-3xl p-6 shadow-sm border border-slate-100/80 transition-all flex items-center justify-between group cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
          <FaWhatsapp size={24} />
        </div>
        <div>
          <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
            Official WhatsApp Live Desk (090 2766 2488)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Tap to connect immediately with a verified customer specialist
          </p>
        </div>
      </div>
      <div className="w-9 h-9 rounded-full bg-slate-50 group-hover:bg-emerald-100 text-slate-400 group-hover:text-emerald-700 flex items-center justify-center transition-colors">
        <FiChevronRight size={18} />
      </div>
    </a>
  );
};

export default Supports;

