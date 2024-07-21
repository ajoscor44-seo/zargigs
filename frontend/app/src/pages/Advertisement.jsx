import React, { useState } from "react";
import BackNav from "../components/BackNav/BackNav";
import FormInput from "../components/FormInput/FormInput";
import PayAmountBar from "../components/PayAmountBar/PayAmountBar";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";

const Advertisement = () => {
  const [advertData, setAdvertData] = useState({
    name: "",
    description: "",
    duration: 1,
    banner: "",
    link: "",
  });
  const amountToPay = advertData.duration * 1500;

  const handleChange = (e) => {
    setAdvertData({
      ...advertData,
      [e.target.name]: e.target.value,
    });
  };

  const uploadAdvert = () => {
    try {
      //
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <BackNav pageName={"Manage Advertisement"} />
      <div className="underBackNav flex flex-col border justify-center items-center px-2 mb-32">
        <h1 className="my-5 font-bold text-xl">Post Advert On Gigsflix</h1>
        <div className="shadow-2xl border flex flex-col w-full px-5 gap-3 py-5">
          <h2>Advert Setup</h2>
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
            placeholder={
              "Number of days you want your advert to use on gigsflix"
            }
            isError={false}
            type={"number"}
            name={"duration"}
            handleChange={handleChange}
          />
        </div>
      </div>
      <PayAmountBar
        feeTitle={"Advertisement Fee:"}
        fee={amountToPay}
        disable={true}
        btnText={"Pay For Advert"}
        handleClick={uploadAdvert}
      />
      <ClientMenuBar />
    </div>
  );
};

export default Advertisement;
