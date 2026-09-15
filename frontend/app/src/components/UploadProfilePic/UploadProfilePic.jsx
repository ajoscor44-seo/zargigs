import React, { useRef, useState } from "react";
import { FiCamera, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa6";
import { uploadFileToSupabase } from "../../config/supabase.config";

const UploadProfilePic = ({ setActivePage, image, setImage }) => {
  const fileInputRef = useRef(null);
  const [imageError, setImageError] = useState(null);
  const [imagePercentage, setImagePercentage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const selectProfilePic = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      setImageError("The photo is too large. Maximum size is 4MB.");
      return;
    }
    uploadProfilePic(file);
  };

  const uploadProfilePic = async (file) => {
    if (!file) return;
    setIsUploading(true);
    setImagePercentage(15);
    setImageError(null);
    try {
      const fileName = `avatar_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const downloadUrl = await uploadFileToSupabase(
        "profile_pics",
        fileName,
        file,
        (progress) => setImagePercentage(progress)
      );
      setImage(downloadUrl);
      setImagePercentage(100);
      setIsUploading(false);
      setImageError(null);
    } catch (error) {
      console.error("Upload error:", error);
      setIsUploading(false);
      setImagePercentage(null);
      setImageError(error.message || "Failed to upload photo.");
    }
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-100/80 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <button
          onClick={() => setActivePage("location")}
          className="p-1 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
        >
          <FiArrowLeft size={14} />
          <span>Back</span>
        </button>

        <button
          onClick={() => setActivePage("bank-details")}
          className="text-xs font-bold text-slate-400 hover:text-emerald-600 transition-colors py-0.5 px-2"
        >
          Skip for now
        </button>
      </div>

      <div className="text-center space-y-1">
        <h2 className="text-lg font-black text-slate-900 tracking-tight">
          Profile Photo
        </h2>
        <p className="text-[11px] sm:text-xs text-slate-500 max-w-sm mx-auto">
          Add an avatar so advertisers recognize your task submissions.
        </p>
      </div>

      {imageError && (
        <p className="text-xs font-bold text-rose-500 text-center">
          {imageError}
        </p>
      )}

      {/* Compact Avatar Picker */}
      <div className="flex justify-center py-2">
        <div
          onClick={selectProfilePic}
          className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 hover:border-emerald-500 flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group shadow-inner"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept="image/*"
            className="hidden"
          />

          {image ? (
            <img
              src={image}
              alt="Uploaded Avatar"
              className="w-full h-full object-cover"
            />
          ) : isUploading ? (
            <div className="flex flex-col items-center gap-1 text-emerald-600">
              <FaSpinner className="animate-spin" size={20} />
              <span className="text-[10px] font-bold">{imagePercentage}%</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 text-slate-400 group-hover:text-emerald-600 transition-colors">
              <FiCamera size={20} />
              <span className="text-[10px] font-bold">Choose Photo</span>
            </div>
          )}

          {image && (
            <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity">
              Change
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => setActivePage("bank-details")}
        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs sm:text-sm"
      >
        <span>{image ? "Use Photo & Continue" : "Continue"}</span>
        <FiArrowRight size={14} />
      </button>
    </div>
  );
};

export default UploadProfilePic;
