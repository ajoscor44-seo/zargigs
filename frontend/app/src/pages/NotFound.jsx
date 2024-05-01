import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";
import notFound from "../assets/png/not_found.png";
import { FaArrowLeft } from "react-icons/fa6";

const NotFound = () => {
  return (
    <div className="flex justify-center items-center h-screen px-3 bg-slate-100 font-primary">
      <div className="shadow-2xl bg-white p-4 rounded flex flex-col">
        <div className="flex justify-center items-center">
          <img src={notFound} className=" max-w-60" />
        </div>
        <h2 className="text-red-500 text-xl font-semibold text-center">
          Uh oh! We couldn't find that page.
        </h2>
        <p className="font-semibold mb-5 text-center">
          The route you requested may not exist, or it may have been typed
          incorrectly.
        </p>
        <Link
          to="/"
          className="text-green-500 hover:opacity-50 text-lg flex items-center justify-center gap-1 transition duration-100"
        >
          <span>
            <FaArrowLeft size={15} />
          </span>
          Back to Dashboard
        </Link>
        <div className="flex justify-end items-center italic font-bold">
          <h3 className="text-green-500">GigsFlix</h3>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
