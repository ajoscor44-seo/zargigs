import React, { useState } from "react";
import BackNav from "../components/BackNav/BackNav";
import PayAmountBar from "../components/PayAmountBar/PayAmountBar";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";
import AdvertisementList from "../components/AdvertisementList/AdvertisementList";
import CreateAdvertisement from "../components/CreateAdvertisement/CreateAdvertisement";

const Advertisement = () => {
  const [creatingAdvert, setCreatingAdvert] = useState(false);
  const [advertData, setAdvertData] = useState({
    name: "",
    description: "",
    duration: 1,
    banner: "",
    link: "",
  });
  const amountToPay = advertData.duration * 1500;

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
      <div className="underBackNav flex flex-col justify-center items-center px-2 mb-32">
        <h1 className="mt-4 mb-2 font-bold text-xl">Post Advert On Gigsflix</h1>
        {creatingAdvert ? (
          <CreateAdvertisement
            advertData={advertData}
            setAdvertData={setAdvertData}
            setCreatingAdvert={setCreatingAdvert}
          />
        ) : (
          <AdvertisementList setCreatingAdvert={setCreatingAdvert} />
        )}
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
