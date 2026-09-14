import React from "react";
import religions from "../../data/religions";
import { useAuth } from "../../context/AuthContext";
import { FaSpinner } from "react-icons/fa6";
import { FiCalendar, FiArrowLeft, FiCheck } from "react-icons/fi";

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
  loading,
}) => {
  const { adminData } = useAuth();

  const handleReligionChange = (e) => {
    setSelectedReligion(e.target.value);
  };

  const handleDOBChange = (e) => {
    setUserDOB({
      ...userDOB,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100/80 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <button
          onClick={() => setActivePage("bank-details")}
          className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
        >
          <FiArrowLeft size={16} />
          <span>Back</span>
        </button>
      </div>

      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <FiCalendar size={28} />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900">
          Birthday & Preferences
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
          Tell us a little more about yourself so we can match you with age and community-tailored social tasks.
        </p>
      </div>

      <div className="space-y-4 pt-2">
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5">
            Date of Birth
          </label>
          <div className="grid grid-cols-3 gap-2">
            <select
              name="day"
              value={userDOB?.day || ""}
              onChange={handleDOBChange}
              className="bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-800 font-semibold text-xs sm:text-sm px-3 py-3.5 rounded-2xl border border-slate-200 focus:border-emerald-500 outline-none transition-all"
            >
              {days.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              name="month"
              value={userDOB?.month || ""}
              onChange={handleDOBChange}
              className="bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-800 font-semibold text-xs sm:text-sm px-3 py-3.5 rounded-2xl border border-slate-200 focus:border-emerald-500 outline-none transition-all"
            >
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <select
              name="year"
              value={userDOB?.year || ""}
              onChange={handleDOBChange}
              className="bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-800 font-semibold text-xs sm:text-sm px-3 py-3.5 rounded-2xl border border-slate-200 focus:border-emerald-500 outline-none transition-all"
            >
              <option value="">Year</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5">
            Religion / Belief (Optional)
          </label>
          <select
            value={selectedReligion || ""}
            onChange={handleReligionChange}
            className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-800 font-semibold text-sm px-4 py-3.5 rounded-2xl border border-slate-200 focus:border-emerald-500 outline-none transition-all"
          >
            <option value="">Select Religion</option>
            {religions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={uploadUserDetails}
        disabled={loading}
        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm disabled:opacity-50"
      >
        {loading ? (
          <>
            <FaSpinner className="animate-spin" size={18} />
            <span>Completing Setup...</span>
          </>
        ) : (
          <>
            <FiCheck size={18} />
            <span>Complete & Enter Dashboard</span>
          </>
        )}
      </button>
    </div>
  );
};

export default SetBirthReligion;

