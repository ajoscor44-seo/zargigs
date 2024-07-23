import React from "react";
import { IoClose } from "react-icons/io5";
import FormInput from "../FormInput/FormInput";

const CreateAdvertisement = ({
  advertData,
  setAdvertData,
  setCreatingAdvert,
}) => {
  const handleChange = (e) => {
    setAdvertData({
      ...advertData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="shadow-2xl border flex flex-col w-full px-5 gap-3 py-5">
      <div className="flex items-center justify-between">
        <h2 className="font-bold">Advert Setup</h2>
        <button
          className="border rounded-full p-1"
          onClick={() => setCreatingAdvert(false)}
        >
          <IoClose size={20} className="text-red-500" />
        </button>
      </div>
      <FormInput
        label={"Name Your Advert"}
        placeholder={"Advert Name"}
        isError={false}
        type={"text"}
        name={"name"}
        handleChange={handleChange}
      />
      <FormInput
        label={"Advert Link"}
        placeholder={"https://www.example.com/link-to-advert"}
        isError={false}
        type={"text"}
        name={"link"}
        handleChange={handleChange}
      />
      <FormInput
        label={"Description"}
        placeholder={"Describe Your Advert"}
        isError={false}
        type={"text"}
        name={"description"}
        handleChange={handleChange}
        useTextArea={true}
      />
      <FormInput
        label={"Upload Banner"}
        placeholder={"Describe Your Advert"}
        isError={false}
        type={"file"}
        name={"banner"}
        handleChange={handleChange}
      />
      <FormInput
        label={"Duration (in Days)"}
        placeholder={"Number of days you want your advert to use on gigsflix"}
        isError={false}
        type={"number"}
        name={"duration"}
        handleChange={handleChange}
      />
    </div>
  );
};

export default CreateAdvertisement;
