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
    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-100/80 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <button
          onClick={() => setActivePage("bank-details")}
          className="p-1 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
        >
          <FiArrowLeft size={14} />
          <span>Back</span>
        </button>
      </div>

      <div className="text-center space-y-1">
        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
          <FiCalendar size={20} />
        </div>
        <h2 className="text-lg font-black text-slate-900 tracking-tight">
          Birthday & Preferences
        </h2>
        <p className="text-[11px] sm:text-xs text-slate-500 max-w-sm mx-auto">
          Tell us a little more about yourself so we can match you with age and community-tailored tasks.
        </p>
      </div>

      <div className="space-y-3 pt-1">
        <div>
          <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
            Date of Birth
          </label>
          <div className="grid grid-cols-3 gap-2">
            <select
              name="day"
              value={userDOB?.day || ""}
              onChange={handleDOBChange}
              className="bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-800 font-semibold text-xs sm:text-sm px-2 sm:px-3 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-all cursor-pointer"
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
              className="bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-800 font-semibold text-xs sm:text-sm px-2 sm:px-3 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-all cursor-pointer"
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
              className="bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-800 font-semibold text-xs sm:text-sm px-2 sm:px-3 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-all cursor-pointer"
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
          <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
            Religion / Belief (Optional)
          </label>
          <select
            value={selectedReligion || ""}
            onChange={handleReligionChange}
            className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-800 font-semibold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-all cursor-pointer"
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
        type="button"
        onClick={uploadUserDetails}
        disabled={loading}
        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs sm:text-sm disabled:opacity-50"
      >
        {loading ? (
          <>
            <FaSpinner className="animate-spin" size={16} />
            <span>Completing Setup...</span>
          </>
        ) : (
          <>
            <FiCheck size={16} />
            <span>Complete & Enter Dashboard</span>
          </>
        )}
      </button>
    </div>
  );
};

export default SetBirthReligion;

