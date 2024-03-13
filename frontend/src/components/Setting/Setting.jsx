import React from "react";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom/cjs/react-router-dom";

const Setting = ({ icon, settingName, path }) => {
  return (
    <Link to={path}>
      <div className="px-3 py-2 hover:bg-slate-50 flex justify-between items-center font-primary border-b">
        <div className="flex items-center gap-2">
          <div className="text-slate-700 p-2">{icon}</div>
          <div className="font-semibold text-sm text-slate-700">
            {settingName}
          </div>
        </div>
        <div className="text-slate-500">
          <IoIosArrowForward size={20} />
        </div>
      </div>
    </Link>
  );
};

export default Setting;
