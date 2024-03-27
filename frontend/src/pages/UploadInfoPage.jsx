import React, { useEffect, useState } from "react";
import ClientNavbar from "../components/ClientNavbar/ClientNavbar";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";
import SetLocation from "../components/SetLocation/SetLocation";
import SetBirthReligion from "../components/Setbirthreliogion/Setbirthreliogion";
import UploadProfilePic from "../components/UploadProfilePic/UploadProfilePic";
import fetchStates from "../hooks/fetchStatesData";

const UploadInfoPage = () => {
  const [activePage, setActivePage] = useState("location");
  const [error, setError] = useState(null);
  const [statesData, setStatesData] = useState([]);

  // User Location and Gender data
  const [userLocation, setUserLocation] = useState({});
  const [selectedGender, setSelectedGender] = useState(null);

  // Fetches the location data
  useEffect(() => {
    const fetchData = async () => {
      const states = await fetchStates();
      return setStatesData(states);
    };

    fetchData();
  }, []);

  return (
    <div>
      <ClientNavbar />
      <div className="underBackNav mt-3 flex flex-col">
        {error && (
          <span className="bg-red-200 capitalize fixed w-full text-center py-2 text-red-500 font-semibold">
            {error}
          </span>
        )}
        {activePage == "location" ? (
          <SetLocation
            setActivePage={setActivePage}
            setError={setError}
            userLocation={userLocation}
            setUserLocation={setUserLocation}
            selectedGender={selectedGender}
            setSelectedGender={setSelectedGender}
            statesData={statesData}
            setStatesData={setStatesData}
          />
        ) : activePage == "birth-religion" ? (
          <SetBirthReligion />
        ) : (
          <UploadProfilePic setActivePage={setActivePage} />
        )}
      </div>
      <ClientMenuBar />
    </div>
  );
};

export default UploadInfoPage;
