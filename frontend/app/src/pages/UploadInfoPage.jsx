import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import months from "../data/months";
import ClientNavbar from "../components/ClientNavbar/ClientNavbar";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";
import SetLocation from "../components/SetLocation/SetLocation";
import SetBirthReligion from "../components/Setbirthreliogion/Setbirthreliogion";
import UploadProfilePic from "../components/UploadProfilePic/UploadProfilePic";
import axios from "axios";
import SetBankDetails from "../components/SetBankDetails/SetBankDetails";
import statesData from "../data/states";

const UploadInfoPage = () => {
  const { currentUser, fetchUserData } = useAuth();
  const history = useHistory();
  const [activePage, setActivePage] = useState("location");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(["Day"]);

  // Dynamically generate years based on the current year
  const currentYear = new Date().getFullYear() - 13;
  const years = [...Array.from({ length: 100 }, (_, i) => currentYear - i)];

  // User details data
  const [image, setImage] = useState(undefined);
  const [religion, setReligion] = useState(undefined);
  const [bank, setBank] = useState(undefined);
  const [userLocation, setUserLocation] = useState({});
  const [bankDetail, setBankDetail] = useState({});
  const [userDOB, setUserDOB] = useState({
    day: new Date().getDate(),
    month: months[new Date().getMonth() + 1],
    year: new Date().getFullYear() - 13,
  });
  const [selectedGender, setSelectedGender] = useState(null);

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

  const uploadUserDetails = async () => {
    setLoading(true);
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
          bankName: bank,
          ...bankDetail,
        },
        userEarnings: {
          totalEarnings: 0,
          pendingEarnings: 0,
          amountSpent: 0,
          amountWithdrawn: 0,
          balance: 0,
        },
      };

      const response = await axios.post("/api/v1/user/user-details", formData);

      const data = await response.data;
      if (data.failed) {
        if (data.message == "User's details already exists.") {
          await fetchUserData();
          return history.push("/");
        }
        return setError(data.message);
      }
      await fetchUserData();
      setLoading(false);
      return history.push("/");
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
          />
        ) : activePage == "bank-details" ? (
          <SetBankDetails
            setActivePage={setActivePage}
            selectedBank={bank}
            setSelectedBank={setBank}
            bankDetails={bankDetail}
            setBankDetails={setBankDetail}
            setError={setError}
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
            loading={loading}
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
