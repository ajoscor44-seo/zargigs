import React from "react";
import { FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom/cjs/react-router-dom";

const Setting = ({ icon, settingName, desc, path, logout }) => {
  const isExternal = path && path.startsWith("http");

  const Content = (
    <div className="px-5 py-3.5 hover:bg-slate-50/80 transition-colors flex items-center justify-between group cursor-pointer">
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-slate-100 group-hover:bg-emerald-50 text-slate-700 group-hover:text-emerald-600 flex items-center justify-center transition-colors shadow-sm">
          {icon}
        </div>
        <div>
          <h4 className="font-semibold text-sm text-slate-800 group-hover:text-emerald-700 transition-colors">
            {settingName}
          </h4>
          {desc && (
            <p className="text-xs text-slate-400 font-normal">
              {desc}
            </p>
          )}
        </div>
      </div>
      <FiChevronRight className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" size={18} />
    </div>
  );

  if (logout) {
    return <div onClick={logout}>{Content}</div>;
  }

  if (isExternal) {
    return (
      <a href={path} target="_blank" rel="noreferrer" className="block">
        {Content}
      </a>
    );
  }

  return (
    <Link to={path || "#"} className="block">
      {Content}
    </Link>
  );
};

export default Setting;

