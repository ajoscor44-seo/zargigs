import React, { useState, useEffect, useMemo } from "react";
import ClientLayout from "../components/ClientLayout/ClientLayout";
import { useParams, useHistory, Link } from "react-router-dom/cjs/react-router-dom";
import PricingWay from "../components/PricingWay/PricingWay";
import FormInput from "../components/FormInput/FormInput";
import allStates from "../data/states";
import religions from "../data/religions";
import axios from "axios";
import ToastNotification from "../components/ToastNotification/ToastNotification";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../config/supabase.config";
import { FaSpinner, FaUsers, FaArrowLeft } from "react-icons/fa6";
import numeral from "numeral";

const fallbackEngagementPackages = [
  {
    id: "eng_ig_follow",
    _id: "eng_ig_follow",
    title: "Get Real Instagram Followers",
    platformName: "instagram",
    amountToPay: 10,
    amountToEarn: 5,
    pathToPage: "/order/instagram-followers",
    platforms: ["instagram"],
    description: "Get real, active Nigerian users to follow your Instagram page or brand account.",
  },
  {
    id: "eng_ig_like",
    _id: "eng_ig_like",
    title: "Get Instagram Post Likes",
    platformName: "instagram",
    amountToPay: 6,
    amountToEarn: 3,
    pathToPage: "/order/instagram-likes",
    platforms: ["instagram"],
    description: "Boost your Instagram photos, reels, and carousel posts with real likes.",
  },
  {
    id: "eng_ig_comment",
    _id: "eng_ig_comment",
    title: "Get Custom Instagram Comments",
    platformName: "instagram",
    amountToPay: 20,
    amountToEarn: 10,
    pathToPage: "/order/instagram-comments",
    platforms: ["instagram"],
    description: "Get meaningful, relevant custom comments on your Instagram posts to drive conversation.",
  },
  {
    id: "eng_tiktok_follow",
    _id: "eng_tiktok_follow",
    title: "Get TikTok Followers",
    platformName: "tiktok",
    amountToPay: 10,
    amountToEarn: 5,
    pathToPage: "/order/tiktok-followers",
    platforms: ["tiktok"],
    description: "Grow your TikTok profile rapidly with real Nigerian followers.",
  },
  {
    id: "eng_tiktok_like",
    _id: "eng_tiktok_like",
    title: "Get TikTok Video Likes",
    platformName: "tiktok",
    amountToPay: 6,
    amountToEarn: 3,
    pathToPage: "/order/tiktok-likes",
    platforms: ["tiktok"],
    description: "Trigger the TikTok FYP algorithm by getting real user likes on your videos.",
  },
  {
    id: "eng_yt_sub",
    _id: "eng_yt_sub",
    title: "Get YouTube Subscribers",
    platformName: "youtube",
    amountToPay: 30,
    amountToEarn: 15,
    pathToPage: "/order/youtube-subscribers",
    platforms: ["youtube"],
    description: "Gain genuine channel subscribers to accelerate your YouTube monetization.",
  },
  {
    id: "eng_yt_like",
    _id: "eng_yt_like",
    title: "Get YouTube Video Likes",
    platformName: "youtube",
    amountToPay: 15,
    amountToEarn: 8,
    pathToPage: "/order/youtube-likes",
    platforms: ["youtube"],
    description: "Increase video rankings and engagement metrics on YouTube.",
  },
  {
    id: "eng_twitter_follow",
    _id: "eng_twitter_follow",
    title: "Get Twitter / X Followers",
    platformName: "twitter",
    amountToPay: 10,
    amountToEarn: 5,
    pathToPage: "/order/twitter-followers",
    platforms: ["twitter"],
    description: "Build social proof and authority on X (Twitter) with real followers.",
  },
  {
    id: "eng_twitter_rt",
    _id: "eng_twitter_rt",
    title: "Get Twitter / X Retweets & Quotes",
    platformName: "twitter",
    amountToPay: 15,
    amountToEarn: 8,
    pathToPage: "/order/twitter-retweets",
    platforms: ["twitter"],
    description: "Amplify your message across Nigerian Twitter with genuine retweets and quotes.",
  },
  {
    id: "eng_fb_follow",
    _id: "eng_fb_follow",
    title: "Get Facebook Page Followers",
    platformName: "facebook",
    amountToPay: 10,
    amountToEarn: 5,
    pathToPage: "/order/facebook-follows",
    platforms: ["facebook"],
    description: "Increase follower count and credibility for your Facebook page.",
  },
  {
    id: "eng_app_review",
    _id: "eng_app_review",
    title: "Download & Review Mobile App",
    platformName: "playstore",
    amountToPay: 50,
    amountToEarn: 25,
    pathToPage: "/order/playstore-reviews",
    platforms: ["playstore", "applestore"],
    description: "Get real users to download your Android or iOS app and leave positive reviews.",
  },
  {
    id: "eng_spotify_stream",
    _id: "eng_spotify_stream",
    title: "Spotify & Music Streams / Follows",
    platformName: "spotify",
    amountToPay: 20,
    amountToEarn: 10,
    pathToPage: "/order/spotify-streams",
    platforms: ["spotify", "audiomack"],
    description: "Boost your song stream count and artist profile saves across music platforms.",
  },
];

