import React from "react";
import ClientNavbar from "../components/ClientNavbar/ClientNavbar";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";

const InputUserInfoLayout = ({ children }) => {
  return (
    <div className="bg-gray-50" style={{ height: "100vh" }}>
      <ClientNavbar />
      <div className="flex justify-center items-center">{children}</div>
      <ClientMenuBar />
    </div>
  );
};

export default InputUserInfoLayout;
