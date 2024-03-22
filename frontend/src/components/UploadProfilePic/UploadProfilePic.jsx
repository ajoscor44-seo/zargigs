import React from "react";
import { BiCamera } from "react-icons/bi";
import { FaCamera } from "react-icons/fa";
import { FaUserLarge } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom/cjs/react-router-dom";

const UploadProfilePic = () => {
  return (
    <div
      className="underBackNav font-primary mt-5 mx-3 flex flex-col justify-center"
      style={{ maxWidth: "400px" }}
    >
      <div className="bg-white rounded shadow-2xl">
        <span className="flex justify-between items-center px-3 py-2 border-b text-sm">
          <h2 className="font-bold">More About You</h2>{" "}
          <button className="text-white bg-green-500 px-5 py-2 rounded-full flex items-center gap-1">
            <span>SKIP</span>
            <Link to="/set-birth-religion">
              <IoIosArrowForward size={15} className="font-bold" />
            </Link>
          </button>
        </span>

        <div className="p-3 flex flex-col gap-2">
          <div className="flex flex-col gap-2 py-0">
            <div className="flex justify-center items-center mt-5">
              <FaCamera size={70} className="text-green-500" />
            </div>
            <h1 className="text-center text-xl font-extrabold">
              You are almost done!
            </h1>
            <p className="text-center font-semibold text-xs">
              You are almost done with setting up your account, Simply upload a
              profile picture to enable people recognise and connect with you
              faster.
            </p>
          </div>
        </div>

        <div className="flex justify-center pt-3 pb-14">
          <div className="relative bg-green-200 w-fit p-5 rounded-full">
            <FaUserLarge size={120} className="text-green-500 rounded-full" />
            <div className="flex flex-col items-center absolute top-12 left-6 text-white">
              <BiCamera size={30} className="text-white" />
              <span>Click to Upload</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadProfilePic;
