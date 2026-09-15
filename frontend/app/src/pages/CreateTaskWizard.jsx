import React, { useState } from "react";
import ClientLayout from "../components/ClientLayout/ClientLayout";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../config/supabase.config";
import axios from "axios";
import numeral from "numeral";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaPlus,
  FaTrash,
  FaBoltLightning,
  FaShieldHalved,
  FaWallet,
  FaListCheck,
  FaMobileScreen,
  FaVideo,
  FaMicrophone,
  FaChartSimple,
  FaPenNib,
  FaBasketShopping,
  FaLayerGroup,
  FaCircleQuestion,
  FaSpinner,
  FaBullhorn,
  FaThumbsUp,
  FaLink,
  FaGlobe,
  FaEye,
} from "react-icons/fa6";
import { MdPoll, MdFileUpload, MdTextFields, MdRadioButtonChecked, MdOutlineAssignment } from "react-icons/md";

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
  "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau",
  "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

const TEMPLATES = [
  {
    id: "app_testing",
    categoryGroup: "testing",
    title: "Mobile App Testing & Reviews",
    desc: "Hire real smartphone users to download your app, test onboarding, and submit feedback.",
    icon: <FaMobileScreen size={20} className="text-teal-600" />,
    iconBg: "bg-teal-50",
    badge: "App QA",
    badgeColor: "bg-teal-100 text-teal-800",
    defaultProof: ["screenshot", "text"],
    defaultMinutes: 15,
    defaultReward: 500,
    defaultSteps: [
      "Click the App Link provided above to download and install the mobile app.",
      "Open the app and complete user registration / onboarding.",
      "Explore and test the app features for at least 3-5 minutes.",
      "Take a clear screenshot of your registered account dashboard and upload as proof.",
    ],
    defaultProofInstructions: "Upload a screenshot of your logged-in profile dashboard and provide your registered username.",
  },
  {
    id: "website_testing",
    categoryGroup: "testing",
    title: "Website & Web App Testing",
    desc: "Hire users to navigate pages, test checkout flows, find bugs, and capture feedback.",
    icon: <FaChartSimple size={20} className="text-indigo-600" />,
    iconBg: "bg-indigo-50",
    badge: "QA Testing",
    badgeColor: "bg-indigo-100 text-indigo-800",
    defaultProof: ["screenshot", "text"],
    defaultMinutes: 10,
    defaultReward: 400,
    defaultSteps: [
      "Visit the target website link provided above.",
      "Navigate to the designated page and test the specified workflow.",
      "Verify that all buttons and pages load smoothly without errors.",
      "Take a clear screenshot of the final confirmation screen as proof.",
    ],
    defaultProofInstructions: "Upload a full-screen screenshot showing you completed the test.",
  },
  {
    id: "survey",
    categoryGroup: "research",
    title: "Survey / Questionnaire",
    desc: "Gather market insights, feedback, and consumer opinions from targeted Nigerians.",
    icon: <MdPoll size={20} className="text-emerald-600" />,
    iconBg: "bg-emerald-50",
    badge: "Research",
    badgeColor: "bg-emerald-100 text-emerald-800",
    defaultProof: ["survey"],
    defaultMinutes: 5,
    defaultReward: 200,
    defaultSteps: [
      "Carefully read each questionnaire question below.",
      "Select your honest answer for all required questions.",
      "Submit your responses for instant automated verification.",
    ],
    defaultProofInstructions: "Answer all questionnaire items below.",
  },
  {
    id: "ugc_media",
    categoryGroup: "media",
    title: "UGC Video & Product Review",
    desc: "Have creators record short authentic video reviews, unboxing, or testimonial clips.",
    icon: <FaVideo size={20} className="text-rose-600" />,
    iconBg: "bg-rose-50",
    badge: "Creator Video",
    badgeColor: "bg-rose-100 text-rose-800",
    defaultProof: ["video", "file", "text"],
    defaultMinutes: 20,
    defaultReward: 1500,
    defaultSteps: [
      "Access the provided product or brand link to review key talking points.",
      "Record a 30 to 60-second clear, authentic video review on your phone.",
      "Highlight the key product benefits naturally.",
      "Upload the video recording or share your public video link as proof.",
    ],
    defaultProofInstructions: "Upload your recorded video file or provide the public video post URL.",
  },
  {
    id: "data_collection",
    categoryGroup: "tasks",
    title: "Data Collection & Entry",
    desc: "Collect local pricing, contact directories, business listings, or web info.",
    icon: <FaListCheck size={20} className="text-amber-600" />,
    iconBg: "bg-amber-50",
    badge: "Data Entry",
    badgeColor: "bg-amber-100 text-amber-800",
    defaultProof: ["text", "file"],
    defaultMinutes: 12,
    defaultReward: 400,
    defaultSteps: [
      "Review the data points and guidelines requested by the creator.",
      "Gather and verify the required information accurately.",
      "Type or upload the collected dataset in the submission box below.",
    ],
    defaultProofInstructions: "Enter the verified data details and attach any supporting document.",
  },
  {
    id: "voice_recording",
    categoryGroup: "media",
    title: "Voice & Audio Sample",
    desc: "Collect speech samples, accents, or audio recordings for research and AI datasets.",
    icon: <FaMicrophone size={20} className="text-cyan-600" />,
    iconBg: "bg-cyan-50",
    badge: "Audio Sample",
    badgeColor: "bg-cyan-100 text-cyan-800",
    defaultProof: ["file", "text"],
    defaultMinutes: 8,
    defaultReward: 350,
    defaultSteps: [
      "Read the sample speech text provided in the instructions.",
      "Record your clear voice in a quiet room.",
      "Upload the audio recording file as proof of completion.",
    ],
    defaultProofInstructions: "Upload the clear .mp3 / .wav / .m4a voice recording.",
  },
  {
    id: "custom",
    categoryGroup: "tasks",
    title: "Custom Microtask",
    desc: "Create any tailored digital or physical task with custom instructions and requirements.",
    icon: <FaLayerGroup size={20} className="text-slate-700" />,
    iconBg: "bg-slate-100",
    badge: "Custom Task",
    badgeColor: "bg-slate-100 text-slate-800",
    defaultProof: ["screenshot", "text"],
    defaultMinutes: 10,
    defaultReward: 300,
    defaultSteps: [
      "Open the destination link provided in the task.",
      "Follow all specific instructions detailed by the creator.",
      "Take a screenshot or provide proof of completed work.",
    ],
    defaultProofInstructions: "Upload screenshot proof of completed task.",
  },
  {
    id: "social_advert",
    type: "redirect",
    link: "/advertise",
    categoryGroup: "social",
    title: "Post Social Media Advert",
    desc: "Hire verified WhatsApp, Instagram, Facebook & TikTok users with 1k+ viewers to post your advert.",
    icon: <FaBullhorn size={20} className="text-purple-600" />,
    iconBg: "bg-purple-50",
    badge: "Social Advert",
    badgeColor: "bg-purple-100 text-purple-800",
    defaultReward: 100,
  },
  {
    id: "social_engagement",
    type: "redirect",
    link: "/order",
    categoryGroup: "social",
    title: "Social Engagements & Followers",
    desc: "Order real Nigerian followers, post likes, custom comments, YouTube subscribers & app reviews.",
    icon: <FaThumbsUp size={20} className="text-blue-600" />,
    iconBg: "bg-blue-50",
    badge: "Engagement",
    badgeColor: "bg-blue-100 text-blue-800",
    defaultReward: 25,
  },
];

