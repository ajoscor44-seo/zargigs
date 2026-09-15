import React, { useRef, useState, useEffect, useMemo } from "react";
import ClientLayout from "../components/ClientLayout/ClientLayout";
import { useParams, useHistory, Link } from "react-router-dom/cjs/react-router-dom";
import PricingWay from "../components/PricingWay/PricingWay";
import FormInput from "../components/FormInput/FormInput";
import { FaCloudUploadAlt, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { FaBullhorn } from "react-icons/fa6";
import allStates from "../data/states";
import religions from "../data/religions";
import axios from "axios";
import ToastNotification from "../components/ToastNotification/ToastNotification";
import { uploadFileToSupabase, supabase } from "../config/supabase.config";
import { useAuth } from "../context/AuthContext";
import numeral from "numeral";

const fallbackAdvertPackages = [
  {
    id: "adv_whatsapp",
    _id: "adv_whatsapp",
    title: "Post Advert on WhatsApp Status",
    platformName: "whatsapp",
    amountToPay: 150,
    amountToEarn: 100,
    pathToPage: "/advertise/whatsapp-status",
    platforms: ["whatsapp"],
    description: "Get verified Nigerian earners with 1,000+ status contacts to post your advert.",
  },
  {
    id: "adv_instagram",
    _id: "adv_instagram",
    title: "Post Advert on Instagram Story & Feed",
    platformName: "instagram",
    amountToPay: 200,
    amountToEarn: 120,
    pathToPage: "/advertise/instagram-post",
    platforms: ["instagram"],
    description: "Have real creators publish your product banner or promotional reel on Instagram.",
  },
  {
    id: "adv_facebook",
    _id: "adv_facebook",
    title: "Post Advert on Facebook Profile / Group",
    platformName: "facebook",
    amountToPay: 150,
    amountToEarn: 100,
    pathToPage: "/advertise/facebook-post",
    platforms: ["facebook"],
    description: "Broadcast your brand message directly to active Facebook communities.",
  },
  {
    id: "adv_twitter",
    _id: "adv_twitter",
    title: "Post Advert on Twitter / X",
    platformName: "twitter",
    amountToPay: 180,
    amountToEarn: 110,
    pathToPage: "/advertise/twitter-post",
    platforms: ["twitter"],
    description: "Get users to tweet your marketing banner, link, and hashtags to their followers.",
  },
  {
    id: "adv_tiktok",
    _id: "adv_tiktok",
    title: "Post Advert on TikTok",
    platformName: "tiktok",
    amountToPay: 250,
    amountToEarn: 150,
    pathToPage: "/advertise/tiktok-post",
    platforms: ["tiktok"],
    description: "Pay creators to post your promotional video or audio on TikTok.",
  },
];

const CreateAdvert = () => {
  const { advertCreator, getAdvertCreator, fetchUserData, currentUser } = useAuth();
  const history = useHistory();
  const fileInputRef = useRef();
  const params = useParams();
  const slug = params.slug;

  const [toastNotifications, setToastNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeMediaUploadTab, setActiveMediaUploadTab] = useState("photo");
  const [amountToPay, setAmountToPay] = useState(0);
  const [error, setError] = useState(null);
  const [mediaError, setMediaError] = useState(null);
  const [mediaPercentage, setMediaPercentage] = useState(null);

  useEffect(() => {
    if (getAdvertCreator) {
      getAdvertCreator();
    }
  }, []);

  const allPackages = useMemo(() => {
    return advertCreator && advertCreator.length > 0
      ? advertCreator
      : fallbackAdvertPackages;
  }, [advertCreator]);

  const wayToCreateAdvert = useMemo(() => {
    const matched = allPackages.find((way) => {
      const waySlug = way.pathToPage
        ? way.pathToPage.replace("/advertise/", "")
        : way.slug || way.platformName;
      return waySlug === slug || way.pathToPage === "/advertise/" + slug;
    });
    return matched || fallbackAdvertPackages[0];
  }, [allPackages, slug]);

  // Task data object
  const [taskData, setTaskData] = useState({
    title: wayToCreateAdvert?.title,
    taskType: "advert",
    gender: undefined,
    location: undefined,
    religion: undefined,
    caption: undefined,
    mediaUrl: undefined,
    numberOfTasks: undefined,
    payId: wayToCreateAdvert?.id || wayToCreateAdvert?._id,
    taskPlatform: wayToCreateAdvert?.platformName?.toLowerCase(),
  });

  useEffect(() => {
    if (wayToCreateAdvert) {
      setTaskData((prev) => ({
        ...prev,
        title: wayToCreateAdvert.title,
        payId: wayToCreateAdvert.id || wayToCreateAdvert._id,
        taskPlatform: wayToCreateAdvert.platformName?.toLowerCase(),
      }));
      if (taskData.numberOfTasks) {
        setAmountToPay(
          Number(taskData.numberOfTasks) * Number(wayToCreateAdvert.amountToPay || 0)
        );
      }
    }
  }, [wayToCreateAdvert]);

  const statesName = allStates.map((state) => state.name);

  const showToast = (props) => {
    const id = Date.now();
    const newToast = {
      id,
      msg: props.msg,
      errorType: props.errorType,
    };
    setToastNotifications((prevToasts) => [...prevToasts, newToast]);
  };

  const handleChange = (e) => {
    const isFile = e.target.type === "file";
    if (isFile) {
      return handleFileInputChange(e);
    }
    const val = e.target.value;
    if (e.target.name === "numberOfTasks") {
      setAmountToPay(Number(val || 0) * Number(wayToCreateAdvert?.amountToPay || 0));
    }
    return setTaskData((prev) => ({
      ...prev,
      [e.target.name]: val,
    }));
  };

  // Adds new task
  const addNewtask = async (payload) => {
    try {
      const response = await axios.post("/api/v1/tasks/adverts", payload, {
        headers: {
          "x-user-id": currentUser?.id || currentUser?._id || "",
        },
      });
      return response.data;
    } catch (err) {
      console.warn("Backend API notice, saving directly to Supabase:", err.message);
      try {
        const totalBudget = Number(payload.numberOfTasks || 10) * Number(payload.amountToPay || 100);
        const userBal = parseFloat(currentUser?.balance || 0);
        if (userBal < totalBudget) {
          return { failed: true, status: false, message: `Insufficient balance. You need ₦${totalBudget.toLocaleString()} to fund this campaign.` };
        }

        // Deduct balance
        await supabase.from("users").update({ balance: userBal - totalBudget, updated_at: new Date().toISOString() }).eq("id", currentUser?.id);

        // Insert advert_task with status = 'pending'
        const { data: advert, error: advErr } = await supabase.from("advert_tasks").insert({
          user_id: currentUser?.id,
          title: payload.title || "Social Media Advert",
          platform: payload.taskPlatform || "whatsapp",
          number_of_tasks: Number(payload.numberOfTasks || 10),
          tasks_done: 0,
          amount_paid: totalBudget,
          earner_fee: Number(payload.amountToEarn || 70),
          status: "pending",
          caption: payload.caption,
          media_url: payload.mediaUrl,
          created_at: new Date().toISOString(),
        }).select().single();

        if (advErr) throw advErr;

        // Log transaction
        await supabase.from("transactions").insert({
          user_id: currentUser?.id,
          amount: totalBudget,
          type: "debit",
          category: "task_creation",
          status: "successful",
          reference: `ADV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          description: `Advert Escrow Budget for "${payload.title || "Social Media Advert"}"`,
          created_at: new Date().toISOString(),
        });

        // Insert notification
        await supabase.from("notifications").insert({
          user_id: currentUser?.id,
          title: "Advert Campaign Submitted ⏳",
          message: `Your advert campaign "${payload.title}" has been submitted and is pending admin review.`,
          type: "info",
          is_read: false,
          created_at: new Date().toISOString(),
        });

        return { failed: false, status: true, message: "Campaign created and submitted for admin review!", data: advert };
      } catch (dbErr) {
        return { failed: true, status: false, message: dbErr.message || "Failed to create advert campaign" };
      }
    }
  };

  // Creates New Task
  const createNewtask = async () => {
    try {
      if (!taskData.numberOfTasks || Number(taskData.numberOfTasks) <= 0) {
        return setError("Please input a valid number of advert posts.");
      }
      if (!taskData.gender || taskData.gender === "Select Gender") {
        return setError("Please select a target gender category.");
      }
      if (!taskData.location || taskData.location === "Select Location") {
        return setError("Please select a target location.");
      }
      if (!taskData.religion || taskData.religion === "Select Religion") {
        return setError("Please select a target religion.");
      }
      if (!taskData.caption || taskData.caption.trim().length === 0) {
        return setError("Please enter the advert text or caption.");
      }
      if (!taskData.mediaUrl) {
        return setError("Please upload the advert photo or video.");
      }

      setError(null);
      setLoading(true);

      const amountToPayUnit = Number(wayToCreateAdvert?.amountToPay) || 100;
      const amountToEarnUnit = Number(wayToCreateAdvert?.amountToEarn) || Math.round(amountToPayUnit * 0.7);

      const finalPayload = {
        ...taskData,
        userId: currentUser?.id || currentUser?._id,
        creatorId: currentUser?.id || currentUser?._id,
        email: currentUser?.email,
        username: currentUser?.username,
        title: wayToCreateAdvert?.title || taskData.title,
        payId: wayToCreateAdvert?.id || wayToCreateAdvert?._id || taskData.payId,
        amountToPay: amountToPayUnit,
        amountToEarn: amountToEarnUnit,
        taskPlatform: wayToCreateAdvert?.platformName?.toLowerCase() || "whatsapp",
      };

      const tasksProcessed = await addNewtask(finalPayload);

      if (!tasksProcessed.failed && (tasksProcessed.status || tasksProcessed.data || tasksProcessed.message?.toLowerCase().includes("success"))) {
        showToast({
          msg: `${tasksProcessed.message || "Campaign created successfully!"}`,
          errorType: "success",
        });

        await fetchUserData();

        setTimeout(() => {
          setToastNotifications([]);
          history.push("/advertisements");
        }, 1200);
        return setLoading(false);
      }

      showToast({
        msg: `${tasksProcessed.message || "Failed to create advert"}`,
        errorType: "danger",
      });
      return setLoading(false);
    } catch (err) {
      showToast({
        msg: `${err.response?.data?.message || "An unexpected error occurred"}`,
        errorType: "danger",
      });
      return setLoading(false);
    }
  };

  const selectMedia = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type.startsWith("image") && file.size > 5 * 1024 * 1024) {
      alert("Image is too large. Maximum size is 5MB.");
      return (e.target.value = "");
    } else if (file.type.startsWith("video") && file.size > 25 * 1024 * 1024) {
      alert("Video is too large. Maximum size is 25MB.");
      return (e.target.value = "");
    } else {
      uploadMedia(file);
    }
  };

  const uploadMedia = async (file) => {
    try {
      setMediaPercentage(15);
      setMediaError(null);
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const downloadUrl = await uploadFileToSupabase(
        "advertisements",
        `${activeMediaUploadTab}/${fileName}`,
        file,
        (progress) => setMediaPercentage(progress)
      );
      setTaskData((prev) => ({
        ...prev,
        mediaUrl: downloadUrl,
      }));
      setMediaPercentage(100);
      setMediaError(null);
    } catch (err) {
      console.error("Upload error:", err);
      setMediaPercentage(null);
      setMediaError(err.message || "Failed to upload file");
      showToast({
        msg: "Failed to upload file. Please try again.",
        errorType: "danger",
      });
    }
  };

  return (
    <ClientLayout>
      <div className="font-primary text-slate-800 space-y-6">
        {/* Top Header */}
        <div className="pb-2 border-b border-slate-200/70">
          <div className="flex items-center gap-2 mb-1">
            <Link
              to="/advertise"
              className="text-xs font-bold text-slate-400 hover:text-emerald-600 transition-colors"
            >
              ← All Advert Channels
            </Link>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FaBullhorn className="text-emerald-600" />
            <span>Create Advert Campaign</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Get hundreds of active social media users to broadcast your flyers and adverts on their personal status and timelines.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-xs font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column (8 cols): Package & Form */}
          <div className="md:col-span-8 space-y-6">
            {/* Selected Package Header */}
            {wayToCreateAdvert && (
              <PricingWay
                way={wayToCreateAdvert}
                wayDescription={wayToCreateAdvert.description}
              />
            )}

            {/* Form Container Card */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">
                  Campaign Details & Targeting
                </h2>
                <p className="text-xs text-slate-500">
                  Configure audience demographic and quantity for this advert campaign.
                </p>
              </div>

              <FormInput
                type="number"
                fullRounded={true}
                placeholder="e.g. 50"
                label={`Number of ${wayToCreateAdvert?.platformName || "Advert"} Posts Desired`}
                note="Enter the total number of unique users you want to post your advert."
                name="numberOfTasks"
                value={taskData.numberOfTasks || ""}
                handleChange={handleChange}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Target Gender"
                  placeholder="Select Gender"
                  useSelect={true}
                  selections={[
                    "Select Gender",
                    "All Genders",
                    "Male",
                    "Female",
                    "Transgender",
                    "Custom",
                    "Others",
                  ]}
                  note="Select your target audience gender."
                  name="gender"
                  value={taskData.gender || "Select Gender"}
                  handleChange={handleChange}
                />

                <FormInput
                  label="Target Location"
                  placeholder="Select Location"
                  useSelect={true}
                  selections={["Select Location", "All Nigeria", ...statesName]}
                  note="Select state to focus reach or All Nigeria."
                  name="location"
                  value={taskData.location || "Select Location"}
                  handleChange={handleChange}
                />
              </div>

              <FormInput
                label="Target Religion"
                placeholder="Select Religion"
                useSelect={true}
                selections={["Select Religion", "All Religions", ...religions]}
                note="Select 'All Religions' for universal reach."
                name="religion"
                value={taskData.religion || "Select Religion"}
                handleChange={handleChange}
              />

              <FormInput
                label="Advert Text or Caption"
                placeholder="Write compelling text, call to action, WhatsApp contact, or website links..."
                useTextArea={true}
                note="This exact text will be copied and posted along with the media by our earners."
                name="caption"
                value={taskData.caption || ""}
                handleChange={handleChange}
              />

              {/* Media Upload Section */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-slate-700">
                  Upload Advert Media
                </label>

                {!taskData.mediaUrl && (
                  <div className="bg-slate-100 p-1 rounded-xl flex gap-1 max-w-xs">
                    <button
                      type="button"
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeMediaUploadTab === "photo"
                          ? "bg-white text-emerald-600 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                      onClick={() => setActiveMediaUploadTab("photo")}
                    >
                      Photo (PNG, JPG)
                    </button>
                    <button
                      type="button"
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeMediaUploadTab === "video"
                          ? "bg-white text-emerald-600 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                      onClick={() => setActiveMediaUploadTab("video")}
                    >
                      Video (MP4)
                    </button>
                  </div>
                )}

                {mediaPercentage !== null && mediaPercentage < 100 && (
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-2 transition-all duration-300 rounded-full"
                      style={{ width: `${mediaPercentage}%` }}
                    />
                  </div>
                )}

                {mediaError && (
                  <p className="text-xs font-bold text-red-500">{mediaError}</p>
                )}

                <div
                  onClick={selectMedia}
                  className="border-2 border-dashed border-slate-300 hover:border-emerald-400 bg-slate-50/70 hover:bg-emerald-50/30 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all min-h-[160px]"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                    accept="image/*,video/*"
                    className="hidden"
                  />

                  {taskData.mediaUrl ? (
                    <div className="flex flex-col items-center gap-2">
                      {activeMediaUploadTab === "photo" ? (
                        <img
                          src={taskData.mediaUrl}
                          alt="Uploaded media"
                          className="max-h-48 rounded-xl object-contain shadow-md"
                        />
                      ) : (
                        <video
                          src={taskData.mediaUrl}
                          controls
                          className="max-h-48 rounded-xl shadow-md"
                        />
                      )}
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                        <FaCheckCircle /> Media Uploaded Successfully (Click to Change)
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-emerald-600">
                        <FaCloudUploadAlt size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          Click to choose an {activeMediaUploadTab === "photo" ? "image" : "video"}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Max file size: {activeMediaUploadTab === "photo" ? "5MB" : "25MB"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Live Order Summary & Checkout */}
          <div className="md:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-5 sticky top-24">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">
                Campaign Summary
              </h3>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Channel:</span>
                  <strong className="text-slate-900 font-bold capitalize">
                    {wayToCreateAdvert?.platformName || "Advert"}
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Rate Per Post:</span>
                  <strong className="text-slate-900 font-mono">
                    ₦{numeral(wayToCreateAdvert?.amountToPay || 0).format("0,0.00")}
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Post Count:</span>
                  <strong className="text-slate-900 font-bold">
                    {numeral(taskData.numberOfTasks || 0).format("0,0")}
                  </strong>
                </div>
                <div className="flex items-center justify-between pt-2.5 border-t border-slate-200">
                  <span className="text-slate-600 font-extrabold">Total Cost:</span>
                  <span className="text-base font-black text-emerald-600 font-mono">
                    ₦{numeral(amountToPay).format("0,0.00")}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                  <span className="text-slate-400 font-medium">Your Wallet Balance:</span>
                  <span className="font-bold text-slate-700 font-mono">
                    ₦{numeral(currentUser?.balance || 0).format("0,0.00")}
                  </span>
                </div>
              </div>

              {amountToPay > (currentUser?.balance || 0) && amountToPay > 0 && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs space-y-1.5">
                  <div className="flex items-center justify-between font-black">
                    <span>⚠️ Insufficient Wallet Balance</span>
                    <Link
                      to="/fund-wallet"
                      className="text-emerald-700 hover:text-emerald-900 underline font-black"
                    >
                      + Fund Wallet
                    </Link>
                  </div>
                  <p className="text-[11px] text-rose-600 font-medium leading-relaxed">
                    Total cost (₦{numeral(amountToPay).format("0,0.00")}) exceeds your balance (₦{numeral(currentUser?.balance || 0).format("0,0.00")}). You can reduce posts to <strong>{Math.floor((Number(currentUser?.balance || 0)) / Number(wayToCreateAdvert?.amountToPay || 150))}</strong> or top up your wallet.
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={createNewtask}
                disabled={loading || amountToPay <= 0 || amountToPay > (currentUser?.balance || 0)}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" size={16} />
                    <span>Launching...</span>
                  </>
                ) : amountToPay > (currentUser?.balance || 0) && amountToPay > 0 ? (
                  <span>Insufficient Balance — Fund Wallet</span>
                ) : (
                  <span>Submit & Launch Campaign</span>
                )}
              </button>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 text-xs text-emerald-800 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-emerald-950">
                  <span>📈</span>
                  <span>Guaranteed 24-Hour Broadcast</span>
                </div>
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  Posts stay live on user status/timelines for a minimum of 24 hours verified with time-stamped proof screenshots.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="toast_cover">
          {toastNotifications?.map((toast) => (
            <ToastNotification key={toast.id} toastNotification={toast} />
          ))}
        </div>
      </div>
    </ClientLayout>
  );
};

export default CreateAdvert;
