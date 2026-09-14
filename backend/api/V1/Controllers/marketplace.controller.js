import taskMarketplaceService from "../services/taskMarketplace.service.js";
import { supabase } from "../config/supabase.config.js";
import { ErrorHandler } from "../utils/error.js";

export const getPublicMarketplaceTasks = async (req, res, next) => {
  try {
    const { category, platform, search } = req.query;

    let marketplaceTasks = [];
    try {
      marketplaceTasks = await taskMarketplaceService.getMarketplaceTasks(null, {
        category,
        search,
      });
    } catch (e) {
      marketplaceTasks = [];
    }

    let advertsData = [];
    try {
      const { data } = await supabase
        .from("advert_tasks")
        .select("*, users:user_id(username, avatar_url)")
        .in("status", ["active", "pending"])
        .order("created_at", { ascending: false })
        .limit(40);
      advertsData = data || [];
    } catch (e) {
      advertsData = [];
    }

    let engagementsData = [];
    try {
      const { data } = await supabase
        .from("engagement_tasks")
        .select("*, users:user_id(username, avatar_url)")
        .in("status", ["active", "pending"])
        .order("created_at", { ascending: false })
        .limit(40);
      engagementsData = data || [];
    } catch (e) {
      engagementsData = [];
    }

    const formattedAdverts = advertsData.map((t) => ({
      id: t.id,
      _id: t.id,
      title: t.title,
      description: t.caption || `Post advert on your ${t.platform} account and earn rewards.`,
      category: "social",
      platform: (t.platform || "whatsapp").toLowerCase(),
      reward_per_worker: Number(t.earner_fee) || 50,
      rewardAmount: Number(t.earner_fee) || 50,
      total_quota: t.number_of_tasks || 50,
      completed_count: t.tasks_done || 0,
      spots_remaining: Math.max(0, (t.number_of_tasks || 50) - (t.tasks_done || 0)),
      status: t.status === "pending" ? "active" : t.status,
      created_at: t.created_at,
      creator: {
        username: t.users?.username || "Verified Advertiser",
        avatar_url: t.users?.avatar_url,
      },
      requirements: ["WhatsApp or Social Media Account", "Screenshot Proof of Status / Post"],
    }));

    const formattedEngagements = (engagementsData || []).map((t) => ({
      id: t.id,
      _id: t.id,
      title: t.title,
      description: `Engage on ${t.platform}: ${t.task_type || "Follow / Like / Comment"}.`,
      category: "engagement",
      platform: (t.platform || "instagram").toLowerCase(),
      reward_per_worker: Number(t.earner_fee) || 25,
      rewardAmount: Number(t.earner_fee) || 25,
      total_quota: t.number_of_tasks || 100,
      completed_count: t.tasks_done || 0,
      spots_remaining: Math.max(0, (t.number_of_tasks || 100) - (t.tasks_done || 0)),
      status: t.status === "pending" ? "active" : t.status,
      created_at: t.created_at,
      creator: {
        username: t.users?.username || "Verified Advertiser",
        avatar_url: t.users?.avatar_url,
      },
      requirements: ["Active Account", "Screenshot Proof"],
    }));

    const FEATURED_PUBLIC_TASKS = [
      {
        id: "feat-1",
        _id: "feat-1",
        title: "Post Promo Video on WhatsApp Status (50+ views)",
        description: "Post our promotional video with caption and referral link on your WhatsApp status. Keep it up for 24 hours and upload a clear screenshot showing view count.",
        category: "social",
        platform: "whatsapp",
        reward_per_worker: 150,
        rewardAmount: 150,
        total_quota: 200,
        completed_count: 142,
        spots_remaining: 58,
        status: "active",
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        creator: {
          username: "GigsFlix Verified",
          avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        },
        requirements: ["WhatsApp with min 50 contact views", "Screenshot showing view count after 20+ hours"],
      },
      {
        id: "feat-2",
        _id: "feat-2",
        title: "Follow, Like & Comment on TikTok Brand Video",
        description: "Follow the official TikTok account, like the pinned video, and leave a genuine 5+ word comment related to the brand. Upload profile screenshot.",
        category: "engagement",
        platform: "tiktok",
        reward_per_worker: 100,
        rewardAmount: 100,
        total_quota: 500,
        completed_count: 388,
        spots_remaining: 112,
        status: "active",
        created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
        creator: {
          username: "Pulse Media Africa",
          avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        },
        requirements: ["Active TikTok Profile", "Screenshot showing followed + liked + your comment"],
      },
      {
        id: "feat-3",
        _id: "feat-3",
        title: "Retweet & Quote-Tweet Product Launch on X (Twitter)",
        description: "Repost the pinned announcement tweet with the required hashtag #GigsFlixLaunch and tag 2 friends. Submit your tweet link and screenshot.",
        category: "social",
        platform: "twitter",
        reward_per_worker: 120,
        rewardAmount: 120,
        total_quota: 300,
        completed_count: 215,
        spots_remaining: 85,
        status: "active",
        created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
        creator: {
          username: "FinTech Nigeria Hub",
          avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
        },
        requirements: ["Twitter/X account with 50+ followers", "Include required hashtag"],
      },
      {
        id: "feat-4",
        _id: "feat-4",
        title: "Download & Rate Fintech App on Google PlayStore (5-Star)",
        description: "Install the app from Google Playstore, test for 2 minutes, write a positive 5-star review, and upload a screenshot of your published review.",
        category: "app",
        platform: "playstore",
        reward_per_worker: 500,
        rewardAmount: 500,
        total_quota: 150,
        completed_count: 98,
        spots_remaining: 52,
        status: "active",
        created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
        creator: {
          username: "AppVentures Studio",
          avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
        },
        requirements: ["Android device with PlayStore", "Review must remain published for 48h"],
      },
      {
        id: "feat-5",
        _id: "feat-5",
        title: "Stream & Add Afrobeat Track to Spotify Playlist",
        description: "Stream the new single for at least 60 seconds, like the song (heart icon), and add it to any of your public playlists. Upload screenshot proof.",
        category: "engagement",
        platform: "spotify",
        reward_per_worker: 200,
        rewardAmount: 200,
        total_quota: 250,
        completed_count: 180,
        spots_remaining: 70,
        status: "active",
        created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
        creator: {
          username: "Afrobeats Daily",
          avatar_url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80",
        },
        requirements: ["Spotify Free or Premium account", "Screenshot showing song playing past 60s"],
      },
      {
        id: "feat-6",
        _id: "feat-6",
        title: "Join Telegram Crypto Discussion Community",
        description: "Join the official Telegram group, introduce yourself in the main chat, and remain active for at least 7 days.",
        category: "engagement",
        platform: "telegram",
        reward_per_worker: 150,
        rewardAmount: 150,
        total_quota: 400,
        completed_count: 260,
        spots_remaining: 140,
        status: "active",
        created_at: new Date(Date.now() - 3600000 * 16).toISOString(),
        creator: {
          username: "Web3 Africa Network",
          avatar_url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80",
        },
        requirements: ["Active Telegram account", "Screenshot inside the group showing your username"],
      },
      {
        id: "feat-7",
        _id: "feat-7",
        title: "Subscribe to YouTube Channel & Turn on Bell Notification",
        description: "Subscribe to the official YouTube channel, like the latest video, turn on all notifications, and upload proof.",
        category: "engagement",
        platform: "youtube",
        reward_per_worker: 100,
        rewardAmount: 100,
        total_quota: 500,
        completed_count: 420,
        spots_remaining: 80,
        status: "active",
        created_at: new Date(Date.now() - 3600000 * 20).toISOString(),
        creator: {
          username: "TechAfrica Media",
          avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
        },
        requirements: ["Google/YouTube account", "Screenshot with Subscribed + Bell notification icon active"],
      },
      {
        id: "feat-8",
        _id: "feat-8",
        title: "Complete 3-Minute Consumer Tech Preference Survey",
        description: "Answer 8 short questions about your online shopping and mobile payment habits. Honest answers required.",
        category: "survey",
        platform: "web",
        reward_per_worker: 350,
        rewardAmount: 350,
        total_quota: 100,
        completed_count: 73,
        spots_remaining: 27,
        status: "active",
        created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
        creator: {
          username: "Consumer Insights NG",
          avatar_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
        },
        requirements: ["Complete all survey fields", "Submit confirmation screen screenshot"],
      },
    ];

    // Combine all tasks with featured fallback
    let allPublicTasks = [...marketplaceTasks, ...formattedAdverts, ...formattedEngagements];
    if (allPublicTasks.length === 0) {
      allPublicTasks = FEATURED_PUBLIC_TASKS;
    } else {
      // Add featured tasks to live ones
      allPublicTasks = [...allPublicTasks, ...FEATURED_PUBLIC_TASKS];
    }

    // Filter by platform if provided
    if (platform && platform !== "all") {
      allPublicTasks = allPublicTasks.filter(
        (t) => (t.platform || "").toLowerCase() === platform.toLowerCase()
      );
    }

    // Filter by category if provided
    if (category && category !== "all") {
      allPublicTasks = allPublicTasks.filter(
        (t) => (t.category || "").toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by search query if provided
    if (search) {
      const q = search.toLowerCase();
      allPublicTasks = allPublicTasks.filter(
        (t) =>
          t.title?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.platform?.toLowerCase().includes(q)
      );
    }

    return res.status(200).json({
      success: true,
      total: allPublicTasks.length,
      data: allPublicTasks,
    });
  } catch (err) {
    console.error("getPublicMarketplaceTasks error:", err);
    next(err);
  }
};

export const getMarketplaceTasks = async (req, res, next) => {
  try {
    const workerUserId = req.user?.id || req.user?._id || null;
    const { category, search } = req.query;
    const tasks = await taskMarketplaceService.getMarketplaceTasks(workerUserId, {
      category,
      search,
    });
    return res.status(200).json({ success: true, data: tasks });
  } catch (err) {
    next(err);
  }
};

export const getMarketplaceTaskById = async (req, res, next) => {
  try {
    const workerUserId = req.user?.id || req.user?._id || null;
    const { id } = req.params;
    const task = await taskMarketplaceService.getTaskById(id, workerUserId);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found." });
    }
    return res.status(200).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

export const createMarketplaceTask = async (req, res, next) => {
  try {
    const creatorId =
      req.user?.id ||
      req.user?._id ||
      req.headers?.["x-user-id"] ||
      req.body?.userId ||
      req.body?.creatorId;

    if (!creatorId && !req.body?.email && !req.user?.email) {
      return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
    }

    const taskPayload = {
      ...req.body,
      email: req.body?.email || req.user?.email,
      username: req.body?.username || req.user?.username,
      userId: req.body?.userId || creatorId,
      creatorId: req.body?.creatorId || creatorId,
    };

    const task = await taskMarketplaceService.createTaskCampaign(creatorId, taskPayload);
    return res.status(201).json({
      success: true,
      message: "Campaign published and escrow budget reserved successfully.",
      data: task,
    });
  } catch (err) {
    next(err);
  }
};

export const reserveTaskSlot = async (req, res, next) => {
  try {
    const workerUserId = req.user?.id || req.user?._id;
    if (!workerUserId) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }
    const { id } = req.params;
    const reservation = await taskMarketplaceService.reserveSlot(id, workerUserId);
    return res.status(200).json({
      success: true,
      message: "Slot reserved. Please complete and submit before the timer expires.",
      data: reservation,
    });
  } catch (err) {
    next(err);
  }
};

export const releaseTaskReservation = async (req, res, next) => {
  try {
    const workerUserId = req.user?.id || req.user?._id;
    const { reservationId } = req.params;
    await taskMarketplaceService.releaseReservation(reservationId, workerUserId);
    return res.status(200).json({ success: true, message: "Reservation released." });
  } catch (err) {
    next(err);
  }
};

export const submitTaskProof = async (req, res, next) => {
  try {
    const workerUserId = req.user?.id || req.user?._id;
    if (!workerUserId) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }
    const { id } = req.params;
    const submission = await taskMarketplaceService.submitTaskProof(id, workerUserId, req.body);
    return res.status(201).json({
      success: true,
      message: "Proof submitted successfully. Awaiting creator review.",
      data: submission,
    });
  } catch (err) {
    next(err);
  }
};

export const getCreatorCampaigns = async (req, res, next) => {
  try {
    const creatorId = req.user?.id || req.user?._id;
    if (!creatorId) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }
    const campaigns = await taskMarketplaceService.getCreatorCampaigns(creatorId);
    return res.status(200).json({ success: true, data: campaigns });
  } catch (err) {
    next(err);
  }
};

