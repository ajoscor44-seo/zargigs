import React, { useState, useEffect } from "react";
import ClientLayout from "../components/ClientLayout/ClientLayout";
import { useAuth } from "../context/AuthContext";
import statesData from "../data/states";
import { userService } from "../services/supabaseService";
import { FiMapPin, FiCheck, FiSave, FiAlertCircle } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa6";

const UpdateLocation = () => {
  const { currentUser, fetchUserData } = useAuth();
  const [selectedState, setSelectedState] = useState("");
  const [selectedLga, setSelectedLga] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (currentUser) {
      const state =
        currentUser.location?.state || currentUser.state || "";
      const lga =
        currentUser.location?.LGA ||
        currentUser.location?.lga ||
        currentUser.lga ||
        "";
      setSelectedState(state);
      setSelectedLga(lga);
    }
  }, [currentUser]);

  const states = statesData?.map((s) => s.name) || [];
  const currentLgas =
    statesData?.find((s) => s.name === selectedState)?.lgas?.map((l) => l.name) || [];

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedLga("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedState) {
      setMessage({ type: "error", text: "Please select your state." });
      return;
    }
    if (!selectedLga) {
      setMessage({ type: "error", text: "Please select your LGA." });
      return;
    }

    try {
      setSaving(true);
      setMessage({ type: "", text: "" });

      const userId = currentUser?.id || currentUser?._id;
      if (userId) {
        await userService.updateProfile(userId, {
          state: selectedState,
          lga: selectedLga,
        });
      }

      try {
        await axios.put("/api/v1/user/update-details", {
          location: {
            state: selectedState,
            lga: selectedLga,
            LGA: selectedLga,
          },
        });
      } catch {}

      setMessage({ type: "success", text: "Location updated successfully!" });
      await fetchUserData();
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: err?.message || "Failed to update location.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <ClientLayout>
      <main className="w-full font-primary">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Update Location
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Ensure your state and LGA are accurate to receive geo-targeted tasks and advertiser campaigns
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form Settings */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSave} className="space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100/80">
                <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <FiMapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">
                      Target Location Settings
                    </h3>
                    <p className="text-xs text-slate-400">
                      Select your state and LGA to receive localized tasks and offers
                    </p>
                  </div>
                </div>

                {/* Feedback alert */}
                {message.text && (
                  <div
                    className={`p-4 rounded-2xl flex items-center gap-2 text-sm font-semibold mb-6 ${
                      message.type === "success"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                  >
                    {message.type === "success" ? (
                      <FiCheck size={18} />
                    ) : (
                      <FiAlertCircle size={18} />
                    )}
                    <span>{message.text}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">
                      State of Residence
                    </label>
                    <select
                      value={selectedState}
                      onChange={handleStateChange}
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

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">
                      Local Government Area (LGA)
                    </label>
                    <select
                      value={selectedLga}
                      onChange={(e) => setSelectedLga(e.target.value)}
                      disabled={!selectedState}
                      className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-800 font-semibold text-sm px-4 py-3.5 rounded-2xl border border-slate-200 focus:border-emerald-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {selectedState ? "Select LGA" : "Please select state first"}
                      </option>
                      {currentLgas.map((lga) => (
                        <option key={lga} value={lga}>
                          {lga}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <FaSpinner className="animate-spin" size={18} />
                        <span>Updating Location...</span>
                      </>
                    ) : (
                      <>
                        <FiSave size={18} />
                        <span>Save Location</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column: Geo-targeting Perks & Info Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-800 space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <FiMapPin size={24} />
              </div>

              <div>
                <h3 className="font-extrabold text-lg text-white">
                  Why Location Matters
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Many advertisers specify target states and LGAs for local campaigns, physical promotions, and surveys.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 text-xs text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <span><strong>Higher Priority:</strong> Users with verified state and LGA settings receive first access to regional tasks.</span>
                </div>

                <div className="flex items-start gap-3 text-xs text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <span><strong>Verified Demographic:</strong> Helps prevent task submission rejections caused by location mismatches.</span>
                </div>

                <div className="flex items-start gap-3 text-xs text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <span><strong>Privacy Protected:</strong> Your exact street address is never shared with advertisers or third parties.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </ClientLayout>
  );
};

export default UpdateLocation;

