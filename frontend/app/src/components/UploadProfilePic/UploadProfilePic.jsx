import React, { useRef, useState } from "react";
import { FiCamera, FiArrowRight, FiArrowLeft, FiUploadCloud } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa6";
import { useAuth } from "../../context/AuthContext";
import { uploadFileToSupabase } from "../../config/supabase.config";

const UploadProfilePic = ({ setActivePage, image, setImage }) => {
  const { currentUser } = useAuth();
  const fileInputRef = useRef(null);
  const [imageError, setImageError] = useState(null);
  const [imagePercentage, setImagePercentage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const googleAvatar =
    currentUser?.googleAvatar ||
    currentUser?.user_metadata?.avatar_url ||
    currentUser?.user_metadata?.picture ||
    (currentUser?.avatarUrl?.includes("googleusercontent.com") ? currentUser?.avatarUrl : "");

  const isGooglePhoto = Boolean(
    image &&
    (image === googleAvatar ||
      image.includes("googleusercontent.com") ||
      image.includes("google.com"))
  );

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

  const restoreGooglePhoto = () => {
    if (googleAvatar) {
      setImage(googleAvatar);
      setImageError(null);
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

      {isGooglePhoto ? (
        <div className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-50/80 border border-blue-200/70 rounded-full text-blue-700 text-xs font-semibold mx-auto w-fit shadow-2xs">
          <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Synced from your Google Account</span>
        </div>
      ) : image ? (
        <div className="flex items-center justify-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200/70 rounded-full text-emerald-700 text-xs font-semibold mx-auto w-fit">
          <span>Photo attached ✓</span>
        </div>
      ) : null}

      {imageError && (
        <p className="text-xs font-bold text-rose-500 text-center">
          {imageError}
        </p>
      )}

      {/* Compact Avatar Picker */}
      <div className="flex flex-col items-center justify-center py-2 gap-2">
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
              alt="Profile Avatar"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
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
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-bold transition-opacity gap-1">
              <FiCamera size={16} />
              <span>Change</span>
            </div>
          )}
        </div>

        {/* Action buttons below avatar */}
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={selectProfilePic}
            className="text-[11px] font-bold text-slate-600 hover:text-emerald-600 transition-colors flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 hover:border-slate-300"
          >
            <FiUploadCloud size={13} />
            <span>{image ? "Upload Different Photo" : "Upload Photo"}</span>
          </button>

          {googleAvatar && image !== googleAvatar && (
            <button
              type="button"
              onClick={restoreGooglePhoto}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 px-2.5 py-1 rounded-lg border border-blue-200 bg-blue-50/50"
            >
              <span>Use Google Photo</span>
            </button>
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
