import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import months from "../data/months";
import ClientNavbar from "../components/ClientNavbar/ClientNavbar";
import SetLocation from "../components/SetLocation/SetLocation";
import SetBirthReligion from "../components/Setbirthreliogion/Setbirthreliogion";
import UploadProfilePic from "../components/UploadProfilePic/UploadProfilePic";
import SetBankDetails from "../components/SetBankDetails/SetBankDetails";
import statesData from "../data/states";
import { userService, emailService } from "../services/supabaseService";
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

  const [image, setImage] = useState(() => {
    return (
      currentUser?.avatarUrl ||
      currentUser?.avatar_url ||
      currentUser?.image ||
      currentUser?.googleAvatar ||
      currentUser?.user_metadata?.avatar_url ||
      currentUser?.user_metadata?.picture ||
      undefined
    );
  });
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
  const [selectedDevice, setSelectedDevice] = useState(() => {
    if (typeof navigator !== "undefined") {
      if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) return "iPhone";
      if (/Android/i.test(navigator.userAgent)) return "Android";
    }
    return "Android";
  });

  useEffect(() => {
    if (currentUser) {
      const detected =
        currentUser.avatarUrl ||
        currentUser.avatar_url ||
        currentUser.image ||
        currentUser.googleAvatar ||
        currentUser.user_metadata?.avatar_url ||
        currentUser.user_metadata?.picture;
      if (detected && !image) {
        setImage(detected);
      }
    }
  }, [currentUser]);

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
    setError(null);

    const userId = currentUser?.id || currentUser?._id;
    if (!userId) {
      return history.push("/login");
    }
    if (!selectedGender) {
      setLoading(false);
      return setError("Please select a gender.");
    }
    if (!selectedDevice) {
      setLoading(false);
      return setError("Please select your phone operating system (Android or iPhone).");
    }
    if (!userLocation?.state || (!userLocation?.LGA && !userLocation?.lga)) {
      setLoading(false);
      return setError("Please select your State and LGA.");
    }

    const cleanLga = userLocation?.LGA || userLocation?.lga || "";
    const cleanState = userLocation?.state || "";

    try {
      await userService.updateProfile(userId, {
        gender: selectedGender,
        device: selectedDevice,
        deviceType: selectedDevice,
        state: cleanState,
        lga: cleanLga,
        religion: religion || "",
        avatarUrl: image || currentUser?.avatarUrl,
        bankName: bank || bankDetail?.bankName,
        accountNumber: bankDetail?.accountNumber,
        accountName: bankDetail?.accountName,
        isMember: false, // Strictly Free tier by default
      });

      // Send welcome email
      if (currentUser?.email) {
        emailService.sendWelcomeEmail({
          to: currentUser.email,
          name: currentUser.firstname || currentUser.username || "Earner",
        }).catch(() => {});
      }

      await fetchUserData();
      setLoading(false);
      history.replace("/dashboard");
    } catch (err) {
      setLoading(false);
      return setError(err.message || "Failed to complete account setup.");
    }
  };

  const steps = [
    { id: "location", label: "Profile", icon: <FiMapPin size={13} /> },
    { id: "upload-profile-pic", label: "Photo", icon: <FiCamera size={13} /> },
    { id: "bank-details", label: "Bank", icon: <FiCreditCard size={13} /> },
    { id: "birth-religion", label: "Details", icon: <FiUserCheck size={13} /> },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === activePage);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col justify-between">
      <ClientNavbar />

      <main className="max-w-xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 flex-1 flex flex-col justify-center">
        {/* Compact Step Progress Bar */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-slate-100/80 mb-3 sm:mb-4">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-slate-100 rounded-full" />
            <div
              className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-emerald-500 rounded-full transition-all duration-300"
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
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center font-bold text-[11px] transition-all ${
                      isCurrent
                        ? "bg-emerald-600 text-white shadow-xs scale-105"
                        : isCompleted
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-white text-slate-400 border border-slate-200"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <span
                    className={`text-[9px] sm:text-[10px] font-bold mt-1 ${
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
          <div className="mb-3 p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 text-center animate-shake">
            {error}
          </div>
        )}

        {/* Step Content Card */}
        <div className="w-full">
          {activePage === "location" ? (
            <SetLocation
              setActivePage={setActivePage}
              setError={setError}
              userLocation={userLocation}
              setUserLocation={setUserLocation}
              selectedGender={selectedGender}
              setSelectedGender={setSelectedGender}
              selectedDevice={selectedDevice}
              setSelectedDevice={setSelectedDevice}
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
      </main>

      <div className="py-3 text-center text-[10px] text-slate-400">
        &copy; {new Date().getFullYear()} DocsZAR Technologies. All rights reserved.
      </div>
    </div>
  );
};

export default UploadInfoPage;
