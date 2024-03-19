import React from "react";
import ClientNavbar from "../components/ClientNavbar/ClientNavbar";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";

const InputUserInfoLayout = ({ children }) => {
  return (
    <div>
      <ClientNavbar />
      {children}
      <ClientMenuBar />
    </div>
  );
};

export default InputUserInfoLayout;