const CreateTaskWizard = () => {
  const { currentUser, fetchUserData } = useAuth();
  const history = useHistory();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Form State
  const [taskData, setTaskData] = useState({
    category: "app_testing",
    title: "",
    targetUrl: "", // Optional App / Website Link
    appName: "", // Optional App / Brand Name
    description: "",
    instructions: "",
    steps: [
      "Click the App Link provided above to download and install the app.",
      "Open the app and complete registration / account setup.",
      "Explore and test core features for at least 3 minutes.",
      "Take a clear screenshot of your profile screen and upload as proof.",
    ],
    hasSurvey: false,
    surveyQuestions: [
      {
        id: "q_1",
        title: "What is your primary age group?",
        type: "multiple_choice",
        options: ["18 - 24", "25 - 34", "35 - 44", "45+"],
        required: true,
      },
    ],
    proofTypes: ["screenshot", "text"],
    proofInstructions: "Please upload a clear screenshot showing your completed task, and provide your registered username or details.",
    targeting: {
      target_all: true,
      states: [],
      min_age: 18,
      max_age: 55,
      gender: "all",
      device_types: ["all"],
    },
    totalSlots: 5,
    rewardPerWorker: 500,
    estimatedMinutes: 10,
    reservationTimeLimitMins: 30,
    reviewWindowHours: 48,
    platformFeePercent: 30,
  });

  const workerBudget = (taskData.totalSlots || 0) * (taskData.rewardPerWorker || 0);
  const platformFee = Math.round((workerBudget * 30) / 100);
  const totalEscrow = workerBudget + platformFee;
  const userBalance = parseFloat(currentUser?.balance || 0);
  const isBalanceSufficient = userBalance >= totalEscrow;

  const selectTemplate = (template) => {
    if (template.type === "redirect" && template.link) {
      return history.push(template.link);
    }
    setTaskData({
      ...taskData,
      category: template.id,
      hasSurvey: template.id === "survey",
      proofTypes: template.defaultProof || ["screenshot"],
      estimatedMinutes: template.defaultMinutes || 10,
      rewardPerWorker: template.defaultReward || 300,
      steps: template.defaultSteps || [
        "Open the target link provided in the task.",
        "Complete the required action.",
        "Take screenshot proof of completion.",
      ],
      proofInstructions: template.defaultProofInstructions || "Please upload clear screenshot proof.",
    });
    setStep(2);
  };

  // Step Builder Helpers
  const addStep = () => {
    setTaskData({
      ...taskData,
      steps: [...(taskData.steps || []), ""],
    });
  };

  const updateStepText = (idx, text) => {
    const updated = [...(taskData.steps || [])];
    updated[idx] = text;
    setTaskData({ ...taskData, steps: updated });
  };

  const removeStep = (idx) => {
    const updated = (taskData.steps || []).filter((_, i) => i !== idx);
    setTaskData({ ...taskData, steps: updated });
  };

  const toggleProofType = (pType) => {
    const current = taskData.proofTypes || [];
    const updated = current.includes(pType)
      ? current.filter((t) => t !== pType)
      : [...current, pType];
    setTaskData({ ...taskData, proofTypes: updated.length > 0 ? updated : ["screenshot"] });
  };

  // Survey Builder Helpers
  const addSurveyQuestion = () => {
    const newQ = {
      id: `q_${Date.now()}`,
      title: "New Survey Question",
      type: "multiple_choice",
      options: ["Option 1", "Option 2"],
      required: true,
    };
    setTaskData({
      ...taskData,
      surveyQuestions: [...taskData.surveyQuestions, newQ],
    });
  };

  const updateQuestion = (qId, field, val) => {
    setTaskData({
      ...taskData,
      surveyQuestions: taskData.surveyQuestions.map((q) =>
        q.id === qId ? { ...q, [field]: val } : q
      ),
    });
  };

  const removeQuestion = (qId) => {
    setTaskData({
      ...taskData,
      surveyQuestions: taskData.surveyQuestions.filter((q) => q.id !== qId),
    });
  };

  const addOptionToQuestion = (qId) => {
    setTaskData({
      ...taskData,
      surveyQuestions: taskData.surveyQuestions.map((q) => {
        if (q.id === qId) {
          return {
            ...q,
            options: [...(q.options || []), `Option ${(q.options?.length || 0) + 1}`],
          };
        }
        return q;
      }),
    });
  };

  const updateOptionText = (qId, optIdx, text) => {
    setTaskData({
      ...taskData,
      surveyQuestions: taskData.surveyQuestions.map((q) => {
        if (q.id === qId) {
          const newOpts = [...q.options];
          newOpts[optIdx] = text;
          return { ...q, options: newOpts };
        }
        return q;
      }),
    });
  };

  const removeOption = (qId, optIdx) => {
    setTaskData({
      ...taskData,
      surveyQuestions: taskData.surveyQuestions.map((q) => {
        if (q.id === qId) {
          return {
            ...q,
            options: q.options.filter((_, idx) => idx !== optIdx),
          };
        }
        return q;
      }),
    });
  };

  const handleSubmitCampaign = async () => {
    try {
      setSubmitting(true);
      setErrorMsg(null);

      if (!taskData.title.trim()) {
        setErrorMsg("Please provide a title for your task.");
        setSubmitting(false);
        return;
      }

      const totalParticipants = Number(taskData.totalSlots || 5);
      const rewardUnit = Number(taskData.rewardPerWorker || 300);
      const budget = totalParticipants * rewardUnit;
      const fee = Math.round((budget * 30) / 100);
      const requiredEscrow = budget + fee;

      const userBal = parseFloat(currentUser?.balance || 0);
      if (userBal < requiredEscrow) {
        setErrorMsg(
          `Insufficient wallet balance. You need ₦${numeral(requiredEscrow).format(
            "0,0.00"
          )} to fund this campaign.`
        );
        setSubmitting(false);
        return;
      }

      // Filter empty steps
      const cleanSteps = (taskData.steps || [])
        .map((s) => s.trim())
        .filter(Boolean);

      // Build structured instructions
      let combinedInstructions = taskData.instructions?.trim() || "";
      if (cleanSteps.length > 0) {
        const formattedSteps = cleanSteps.map((s, i) => `${i + 1}. ${s}`).join("\n");
        if (combinedInstructions) {
          combinedInstructions += "\n\nStep-by-Step Guide:\n" + formattedSteps;
        } else {
          combinedInstructions = formattedSteps;
        }
      }

      const payload = {
        creator_id: currentUser?.id,
        title: taskData.title.trim(),
        category: taskData.category || "custom",
        reward_per_worker: rewardUnit,
        total_slots: totalParticipants,
        slots_remaining: totalParticipants,
        slots_completed: 0,
        amount_paid: requiredEscrow,
        status: "pending",
        moderation_status: "pending",
        instructions: combinedInstructions,
        guidelines: cleanSteps,
        target_url: taskData.targetUrl?.trim() || null,
        survey_questions: taskData.hasSurvey ? taskData.surveyQuestions : null,
        proof_types: taskData.proofTypes || ["screenshot"],
        proof_instructions: taskData.proofInstructions || "Please upload clear screenshot proof.",
        targeting: taskData.targeting,
        estimated_minutes: taskData.estimatedMinutes || 10,
        reservation_time_limit_mins: taskData.reservationTimeLimitMins || 30,
        review_window_hours: taskData.reviewWindowHours || 48,
        created_at: new Date().toISOString(),
      };

      // 1. Deduct escrow from creator balance
      const newBal = userBal - requiredEscrow;
      const { error: balErr } = await supabase
        .from("users")
        .update({ balance: newBal, updated_at: new Date().toISOString() })
        .eq("id", currentUser?.id);

      if (balErr) throw new Error("Failed to process escrow deduction. Please try again.");

      // 2. Insert into marketplace_tasks with status = 'pending'
      const { data: createdTask, error: taskErr } = await supabase
        .from("marketplace_tasks")
        .insert(payload)
        .select()
        .single();

      if (taskErr) {
        // Rollback balance on failure
        await supabase.from("users").update({ balance: userBal }).eq("id", currentUser?.id);
        throw taskErr;
      }

      // 3. Log escrow transaction
      try {
        await supabase.from("transactions").insert({
          user_id: currentUser?.id,
          amount: requiredEscrow,
          type: "debit",
          category: "task_creation",
          status: "successful",
          reference: `ESC-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          description: `Campaign Escrow Budget for "${taskData.title.trim()}" (${totalParticipants} workers @ ₦${rewardUnit} + 30% platform fee)`,
          created_at: new Date().toISOString(),
        });
      } catch (txErr) {
        console.warn("Transaction log notice:", txErr);
      }

      // 4. In-app notification to creator
      try {
        await supabase.from("notifications").insert({
          user_id: currentUser?.id,
          title: "Campaign Submitted for Review ⏳",
          message: `Your campaign "${taskData.title.trim()}" was submitted and is in pending review. Our team will verify and publish it live for earners shortly!`,
          type: "info",
          is_read: false,
          created_at: new Date().toISOString(),
        });
      } catch (notifErr) {
        console.warn("Notification notice:", notifErr);
      }

      // Refresh auth user data
      if (fetchUserData) await fetchUserData();

      setSubmitting(false);
      history.push("/tasks");
    } catch (err) {
      console.error("handleSubmitCampaign error:", err);
      setErrorMsg(err.response?.data?.message || err.message || "Failed to submit task campaign.");
      setSubmitting(false);
    }
  };

  return (
    <ClientLayout>
      <main className="w-full font-primary">
        {/* Top Breadcrumb & Progress */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 mb-6">
          <Link
            to="/tasks"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors"
          >
            <FaArrowLeft size={12} />
            <span>Back to Marketplace</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Step {step} of 5
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: Select Template */}
        {step === 1 && (
          <div className="space-y-4 sm:space-y-6">
            <div className="text-center max-w-xl mx-auto px-2">
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full text-[11px] font-bold uppercase tracking-wider">
                Step 1: Choose Campaign Type
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1.5">
                What type of task do you want to create?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Select a campaign category below to get started.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {TEMPLATES.map((tmpl) => {
                const isRedirect = tmpl.type === "redirect";
                const isSelected = taskData.category === tmpl.id;

                return (
                  <div
                    key={tmpl.id}
                    onClick={() => selectTemplate(tmpl)}
                    className={`bg-white rounded-2xl border p-4 sm:p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between group hover:shadow-md ${
                      isSelected
                        ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs"
                        : "border-slate-200/80 hover:border-emerald-400"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            tmpl.iconBg || "bg-slate-100"
                          } group-hover:scale-105 transition-transform`}
                        >
                          {tmpl.icon}
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide shrink-0 ${
                            tmpl.badgeColor || "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {tmpl.badge}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {tmpl.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                        {tmpl.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">
                        {isRedirect ? "From" : "Suggested"}{" "}
                        <strong className="text-slate-700 font-bold">₦{tmpl.defaultReward}</strong>
                      </span>
                      <span className="font-bold text-emerald-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        <span>{isRedirect ? "Continue" : "Select"}</span>
                        <FaArrowRight size={10} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Task Instructions & Details */}
        {step === 2 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider">
                Step 2: Task Details & Actions
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
                Describe Your Task & Step-by-Step Instructions
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Provide the link to your app/website and outline clear steps so workers complete your task accurately.
              </p>
            </div>

            <div className="space-y-5">
              {/* Campaign Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Download & test the DocsZar Android App"
                  value={taskData.title}
                  onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-emerald-500/30 focus:outline-hidden"
                />
              </div>

              {/* Target App / Website Link (Optional) */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/70 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 uppercase tracking-wider">
                    <FaLink className="text-emerald-600" size={13} />
                    <span>App / Website / Destination Link (Optional)</span>
                  </label>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">
                    Direct Action Link
                  </span>
                </div>
                <input
                  type="url"
                  placeholder="https://play.google.com/store/apps/details?id=... or https://yourwebsite.com"
                  value={taskData.targetUrl}
                  onChange={(e) => setTaskData({ ...taskData, targetUrl: e.target.value })}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-emerald-300/80 text-xs sm:text-sm font-mono text-slate-800 focus:ring-2 focus:ring-emerald-500/30 focus:outline-hidden"
                />
                <p className="text-[11px] text-emerald-800/80 leading-relaxed">
                  Add your Google Play Store, Apple App Store, Website, YouTube, or Social Media link. Workers will see a prominent <strong>"Open App / Task Link"</strong> button.
                </p>
              </div>

              {/* App / Brand Name & Short Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    App / Brand Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. DocsZar App, Kuda, @MyBrand"
                    value={taskData.appName}
                    onChange={(e) => setTaskData({ ...taskData, appName: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/30 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Short Overview / Context
                  </label>
                  <input
                    type="text"
                    placeholder="Brief summary of what this task is about..."
                    value={taskData.description}
                    onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/30 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Step-by-Step Instructions Builder */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <MdOutlineAssignment className="text-emerald-600" size={16} />
                      <span>Step-by-Step Action Guide for Workers</span>
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Workers will see each step numbered sequentially to complete your task accurately.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addStep}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:text-emerald-600 hover:border-emerald-500 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                  >
                    <FaPlus size={11} />
                    <span>Add Step</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(taskData.steps || []).map((stText, idx) => (
                    <div key={idx} className="flex items-start gap-2 sm:gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-1">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <textarea
                          rows={2}
                          value={stText}
                          onChange={(e) => updateStepText(idx, e.target.value)}
                          placeholder={`Step ${idx + 1}: e.g. Download the app and register with referral code...`}
                          className="w-full px-3 py-2 text-xs text-slate-800 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeStep(idx)}
                        disabled={(taskData.steps || []).length <= 1}
                        className="p-2 text-slate-400 hover:text-rose-500 transition-colors disabled:opacity-30 cursor-pointer"
                        title="Remove step"
                      >
                        <FaTrash size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Proof Requirements */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Required Evidence & Proof of Completion
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Select what workers must upload to prove they completed your task.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "screenshot", label: "📷 Screenshot Image" },
                    { id: "text", label: "✍️ Text (Username / ID / Details)" },
                    { id: "video", label: "🎥 Video / Screen Recording" },
                    { id: "file", label: "📁 File Upload" },
                  ].map((p) => {
                    const isChecked = taskData.proofTypes?.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => toggleProofType(p.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          isChecked
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                            : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
                        }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Proof Instructions / Verification Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Take a full screenshot showing your logged-in profile page with your username visible."
                    value={taskData.proofInstructions}
                    onChange={(e) => setTaskData({ ...taskData, proofInstructions: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/30 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(taskData.category === "survey" || taskData.hasSurvey ? 3 : 4)}
                disabled={!taskData.title.trim()}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 cursor-pointer disabled:opacity-50"
              >
                Continue to {taskData.category === "survey" || taskData.hasSurvey ? "Survey Builder" : "Targeting"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Built-In Survey Builder (if survey) */}
        {step === 3 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider">
                  Step 3: Built-In Survey Builder
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
                  Build Your Questionnaire
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Add questions for respondents. Responses will be viewable in your dashboard and exportable as CSV.
                </p>
              </div>

              <button
                type="button"
                onClick={addSurveyQuestion}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                <FaPlus size={12} />
                <span>Add Question</span>
              </button>
            </div>

            {/* Questions List */}
            <div className="space-y-5">
              {taskData.surveyQuestions.map((q, qIdx) => (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                      {qIdx + 1}
                    </span>
                    <input
                      type="text"
                      value={q.title}
                      onChange={(e) => updateQuestion(q.id, "title", e.target.value)}
                      placeholder="Enter question title..."
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden"
                    />
                    <select
                      value={q.type}
                      onChange={(e) => updateQuestion(q.id, "type", e.target.value)}
                      className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-hidden"
                    >
                      <option value="multiple_choice">Multiple Choice</option>
                      <option value="checkboxes">Checkboxes (Multi-select)</option>
                      <option value="short_answer">Short Text</option>
                      <option value="paragraph">Paragraph</option>
                      <option value="rating_scale">Rating (1-10)</option>
                      <option value="yes_no">Yes / No</option>
                      <option value="file_upload">File / Image Upload</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removeQuestion(q.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete question"
                    >
                      <FaTrash size={13} />
                    </button>
                  </div>

                  {/* Options List for Multiple Choice & Checkboxes */}
                  {(q.type === "multiple_choice" || q.type === "checkboxes") && (
                    <div className="pl-9 space-y-2">
                      <div className="text-[11px] font-bold text-slate-400 uppercase">Options</div>
                      {(q.options || []).map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => updateOptionText(q.id, optIdx, e.target.value)}
                            className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => removeOption(q.id, optIdx)}
                            className="text-slate-400 hover:text-rose-500 text-xs px-1"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addOptionToQuestion(q.id)}
                        className="text-xs font-bold text-emerald-600 hover:underline pt-1 inline-block cursor-pointer"
                      >
                        + Add another option
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                Continue to Audience Targeting
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Audience Targeting */}
        {step === 4 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider">
                Step 4: Worker Targeting
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
                Who qualifies to complete this task?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Target by Nigerian state, age group, smartphone OS, or keep it open to all workers nationwide.
              </p>
            </div>

            <div className="space-y-5">
              {/* Location Scope */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase">Geographic Location</span>
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={taskData.targeting.target_all}
                      onChange={(e) =>
                        setTaskData({
                          ...taskData,
                          targeting: { ...taskData.targeting, target_all: e.target.checked },
                        })
                      }
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-xs font-bold text-slate-600">All Nigerian States</span>
                  </label>
                </div>

                {!taskData.targeting.target_all && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Select Target States:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 bg-white rounded-xl border border-slate-200">
                      {NIGERIAN_STATES.map((st) => {
                        const isSelected = taskData.targeting.states?.includes(st);
                        return (
                          <label key={st} className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                const current = taskData.targeting.states || [];
                                const updated = e.target.checked
                                   ? [...current, st]
                                  : current.filter((s) => s !== st);
                                setTaskData({
                                  ...taskData,
                                  targeting: { ...taskData.targeting, states: updated },
                                });
                              }}
                              className="rounded text-emerald-600"
                            />
                            <span>{st}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Device OS Targeting */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <span className="text-xs font-bold text-slate-800 uppercase block">Required Device</span>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "all", label: "Any Device" },
                    { id: "android", label: "Android Only" },
                    { id: "ios", label: "iPhone / iPad" },
                  ].map((dev) => (
                    <button
                      key={dev.id}
                      type="button"
                      onClick={() =>
                        setTaskData({
                          ...taskData,
                          targeting: { ...taskData.targeting, device_types: [dev.id] },
                        })
                      }
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        taskData.targeting.device_types?.includes(dev.id)
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {dev.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(taskData.category === "survey" || taskData.hasSurvey ? 3 : 2)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(5)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                Continue to Budget & Review
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Budget, Escrow & Launch */}
        {step === 5 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider">
                Step 5: Budget & Launch Campaign
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
                Configure Quota & Escrow Budget
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Campaign funds are securely held in escrow and released directly to workers as you approve their verified submissions.
              </p>
            </div>

            {/* Quota & Reward Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Number of Workers Needed *
                </label>
                <input
                  type="number"
                  min={1}
                  value={taskData.totalSlots}
                  onChange={(e) =>
                    setTaskData({
                      ...taskData,
                      totalSlots: Math.max(1, parseInt(e.target.value) || 0),
                    })
                  }
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Reward Per Worker (₦) *
                </label>
                <input
                  type="number"
                  min={10}
                  value={taskData.rewardPerWorker}
                  onChange={(e) =>
                    setTaskData({
                      ...taskData,
                      rewardPerWorker: Math.max(10, parseFloat(e.target.value) || 0),
                    })
                  }
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-hidden"
                />
              </div>
            </div>

            {/* What You Are Paying For - Campaign Summary Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <FaEye className="text-emerald-600" size={13} />
                  <span>Campaign Verification & Details</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">
                  {taskData.category.replace(/_/g, " ")}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-500 font-medium">Campaign Title: </span>
                  <strong className="text-slate-900">{taskData.title || "Untitled Task"}</strong>
                </div>

                {taskData.targetUrl && (
                  <div>
                    <span className="text-slate-500 font-medium">Destination Link: </span>
                    <a
                      href={taskData.targetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-600 font-mono underline hover:text-emerald-700 break-all"
                    >
                      {taskData.targetUrl}
                    </a>
                  </div>
                )}

                {taskData.steps && taskData.steps.length > 0 && (
                  <div>
                    <span className="text-slate-500 font-medium block mb-1">
                      Action Steps for Workers ({taskData.steps.length} steps):
                    </span>
                    <ol className="list-decimal list-inside space-y-1 pl-1 text-slate-700 font-medium">
                      {taskData.steps.map((st, i) => (
                        <li key={i} className="line-clamp-2">
                          {st}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                <div>
                  <span className="text-slate-500 font-medium">Proof Required: </span>
                  <span className="text-slate-800 font-semibold">
                    {taskData.proofTypes?.join(", ") || "Screenshot"}
                  </span>
                  {taskData.proofInstructions && (
                    <p className="text-slate-500 italic mt-0.5 pl-2 border-l-2 border-slate-200">
                      "{taskData.proofInstructions}"
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Financial Summary Box */}
            <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-3 shadow-lg">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Campaign Escrow Breakdown
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm text-slate-300">
                <span>Worker Rewards ({taskData.totalSlots} workers × ₦{taskData.rewardPerWorker})</span>
                <span className="font-mono font-bold text-white">₦{numeral(workerBudget).format("0,0.00")}</span>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm text-slate-300">
                <span>Platform Moderation & Escrow Fee (30%)</span>
                <span className="font-mono font-bold text-white">₦{numeral(platformFee).format("0,0.00")}</span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Total Escrow Required</span>
                  <span className="text-2xl font-black text-emerald-400">
                    ₦{numeral(totalEscrow).format("0,0.00")}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Your Available Balance</span>
                  <span className={`text-sm font-bold ${isBalanceSufficient ? "text-emerald-400" : "text-rose-400"}`}>
                    ₦{numeral(userBalance).format("0,0.00")}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs flex items-center gap-2.5">
              <FaShieldHalved className="text-emerald-600 shrink-0" size={16} />
              <span>
                <strong>100% Escrow Protection:</strong> Funds are locked in escrow and only paid to workers when you review and approve their work, or after the review period.
              </span>
            </div>

            {!isBalanceSufficient && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between gap-4">
                <span>
                  You need <strong>₦{numeral(totalEscrow - userBalance).format("0,0.00")}</strong> more to publish this campaign.
                </span>
                <Link
                  to="/fund-wallet"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shrink-0"
                >
                  Fund Wallet
                </Link>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmitCampaign}
                disabled={submitting || !isBalanceSufficient}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/25 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <FaSpinner className="animate-spin" size={14} />
                    <span>Reserving Escrow & Publishing...</span>
                  </>
                ) : (
                  <>
                    <FaBoltLightning size={14} />
                    <span>Pay ₦{numeral(totalEscrow).format("0,0")} & Publish</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>
    </ClientLayout>
  );
};

export default CreateTaskWizard;
