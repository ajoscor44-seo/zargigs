import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import months from "../data/months";
import ClientNavbar from "../components/ClientNavbar/ClientNavbar";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";
import SetLocation from "../components/SetLocation/SetLocation";
import SetBirthReligion from "../components/Setbirthreliogion/Setbirthreliogion";
import UploadProfilePic from "../components/UploadProfilePic/UploadProfilePic";
import axios from "axios";
import SetBankDetails from "../components/SetBankDetails/SetBankDetails";
import statesData from "../data/states";
import { FiMapPin, FiCamera, FiCreditCard, FiUserCheck } from "react-icons/fi";

const UploadInfoPage = () => {
  const { currentUser, fetchUserData, adminData } = useAuth();
  const history = useHistory();
  const [activePage, setActivePage] = useState("location");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(["Day"]);

  const currentYear = new Date().getFullYear() - 13;
  const years = [...Array.from({ length: 100 }, (_, i) => currentYear - i)];

  const [image, setImage] = useState(undefined);
  const [religion, setReligion] = useState(undefined);
  const [bank, setBank] = useState(undefined);
  const [userLocation, setUserLocation] = useState({});
  const [bankDetail, setBankDetail] = useState({});
  const [userDOB, setUserDOB] = useState({
    day: new Date().getDate(),
    month: months[new Date().getMonth() + 1] || "January",
    year: new Date().getFullYear() - 18,
  });
  const [selectedGender, setSelectedGender] = useState("Male");

  useEffect(() => {
    const updateDaysInMonth = () => {
      const monthIndex = months.indexOf(userDOB?.month);
      const year = parseInt(userDOB?.year);
      if (monthIndex > 0 && year) {
        const daysInMonth = new Date(year, monthIndex, 0).getDate();
        setDays([
          "Day",
          ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
        ]);
      }
    };
    updateDaysInMonth();
  }, [userDOB?.month, userDOB?.year]);

  const uploadUserDetails = async () => {
    setLoading(true);
    if (!currentUser?.email && !currentUser?._id) {
      return history.push("/login");
    }
    if (!selectedGender) {
      setLoading(false);
      return setError("Please select a gender.");
    }
    if (!userLocation?.state || !userLocation?.LGA) {
      setLoading(false);
      return setError("Please select your State and LGA.");
    }
    if (!userDOB?.day || !userDOB?.month || !userDOB?.year) {
      setLoading(false);
      return setError("Please specify your date of birth.");
    }

    try {
      const formData = {
        image,
        religion,
        gender: selectedGender,
        location: userLocation,
        dateOfBirth: userDOB,
        bankDetails: {
          bankName: bank,
          ...bankDetail,
        },
        userEarnings: {
          totalEarnings: 0,
          pendingEarnings: 0,
          amountSpent: 0,
          amountWithdrawn: 0,
          balance: 0,
        },
      };

      const response = await axios.post("/api/v1/user/user-details", formData);
      const data = response.data;
      if (data?.failed) {
        if (data.message === "User's details already exists.") {
          await fetchUserData();
          return history.push("/dashboard");
        }
        setLoading(false);
        return setError(data.message);
      }
      await fetchUserData();
      setLoading(false);
      return history.push("/dashboard");
    } catch (err) {
      setLoading(false);
      return setError("Failed to complete account setup.");
    }
  };

  const steps = [
    { id: "location", label: "Location", icon: <FiMapPin size={16} /> },
    { id: "upload-profile-pic", label: "Photo", icon: <FiCamera size={16} /> },
    { id: "bank-details", label: "Bank", icon: <FiCreditCard size={16} /> },
    { id: "birth-religion", label: "Details", icon: <FiUserCheck size={16} /> },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === activePage);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-28 text-slate-800">
      <ClientNavbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Onboarding Perks & Overview Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-800 space-y-6">
              <div>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[11px] font-bold uppercase tracking-wider">
                  Quick Onboarding
                </span>
                <h2 className="text-2xl font-black text-white tracking-tight mt-3">
                  Setup Your Earner Profile
                </h2>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Complete these essential details to get verified, unlock higher paying tasks, and enable automated payouts.
                </p>
              </div>

              <div className="space-y-4 pt-2 border-t border-slate-800">
                <div className="flex items-start gap-3 text-xs text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <strong className="text-white block font-bold">Targeted Task Matching</strong>
                    <span className="text-[11px] text-slate-400">Receive tasks and campaigns specific to your state and LGA.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <strong className="text-white block font-bold">Verified Account Badge</strong>
                    <span className="text-[11px] text-slate-400">Profile photos help advertisers trust and rapidly approve your work.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <strong className="text-white block font-bold">Instant Nigerian Bank Payouts</strong>
                    <span className="text-[11px] text-slate-400">Direct wallet-to-bank settlements to any commercial or microfinance bank.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Step Form */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step Indicator */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100/80">
              <div className="flex items-center justify-between relative mb-2">
                <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-slate-200 -z-0 rounded-full" />
                <div
                  className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-emerald-500 -z-0 rounded-full transition-all duration-300"
                  style={{
                    width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
                  }}
                />

                {steps.map((step, idx) => {
                  const isCompleted = idx < currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  return (
                    <div
                      key={step.id}
                      className="flex flex-col items-center relative z-10"
                    >
                      <div
                        className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs transition-all shadow-sm ${
                          isCurrent
                            ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-110"
                            : isCompleted
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-white text-slate-400 border border-slate-200"
                        }`}
                      >
                        {step.icon}
                      </div>
                      <span
                        className={`text-[10px] font-bold mt-1.5 ${
                          isCurrent
                            ? "text-emerald-700"
                            : isCompleted
                            ? "text-slate-600"
                            : "text-slate-400"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 text-center animate-shake">
                {error}
              </div>
            )}

            {/* Step Content */}
            <div>
              {activePage === "location" ? (
                <SetLocation
                  setActivePage={setActivePage}
                  setError={setError}
                  userLocation={userLocation}
                  setUserLocation={setUserLocation}
                  selectedGender={selectedGender}
                  setSelectedGender={setSelectedGender}
                  statesData={statesData}
                />
              ) : activePage === "bank-details" ? (
                <SetBankDetails
                  setActivePage={setActivePage}
                  selectedBank={bank}
                  setSelectedBank={setBank}
                  bankDetails={bankDetail}
                  setBankDetails={setBankDetail}
                  setError={setError}
                />
              ) : activePage === "birth-religion" ? (
                <SetBirthReligion
                  setActivePage={setActivePage}
                  selectedReligion={religion}
                  setSelectedReligion={setReligion}
                  userDOB={userDOB}
                  setUserDOB={setUserDOB}
                  years={years}
                  months={months}
                  days={days}
                  uploadUserDetails={uploadUserDetails}
                  loading={loading}
                />
              ) : (
                <UploadProfilePic
                  setActivePage={setActivePage}
                  setImage={setImage}
                  image={image}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <ClientMenuBar />
    </div>
  );
};

export default UploadInfoPage;

