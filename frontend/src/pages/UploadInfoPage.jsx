import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import months from "../data/months";
import fetchStates from "../hooks/fetchStatesData";
import ClientNavbar from "../components/ClientNavbar/ClientNavbar";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";
import SetLocation from "../components/SetLocation/SetLocation";
import SetBirthReligion from "../components/Setbirthreliogion/Setbirthreliogion";
import UploadProfilePic from "../components/UploadProfilePic/UploadProfilePic";

const UploadInfoPage = () => {
  const { currentUser, userToken } = useAuth();
  const history = useHistory();
  const [activePage, setActivePage] = useState("location");
  const [error, setError] = useState(null);
  const [statesData, setStatesData] = useState([]);
  const [days, setDays] = useState(["Day"]);

  // Dynamically generate years based on the current year
  const currentYear = new Date().getFullYear();
  const years = [...Array.from({ length: 100 }, (_, i) => currentYear - i)];

  // User details data
  const [image, setImage] = useState(undefined);
  const [religion, setReligion] = useState(undefined);
  const [userLocation, setUserLocation] = useState({});
  const [userDOB, setUserDOB] = useState({
    day: new Date().getDate(),
    month: months[new Date().getMonth() + 1],
    year: new Date().getFullYear() - 13,
  });
  const [selectedGender, setSelectedGender] = useState(null);

  // Fetches the location data
  useEffect(() => {
    const fetchData = async () => {
      const states = await fetchStates();
      return setStatesData(states);
    };

    fetchData();
  }, []);

  // Effect hook to adjust the days in the selected month, including leap years
  useEffect(() => {
    const updateDaysInMonth = () => {
      // Convert month name to month number
      const monthIndex = months.indexOf(userDOB?.month);
      // Parse the year as an integer
      const year = parseInt(userDOB?.year);

      if (monthIndex > 0 && year) {
        // Calculate the number of days in the month
        const daysInMonth = new Date(year, monthIndex, 0).getDate();
        // Update the days state
        setDays([
          "Day",
          ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
        ]);
      }
    };

    updateDaysInMonth();
  }, [userDOB?.month, userDOB?.year, months]);

  // To consume api
  // useEffect(() => {
  //   console.log({
  //     id: currentUser._id,
  //     email: currentUser.email,
  //     image,
  //     religion,
  //     gender: selectedGender,
  //     location: userLocation,
  //     dateOfBirth: userDOB,
  //     bankDetails: {
  //       accountNumber: null,
  //       bankName: null,
  //       accountName: null,
  //     },
  //     userEarnings: {
  //       totalEarnings: 0,
  //       pendingEarnings: 0,
  //       amountSpent: 0,
  //       amountWithdrawn: 0,
  //       balance: 0,
  //     },
  //   });
  // }, [
  //   selectedGender,
  //   userLocation,
  //   userDOB?.month,
  //   userDOB?.year,
  //   currentUser,
  // ]);
  const uploadUserDetails = async () => {
    if (!currentUser.email && !currentUser._id) {
      return history.push("/login");
    }
    if (!selectedGender) {
      return setError("No gender selected");
    }
    if (!userLocation.state || !userLocation.LGA) {
      return setError("Invalid Location");
    }
    if (!userDOB.day || !userDOB.month || !userDOB.year) {
      return setError("Invalid birth date");
    }

    try {
      const formData = {
        image,
        religion,
        gender: selectedGender,
        location: userLocation,
        dateOfBirth: userDOB,
        bankDetails: {
          accountNumber: null,
          bankName: null,
          accountName: null,
        },
        userEarnings: {
          totalEarnings: 0,
          pendingEarnings: 0,
          amountSpent: 0,
          amountWithdrawn: 0,
          balance: 0,
        },
      };

      const response = await fetch(
        "http://localhost:3000/api/v1/user/user-details",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      console.log(data);
      if (data.failed) {
        if (data.message == "User's details already exists.") {
          return history.push("/dashboard");
        }
        return setError(data.message);
      }
      return history.push("/dashboard");
    } catch (error) {
      return console.error(error);
    }
  };

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
          <SetBirthReligion
            setActivePage={setActivePage}
            selectedReligion={religion}
            setSelectedReligion={setReligion}
            userDOB={userDOB}
            setUserDOB={setUserDOB}
            years={years}
            months={months}
            days={days}
            uploadUserDetails={uploadUserDetails}
          />
        ) : (
          <UploadProfilePic
            setActivePage={setActivePage}
            setImage={setImage}
            image={image}
          />
        )}
      </div>
      <ClientMenuBar />
    </div>
  );
};

export default UploadInfoPage;
