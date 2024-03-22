import React from "react";
import UploadProfilePic from "../components/UploadProfilePic/UploadProfilePic";
import ClientNavbar from "../components/ClientNavbar/ClientNavbar";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";

const UploadProfilePage = () => {
  return (
    <div>
      <ClientNavbar />
      <UploadProfilePic />
      <ClientMenuBar />
    </div>
  );
};

export default UploadProfilePage;
