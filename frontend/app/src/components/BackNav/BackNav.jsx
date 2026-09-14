import React from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom";
import ClientNavbar from "../ClientNavbar/ClientNavbar";

const BackNav = ({ pageName, pathToGo, usePath }) => {
  const history = useHistory();

  const goBack = (e) => {
    if (!usePath) {
      e.preventDefault();
      history.goBack();
    }
  };

  return (
    <div className="sticky top-0 z-30 bg-white shadow-xs">
      <ClientNavbar />
      <div className="bg-slate-50/90 border-b border-slate-200/80 px-4 sm:px-6 py-2.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to={pathToGo || "#"}
              onClick={goBack}
              className="p-1.5 rounded-xl text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 transition-colors flex items-center justify-center border border-slate-200 shadow-2xs"
              title="Go Back"
            >
              <FaArrowLeft size={13} />
            </Link>
            <h1 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight line-clamp-1">
              {pageName}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackNav;

