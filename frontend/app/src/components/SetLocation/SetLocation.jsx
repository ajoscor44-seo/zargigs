import React from "react";
import { useAuth } from "../../context/AuthContext";
import { FiCheckCircle, FiMapPin, FiUser, FiArrowRight } from "react-icons/fi";

const SetLocation = ({
  setActivePage,
  setError,
  userLocation,
  setUserLocation,
  selectedGender,
  setSelectedGender,
  statesData,
}) => {
  const { currentUser, adminData } = useAuth();

  const genders = ["Male", "Female", "Other"];
  const states = statesData?.map((state) => state.name) || [];
  const currentLgas =
    statesData?.find((state) => state.name === userLocation?.state)?.lgas?.map(
      (lga) => lga.name
    ) || [];

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
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100/80 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <FiCheckCircle size={28} />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900">
          Welcome, {currentUser?.firstname || "Member"}!
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
          Your account is ready! Let's personalize your experience by setting your gender and location so you receive tasks targeted to your area.
        </p>
      </div>

      <div className="space-y-4 pt-2">
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1.5">
            <FiUser size={14} className="text-emerald-600" />
            <span>Gender</span>
          </label>
          <select
            value={selectedGender}
            onChange={handleGenderChange}
            className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-800 font-semibold text-sm px-4 py-3.5 rounded-2xl border border-slate-200 focus:border-emerald-500 outline-none transition-all"
          >
            {genders.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1.5">
            <FiMapPin size={14} className="text-emerald-600" />
            <span>State of Residence</span>
          </label>
          <select
            name="state"
            value={userLocation?.state || ""}
            onChange={handleLocationChange}
            className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-800 font-semibold text-sm px-4 py-3.5 rounded-2xl border border-slate-200 focus:border-emerald-500 outline-none transition-all"
          >
            <option value="">Select State</option>
            {states.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {userLocation?.state && (
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              Local Government Area (LGA)
            </label>
            <select
              name="LGA"
              value={userLocation?.LGA || ""}
              onChange={handleLocationChange}
              className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-800 font-semibold text-sm px-4 py-3.5 rounded-2xl border border-slate-200 focus:border-emerald-500 outline-none transition-all"
            >
              <option value="">Select LGA</option>
              {currentLgas.map((lga) => (
                <option key={lga} value={lga}>
                  {lga}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <button
        onClick={setLocation}
        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
      >
        <span>Continue to Profile Photo</span>
        <FiArrowRight size={16} />
      </button>
    </div>
  );
};

export default SetLocation;

