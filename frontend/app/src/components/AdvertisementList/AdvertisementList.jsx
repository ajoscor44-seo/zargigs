import React, { useEffect, useState } from "react";
import AdvertItem from "../AdvertItem/AdvertItem";
import NoData from "../NoData/NoData";
import { IoAdd } from "react-icons/io5";
import axios from "axios";
import { FaSpinner } from "react-icons/fa6";

const AdvertisementList = ({ setCreatingAdvert }) => {
  const [advertisementList, setAdvertisementList] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAdvertisements = async () => {
    try {
      const response = await axios.get("/api/v1/advertisements/user");

      setAdvertisementList(response.data.data);
      return setLoading(false);
    } catch (error) {
      console.error(error);
      setAdvertisementList([]);
      setLoading(false);
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
          <div className="flex flex-col mt-3">
            {advertisementList.map((advertisement) => (
              <AdvertItem key={advertisement.id} itemData={advertisement} />
            ))}
          </div>
        ) : loading ? (
          <div className="min-h-96 flex justify-center items-center">
            <FaSpinner size={30} color="green" />
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
