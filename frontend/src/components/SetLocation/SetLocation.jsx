import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import FormInput from "../FormInput/FormInput";
import { BiSolidCheckCircle } from "react-icons/bi";
import { FaLocationDot } from "react-icons/fa6";
import fetchStates from "../../hooks/fetchStatesData";

const SetLocation = ({ setActivePage, setError }) => {
  const { currentUser } = useAuth();

  // User Location and Gender data
  const [userLocation, setUserLocation] = useState({});
  const [selectedGender, setSelectedGender] = useState(null);

  // Selects Data
  const [genders, setGenders] = useState([
    "Select Gender",
    "Male",
    "Female",
    "Transgender",
    "Custom",
    "Others",
  ]);
  const [statesData, setStatesData] = useState([]);

  // Get the states from the location data
  const states = statesData?.map((state) => state.name);

  // Get the lgas from the location data
  const LGAs = statesData
    ?.find((state) => state.name == userLocation.state)
    ?.lgas?.map((lga) => lga.name);
  // console.log(LGAs);
  const LGAList =
    userLocation.state == "Select State" || !userLocation.state
      ? ["Abeg go select state jor"]
      : LGAs;

  // Fetches the location data
  useEffect(() => {
    const fetchData = async () => {
      const states = await fetchStates();
      return setStatesData(states);
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    return setSelectedGender(e.target.value);
  };

  const handleLocationChange = (e) => {
    return setUserLocation({
      ...userLocation,
      [e.target.name]: e.target.value,
    });
  };

  const setLocation = async () => {
    if (userLocation.state && userLocation.LGA && selectedGender) {
      setError(null);
      setActivePage("upload-profile-pic");
      return;
    }
    if (!selectedGender) {
      return setError("Please select a gender.");
    }
    if (!userLocation.state || userLocation.state == "Select State") {
      return setError("Please input your state.");
    }
    if (!userLocation.LGA) {
      return setError("Please input your local govt.");
    }
  };

  useEffect(() => {
    console.log({ ...userLocation, gender: selectedGender });
  }, [selectedGender, userLocation]);

  return (
    <div
      className="font-primary mx-3 mt-10 flex flex-col justify-center mb-20"
      style={{ maxWidth: "400px" }}
    >
      <div className="bg-white rounded shadow-2xl">
        <span className="flex justify-between items-center px-3 py-2 border-b text-sm">
          <h2 className="font-bold">More About You</h2>{" "}
        </span>

        <div className="p-3 flex flex-col gap-2">
          <div className="flex flex-col gap-2 py-0">
            <div className="flex justify-center items-center">
              <BiSolidCheckCircle size={55} className="text-green-500" />
            </div>
            <h1 className="text-center text-xl font-extrabold">
              Welcome to Gigsflix!
            </h1>
            <p className="text-center text-xs">
              Congratulations {currentUser.lastname}, your email{" "}
              <span className="font-bold">{currentUser.email}</span> has been
              verified successfully. You will need to set your gender and
              current location before you can continue.
            </p>
          </div>

          <div className="flex flex-col">
            <FormInput
              useSelect={true}
              selections={genders}
              value={selectedGender}
              name={"gender"}
              handleChange={handleChange}
            />
            <div className="mt-3">
              <span className="flex items-center">
                <FaLocationDot className="text-red-500" size={15} />
                <span className="text-sm font-bold ms-1">Your Location</span>
              </span>
              <FormInput
                useSelect={true}
                selections={["Select State", ...states]}
                value={userLocation.state}
                name={"state"}
                handleChange={handleLocationChange}
              />
              {userLocation.state && userLocation.state !== "Select State" && (
                <FormInput
                  useSelect={true}
                  selections={["Select LGA", ...LGAList]}
                  value={userLocation.LGA}
                  name={"LGA"}
                  handleChange={handleLocationChange}
                  note={
                    "You will have to select your state before selecting LGA."
                  }
                />
              )}
            </div>
          </div>

          <button
            onClick={setLocation}
            className="bg-green-500 text-white font-semibold text-sm py-2 rounded"
          >
            SET DETAILS
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetLocation;
