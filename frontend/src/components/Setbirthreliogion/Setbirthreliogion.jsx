import React, { useEffect, useState } from "react";
import FormInput from "../FormInput/FormInput";
import religions from "../../data/religions";
import { IoArrowForward } from "react-icons/io5";

const SetBirthReligion = ({
  setActivePage,
  selectedReligion,
  setSelectedReligion,
  userDOB,
  setUserDOB,
  years,
  months,
  days,
  uploadUserDetails,
}) => {
  // Handles change in religion selection
  const handleChange = (e) => {
    return setSelectedReligion(e.target.value);
  };

  // Handles the date of birth changes
  const handleDOBChange = (e) => {
    return setUserDOB({
      ...userDOB,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div
      className="font-primary mt-4 mx-3 flex flex-col justify-center"
      style={{ maxWidth: "400px" }}
    >
      <div className="bg-white rounded mb-20 shadow-2xl">
        <span className="flex justify-between items-center px-3 py-2 border-b text-sm">
          <h2 className="font-bold">More About You</h2>{" "}
        </span>

        <div className="p-3 flex flex-col gap-2">
          <div className="flex flex-col gap-2 py-0">
            <button
              onClick={() => setActivePage("upload-profile-pic")}
              className="bg-gray-400 flex items-center justify-center gap-1 text-white p-2 w-fit rounded"
            >
              <span>Back</span>
              <span>
                <IoArrowForward />
              </span>
            </button>
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
                value={userDOB?.day}
                name={"day"}
                handleChange={handleDOBChange}
                hideDropIcon={true}
              />
              <FormInput
                useSelect={true}
                selections={months}
                value={userDOB?.month}
                name={"month"}
                handleChange={handleDOBChange}
                hideDropIcon={true}
              />
              <FormInput
                useSelect={true}
                selections={["Year", ...years]}
                value={userDOB?.year}
                name={"year"}
                handleChange={handleDOBChange}
                hideDropIcon={true}
              />
            </div>
            <div className="mt-3">
              <FormInput
                useSelect={true}
                selections={religions}
                value={selectedReligion}
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

          <button
            onClick={uploadUserDetails}
            className="bg-green-500 text-white font-semibold text-sm py-3 rounded"
          >
            PROCEED TO DASHBOARD
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetBirthReligion;
