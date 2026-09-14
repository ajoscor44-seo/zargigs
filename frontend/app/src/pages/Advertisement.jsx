import React, { useState } from "react";
import ClientLayout from "../components/ClientLayout/ClientLayout";
import AdvertisementList from "../components/AdvertisementList/AdvertisementList";
import CreateAdvertisement from "../components/CreateAdvertisement/CreateAdvertisement";
import { FiPlus, FiList } from "react-icons/fi";
import { RiMegaphoneLine } from "react-icons/ri";

const Advertisement = () => {
  const [creatingAdvert, setCreatingAdvert] = useState(false);

  return (
    <ClientLayout>
      <main className="w-full font-primary">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Manage Advertisements
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Create and monitor promotional banner campaigns across the platform
          </p>
        </div>

        {/* Header Tab Navigation */}
        <div className="bg-white rounded-3xl p-2 shadow-sm border border-slate-100/80 mb-6 flex items-center gap-2">
          <button
            onClick={() => setCreatingAdvert(false)}
            className={`flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              !creatingAdvert
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <FiList size={16} />
            <span>My Running Adverts</span>
          </button>

          <button
            onClick={() => setCreatingAdvert(true)}
            className={`flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              creatingAdvert
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <FiPlus size={16} />
            <span>Create New Advert</span>
          </button>
        </div>

        {/* Dynamic Content */}
        {creatingAdvert ? (
          <CreateAdvertisement setCreatingAdvert={setCreatingAdvert} />
        ) : (
          <AdvertisementList setCreatingAdvert={setCreatingAdvert} />
        )}
      </main>
    </ClientLayout>
  );
};

export default Advertisement;