export const getTaskSubmissions = async (req, res, next) => {
  try {
    const creatorId = req.user?.id || req.user?._id;
    const { taskId } = req.params;
    const result = await taskMarketplaceService.getSubmissionsForTask(taskId, creatorId);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const reviewTaskSubmission = async (req, res, next) => {
  try {
    const creatorId = req.user?.id || req.user?._id;
    const { submissionId } = req.params;
    const result = await taskMarketplaceService.reviewSubmission(submissionId, creatorId, req.body);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

export const fileTaskDispute = async (req, res, next) => {
  try {
    const workerUserId = req.user?.id || req.user?._id;
    const { submissionId } = req.params;
    const dispute = await taskMarketplaceService.fileDispute(submissionId, workerUserId, req.body);
    return res.status(201).json({
      success: true,
      message: "Dispute submitted to admin team for review.",
      data: dispute,
    });
  } catch (err) {
    next(err);
  }
};

export const exportSurveyCSV = async (req, res, next) => {
  try {
    const creatorId = req.user?.id || req.user?._id;
    const { taskId } = req.params;
    const { task, submissions } = await taskMarketplaceService.getSubmissionsForTask(taskId, creatorId);

    const questions = task.survey_questions || [];
    const headers = ["Submission ID", "Worker Username", "Date", "Status", ...questions.map((q) => `"${q.title.replace(/"/g, '""')}"`)];

    const rows = (submissions || []).map((s) => {
      const answers = s.survey_answers || {};
      const answerCols = questions.map((q) => {
        const val = answers[q.id] !== undefined ? answers[q.id] : "";
        const formatted = Array.isArray(val) ? val.join("; ") : String(val);
        return `"${formatted.replace(/"/g, '""')}"`;
      });

      return [
        `"${s.id}"`,
        `"${s.worker?.username || "Worker"}"`,
        `"${new Date(s.created_at).toISOString()}"`,
        `"${s.status}"`,
        ...answerCols,
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="survey_results_${taskId}.csv"`);
    return res.status(200).send(csvContent);
  } catch (err) {
    next(err);
  }
};
