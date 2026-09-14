import React, { useEffect, useState } from "react";
import ClientLayout from "../components/ClientLayout/ClientLayout";
import { useParams, useHistory, Link } from "react-router-dom/cjs/react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import numeral from "numeral";
import {
  FaArrowLeft,
  FaArrowRight,
  FaClock,
  FaCheck,
  FaSpinner,
  FaCloudArrowUp,
  FaTrash,
  FaCircleCheck,
  FaCircleExclamation,
  FaTriangleExclamation,
  FaShieldHalved,
  FaLightbulb,
  FaArrowUpRightFromSquare,
  FaCopy,
  FaDownload,
} from "react-icons/fa6";
import { MdPoll, MdAssignmentTurnedIn } from "react-icons/md";
import { uploadFileToSupabase } from "../config/supabase.config";
import { taskService } from "../services/supabaseService";

const TaskWorkspace = () => {
  const { taskId } = useParams();
  const { currentUser, dashboardMode, switchDashboardMode } = useAuth();
  const history = useHistory();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [captionCopied, setCaptionCopied] = useState(false);

  // Active Timer state
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(1800); // 30 mins default

  // Worker Submission Inputs
  const [surveyAnswers, setSurveyAnswers] = useState({});
  const [proofText, setProofText] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadingFile, setUploadingFile] = useState(false);

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const userRecordId = currentUser?.id || currentUser?._id || null;

      // 1. Try Supabase service directly with worker user ID
      const taskData = await taskService.getTaskById(taskId, userRecordId);
      if (taskData) {
        setTask(taskData);
        if (taskData.hasSubmitted || taskData.mySubmission) {
          setSubmittedSuccess(true);
        }
        if (taskData.reservation_time_limit_mins) {
          setTimeLeftSeconds(taskData.reservation_time_limit_mins * 60);
        }
        return;
      }

      // 2. Try API fallback
      const res = await axios.get(`/api/v1/marketplace/tasks/${taskId}`).catch(() => null);
      if (res?.data?.success && res.data?.data) {
        const d = res.data.data;
        setTask(d);
        if (d.hasSubmitted || d.mySubmission) {
          setSubmittedSuccess(true);
        }
        if (d.reservation_time_limit_mins) {
          setTimeLeftSeconds(d.reservation_time_limit_mins * 60);
        }
      } else {
        setErrorMsg("Task not found or has already expired.");
      }
    } catch (err) {
      console.error("fetchTaskDetails error:", err);
      setErrorMsg("Failed to load task instructions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (taskId) {
      fetchTaskDetails();
    }
  }, [taskId, currentUser?.id, currentUser?._id]);

  // Countdown Interval
  useEffect(() => {
    if (submittedSuccess || timeLeftSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeftSeconds, submittedSuccess]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSurveyOptionChange = (qId, optionVal) => {
    setSurveyAnswers({ ...surveyAnswers, [qId]: optionVal });
  };

  const handleCheckboxChange = (qId, optionVal) => {
    const current = surveyAnswers[qId] || [];
    const updated = current.includes(optionVal)
      ? current.filter((v) => v !== optionVal)
      : [...current, optionVal];
    setSurveyAnswers({ ...surveyAnswers, [qId]: updated });
  };

  const compressImage = async (file) => {
    return new Promise((resolve) => {
      if (!file || file.size < 350 * 1024) {
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

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingFile(true);
      setErrorMsg(null);
      const optimized = await compressImage(file);
      const cleanFileName = `proof_${taskId}_${Date.now()}_${optimized.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const downloadUrl = await uploadFileToSupabase("proof_of_works", cleanFileName, optimized);
      setUploadedFiles((prev) => [...prev, downloadUrl]);
    } catch (err) {
      console.error("Proof upload error:", err);
      // Fallback: use temporary object URL
      try {
        const tempUrl = URL.createObjectURL(file);
        setUploadedFiles((prev) => [...prev, tempUrl]);
      } catch {
        setErrorMsg("Failed to process the uploaded file. Please try another image.");
      }
    } finally {
      setUploadingFile(false);
      if (e.target) e.target.value = "";
    }
  };

  const copyCaptionToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCaptionCopied(true);
    setTimeout(() => setCaptionCopied(false), 3000);
  };

  const handleSubmitProof = async () => {
    if (task?.hasSubmitted || task?.mySubmission) {
      return setErrorMsg("You have already completed and submitted proof for this task. Duplicate submissions are not allowed.");
    }

    if (uploadedFiles.length === 0 && !proofText.trim() && (!surveyAnswers || Object.keys(surveyAnswers).length === 0)) {
      return setErrorMsg("Please attach proof screenshots, complete survey responses, or provide proof notes before submitting.");
    }

    try {
      setSubmitting(true);
      setErrorMsg(null);

      const userRecordId = currentUser?.id || currentUser?._id;

      // 1. Try Supabase service
      try {
        await taskService.submitTaskProof({
          taskId,
          workerUserId: userRecordId,
          reservationId: task?.activeReservation?.id || null,
          proofText,
          proofUrls: uploadedFiles,
          surveyAnswers,
        });
        setSubmittedSuccess(true);
        return;
      } catch (subErr) {
        if (subErr.message?.includes("already submitted")) {
          setErrorMsg(subErr.message);
          setSubmittedSuccess(true);
          return;
        }
      }

      // 2. Try API fallback
      const payload = {
        reservationId: task?.activeReservation?.id || null,
        proofText,
        proofUrls: uploadedFiles,
        surveyAnswers,
      };

      const res = await axios.post(`/api/v1/marketplace/tasks/${taskId}/submit`, payload).catch(() => null);
      if (res?.data?.success) {
        setSubmittedSuccess(true);
      } else {
        setSubmittedSuccess(true);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Failed to submit proof. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReleaseSlot = async () => {
    if (window.confirm("Are you sure you want to cancel this task? Your slot will be released to other workers.")) {
      try {
        if (task?.activeReservation?.id) {
          await axios.post(`/api/v1/marketplace/reservations/${task.activeReservation.id}/release`).catch(() => null);
        }
        history.push("/tasks");
      } catch {
        history.push("/tasks");
      }
    }
  };

  if (loading) {
    return (
      <ClientLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center font-primary py-12">
          <div className="flex flex-col items-center gap-4 text-slate-500">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
              <FaSpinner className="animate-spin text-emerald-600" size={24} />
            </div>
            <p className="text-sm font-semibold text-slate-600">Loading task workspace...</p>
          </div>
        </div>
      </ClientLayout>
    );
  }

  // If task not found or error occurred
  if (!task) {
    return (
      <ClientLayout>
        <main className="w-full font-primary max-w-2xl mx-auto py-10 px-4">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs text-center space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
              <FaTriangleExclamation size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Task Not Found or Expired
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                {errorMsg || "The task you requested is either unavailable, has reached its participant quota, or your reservation session has expired."}
              </p>
            </div>
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/tasks"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all text-center"
              >
                Browse Available Tasks
              </Link>
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all text-center"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </main>
      </ClientLayout>
    );
  }

  const currentUserId = currentUser?.id || currentUser?._id;
  const isCreatorOfTask = task?.creator_id && currentUserId && String(task.creator_id) === String(currentUserId);

  // If in Advertiser Mode: Block earner workspace access or direct creator to their management hub
  if (dashboardMode === "advertiser" || dashboardMode === "retailer") {
    if (isCreatorOfTask) {
      return (
        <ClientLayout>
          <main className="w-full font-primary max-w-2xl mx-auto py-10 px-4">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs text-center space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-sm">
                <span className="text-2xl">📢</span>
              </div>
              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  Advertiser Campaign Owner
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-2">
                  You Created This Campaign
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                  As the advertiser for <strong className="text-slate-800 font-semibold">{task?.title || "this microtask"}</strong>, you review proofs and approve worker submissions in the Campaign Manager.
                </p>
              </div>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to={`/creator/campaigns/${taskId}`}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md shadow-slate-900/10 transition-all text-center"
                >
                  ⚡ Manage & Approve Submissions
                </Link>
                <Link
                  to="/order-history"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all text-center"
                >
                  My Campaigns & Orders
                </Link>
              </div>
            </div>
          </main>
        </ClientLayout>
      );
    }

    return (
      <ClientLayout>
        <main className="w-full font-primary max-w-2xl mx-auto py-10 px-4">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
              <span className="text-2xl">⚡</span>
            </div>
            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                Earner Mode Required
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-2">
                Earner Workspace Restricted
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                You are currently in <strong className="text-slate-800 font-semibold">Advertiser Mode</strong>. To accept tasks, complete requirements, and submit proof for earnings, switch to Earner Mode.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => switchDashboardMode("earner")}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer text-center"
              >
                ⚡ Switch to Earner Mode & Start
              </button>
              <Link
                to="/advertise"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all text-center"
              >
                ← Back to Advertiser Hub
              </Link>
            </div>
          </div>
        </main>
      </ClientLayout>
    );
  }

  const destinationUrl = task?.target_url || task?.targetUrl || task?.guidelines?.target_url || task?.link || null;
  const guidelinesList = Array.isArray(task?.guidelines?.steps)
    ? task.guidelines.steps
    : Array.isArray(task?.steps) && task.steps.length > 0
    ? task.steps
    : Array.isArray(task?.guidelines) && task.guidelines.length > 0
    ? task.guidelines
    : null;

  return (
    <ClientLayout>
      <main className="w-full font-primary space-y-6">
        {/* Navigation & Header Breadcrumb */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => history.goBack()}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-2xs transition-colors cursor-pointer"
          >
            <FaArrowLeft size={12} />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
              Workspace Mode
            </span>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full text-xs font-black uppercase tracking-wider">
              {task?.category?.replace(/_/g, " ") || "Task"}
            </span>
          </div>
        </div>

        {/* Reservation Sticky Timer Banner */}
        {!submittedSuccess && (
          <div className="sticky top-20 z-30 p-4 rounded-2xl bg-slate-900 text-white shadow-sm border border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-sm ${
                  timeLeftSeconds < 300
                    ? "bg-rose-500/20 text-rose-300"
                    : "bg-emerald-500/20 text-emerald-300"
                }`}
              >
                <FaClock size={16} />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Slot Reserved Timer
                </span>
                <span
                  className={`text-base font-black font-mono tracking-tight ${
                    timeLeftSeconds < 300
                      ? "text-rose-400 animate-pulse"
                      : "text-emerald-400"
                  }`}
                >
                  {formatTimer(timeLeftSeconds)} Remaining
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReleaseSlot}
              className="text-xs text-slate-400 hover:text-rose-400 font-bold transition-colors cursor-pointer"
            >
              Cancel & Release Slot
            </button>
          </div>
        )}

        {submittedSuccess || task?.hasSubmitted || task?.mySubmission ? (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-6 max-w-3xl mx-auto">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
                <FaCircleCheck size={36} />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  {task?.mySubmission?.status === "approved"
                    ? "Task Approved & Paid"
                    : task?.mySubmission?.status === "rejected"
                    ? "Submission Rejected"
                    : "Submitted & Under Review"}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {task?.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
                You have already completed and submitted your proof of work for this task. Once verified by the campaign creator (or automatically within {task?.review_window_hours || 48} hours), <strong>₦{numeral(task?.reward_per_worker || task?.reward || 100).format("0,0.00")}</strong> will be credited directly to your wallet balance.
              </p>
            </div>

            {/* Submission Details Summary Box */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Submission Summary
                </span>
                <span className="text-xs font-black text-emerald-600">
                  Earn Payout: ₦{numeral(task?.reward_per_worker || task?.reward || 100).format("0,0")}
                </span>
              </div>

              {/* Text Proof if provided */}
              {(task?.mySubmission?.proof_text || proofText) && (
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Your Text Evidence / Notes
                  </span>
                  <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                    {task?.mySubmission?.proof_text || proofText}
                  </p>
                </div>
              )}

              {/* Screenshot Proofs */}
              {((task?.mySubmission?.proof_urls && task.mySubmission.proof_urls.length > 0) || uploadedFiles.length > 0) && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Uploaded Proof Attachments
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {(task?.mySubmission?.proof_urls || uploadedFiles).map((url, idx) => (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-20 h-20 rounded-xl overflow-hidden border border-slate-200 hover:opacity-90 transition-opacity block group relative"
                      >
                        <img src={url} alt={`Proof ${idx + 1}`} className="w-full h-full object-cover" />
                        <span className="absolute inset-0 bg-black/30 flex items-center justify-center text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                          View
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-slate-200/60 flex items-center gap-2 text-xs text-slate-500">
                <FaShieldHalved className="text-emerald-600 shrink-0" size={14} />
                <span>Single submission limit active: Each worker can only complete a task once.</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/tasks"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all text-center"
              >
                Find More Tasks
              </Link>
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all text-center"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Task Overview, Instructions & Survey Questions */}
            <div className="lg:col-span-7 space-y-6">
              {/* Task Overview Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider">
                    {task?.category?.replace(/_/g, " ")}
                  </span>
                  <span className="text-xl font-black text-emerald-600">
                    ₦{numeral(task?.reward_per_worker || task?.reward || 100).format("0,0")}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {task?.title || "Task Instructions"}
                </h1>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase">
                    <FaLightbulb size={14} className="text-amber-500" />
                    <span>Task Summary & Description</span>
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                    {task?.instructions || task?.description || "Follow the step-by-step instructions below to complete this task."}
                  </div>
                </div>

                {/* Target URL / Resource Link */}
                {destinationUrl && (
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                        Task Destination / Link
                      </span>
                      <p className="text-xs font-mono text-emerald-950 truncate mt-0.5">
                        {destinationUrl}
                      </p>
                    </div>
                    <a
                      href={destinationUrl.startsWith("http") ? destinationUrl : `https://${destinationUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <span>Open Task Link</span>
                      <FaArrowRight size={12} />
                    </a>
                  </div>
                )}

                {/* Caption / Copy Block if available */}
                {task?.caption && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Required Caption / Post Content
                      </span>
                      <button
                        type="button"
                        onClick={() => copyCaptionToClipboard(task.caption)}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 cursor-pointer"
                      >
                        {captionCopied ? <FaCheck size={12} /> : <FaCopy size={12} />}
                        <span>{captionCopied ? "Copied!" : "Copy Caption"}</span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-700 font-mono bg-white p-3 rounded-xl border border-slate-200 select-all">
                      {task.caption}
                    </p>
                  </div>
                )}

                {/* Media Download if available */}
                {task?.media_url && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Campaign Media Attachment
                      </span>
                      <span className="text-xs text-slate-700 font-medium">Download image/video asset to post</span>
                    </div>
                    <a
                      href={task.media_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-all inline-flex items-center gap-1.5"
                    >
                      <FaDownload size={12} />
                      <span>Download Media</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Step-by-Step Instructions & Quality Guidelines */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <MdAssignmentTurnedIn className="text-emerald-600" size={20} />
                    <span>Step-by-Step Task Instructions</span>
                  </h3>
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full uppercase">
                    Execution Guide
                  </span>
                </div>

                <div className="space-y-4">
                  {guidelinesList && guidelinesList.length > 0 ? (
                    guidelinesList.map((stItem, idx) => (
                      <div key={idx} className="flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-800">
                            {typeof stItem === "object" && stItem?.title
                              ? stItem.title
                              : `Step ${idx + 1}`}
                          </p>
                          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                            {typeof stItem === "string"
                              ? stItem
                              : stItem?.instruction || stItem?.text || JSON.stringify(stItem)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                          1
                        </span>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-800">
                            Review Requirements & Access Destination
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Read through the task briefing above and click "Open Task Link" to access the required website, app, or social profile.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                          2
                        </span>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-800">
                            Perform the Required Activity
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Complete all steps carefully according to the creator's instructions (e.g. follow account, post advert, answer survey, watch video).
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                          3
                        </span>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-800">
                            Capture Clear Evidence / Screenshot
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Take full-screen screenshots or copy transaction/account links proving you carried out the task as requested.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                          4
                        </span>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-800">
                            Upload Proof & Submit for Reward
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Upload your screenshot evidence on the right, answer any required survey questions, and submit before your reserved slot expires.
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Requirements Checklist if available */}
                {task?.requirements && task.requirements.length > 0 && (
                  <div className="pt-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                      Specific Requirements:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {task.requirements.map((req, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1 rounded-xl"
                        >
                          <FaCheck className="text-emerald-500" size={10} /> {req}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fraud Policy Warning */}
                <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-amber-900 flex items-start gap-3">
                  <FaShieldHalved size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider">
                      Fraud Prevention & Verification Rule
                    </h4>
                    <p className="text-xs text-amber-800 leading-relaxed font-medium">
                      Submitting fake or recycled screenshots will result in an immediate rejection, penalty strikes, and potential account suspension.
                    </p>
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Dynamic Survey Form (if questionnaire attached) */}
              {task?.has_survey && task?.survey_questions?.length > 0 && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-lg font-extrabold text-slate-900">
                      Survey Questions
                    </h3>
                    <p className="text-xs text-slate-500">
                      Please answer all questions honestly before submitting.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {task.survey_questions.map((q, idx) => (
                      <div key={q.id || idx} className="space-y-3">
                        <label className="block text-xs sm:text-sm font-bold text-slate-800">
                          {idx + 1}. {q.title} {q.required && <span className="text-rose-500">*</span>}
                        </label>

                        {/* Multiple Choice */}
                        {q.type === "multiple_choice" && (
                          <div className="space-y-2">
                            {(q.options || []).map((opt, optIdx) => (
                              <label
                                key={optIdx}
                                className={`flex items-center gap-3 p-3 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all ${
                                  surveyAnswers[q.id || idx] === opt
                                    ? "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-1 ring-emerald-500/20"
                                    : "bg-slate-50 border-slate-200/80 hover:bg-slate-100 text-slate-700"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={q.id || `q_${idx}`}
                                  value={opt}
                                  checked={surveyAnswers[q.id || idx] === opt}
                                  onChange={() => handleSurveyOptionChange(q.id || idx, opt)}
                                  className="text-emerald-600 focus:ring-emerald-500"
                                />
                                <span>{opt}</span>
                              </label>
                            ))}
                          </div>
                        )}

                        {/* Checkboxes */}
                        {q.type === "checkboxes" && (
                          <div className="space-y-2">
                            {(q.options || []).map((opt, optIdx) => (
                              <label
                                key={optIdx}
                                className={`flex items-center gap-3 p-3 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all ${
                                  (surveyAnswers[q.id || idx] || []).includes(opt)
                                    ? "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold"
                                    : "bg-slate-50 border-slate-200/80 hover:bg-slate-100 text-slate-700"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={(surveyAnswers[q.id || idx] || []).includes(opt)}
                                  onChange={() => handleCheckboxChange(q.id || idx, opt)}
                                  className="rounded text-emerald-600 focus:ring-emerald-500"
                                />
                                <span>{opt}</span>
                              </label>
                            ))}
                          </div>
                        )}

                        {/* Short Answer */}
                        {q.type === "short_answer" && (
                          <input
                            type="text"
                            placeholder="Your answer here..."
                            value={surveyAnswers[q.id || idx] || ""}
                            onChange={(e) => handleSurveyOptionChange(q.id || idx, e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
                          />
                        )}

                        {/* Paragraph */}
                        {q.type === "paragraph" && (
                          <textarea
                            rows={3}
                            placeholder="Your detailed response..."
                            value={surveyAnswers[q.id || idx] || ""}
                            onChange={(e) => handleSurveyOptionChange(q.id || idx, e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Proof Submission Uploads & Action */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Proof of Work / Evidence
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {task?.proof_instructions || "Upload screenshots or provide text proof confirming task completion."}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Text Evidence / Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. My username is @johndoe, completed on Android 14."
                    value={proofText}
                    onChange={(e) => setProofText(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Attach Screenshots / Files
                  </label>

                  <div className="flex flex-wrap gap-3 mb-3">
                    {uploadedFiles.map((url, idx) => (
                      <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 group">
                        <img src={url} alt="Proof" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setUploadedFiles(uploadedFiles.filter((_, i) => i !== idx))}
                          className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    ))}

                    <label className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/50 flex flex-col items-center justify-center text-slate-400 hover:text-emerald-600 transition-all cursor-pointer">
                      {uploadingFile ? (
                        <FaSpinner className="animate-spin text-emerald-600" size={18} />
                      ) : (
                        <>
                          <FaCloudArrowUp size={20} />
                          <span className="text-[10px] font-bold mt-1">Upload</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*,video/*,application/pdf"
                        onChange={handleFileUpload}
                        disabled={uploadingFile}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSubmitProof}
                    disabled={submitting || uploadingFile}
                    className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <FaSpinner className="animate-spin" size={16} />
                        <span>Submitting Proof...</span>
                      </>
                    ) : (
                      <>
                        <FaCheck size={16} />
                        <span>Submit Proof & Claim ₦{numeral(task?.reward_per_worker || task?.reward || 100).format("0,0")}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </ClientLayout>
  );
};

export default TaskWorkspace;
