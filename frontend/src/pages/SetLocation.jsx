import React from "react";
import SetLocation from "../components/SetLocation/SetLocation";
import ClientNavbar from "../components/ClientNavbar/ClientNavbar";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";

const SetLocationPage = () => {
  return (
    <div>
      <ClientNavbar />
      <SetLocation />
      <ClientMenuBar />
    </div>
  );
};

export default SetLocationPage;
