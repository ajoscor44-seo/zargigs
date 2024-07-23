import React, { useEffect, useState } from "react";
import AdvertItem from "../AdvertItem/AdvertItem";
import NoData from "../NoData/NoData";
import { IoAdd } from "react-icons/io5";
import axios from "axios";

const AdvertisementList = ({ setCreatingAdvert }) => {
  const [advertisementList, setAdvertisementList] = useState([]);

  const getAdvertisements = async () => {
    try {
      console.log("Get Advertisement");
      // const advertisements = await axios.get("/api/v1/")
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAdvertisements();
  }, []);

  return (
    <div className="w-full">
      <div className="flex mx-5 justify-between items-center">
        <span className="font-bold text-lg">My Advertisements</span>
        <button
          onClick={() => setCreatingAdvert(true)}
          className="rounded-full bg-green-500 text-white p-0.5"
        >
          <IoAdd size={20} />
        </button>
      </div>

      <div>
        {advertisementList.length ? (
          <div className="flex flex-col">
            {advertisementList.map((advertisement) => (
              <AdvertItem itemData={advertisement} />
            ))}
          </div>
        ) : (
          <div className="min-h-96 flex justify-center items-center">
            <NoData textBelow={"No Active Advertisement"} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvertisementList;
