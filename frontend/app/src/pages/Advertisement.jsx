import React, { useState } from "react";
import BackNav from "../components/BackNav/BackNav";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";
import AdvertisementList from "../components/AdvertisementList/AdvertisementList";
import CreateAdvertisement from "../components/CreateAdvertisement/CreateAdvertisement";

const Advertisement = () => {
  const [creatingAdvert, setCreatingAdvert] = useState(false);

  return (
    <div>
      <BackNav pageName={"Manage Advertisement"} />
      <div className="underBackNav flex flex-col justify-center items-center px-2 mb-32">
        <h1 className="mt-4 mb-2 font-bold text-xl">Post Advert On Gigsflix</h1>
        {creatingAdvert ? (
          <CreateAdvertisement setCreatingAdvert={setCreatingAdvert} />
        ) : (
          <AdvertisementList setCreatingAdvert={setCreatingAdvert} />
        )}
      </div>
      <ClientMenuBar />
    </div>
  );
};

export default Advertisement;
