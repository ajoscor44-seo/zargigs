import React from "react";
import BackNav from "../components/BackNav/BackNav";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";
import { IoSettingsOutline } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";

const Settings = () => {
  return (
    <div>
      <BackNav pageName={"Settings"} />
      <div className="py-2 px-3 bg-red-500 rounded-full flex justify-center items-center gap-1 text-white fixed top-3 z-20 right-2 font-bold font-primary">
        <span className="text-sm">Logout</span>
        <CiLogout size={20} />
      </div>
      <ClientMenuBar />
    </div>
  );
};

export default Settings;
