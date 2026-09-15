import React, { useState, useRef, useEffect } from "react";
import ClientLayout from "../components/ClientLayout/ClientLayout";
import { useAuth } from "../context/AuthContext";
import { uploadFileToSupabase } from "../config/supabase.config";
import { userService, bankService } from "../services/supabaseService";
import {
  FiCamera,
  FiUser,
  FiCreditCard,
  FiCheck,
  FiSave,
  FiAlertCircle,
} from "react-icons/fi";
import { FaSpinner } from "react-icons/fa6";

const EditProfile = () => {
  const { currentUser, fetchUserData } = useAuth();
  const fileInputRef = useRef(null);

  const [bankList, setBankList] = useState([]);
  const [verifyingBank, setVerifyingBank] = useState(false);
  const [bankVerified, setBankVerified] = useState(false);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    gender: "Male",
    bankName: "",
    accountNumber: "",
    accountName: "",
  });

  const [avatar, setAvatar] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const banks = await bankService.getBanks();
        if (banks && banks.length > 0) {
          setBankList(banks);
        }
      } catch (err) {
        console.warn("Failed to load PocketFi banks:", err.message);
      }
    };
    fetchBanks();
  }, []);

  useEffect(() => {
    if (currentUser) {
      const existingAcctName =
        currentUser.bankDetails?.accountName ||
        currentUser.walletDetails?.accountName ||
        "";
      setFormData({
        firstname: currentUser.firstname || "",
        lastname: currentUser.lastname || "",
        gender: currentUser.gender || "Male",
        device: currentUser.device || currentUser.deviceType || currentUser.device_type || "Android",
        bankName:
          currentUser.bankDetails?.bankName ||
          currentUser.walletDetails?.bankName ||
          "",
        accountNumber:
          currentUser.bankDetails?.accountNumber ||
          currentUser.walletDetails?.accountNumber ||
          "",
        accountName: existingAcctName,
      });
      if (existingAcctName) {
        setBankVerified(true);
      }
      setAvatar(currentUser.image || currentUser.avatarUrl || currentUser.avatar_url || "");
    }
  }, [currentUser]);

  const verifyAccount = async (accountNum, bankName) => {
    if (!accountNum || accountNum.length !== 10 || !bankName) return;

    try {
      setVerifyingBank(true);
      const foundBank = bankList.find((b) => b.name?.toLowerCase() === bankName?.toLowerCase());
      const bankCode = foundBank ? foundBank.code : "";

      const res = await bankService.verifyAccount(accountNum, bankCode, bankName);

      if (res?.status === "success" && res.accountName) {
        setBankVerified(true);
        setFormData((prev) => ({
          ...prev,
          accountName: res.accountName,
        }));
      } else {
        setBankVerified(false);
      }
    } catch (err) {
      setBankVerified(false);
    } finally {
      setVerifyingBank(false);
    }
  };

  const handleAvatarSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setMessage({
        type: "error",
        text: "Image is too large. Maximum size is 5MB.",
      });
      return;
    }

    try {
      setUploadingAvatar(true);
      setUploadProgress(20);
      const ext = file.name.split(".").pop() || "jpg";
      const fileName = `avatar_${currentUser?._id || currentUser?.id || Date.now()}_${Date.now()}.${ext}`;
      const downloadUrl = await uploadFileToSupabase(
        "profile_pics",
        fileName,
        file,
        (p) => setUploadProgress(p)
      );
      setAvatar(downloadUrl);
      setUploadingAvatar(false);

      // Auto-save avatar immediately to database
      if (currentUser?.id || currentUser?._id) {
        await userService.updateProfile(currentUser?.id || currentUser?._id, {
          image: downloadUrl,
          avatarUrl: downloadUrl,
        });
      }
      await fetchUserData();
      setMessage({ type: "success", text: "Profile picture updated and saved!" });
    } catch (err) {
      console.error(err);
      setUploadingAvatar(false);
      setMessage({ type: "error", text: "Failed to upload and save profile photo." });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const cleanValue = name === "accountNumber" ? value.replace(/[^0-9]/g, "") : value;

    setFormData((prev) => ({ ...prev, [name]: cleanValue }));

    if (name === "bankName" || name === "accountNumber") {
      setBankVerified(false);
      const targetAcct = name === "accountNumber" ? cleanValue : formData.accountNumber;
      const targetBank = name === "bankName" ? cleanValue : formData.bankName;

      if (targetAcct.length === 10 && targetBank) {
        verifyAccount(targetAcct, targetBank);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const payload = {
        avatarUrl: avatar || currentUser?.avatarUrl,
        image: avatar || currentUser?.image,
        firstname: formData.firstname,
        lastname: formData.lastname,
        gender: formData.gender,
        device: formData.device,
        deviceType: formData.device,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        accountName: formData.accountName,
      };

      if (currentUser?.id || currentUser?._id) {
        await userService.updateProfile(currentUser?.id || currentUser?._id, payload);
      }
      setMessage({ type: "success", text: "Profile updated successfully!" });
      await fetchUserData();
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: err?.message || "An unexpected error occurred.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <ClientLayout>
      <div className="font-primary text-slate-800 space-y-6">
        <div className="pb-2 border-b border-slate-200/70">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Edit Profile & Bank Information
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Update your personal details and destination payout bank account.
          </p>
        </div>

        {/* Feedback Alert */}
        {message.text && (
          <div
            className={`p-4 rounded-2xl flex items-center gap-2 text-sm font-semibold ${
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

        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Column (5 cols): Avatar & Personal Info */}
            <div className="md:col-span-5 space-y-6">
              {/* Avatar Section */}
              <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 flex flex-col items-center text-center">
                <div className="relative mb-3 group">
                  <img
                    src={
                      avatar ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt="Profile Avatar"
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-emerald-500/20 shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="absolute inset-0 bg-slate-900/40 hover:bg-slate-900/60 rounded-3xl flex flex-col items-center justify-center text-white transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    {uploadingAvatar ? (
                      <FaSpinner className="animate-spin text-white" size={24} />
                    ) : (
                      <>
                        <FiCamera size={22} />
                        <span className="text-[11px] font-bold mt-1">Change</span>
                      </>
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarSelect}
                    className="hidden"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 py-1.5 px-3 rounded-full bg-emerald-50 hover:bg-emerald-100/60 transition-colors cursor-pointer"
                >
                  {uploadingAvatar ? `Uploading ${uploadProgress}%...` : "Change Photo"}
                </button>
                <p className="text-[11px] text-slate-400 mt-1">
                  JPG, PNG or WEBP. Max 3MB.
                </p>
              </div>

              {/* Personal Info */}
              <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80">
                <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <FiUser size={16} />
                  </div>
                  <h3 className="font-bold text-base text-slate-900">
                    Personal Information
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstname"
                        value={formData.firstname}
                        disabled
                        className="w-full bg-slate-100/80 text-slate-500 font-medium text-sm px-4 py-3 rounded-2xl border border-slate-200/80 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        disabled
                        className="w-full bg-slate-100/80 text-slate-500 font-medium text-sm px-4 py-3 rounded-2xl border border-slate-200/80 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-800 font-semibold text-sm px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 outline-none transition-all"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">
                        Phone OS (Device)
                      </label>
                      <select
                        name="device"
                        value={formData.device}
                        onChange={handleChange}
                        className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-800 font-semibold text-sm px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 outline-none transition-all"
                      >
                        <option value="Android">Android</option>
                        <option value="iPhone">iPhone (iOS)</option>
                        <option value="Both">Both (Android & iPhone)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (7 cols): Payout Bank Details & Save */}
            <div className="md:col-span-7 space-y-6">
              {/* Bank Account Details */}
              <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80">
                <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <FiCreditCard size={16} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">
                      Payout Bank Details
                    </h3>
                    <p className="text-xs text-slate-400">
                      Where your earned task withdrawals will be credited
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">
                      Bank Name
                    </label>
                    <select
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                      className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-800 font-semibold text-sm px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 outline-none transition-all"
                    >
                      <option value="">Select your bank</option>
                      {bankList.map((b, idx) => (
                        <option key={`${b.code || b.name}-${idx}`} value={b.name}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-600">
                        Account Number
                      </label>
                      {verifyingBank && (
                        <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                          <FaSpinner className="animate-spin" size={12} />
                          <span>Verifying...</span>
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      maxLength={10}
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleChange}
                      placeholder="10-digit Bank Account Number"
                      className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-800 font-semibold text-sm px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 outline-none transition-all font-mono"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-600">
                        Account Name
                      </label>
                      {bankVerified && (
                        <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                          <FiCheck size={13} />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      name="accountName"
                      value={formData.accountName}
                      onChange={handleChange}
                      placeholder={verifyingBank ? "Verifying with bank..." : "Must match your registered bank name"}
                      className={`w-full text-slate-800 font-semibold text-sm px-4 py-3 rounded-2xl border outline-none transition-all ${
                        bankVerified
                          ? "bg-emerald-50/50 border-emerald-300 text-emerald-900 font-bold"
                          : "bg-slate-50 hover:bg-slate-100/60 focus:bg-white border-slate-200 focus:border-emerald-500"
                      }`}
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      {bankVerified
                        ? "✓ Verified bank account holder name."
                        : "Type your 10-digit account number to auto-verify account name."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={saving}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-black rounded-2xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <FaSpinner className="animate-spin" size={18} />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <FiSave size={18} />
                    <span>Save Profile & Bank</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </ClientLayout>
  );
};

export default EditProfile;

