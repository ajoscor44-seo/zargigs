import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import FormInput from "../FormInput/FormInput";
import religions from "../../data/religions";

const SetBirthReligion = () => {
  const { currentUser } = useAuth();

  // Selects Data
  const [days, setDays] = useState(["Day", 1, 2]);
  const [months, setMonths] = useState(["Month", "January", "February"]);
  const [years, setYears] = useState(["Year", 2024, 2023]);

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

  useEffect(() => {
    console.log({ ...userLocation, gender: selectedGender });
  }, [selectedGender, userLocation]);

  return (
    <div
      className="underBackNav font-primary mt-5 mx-3 flex flex-col justify-center"
      style={{ maxWidth: "400px" }}
    >
      <div className="bg-white rounded shadow-2xl">
        <span className="flex justify-between items-center px-3 py-2 border-b text-sm">
          <h2 className="font-bold">More About You</h2>{" "}
        </span>

        <div className="p-3 flex flex-col gap-2">
          <div className="flex flex-col gap-2 py-0">
            <p className="text-sm font-semibold">
              Let's know about you so we can personalise your experience on
              GigsFlix
            </p>

            <span className="flex flex-col gap-2">
              <h2 className="text-sm font-semibold">Add Your Birthday</h2>
              <p className="text-sm text-slate-500">
                Get more tasks that is in line with your birthday. Enter your
                correct date of birth.{" "}
                <span className="text-sky-500 font-bold">
                  No one will see this information
                </span>
              </p>
            </span>
          </div>

          <div className="flex flex-col">
            <div className="grid grid-cols-3 gap-3">
              <FormInput
                useSelect={true}
                selections={days}
                value={selectedGender}
                name={"day"}
                handleChange={handleChange}
                hideDropIcon={true}
              />
              <FormInput
                useSelect={true}
                selections={months}
                value={selectedGender}
                name={"month"}
                handleChange={handleChange}
                hideDropIcon={true}
              />
              <FormInput
                useSelect={true}
                selections={years}
                value={selectedGender}
                name={"year"}
                handleChange={handleChange}
                hideDropIcon={true}
              />
            </div>
            <div className="mt-3">
              <FormInput
                useSelect={true}
                selections={religions}
                value={selectedGender}
                name={"religion"}
                handleChange={handleChange}
                label={"What's Your Religion?"}
                note={
                  "Please select your religion so we can personalise your tasks according to your what you believe in."
                }
                hideDropIcon={true}
              />
            </div>
          </div>

          <button className="bg-green-500 text-white font-semibold text-sm py-3 rounded">
            PROCEED TO DASHBOARD
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetBirthReligion;
