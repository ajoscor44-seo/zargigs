import React, { useRef, useState } from "react";
import { FiCamera, FiArrowRight, FiArrowLeft, FiUser, FiCheck } from "react-icons/fi";
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
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100/80 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <button
          onClick={() => setActivePage("location")}
          className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
        >
          <FiArrowLeft size={16} />
          <span>Back</span>
        </button>

        <button
          onClick={() => setActivePage("bank-details")}
          className="text-xs font-bold text-slate-400 hover:text-emerald-600 transition-colors py-1 px-3"
        >
          Skip for now
        </button>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-xl font-extrabold text-slate-900">
          Upload Your Profile Photo
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
          Add a picture so other community members and advertisers can recognize your profile.
        </p>
      </div>

      {imageError && (
        <p className="text-xs font-bold text-rose-500 text-center">
          {imageError}
        </p>
      )}

      {/* Avatar Picker Circle */}
      <div className="flex justify-center py-4">
        <div
          onClick={selectProfilePic}
          className="relative w-36 h-36 rounded-3xl bg-slate-100 border-2 border-dashed border-slate-300 hover:border-emerald-500 flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group shadow-inner"
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
              <FaSpinner className="animate-spin" size={28} />
              <span className="text-[11px] font-bold">{imagePercentage}%</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-emerald-600 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                <FiCamera size={24} />
              </div>
              <span className="text-xs font-bold">Choose Photo</span>
            </div>
          )}

          {image && (
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
              Change Photo
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => setActivePage("bank-details")}
        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
      >
        <span>{image ? "Use Photo & Continue" : "Continue"}</span>
        <FiArrowRight size={16} />
      </button>
    </div>
  );
};

export default UploadProfilePic;

