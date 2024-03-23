import React, { useState } from "react";
import ClientNavbar from "../components/ClientNavbar/ClientNavbar";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";
import SetLocation from "../components/SetLocation/SetLocation";
import SetBirthReligion from "../components/Setbirthreliogion/Setbirthreliogion";
import UploadProfilePic from "../components/UploadProfilePic/UploadProfilePic";

const UploadInfoPage = () => {
  const [activePage, setActivePage] = useState("location");

  return (
    <div>
      <ClientNavbar />
      {activePage == "location" ? (
        <SetLocation setActivePage={setActivePage} />
      ) : activePage == "birth-religion" ? (
        <SetBirthReligion />
      ) : (
        <UploadProfilePic setActivePage={setActivePage} />
      )}
      <ClientMenuBar />
    </div>
  );
};

export default UploadInfoPage;
