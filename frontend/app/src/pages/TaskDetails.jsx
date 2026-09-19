import React, { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom";
import ClientLayout from "../components/ClientLayout/ClientLayout";
import axios from "axios";
import PendingTaskSubtask from "../components/PendingtaskSubtask/PendingTaskSubtask";
import Subtask from "../components/Subtask/Subtask";
import { uploadFileToSupabase } from "../config/supabase.config";
import formatDate from "../hooks/formatDate";
import CopyToClipboard from "../hooks/CopyToClipboard";
import { useAuth } from "../context/AuthContext";
import { taskService } from "../services/supabaseService";
import DownloadPermissionChecker from "../components/CheckPermissions/CheckPermissions";
import { triggerConfetti } from "../utils/confetti";
import {
  FiCopy,
  FiCheck,
  FiDownload,
  FiExternalLink,
  FiUploadCloud,
  FiAlertTriangle,
  FiXCircle,
  FiCheckCircle,
  FiClock,
  FiInfo,
} from "react-icons/fi";
import { FaSpinner } from "react-icons/fa6";

const TaskDetails = () => {
  const { currentUser, adminData, fetchUserData } = useAuth();
  const history = useHistory();
  const { slug, platform, status, id, type } = useParams();
  const [taskDetails, setTaskDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [textIsCopied, setTextIsCopied] = useState(false);
  const [error, setError] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [username, setUsername] = useState("");
  const fileInputRef = useRef(null);
  const captionRef = useRef(null);
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [imagePercentage, setImagePercentage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const userRecordId = currentUser?.id || currentUser?._id;

  const copyToClipboard = (inputRef) => {
    const isCopied = CopyToClipboard(inputRef);
    if (isCopied) setTextIsCopied(true);
    setTimeout(() => setTextIsCopied(false), 4000);
  };

  const compressImage = async (file) => {
    return new Promise((resolve) => {
      if (!file || file.size < 400 * 1024) {
        return resolve(file);
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxDim = 1400;
          let { width, height } = img;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) return resolve(file);
              const compressedFile = new File(
                [blob],
                file.name.replace(/\.[^/.]+$/, ".jpg"),
                { type: "image/jpeg", lastModified: Date.now() }
              );
              resolve(compressedFile);
            },
            "image/jpeg",
            0.82
          );
        };
        img.onerror = () => resolve(file);
      };
      reader.onerror = () => resolve(file);
    });
  };

  const handleFileInputChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image")) {
      alert("Only image screenshot files are allowed.");
      e.target.value = "";
      return;
    }

    try {
      setImagePercentage(5);
      const optimized = await compressImage(file);
      uploadProof(optimized);
    } catch {
      uploadProof(file);
    }
  };

  const uploadProof = async (file) => {
    if (!file) return;
    setImagePercentage(15);
    setImageError(null);
    try {
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const downloadUrl = await uploadFileToSupabase(
        "proof_of_works",
        fileName,
        file,
        (progress) => setImagePercentage(progress)
      );
      setImage(downloadUrl);
      setImagePercentage(100);
      setImageError(null);
    } catch (err) {
      console.error("Proof upload error:", err);
      setImagePercentage(null);
      setImageError(err.message || "Failed to upload proof.");
    }
  };

  const getTaskDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/v1/tasks/task/${id}?type=${type}&platform=${platform}&status=${status}`,
        {
          headers: userRecordId ? { "x-user-id": userRecordId } : {},
        }
      );

      const data = response.data?.data || response.data;
      if (data && !data.failed) {
        const resolvedPlatform = data.taskPlatform || data.platform || platform || "whatsapp";
        setTaskDetails({
          ...data,
          id: data.id || id,
          title: data.title || (type === "advert" ? `Post Advert on ${resolvedPlatform.toUpperCase()} Status` : `Perform Verified ${resolvedPlatform.toUpperCase()} Task`),
          caption: data.caption || `Promote with DocsZAR on ${resolvedPlatform}. Earn daily income! Register: https://docszar.com`,
          link: data.link || data.action_link || (resolvedPlatform === "facebook" ? "https://facebook.com" : "https://docszar.com"),
          mediaUrl: data.mediaUrl || data.media_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
          earningPerTask: Number(data.earningPerTask) || Number(data.earner_fee) || (type === "advert" ? 100 : 25),
          taskType: type || "advert",
          taskPlatform: resolvedPlatform,
          timeLeftS: data.timeLeftS || 3600,
          createdAt: data.createdAt || data.created_at || new Date().toISOString(),
        });
        setError(null);
      } else {
        setError(response.data?.message || "Failed to fetch task details.");
        setTaskDetails({});
      }
    } catch (err) {
      console.warn("getTaskDetails error:", err);
      const fallbackPlatform = platform || "whatsapp";
      setTaskDetails({
        id,
        title: type === "advert" ? `Post Advert on ${fallbackPlatform.toUpperCase()} Status` : `Perform Verified ${fallbackPlatform.toUpperCase()} Task`,
        caption: `Check out DocsZAR! Monetize your social media and earn daily cash. Join here: https://docszar.com #DocsZAR`,
        link: fallbackPlatform === "facebook" ? "https://facebook.com" : "https://docszar.com",
        mediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
        earningPerTask: type === "advert" ? 100 : 25,
        taskType: type || "advert",
        taskPlatform: fallbackPlatform,
        timeLeftS: 3600,
        createdAt: new Date().toISOString(),
      });
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const cancelGeneratedTask = async () => {
    if (status?.toLowerCase() !== "pending") return;
    setLoading(true);
    try {
      const taskId = id || taskDetails?.id || taskDetails?.parentId;
      if (taskId && userRecordId) {
        await taskService.cancelTask({
          taskId: taskId,
          userId: userRecordId,
          taskType: taskDetails?.taskType || type || "advert",
          reason: "User cancelled task from task details view",
        });
      }

      await axios.delete(
        `/api/v1/tasks/cancel-task/${id || taskDetails?.id}?type=${
          taskDetails?.taskType || type
        }&platform=${taskDetails?.taskPlatform?.toLowerCase() || platform}`,
        {
          headers: userRecordId ? { "x-user-id": userRecordId } : {},
        }
      ).catch(() => null);

      setLoading(false);
      return history.push(`/earn/${slug}`);
    } catch (err) {
      setLoading(false);
      setError(err?.response?.data?.message || err?.message || "Failed to cancel task.");
    }
  };

  const uploadTaskForReview = async () => {
    try {
      if (!username) {
        return setUploadError("Please enter the social media username you used.");
      }
      if (!image) {
        return setUploadError("Please upload a screenshot proof of work.");
      }
      setSubmitting(true);
      setUploadError(null);

      const resolvedTaskId = taskDetails?.id || id || taskDetails?.parentId;
      const resolvedTaskType = type || taskDetails?.taskType || "advert";

      const response = await axios.post(
        "/api/v1/tasks/request-review",
        {
          taskId: resolvedTaskId,
          id: resolvedTaskId,
          parentId: taskDetails?.parentId || resolvedTaskId,
          taskType: resolvedTaskType,
          type: resolvedTaskType,
          userId: userRecordId,
          email: currentUser?.email,
          username: currentUser?.username || username,
          usernameProof: username,
          image,
          imageProof: image,
          createdBy: taskDetails?.createdBy,
          platform: taskDetails?.taskPlatform || platform,
          title: taskDetails?.title,
          link: taskDetails?.link,
          caption: taskDetails?.caption,
          mediaUrl: taskDetails?.mediaUrl,
        },
        {
          headers: userRecordId ? { "x-user-id": userRecordId } : {},
        }
      );

      if (response.data?.failed) {
        setUploadError(response.data.message);
        setSubmitting(false);
        return;
      }

      setSubmitting(false);
      triggerConfetti();
      await fetchUserData();
      if (!slug || slug === "null" || slug === "undefined") {
        return history.push("/tasks-history");
      }
      return history.push(`/earn/${slug}`);
    } catch (err) {
      setSubmitting(false);
      return setUploadError(
        err.response?.data?.message || "Something went wrong while submitting proof."
      );
    }
  };

  const getMediaExtension = (mediaUrl) => {
    const lastDotIndex = mediaUrl.lastIndexOf(".");
    const queryStartIndex = mediaUrl.indexOf("?");
    let extension;
    if (lastDotIndex === -1) return null;
    extension =
      queryStartIndex === -1
        ? mediaUrl.substring(lastDotIndex + 1).toLowerCase()
        : mediaUrl.substring(lastDotIndex + 1, queryStartIndex).toLowerCase();

    const validExtensions = new Set(["jpg", "jpeg", "png", "mp4", "mp3", "mov"]);
    return validExtensions.has(extension) ? extension : null;
  };

  const downloadMedia = async () => {
    try {
      const mediaUrl = taskDetails?.mediaUrl;
      if (!mediaUrl) {
        alert("Media URL is missing.");
        return;
      }
      const mediaExtension = getMediaExtension(mediaUrl) || "png";
      const xhr = new XMLHttpRequest();
      xhr.responseType = "blob";
      xhr.onload = function () {
        const blob = xhr.response;
        const downloadUrl = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = downloadUrl;
        anchor.download = `advert_media_${taskDetails?.id || Date.now()}.${mediaExtension}`;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        window.URL.revokeObjectURL(downloadUrl);
      };
      xhr.open("GET", mediaUrl);
      xhr.send();
    } catch (err) {
      alert("Error downloading media.");
    }
  };

  useEffect(() => {
    getTaskDetails();
  }, []);

  useEffect(() => {
    if (status === "in-review" || status === "completed") {
      setImage(taskDetails?.proof?.imageUrl);
    }
  }, [taskDetails]);

  return (
    <ClientLayout>
      <main className="w-full font-primary">
        <DownloadPermissionChecker />

        {loading ? (
          <div className="py-24 flex justify-center items-center">
            <FaSpinner className="animate-spin text-emerald-600" size={32} />
          </div>
        ) : error ? (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 text-center max-w-lg mx-auto shadow-sm space-y-4 my-8">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <FiClock size={28} />
            </div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Task Unavailable or Expired
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {error || "This task allocation has expired or is no longer available. You can grab a new task immediately."}
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
              <button
                type="button"
                onClick={() => history.push(`/earn/${slug || "whatsapp"}`)}
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                Grab Next Task →
              </button>
              <button
                type="button"
                onClick={() => history.push("/tasks")}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Task Marketplace
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Task Overview & Instructions */}
            <div className="lg:col-span-7 space-y-6">
              {/* Task Overview Card */}
              <div>
                {status === "pending" ? (
                  <PendingTaskSubtask
                    slug={slug}
                    task={taskDetails}
                    hideBtn={true}
                    cancelTask={cancelGeneratedTask}
                    platform={platform}
                    type={type}
                    status={status}
                  />
                ) : (
                  <Subtask
                    slug={slug}
                    platform={platform}
                    status={status}
                    type={type}
                    task={taskDetails}
                    hideBtn={true}
                  />
                )}
              </div>

              {/* Task Action & Link Box */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/80">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Task Destination & Assets
                </h3>

                {type === "advert" ||
                taskDetails?.taskPlatform?.toLowerCase() === "allcomment" ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200/60">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Advert Caption & Text to Post
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(captionRef)}
                          className="px-3 py-1.5 text-emerald-700 bg-emerald-100/80 hover:bg-emerald-200/80 active:scale-95 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-2xs"
                        >
                          {textIsCopied ? <FiCheck size={14} className="text-emerald-700" /> : <FiCopy size={14} />}
                          <span>{textIsCopied ? "Copied to Clipboard!" : "Copy Caption"}</span>
                        </button>
                      </div>

                      <div className="text-xs sm:text-sm text-slate-800 font-medium whitespace-pre-wrap break-words leading-relaxed select-all bg-white p-3.5 rounded-xl border border-slate-200/50">
                        {taskDetails?.taskPlatform?.toLowerCase() === "allcomment"
                          ? taskDetails?.customComment
                          : taskDetails?.caption}
                      </div>

                      <textarea
                        ref={captionRef}
                        className="hidden"
                        readOnly
                        value={
                          taskDetails?.taskPlatform?.toLowerCase() === "allcomment"
                            ? taskDetails?.customComment || ""
                            : taskDetails?.caption || ""
                        }
                      />
                    </div>

                    {type === "advert" && (
                      <button
                        type="button"
                        onClick={downloadMedia}
                        className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <FiDownload size={18} />
                        <span>Download Campaign Media</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3">
                      <span className="text-xs sm:text-sm text-slate-700 font-mono truncate flex-1">
                        {taskDetails?.link}
                      </span>
                      <a
                        href={taskDetails?.link}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                      >
                        <span>Visit Link</span>
                        <FiExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Failure Reason Alert */}
              {status === "failed" && (
                <div className="bg-rose-50 border border-rose-200 rounded-3xl p-5 text-rose-900 flex items-start gap-3">
                  <FiXCircle size={22} className="text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-rose-900">
                      Submission Disapproved
                    </h4>
                    <p className="text-xs text-rose-800 mt-1">
                      Reason: {taskDetails?.reason || "Proof provided was found invalid or incomplete."}
                    </p>
                  </div>
                </div>
              )}

              {/* Step-by-Step Instructions */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100/80 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <FiInfo className="text-emerald-600" size={18} />
                    <span>How to Perform This Task & Earn</span>
                  </h3>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase">
                    {platform || "Social"} Guide
                  </span>
                </div>

                <div className="space-y-4">
                  {platform?.toLowerCase() === "whatsapp" ? (
                    <>
                      <div className="flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                          1
                        </span>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-800">
                            Download Media & Copy Caption
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Click the green "Download Campaign Media" button above and copy the required caption to your clipboard.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                          2
                        </span>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-800">
                            Post to Your WhatsApp Status
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Upload the video/image to your WhatsApp status with the caption and leave it active for up to 24 hours.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                          3
                        </span>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-800">
                            Capture Clear View Count Screenshot
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Take a clear screenshot showing the status post and your contact views count (e.g. 50+ views).
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                          4
                        </span>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-800">
                            Upload Proof & Submit
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Attach your screenshot on the right and click "Submit Task for Review" to claim your payout.
                          </p>
                        </div>
                      </div>
                    </>
                  ) : platform?.toLowerCase() === "playstore" ? (
                    <>
                      <div className="flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                          1
                        </span>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-800">
                            Open Google PlayStore Link
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Tap the "Visit Link" button above to navigate to the official app page on Google Play.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                          2
                        </span>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-800">
                            Install & Open the App
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Download and launch the application on your Android device. Test the app for at least 2 minutes.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                          3
                        </span>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-800">
                            Rate 5 Stars & Write a Positive Review
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Give the app a 5-star rating and write a genuine 2+ sentence review expressing your feedback.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                          4
                        </span>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-800">
                            Upload Published Review Screenshot
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Screenshot your published PlayStore review and submit it for instant payout verification.
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                          1
                        </span>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-800">
                            Visit Target Link
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {type === "advert"
                              ? "Download the campaign media and copy the caption above."
                              : "Click the 'Visit Link' button above to open the exact post or profile in a new tab."}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                          2
                        </span>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-800">
                            Perform the Required Action
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {type === "advert"
                              ? `Post the media and caption on your ${platform} status or feed.`
                              : `Complete the action (Follow account, Like post, Comment, Subscribe, or Stream) as described.`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                          3
                        </span>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-800">
                            Take Screenshot Proof
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Capture a clear full-screen screenshot showing that you completed the action with your profile active.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                          4
                        </span>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-800">
                            Upload Proof & Enter Username
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Attach your screenshot on the right, input the username of the account you used, and submit for instant review.
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Anti-fraud & Quality Standards */}
                <div className="pt-2">
                  <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-amber-900 flex items-start gap-3">
                    <FiAlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider">
                        Important Rules & Platform Policy
                      </h4>
                      <p className="text-xs text-amber-800 leading-relaxed font-medium">
                        DO NOT delete adverts, unlike posts, or unfollow accounts after receiving earnings. Our automated fraud detector audits submissions periodically; violators face immediate account bans and forfeiture of funds.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Proof Submission / Review Details */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              {(status === "pending" ||
                status === "in-review" ||
                status === "completed") && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100/80">
                  <h3 className="font-extrabold text-base text-slate-900 mb-4">
                    {status === "pending" ? "Submit Proof of Work" : "Submitted Proof Details"}
                  </h3>

                  {uploadError && (
                    <div className="p-3 mb-4 rounded-2xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                      {uploadError}
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Screenshot Picker/Preview */}
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">
                        Screenshot Proof
                      </label>

                      {image ? (
                        <div className="relative w-full max-h-64 rounded-2xl overflow-hidden border border-slate-200">
                          <img
                            src={image}
                            alt="Proof Preview"
                            className="w-full h-52 object-contain bg-slate-100"
                          />
                          {status === "pending" && (
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="absolute bottom-3 right-3 px-3 py-1.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                            >
                              Replace Screenshot
                            </button>
                          )}
                        </div>
                      ) : (
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
                          <div className="w-12 h-12 rounded-2xl bg-emerald-50 group-hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition-colors mb-2">
                            <FiUploadCloud size={24} />
                          </div>
                          <span className="text-xs font-bold text-slate-800">
                            {imagePercentage && imagePercentage < 100
                              ? `Uploading Screenshot... ${imagePercentage}%`
                              : "Click to upload task completion screenshot"}
                          </span>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            PNG, JPG or WEBP (Max 5MB)
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Username Input */}
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">
                        Your Social Media Username
                      </label>
                      {status === "pending" ? (
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="e.g. @your_instagram_handle"
                          className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-800 font-semibold text-sm px-4 py-3.5 rounded-2xl border border-slate-200 focus:border-emerald-500 outline-none transition-all"
                        />
                      ) : (
                        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-800">
                          @{taskDetails?.proof?.username || "Not provided"}
                        </div>
                      )}
                    </div>

                    {/* Submit / Cancel Actions */}
                    {status === "pending" && (
                      <div className="pt-2 flex flex-col sm:flex-row gap-3">
                        <button
                          type="button"
                          onClick={uploadTaskForReview}
                          disabled={submitting}
                          className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          {submitting ? (
                            <>
                              <FaSpinner className="animate-spin" size={18} />
                              <span>Submitting for Review...</span>
                            </>
                          ) : (
                            <>
                              <FiCheckCircle size={18} />
                              <span>Submit Proof of Work</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={cancelGeneratedTask}
                          className="py-4 px-6 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold rounded-2xl transition-colors cursor-pointer text-xs sm:text-sm"
                        >
                          Cancel Task
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </ClientLayout>
  );
};

export default TaskDetails;

