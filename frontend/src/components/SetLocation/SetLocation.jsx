import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import FormInput from "../FormInput/FormInput";
import { BiSolidCheckCircle } from "react-icons/bi";
import { FaLocationDot } from "react-icons/fa6";

const SetLocation = ({ setActivePage }) => {
  const { currentUser } = useAuth();

  // Selects Data
  const [genders, setGenders] = useState(["Select Gender", "Male", "Female"]);
  const [states, setStates] = useState(["Select State", "Abia", "Adamawa"]);
  const [LGAs, setLGAs] = useState(["Select LGA", "Male", "Female"]);

  // User Location and Gender data
  const [userLocation, setUserLocation] = useState({});
  const [selectedGender, setSelectedGender] = useState(null);

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
    //
    setActivePage("upload-profile-pic");
  };

  useEffect(() => {
    console.log({ ...userLocation, gender: selectedGender });
  }, [selectedGender, userLocation]);

  return (
    <div
      className="underBackNav font-primary mt-5 mx-3 flex flex-col justify-center mb-20"
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
                selections={states}
                value={userLocation.state}
                name={"state"}
                handleChange={handleLocationChange}
              />
              {userLocation.state && userLocation.state !== "Select State" && (
                <FormInput
                  useSelect={true}
                  selections={LGAs}
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
