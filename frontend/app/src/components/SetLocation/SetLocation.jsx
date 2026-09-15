import React from "react";
import { useAuth } from "../../context/AuthContext";
import { FiCheckCircle, FiMapPin, FiUser, FiArrowRight } from "react-icons/fi";
import { FaAndroid, FaApple, FaMobileScreenButton } from "react-icons/fa6";

const SetLocation = ({
  setActivePage,
  setError,
  userLocation,
  setUserLocation,
  selectedGender,
  setSelectedGender,
  selectedDevice,
  setSelectedDevice,
  statesData,
}) => {
  const { currentUser } = useAuth();

  const genders = ["Male", "Female", "Other"];
  const states = statesData?.map((state) => state.name) || [];
  const currentLgas =
    statesData?.find((state) => state.name === userLocation?.state)?.lgas?.map(
      (lga) => lga.name
    ) || [];

  const deviceOptions = [
    {
      id: "Android",
      label: "Android",
      sub: "Google Play Store",
      icon: <FaAndroid className="text-emerald-500" size={18} />,
    },
    {
      id: "iPhone",
      label: "iPhone (iOS)",
      sub: "Apple App Store",
      icon: <FaApple className="text-slate-800" size={18} />,
    },
    {
      id: "Both",
      label: "Both",
      sub: "Android & iPhone",
      icon: <FaMobileScreenButton className="text-emerald-600" size={18} />,
    },
  ];

  const handleGenderChange = (e) => {
    setSelectedGender(e.target.value);
  };

  const handleLocationChange = (e) => {
    setUserLocation({
      ...userLocation,
      [e.target.name]: e.target.value,
    });
  };

  const setLocation = () => {
    if (!selectedGender) {
      return setError("Please select your gender.");
    }
    if (!selectedDevice) {
      return setError("Please select your phone operating system (Android or iPhone).");
    }
    if (!userLocation?.state) {
      return setError("Please select your state of residence.");
    }
    if (!userLocation?.LGA) {
      return setError("Please select your local government area.");
    }

    setError(null);
    setActivePage("upload-profile-pic");
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-100/80 space-y-4">
      <div className="text-center space-y-1">
        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
          <FiCheckCircle size={20} />
        </div>
        <h2 className="text-lg font-black text-slate-900 tracking-tight">
          Welcome, {currentUser?.firstname || "Earner"}!
        </h2>
        <p className="text-[11px] sm:text-xs text-slate-500 max-w-sm mx-auto">
          Set your device type and location to receive targeted microtasks & app download gigs.
        </p>
      </div>

      <div className="space-y-3.5 pt-1">
        {/* Device Selection (Android vs iPhone) */}
        <div>
          <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <FaMobileScreenButton size={12} className="text-emerald-600" />
              <span>What Phone Do You Use?</span>
            </span>
            <span className="text-[9px] text-slate-400 font-normal">For targeted app tasks</span>
          </label>

          <div className="grid grid-cols-3 gap-2">
            {deviceOptions.map((opt) => {
              const isSelected = (selectedDevice || "Android") === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedDevice(opt.id)}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-500 text-emerald-950 font-bold"
                      : "border-slate-200 bg-slate-50 hover:bg-slate-100/70 text-slate-700"
                  }`}
                >
                  <div className="p-1 rounded-lg bg-white shadow-2xs">
                    {opt.icon}
                  </div>
                  <span className="text-xs font-bold leading-tight">{opt.label}</span>
                  <span className="text-[9px] text-slate-400 leading-none">{opt.sub}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Gender Selection */}
        <div>
          <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
            <FiUser size={12} className="text-emerald-600" />
            <span>Gender</span>
          </label>
          <select
            value={selectedGender}
            onChange={handleGenderChange}
            className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-800 font-semibold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-all cursor-pointer"
          >
            {genders.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* Location Selection: State & LGA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
              <FiMapPin size={12} className="text-emerald-600" />
              <span>State</span>
            </label>
            <select
              name="state"
              value={userLocation?.state || ""}
              onChange={handleLocationChange}
              className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-800 font-semibold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-all cursor-pointer"
            >
              <option value="">Select State</option>
              {states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Local Govt (LGA)
            </label>
            <select
              name="LGA"
              disabled={!userLocation?.state}
              value={userLocation?.LGA || ""}
              onChange={handleLocationChange}
              className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-800 font-semibold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-all disabled:opacity-50 cursor-pointer"
            >
              <option value="">Select LGA</option>
              {currentLgas.map((lga) => (
                <option key={lga} value={lga}>
                  {lga}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={setLocation}
        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs sm:text-sm"
      >
        <span>Continue to Photo</span>
        <FiArrowRight size={14} />
      </button>
    </div>
  );
};

export default SetLocation;
