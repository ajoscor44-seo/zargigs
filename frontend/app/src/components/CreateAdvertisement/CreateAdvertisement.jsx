import React, { useState, useRef } from "react";
import { IoClose } from "react-icons/io5";
import FormInput from "../FormInput/FormInput";
import axios from "axios";
import { uploadFileToSupabase } from "../../config/supabase.config";
import PayAmountBar from "../PayAmountBar/PayAmountBar";
import { FiUploadCloud, FiCheck, FiAlertCircle, FiImage, FiCalendar } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa6";

const CreateAdvertisement = ({ setCreatingAdvert }) => {
  const [imagePercentage, setImagePercentage] = useState(0);
  const [imageError, setImageError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [advertData, setAdvertData] = useState({
    name: "",
    description: "",
    duration: 1,
    banner: "",
    link: "",
  });

  const amountToPay = advertData.duration * 1500;

  const handleChange = (e) => {
    setAdvertData({
      ...advertData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type.startsWith("image") && file.size > 5 * 1024 * 1024) {
      setImageError("The photo is too large. Maximum size is 5 MB.");
      return;
    }

    if (!file.type.startsWith("image")) {
      setImageError("Only image files are allowed for advert banners.");
      return;
    }

    uploadMedia(file);
  };

  const uploadMedia = async (file) => {
    if (!file) return;
    setIsUploading(true);
    setImagePercentage(10);
    setImageError(null);
    try {
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const downloadUrl = await uploadFileToSupabase(
        "advertisements",
        fileName,
        file,
        (progress) => setImagePercentage(progress)
      );
      setImageError(null);
      setImagePercentage(100);
      setIsUploading(false);
      setAdvertData((prev) => ({
        ...prev,
        banner: downloadUrl,
      }));
    } catch (error) {
      console.error("Upload error:", error);
      setIsUploading(false);
      setImagePercentage(0);
      setImageError(error.message || "Failed to upload image.");
    }
  };

  const createAdvertisement = async () => {
    try {
      if (
        !advertData.banner ||
        !advertData.name ||
        !advertData.description ||
        !advertData.duration ||
        !advertData.link
      ) {
        return alert("Please complete all required advert fields.");
      }
      const response = await axios.post("/api/v1/advertisements", advertData);
      alert(`${response.data.message || "Advert created successfully!"}. Thanks for choosing DocsZAR!`);
      return setCreatingAdvert(false);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Oops an error occurred!");
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Advert Creation Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100/80">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div>
                <h2 className="font-extrabold text-lg text-slate-900">
                  New Advertisement Setup
                </h2>
                <p className="text-xs text-slate-400">
                  Fill in your campaign details and upload a high-quality banner
                </p>
              </div>
              <button
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-colors cursor-pointer"
                onClick={() => setCreatingAdvert(false)}
              >
                <IoClose size={22} />
              </button>
            </div>

            <div className="space-y-4">
              <FormInput
                label={"Campaign Name"}
                placeholder={"e.g. Mega Summer Promo"}
                isError={false}
                type={"text"}
                name={"name"}
                handleChange={handleChange}
              />

              <FormInput
                label={"Destination URL / WhatsApp"}
                placeholder={"https://wa.me/... or https://yoursite.com"}
                isError={false}
                type={"text"}
                name={"link"}
                handleChange={handleChange}
                note={"Users will be redirected to this link when they click on your advert."}
              />

              <FormInput
                label={"Description"}
                placeholder={"Tell users why they should check out your offer..."}
                isError={false}
                type={"text"}
                name={"description"}
                handleChange={handleChange}
                useTextArea={true}
              />

              {/* Banner Upload Box */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  Advert Banner Image
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-emerald-50/30 group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />

                  {advertData.banner ? (
                    <div className="relative w-full max-h-48 overflow-hidden rounded-xl">
                      <img
                        src={advertData.banner}
                        alt="Advert Preview"
                        className="w-full h-40 object-cover rounded-xl"
                      />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
                        Click to replace banner
                      </div>
                    </div>
                  ) : isUploading ? (
                    <div className="py-4 flex flex-col items-center gap-2">
                      <FaSpinner className="animate-spin text-emerald-600" size={28} />
                      <span className="text-xs font-bold text-emerald-600">
                        Uploading Banner... {imagePercentage}%
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 group-hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition-colors">
                        <FiUploadCloud size={24} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800">
                          Click to upload banner photo
                        </span>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Recommended: 1200x630 PNG, JPG or WEBP (Max 5MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {imageError && (
                  <p className="text-xs font-bold text-rose-500 mt-1.5 flex items-center gap-1">
                    <FiAlertCircle size={14} />
                    <span>{imageError}</span>
                  </p>
                )}
              </div>

              {/* Duration Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  Campaign Duration (Days)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 3, 7, 30].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setAdvertData({ ...advertData, duration: days })}
                      className={`py-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                        advertData.duration === days
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {days} {days === 1 ? "Day" : "Days"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Campaign Preview & Summary */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100/80 space-y-5">
            <h3 className="font-extrabold text-base text-slate-900">
              Live Preview
            </h3>

            {/* Simulated Banner Card */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50">
              {advertData.banner ? (
                <img
                  src={advertData.banner}
                  alt="Advert Preview"
                  className="w-full h-36 object-cover"
                />
              ) : (
                <div className="w-full h-36 bg-slate-100 flex flex-col items-center justify-center text-slate-400 gap-1">
                  <FiImage size={24} />
                  <span className="text-[11px] font-semibold">Banner preview</span>
                </div>
              )}
              <div className="p-4 space-y-2">
                <h4 className="font-bold text-sm text-slate-900 truncate">
                  {advertData.name || "Your Campaign Title"}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {advertData.description || "Your campaign description will appear here across member dashboards and task feeds..."}
                </p>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                    Sponsored Banner
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {advertData.duration} {advertData.duration === 1 ? "Day" : "Days"}
                  </span>
                </div>
              </div>
            </div>

            {/* Campaign Cost Summary */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Daily Rate:</span>
                <span className="font-mono font-bold text-slate-700">₦1,500 / day</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Duration:</span>
                <span className="font-mono font-bold text-slate-700">{advertData.duration} {advertData.duration === 1 ? "day" : "days"}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-800">Total Investment:</span>
                <span className="text-lg font-black text-emerald-600 font-mono">₦{amountToPay.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={createAdvertisement}
              disabled={
                !advertData.banner ||
                !advertData.name ||
                !advertData.description ||
                !advertData.duration ||
                !advertData.link
              }
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
            >
              <FiCheck size={18} />
              <span>Pay & Launch Advert (₦{amountToPay.toLocaleString()})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAdvertisement;