const CreateOrder = () => {
  const { engagementCreator, getEngagementCreator, fetchUserData, currentUser } = useAuth();
  const history = useHistory();
  const params = useParams();
  const slug = params.slug;

  const [toastNotifications, setToastNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [amountToPay, setAmountToPay] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (getEngagementCreator) {
      getEngagementCreator();
    }
  }, []);

  const allPackages = useMemo(() => {
    return engagementCreator && engagementCreator.length > 0
      ? engagementCreator
      : fallbackEngagementPackages;
  }, [engagementCreator]);

  const wayToCreateEngagement = useMemo(() => {
    const matched = allPackages.find((way) => {
      const waySlug = way.pathToPage
        ? way.pathToPage.replace("/order/", "")
        : way.slug || way.platformName;
      return waySlug === slug || way.pathToPage === "/order/" + slug;
    });
    return matched || fallbackEngagementPackages[0];
  }, [allPackages, slug]);

  const statesName = allStates.map((state) => state.name);

  // Task data object
  const [taskData, setTaskData] = useState({
    title: wayToCreateEngagement?.title,
    taskType: "engagement",
    gender: undefined,
    location: undefined,
    religion: undefined,
    link: undefined,
    numberOfTasks: undefined,
    payId: wayToCreateEngagement?.id || wayToCreateEngagement?._id,
    earnId: wayToCreateEngagement?.earnId,
    customComment: undefined,
    taskPlatform: wayToCreateEngagement?.platformName?.toLowerCase(),
  });

  useEffect(() => {
    if (wayToCreateEngagement) {
      setTaskData((prev) => ({
        ...prev,
        title: wayToCreateEngagement.title,
        payId: wayToCreateEngagement.id || wayToCreateEngagement._id,
        earnId: wayToCreateEngagement.earnId,
        taskPlatform: wayToCreateEngagement.platformName?.toLowerCase(),
      }));
      if (taskData.numberOfTasks) {
        setAmountToPay(
          Number(taskData.numberOfTasks) * Number(wayToCreateEngagement.amountToPay || 0)
        );
      }
    }
  }, [wayToCreateEngagement]);

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
    const val = e.target.value;
    if (e.target.name === "numberOfTasks") {
      setAmountToPay(Number(val || 0) * Number(wayToCreateEngagement?.amountToPay || 0));
    }
    setTaskData((prev) => ({
      ...prev,
      [e.target.name]: val,
    }));
  };

  const addNewtask = async (payload) => {
    try {
      const response = await axios.post("/api/v1/tasks/engagements", payload, {
        headers: {
          "x-user-id": currentUser?.id || currentUser?._id || "",
        },
      });
      return response.data;
    } catch (err) {
      console.warn("Backend API notice, saving directly to Supabase:", err.message);
      try {
        const totalBudget = Number(payload.numberOfTasks || 10) * Number(payload.amountToPay || 30);
        const userBal = parseFloat(currentUser?.balance || 0);
        if (userBal < totalBudget) {
          return { failed: true, status: false, message: `Insufficient balance. You need ₦${totalBudget.toLocaleString()} to fund this campaign.` };
        }

        // Deduct balance
        await supabase.from("users").update({ balance: userBal - totalBudget, updated_at: new Date().toISOString() }).eq("id", currentUser?.id);

        // Insert engagement_task with status = 'pending'
        const { data: engTask, error: engErr } = await supabase.from("engagement_tasks").insert({
          user_id: currentUser?.id,
          title: payload.title || "Engagement Task",
          platform: payload.taskPlatform || "instagram",
          number_of_tasks: Number(payload.numberOfTasks || 10),
          tasks_done: 0,
          amount_paid: totalBudget,
          earner_fee: Number(payload.amountToEarn || 20),
          status: "pending",
          action_link: payload.link,
          instructions: payload.instructions || `Complete the engagement task on ${payload.taskPlatform || "social media"}.`,
          created_at: new Date().toISOString(),
        }).select().single();

        if (engErr) throw engErr;

        // Log transaction
        await supabase.from("transactions").insert({
          user_id: currentUser?.id,
          amount: totalBudget,
          type: "debit",
          category: "task_creation",
          status: "successful",
          reference: `ENG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          description: `Engagement Escrow Budget for "${payload.title || "Engagement Task"}"`,
          created_at: new Date().toISOString(),
        });

        // Insert notification
        await supabase.from("notifications").insert({
          user_id: currentUser?.id,
          title: "Engagement Campaign Submitted ⏳",
          message: `Your engagement campaign "${payload.title}" has been submitted and is pending admin review.`,
          type: "info",
          is_read: false,
          created_at: new Date().toISOString(),
        });

        return { failed: false, status: true, message: "Campaign created and submitted for admin review!", data: engTask };
      } catch (dbErr) {
        return { failed: true, status: false, message: dbErr.message || "Failed to create engagement campaign" };
      }
    }
  };

  const createNewtask = async () => {
    try {
      if (!taskData.numberOfTasks || Number(taskData.numberOfTasks) <= 0) {
        return setError("Please enter a valid number of engagements.");
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
      if (!taskData.link || taskData.link.trim().length === 0) {
        return setError("Please provide the direct link to your page or post.");
      }

      setError(null);
      setLoading(true);

      const amountToPayUnit = Number(wayToCreateEngagement?.amountToPay) || 20;
      const amountToEarnUnit = Number(wayToCreateEngagement?.amountToEarn) || Math.round(amountToPayUnit * 0.7);

      const finalPayload = {
        ...taskData,
        userId: currentUser?.id || currentUser?._id,
        creatorId: currentUser?.id || currentUser?._id,
        email: currentUser?.email,
        username: currentUser?.username,
        title: wayToCreateEngagement?.title || taskData.title,
        payId: wayToCreateEngagement?.id || wayToCreateEngagement?._id || taskData.payId,
        amountToPay: amountToPayUnit,
        amountToEarn: amountToEarnUnit,
        taskPlatform: wayToCreateEngagement?.platformName?.toLowerCase() || "social",
      };

      const tasksProcessed = await addNewtask(finalPayload);

      if (!tasksProcessed.failed && (tasksProcessed.status || tasksProcessed.data || tasksProcessed.message?.toLowerCase().includes("success"))) {
        showToast({
          msg: `${tasksProcessed.message || "Order launched successfully!"}`,
          errorType: "success",
        });

        await fetchUserData();

        setTimeout(() => {
          setToastNotifications([]);
          history.push("/order-history");
        }, 1200);
        return setLoading(false);
      }

      showToast({
        msg: `${tasksProcessed.message || "Failed to create order"}`,
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

  return (
    <ClientLayout>
      <div className="font-primary text-slate-800 space-y-6">
        {/* Header */}
        <div className="pb-2 border-b border-slate-200/70">
          <div className="flex items-center gap-2 mb-1">
            <Link
              to="/order"
              className="text-xs font-bold text-slate-400 hover:text-emerald-600 transition-colors"
            >
              ← All Engagement Services
            </Link>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FaUsers className="text-emerald-600" />
            <span>Create Engagement Order</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Boost your metrics with verified social actions from active Nigerian members.
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
          {/* Left Column (8 cols) */}
          <div className="md:col-span-8 space-y-6">
            {wayToCreateEngagement && (
              <PricingWay
                way={wayToCreateEngagement}
                wayDescription={wayToCreateEngagement.description}
              />
            )}

            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">
                  Targeting & Quantity
                </h2>
                <p className="text-xs text-slate-500">
                  Specify demographic filters and target volume for this order.
                </p>
              </div>

              <FormInput
                type="number"
                fullRounded={true}
                placeholder="e.g. 100"
                label={`Number of ${wayToCreateEngagement?.platformName || "Engagements"} Desired`}
                note="Enter the total number of actions/followers you want."
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
                  handleChange={handleChange}
                />

                <FormInput
                  label="Target Location"
                  placeholder="Select Location"
                  useSelect={true}
                  selections={["Select Location", "All Nigeria", ...statesName]}
                  note="Select state to focus reach or All Nigeria."
                  name="location"
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
                handleChange={handleChange}
              />

              <FormInput
                label="Page or Post Link"
                placeholder="https://instagram.com/yourhandle or post URL"
                note="Provide the direct link for earners to follow, like, or engage with."
                name="link"
                value={taskData.link || ""}
                handleChange={handleChange}
              />

              {slug?.includes("comment") && (
                <FormInput
                  label="Custom Comments Guidelines (Optional)"
                  placeholder="e.g., Mention how fast delivery was, or say Great product!"
                  useTextArea={true}
                  note="Specify comments theme or exact phrases you'd like users to post."
                  name="customComment"
                  handleChange={handleChange}
                />
              )}
            </div>
          </div>

          {/* Right Column (4 cols) */}
          <div className="md:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-5 sticky top-24">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">
                Order Summary
              </h3>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Service:</span>
                  <strong className="text-slate-900 font-bold capitalize">
                    {wayToCreateEngagement?.platformName || "Social"}
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Rate Per Action:</span>
                  <strong className="text-slate-900 font-mono">
                    ₦{numeral(wayToCreateEngagement?.amountToPay || 0).format("0,0.00")}
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Quantity:</span>
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
                    Total cost (₦{numeral(amountToPay).format("0,0.00")}) exceeds your balance (₦{numeral(currentUser?.balance || 0).format("0,0.00")}). You can reduce count to <strong>{Math.floor((Number(currentUser?.balance || 0)) / Number(wayToCreateEngagement?.amountToPay || 10))}</strong> or top up your wallet.
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
                    <span>Processing Order...</span>
                  </>
                ) : amountToPay > (currentUser?.balance || 0) && amountToPay > 0 ? (
                  <span>Insufficient Balance — Fund Wallet</span>
                ) : (
                  <span>Submit & Launch Order</span>
                )}
              </button>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 text-xs text-emerald-800 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-emerald-950">
                  <span>⚡</span>
                  <span>Instant Distribution</span>
                </div>
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  Tasks are automatically queued and delivered to active verified earners immediately upon order launch.
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

export default CreateOrder;
