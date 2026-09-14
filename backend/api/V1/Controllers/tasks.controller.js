import numeral from "numeral";
import { v4 as uuidv4, validate as isValidUUID } from "uuid";
import { supabase } from "../config/supabase.config.js";
import { userService, userDetailsService, taskService, notificationService } from "../services/supabaseDb.service.js";
import { ErrorHandler } from "../utils/error.js";
import {
  sendNotitfication,
  sendPushNotification,
} from "../utils/notification.js";
import logger from "../utils/logger.util.js";

// ==============================================================================
// 1. ADVERT TASK CONTROLLERS
// ==============================================================================

export const getAdvertTask = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { data: advertTask, error } = await supabase
      .from("advert_tasks")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !advertTask) {
      return res.status(200).json([]);
    }

    const formatted = [{
      id: advertTask.id,
      _id: advertTask.id,
      title: advertTask.title,
      taskType: advertTask.task_type || "advert",
      taskPlatform: advertTask.platform || "whatsapp",
      platform: advertTask.platform || "whatsapp",
      caption: advertTask.caption,
      mediaUrl: advertTask.media_url,
      gender: advertTask.gender || "All Genders",
      location: advertTask.location || "All Nigeria",
      religion: advertTask.religion || "All Religions",
      numberOfTasks: advertTask.number_of_tasks || 0,
      tasksDone: advertTask.tasks_done || 0,
      completedTasks: advertTask.tasks_done || 0,
      allocatedTasks: advertTask.tasks_done || 0,
      amountPaid: advertTask.amount_paid || 0,
      costPerTask: Number(advertTask.number_of_tasks) > 0 ? Number(advertTask.amount_paid) / Number(advertTask.number_of_tasks) : 0,
      earnerFee: advertTask.earner_fee || 0,
      status: advertTask.status || "pending",
      createdAt: advertTask.created_at || new Date().toISOString(),
      updatedAt: advertTask.updated_at || new Date().toISOString(),
      ...advertTask,
    }];
    return res.status(200).json(formatted);
  } catch (error) {
    next(error);
  }
};

export const getAdvertTasks = async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const taskPlatform = req.query.platform || null;
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const userId = req.user?.id || req.user?._id || req.headers["x-user-id"] || req.query.userId || req.query.user_id;

  try {
    let query = supabase
      .from("advert_tasks")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (userId) {
      query = query.eq("user_id", userId);
    }

    if (taskPlatform) {
      query = query.eq("platform", taskPlatform);
    }

    const { data: advertTasks, count, error } = await query.range(from, to);
    if (error) throw error;

    const adverttasks = (advertTasks || []).map((t) => ({
      id: t.id,
      _id: t.id,
      ...t,
      createdBy: t.user_id,
      taskPlatform: t.platform,
    }));

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    const response =
      Number(req.query.limit) > 0
        ? {
            data: adverttasks,
            meta: {
              total: totalCount,
              pages: totalPages,
            },
          }
        : {
            total: totalCount,
            pages: totalPages,
          };
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const postAdvertTask = async (req, res, next) => {
  const {
    earnId,
    payId,
    title,
    taskType = "advert",
    gender,
    location,
    religion,
    caption,
    mediaUrl,
    numberOfTasks,
    taskPlatform,
    amountToPay: reqAmountToPay,
    amountToEarn: reqAmountToEarn,
    userId: bodyUserId,
    creatorId: bodyCreatorId,
    email: bodyEmail,
    username: bodyUsername,
  } = req.body;

  try {
    const rawUserId = req.user?.id || req.user?._id || req.headers["x-user-id"] || bodyUserId || bodyCreatorId;
    const rawEmail = req.user?.email || bodyEmail;
    const rawUsername = req.user?.username || bodyUsername;
    const amountToPay = Number(reqAmountToPay) || 100;
    const amountToEarn = Number(reqAmountToEarn) || Math.round(amountToPay * 0.7);

    const paymentResponse = await processPayment(
      Number(numberOfTasks) * Number(amountToPay),
      taskType,
      rawUserId,
      rawEmail,
      rawUsername
    );
    if (!paymentResponse.status) {
      return res.status(400).json(paymentResponse);
    }

    const resolvedUserId = paymentResponse.user?.id || rawUserId;

    const payload = {
      user_id: resolvedUserId,
      title: title || `${taskPlatform} Advert Task`,
      caption,
      media_url: mediaUrl,
      platform: taskPlatform || "generic",
      task_type: taskType,
      gender,
      location,
      religion,
      number_of_tasks: Number(numberOfTasks),
      tasks_done: 0,
      amount_paid: Number(numberOfTasks) * Number(amountToPay),
      earner_fee: Number(amountToEarn),
      status: "pending",
    };

    const { data: newTask, error } = await supabase
      .from("advert_tasks")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({
      status: true,
      failed: false,
      message: "Advert Task Created Successfully",
      data: newTask,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================================================================
// 2. ENGAGEMENT TASK CONTROLLERS
// ==============================================================================

export const getEngagementTask = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { data: engagementTask, error } = await supabase
      .from("engagement_tasks")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !engagementTask) {
      return res.status(200).json([]);
    }

    const formatted = [{
      id: engagementTask.id,
      _id: engagementTask.id,
      title: engagementTask.title,
      taskType: engagementTask.task_type || "engagement",
      taskPlatform: engagementTask.platform || "social",
      platform: engagementTask.platform || "social",
      link: engagementTask.action_link,
      actionLink: engagementTask.action_link,
      gender: engagementTask.gender || "All Genders",
      location: engagementTask.location || "All Nigeria",
      religion: engagementTask.religion || "All Religions",
      numberOfTasks: engagementTask.number_of_tasks || 0,
      tasksDone: engagementTask.tasks_done || 0,
      completedTasks: engagementTask.tasks_done || 0,
      allocatedTasks: engagementTask.tasks_done || 0,
      amountPaid: engagementTask.amount_paid || 0,
      costPerTask: Number(engagementTask.number_of_tasks) > 0 ? Number(engagementTask.amount_paid) / Number(engagementTask.number_of_tasks) : 0,
      earnerFee: engagementTask.earner_fee || 0,
      status: engagementTask.status || "pending",
      createdAt: engagementTask.created_at || new Date().toISOString(),
      updatedAt: engagementTask.updated_at || new Date().toISOString(),
      ...engagementTask,
    }];
    return res.status(200).json(formatted);
  } catch (error) {
    next(error);
  }
};

export const getUserOrders = async (req, res, next) => {
  const userId = req.user?.id || req.user?._id || req.headers["x-user-id"] || req.query.userId || req.query.user_id;
  try {
    let advQuery = supabase.from("advert_tasks").select("*").order("created_at", { ascending: false });
    let engQuery = supabase.from("engagement_tasks").select("*").order("created_at", { ascending: false });

    if (userId) {
      advQuery = advQuery.eq("user_id", userId);
      engQuery = engQuery.eq("user_id", userId);
    }

    const [advertsRes, engagementsRes] = await Promise.all([
      advQuery,
      engQuery,
    ]);

    const formattedAdverts = (advertsRes.data || []).map((t) => ({
      id: t.id,
      _id: t.id,
      ...t,
      orderType: "advert",
      taskType: "advert",
      taskPlatform: t.platform || "whatsapp",
      platform: t.platform || "whatsapp",
      slug: "adverts",
      title: t.title || `Advert on ${(t.platform || "whatsapp").toUpperCase()} Status`,
      numberOfTasks: Number(t.number_of_tasks) || 0,
      tasksDone: Number(t.tasks_done) || 0,
      completedTasks: Number(t.tasks_done) || 0,
      allocatedTasks: Number(t.tasks_done) || 0,
      amountPaid: Number(t.amount_paid) || 0,
      costPerTask: Number(t.number_of_tasks) > 0 ? Number(t.amount_paid) / Number(t.number_of_tasks) : 0,
      earnerFee: Number(t.earner_fee) || 0,
      status: t.status || "pending",
      createdAt: t.created_at,
    }));

    const formattedEngagements = (engagementsRes.data || []).map((t) => ({
      id: t.id,
      _id: t.id,
      ...t,
      orderType: "engagement",
      taskType: "engagement",
      taskPlatform: t.platform || "social",
      platform: t.platform || "social",
      slug: "engagements",
      title: t.title || `${(t.platform || "social").toUpperCase()} Engagement Task`,
      numberOfTasks: Number(t.number_of_tasks) || 0,
      tasksDone: Number(t.tasks_done) || 0,
      completedTasks: Number(t.tasks_done) || 0,
      allocatedTasks: Number(t.tasks_done) || 0,
      amountPaid: Number(t.amount_paid) || 0,
      costPerTask: Number(t.number_of_tasks) > 0 ? Number(t.amount_paid) / Number(t.number_of_tasks) : 0,
      earnerFee: Number(t.earner_fee) || 0,
      status: t.status || "pending",
      createdAt: t.created_at,
    }));

    const allOrders = [...formattedAdverts, ...formattedEngagements].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return res.status(200).json({
      failed: false,
      data: allOrders,
      meta: {
        total: allOrders.length,
        advertsCount: formattedAdverts.length,
        engagementsCount: formattedEngagements.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getEngagementTasks = async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const taskPlatform = req.query.platform || null;
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const userId = req.user?.id || req.user?._id || req.headers["x-user-id"] || req.query.userId || req.query.user_id;

  try {
    let query = supabase
      .from("engagement_tasks")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (userId) {
      query = query.eq("user_id", userId);
    }

    if (taskPlatform) {
      query = query.eq("platform", taskPlatform);
    }

    const { data: engagementTasks, count, error } = await query.range(from, to);
    if (error) throw error;

    const formatted = (engagementTasks || []).map((t) => ({
      id: t.id,
      _id: t.id,
      ...t,
      createdBy: t.user_id,
      taskPlatform: t.platform,
    }));

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    const response =
      Number(req.query.limit) > 0
        ? {
            data: formatted,
            meta: {
              total: totalCount,
              pages: totalPages,
            },
          }
        : {
            total: totalCount,
            pages: totalPages,
          };
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const postEngagementTask = async (req, res, next) => {
  const {
    earnId,
    payId,
    title,
    taskType = "engagement",
    gender,
    location,
    religion,
    taskPlatform,
    numberOfTasks,
    taskUrl,
    link,
    amountToPay: reqAmountToPay,
    amountToEarn: reqAmountToEarn,
    userId: bodyUserId,
    creatorId: bodyCreatorId,
    email: bodyEmail,
    username: bodyUsername,
  } = req.body;

  try {
    const rawUserId = req.user?.id || req.user?._id || req.headers["x-user-id"] || bodyUserId || bodyCreatorId;
    const rawEmail = req.user?.email || bodyEmail;
    const rawUsername = req.user?.username || bodyUsername;
    const amountToPay = Number(reqAmountToPay) || 20;
    const amountToEarn = Number(reqAmountToEarn) || Math.round(amountToPay * 0.7);

    const paymentResponse = await processPayment(
      Number(numberOfTasks) * Number(amountToPay),
      taskType,
      rawUserId,
      rawEmail,
      rawUsername
    );
    if (!paymentResponse.status) {
      return res.status(400).json(paymentResponse);
    }

    const resolvedUserId = paymentResponse.user?.id || rawUserId;

    const payload = {
      user_id: resolvedUserId,
      title: title || `${taskPlatform} Engagement Task`,
      platform: taskPlatform || "generic",
      task_type: taskType,
      action_link: taskUrl || link || "",
      gender,
      location,
      religion,
      number_of_tasks: Number(numberOfTasks),
      tasks_done: 0,
      amount_paid: Number(numberOfTasks) * Number(amountToPay),
      earner_fee: Number(amountToEarn),
      status: "pending",
    };

    const { data: newTask, error } = await supabase
      .from("engagement_tasks")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({
      status: true,
      failed: false,
      message: "Engagement Task Created Successfully",
      data: newTask,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================================================================
// 3. TASK STATISTICS & USER TOTALS
// ==============================================================================

const matchesEngagementAction = (task, { slug, title, action }) => {
  const queryStr = `${slug || ""} ${title || ""} ${action || ""}`.toLowerCase();
  const taskTitle = (task.title || "").toLowerCase();

  if (queryStr.includes("comment")) {
    return taskTitle.includes("comment");
  }
  if (queryStr.includes("like")) {
    return taskTitle.includes("like") && !taskTitle.includes("comment") && !taskTitle.includes("follow");
  }
  if (queryStr.includes("follow")) {
    return (taskTitle.includes("follow") || taskTitle.includes("follower")) && !taskTitle.includes("comment") && !taskTitle.includes("like");
  }
  if (queryStr.includes("sub")) {
    return (taskTitle.includes("sub") || taskTitle.includes("channel")) && !taskTitle.includes("like");
  }
  if (queryStr.includes("retweet") || queryStr.includes("quote") || queryStr.includes("rt")) {
    return taskTitle.includes("retweet") || taskTitle.includes("quote") || taskTitle.includes("rt");
  }
  if (queryStr.includes("review") || queryStr.includes("download") || queryStr.includes("playstore") || queryStr.includes("app")) {
    return taskTitle.includes("review") || taskTitle.includes("download") || taskTitle.includes("playstore") || taskTitle.includes("app");
  }
  if (queryStr.includes("stream") || queryStr.includes("music") || queryStr.includes("spotify") || queryStr.includes("audiomack")) {
    return taskTitle.includes("stream") || taskTitle.includes("spotify") || taskTitle.includes("music") || taskTitle.includes("audiomack");
  }

  return true;
};

export const getTotalTasks = async (req, res, next) => {
  try {
    const type = req.query.type;
    const platform = req.query.platform ? req.query.platform.toLowerCase().trim() : null;
    const slug = req.query.slug ? req.query.slug.toLowerCase().trim() : null;
    const title = req.query.title ? req.query.title.toLowerCase().trim() : null;
    const userId = req.user?.id || req.user?._id || req.headers?.["x-user-id"] || req.query?.userId || req.query?.user_id;

    // Fetch task IDs that this user has already completed, submitted, or is currently working on
    let userHistoryTaskIds = new Set();
    if (userId) {
      const [compRes, revRes, powRes, allocRes] = await Promise.all([
        supabase.from("completed_tasks").select("task_id").eq("user_id", userId),
        supabase.from("in_review_tasks").select("task_id").eq("user_id", userId),
        supabase.from("proof_of_work").select("task_id").eq("user_id", userId),
        supabase.from("allocated_tasks").select("task_id").eq("user_id", userId),
      ]);

      userHistoryTaskIds = new Set(
        [
          ...(compRes.data || []).map((r) => r.task_id),
          ...(revRes.data || []).map((r) => r.task_id),
          ...(powRes.data || []).map((r) => r.task_id),
          ...(allocRes.data || []).map((r) => r.task_id),
        ].filter(Boolean)
      );
    }

    let advertCount = 0;
    let engagementCount = 0;

    if (!type || type === "advert") {
      try {
        let aQuery = supabase
          .from("advert_tasks")
          .select("id, user_id, platform, tasks_done, number_of_tasks, status, title")
          .in("status", ["pending", "active"]);

        if (platform && platform !== "all") {
          aQuery = aQuery.ilike("platform", `%${platform}%`);
        }
        const { data: aData } = await aQuery;
        if (aData) {
          advertCount = aData.filter((t) => {
            const hasQuota = (Number(t.tasks_done) || 0) < (Number(t.number_of_tasks) || 1);
            if (!hasQuota) return false;
            // Exclude if user already completed/submitted this task
            if (userId && userHistoryTaskIds.has(t.id)) return false;
            // Exclude if user created the task themselves
            if (userId && t.user_id === userId) return false;
            return true;
          }).length;
        }
      } catch (e) {
        console.error("Error fetching advert count:", e);
      }
    }

    if (!type || type === "engagement" || type === "normal") {
      try {
        let eQuery = supabase
          .from("engagement_tasks")
          .select("id, user_id, platform, tasks_done, number_of_tasks, status, title")
          .in("status", ["pending", "active"]);

        if (platform && platform !== "all") {
          eQuery = eQuery.ilike("platform", `%${platform}%`);
        }
        const { data: eData } = await eQuery;
        if (eData) {
          engagementCount = eData.filter((t) => {
            const hasQuota = (Number(t.tasks_done) || 0) < (Number(t.number_of_tasks) || 1);
            if (!hasQuota) return false;
            // Exclude if user already completed/submitted this task
            if (userId && userHistoryTaskIds.has(t.id)) return false;
            // Exclude if user created the task themselves
            if (userId && t.user_id === userId) return false;
            if (slug || title) {
              return matchesEngagementAction(t, { slug, title });
            }
            return true;
          }).length;
        }
      } catch (e) {
        console.error("Error fetching engagement count:", e);
      }
    }

    const total =
      type === "advert"
        ? advertCount
        : type === "engagement" || type === "normal"
        ? engagementCount
        : advertCount + engagementCount;

    return res.status(200).json({
      failed: false,
      total,
      totalAdvert: advertCount,
      totalEngagement: engagementCount,
      totalCompleted: 0,
    });
  } catch (error) {
    return res.status(200).json({ failed: false, total: 0, totalAdvert: 0, totalEngagement: 0 });
  }
};

export const getUserTotalTasks = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(200).json({
        pending: 0,
        "in-review": 0,
        inReview: 0,
        failed: 0,
        completed: 0,
        cancelled: 0,
      });
    }

    const [pendingRes, inReviewRes, compRes, failedRes, cancRes] = await Promise.all([
      supabase.from("allocated_tasks").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabase.from("in_review_tasks").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabase.from("completed_tasks").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabase.from("failed_tasks").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabase.from("cancelled_tasks").select("id", { count: "exact", head: true }).eq("user_id", userId),
    ]);

    const counts = {
      pending: pendingRes.count || 0,
      "in-review": inReviewRes.count || 0,
      inReview: inReviewRes.count || 0,
      failed: failedRes.count || 0,
      completed: compRes.count || 0,
      cancelled: cancRes.count || 0,
    };

    return res.status(200).json(counts);
  } catch (error) {
    return res.status(200).json({
      pending: 0,
      "in-review": 0,
      inReview: 0,
      failed: 0,
      completed: 0,
      cancelled: 0,
    });
  }
};

// Resilient helper to find authenticated user record across ID, email, username, or header
const resolveUserRecord = async (req) => {
  const userId =
    req.user?.id ||
    req.user?._id ||
    req.headers?.["x-user-id"] ||
    req.headers?.["user-id"] ||
    req.query?.userId ||
    req.query?.user_id ||
    req.body?.userId ||
    req.body?.user_id;

  const email = req.user?.email || req.query?.email || req.body?.email;
  const username = req.user?.username || req.query?.username || req.body?.username;

  if (userId) {
    const { data: byId } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (byId) return byId;
  }

  if (email) {
    const { data: byEmail } = await supabase
      .from("users")
      .select("*")
      .ilike("email", email.trim())
      .maybeSingle();
    if (byEmail) return byEmail;
  }

  if (username) {
    const { data: byUname } = await supabase
      .from("users")
      .select("*")
      .ilike("username", username.trim())
      .maybeSingle();
    if (byUname) return byUname;
  }

  if (userId && typeof userId === "string") {
    const { data: byFallback } = await supabase
      .from("users")
      .select("*")
      .or(`email.ilike.${userId},username.ilike.${userId}`)
      .maybeSingle();
    if (byFallback) return byFallback;
  }

  return null;
};

// ==============================================================================
// 4. TASK ALLOCATION & COMPLETION LIFECYCLE
// ==============================================================================

export const generateTask = async (req, res, next) => {
  try {
    const taskType = req.query.type || req.body?.taskType || "advert";
    const rawPlatform = req.query.platform || req.body?.platform || "whatsapp";
    const platform = String(rawPlatform).toLowerCase();
    const slug = (req.query.slug || req.body?.slug || "").toLowerCase();
    const title = (req.query.title || req.body?.title || "").toLowerCase();

    const userRecord = await resolveUserRecord(req);
    const userId = userRecord?.id || req.user?.id || req.headers?.["x-user-id"];

    // PRO Membership Gate for high-paying tasks (WhatsApp Status, Adverts, Surveys, Reviews)
    const isProTask =
      taskType === "advert" ||
      slug.includes("status") ||
      slug.includes("survey") ||
      slug.includes("review") ||
      title.includes("advert") ||
      title.includes("status");

    if (isProTask) {
      const isMember = userRecord?.is_member === true;
      if (!isMember) {
        return res.status(403).json({
          failed: true,
          isProRequired: true,
          message:
            "PRO Membership required to access high-paying advert tasks and paid surveys. Upgrade your account to unlock lifetime access.",
        });
      }
    }

    // 1. Check if user already has an active, unexpired task allocation for this EXACT taskType AND platform
    if (userId) {
      const { data: activeAllocations } = await supabase
        .from("allocated_tasks")
        .select("*")
        .eq("user_id", userId)
        .eq("task_type", taskType)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(5);

      if (activeAllocations && activeAllocations.length > 0) {
        for (const activeAlloc of activeAllocations) {
          const timeLeftS = Math.max(
            30,
            Math.floor((new Date(activeAlloc.expires_at).getTime() - Date.now()) / 1000)
          );

          let existingTask = null;
          if (activeAlloc.task_id && isValidUUID(activeAlloc.task_id)) {
            existingTask = await taskService.getTaskById(activeAlloc.task_id, taskType);
          }

          // Strict platform isolation: only return if platform matches the requested platform
          const allocPlatform = (existingTask?.platform || "").toLowerCase();
          if (existingTask && (allocPlatform === platform || (!allocPlatform && platform === "whatsapp") || platform === "all")) {
            return res.status(200).json({
              ...existingTask,
              id: existingTask.id,
              _id: existingTask.id,
              allocationId: activeAlloc.id,
              taskType,
              taskPlatform: existingTask.platform || platform,
              platform: existingTask.platform || platform,
              timeLeftS,
              status: "pending",
              createdAt: activeAlloc.created_at || new Date().toISOString(),
            });
          }
        }
      }
    }

    // 2. Query all task IDs that the user has ALREADY interacted with to prevent duplicate assignments
    let userHistoryTaskIds = new Set();
    if (userId) {
      const [compRes, revRes, powRes, failRes, cancRes] = await Promise.all([
        supabase.from("completed_tasks").select("task_id").eq("user_id", userId),
        supabase.from("in_review_tasks").select("task_id").eq("user_id", userId),
        supabase.from("proof_of_work").select("task_id").eq("user_id", userId),
        supabase.from("failed_tasks").select("task_id").eq("user_id", userId),
        supabase.from("cancelled_tasks").select("task_id").eq("user_id", userId),
      ]);

      userHistoryTaskIds = new Set(
        [
          ...(compRes.data || []).map((r) => r.task_id),
          ...(revRes.data || []).map((r) => r.task_id),
          ...(powRes.data || []).map((r) => r.task_id),
          ...(failRes.data || []).map((r) => r.task_id),
          ...(cancRes.data || []).map((r) => r.task_id),
        ].filter(Boolean)
      );
    }

    // 3. Find available campaign tasks in database strictly matching the requested platform
    let task = null;
    const table = taskType === "engagement" ? "engagement_tasks" : "advert_tasks";
    try {
      let query = supabase.from(table).select("*").in("status", ["pending", "active"]);
      if (platform && platform !== "all") {
        query = query.ilike("platform", `%${platform}%`);
      }
      const { data: dbTasks } = await query;
      const availableTasks = (dbTasks || []).filter((t) => {
        // Exclude if already submitted proof by user
        if (userHistoryTaskIds.has(t.id)) return false;
        // Check if task quota remaining
        if (
          t.tasks_done !== undefined &&
          t.number_of_tasks !== undefined &&
          Number(t.tasks_done) >= Number(t.number_of_tasks)
        ) {
          return false;
        }
        if (taskType === "engagement" && (slug || title)) {
          if (!matchesEngagementAction(t, { slug, title })) return false;
        }
        return true;
      });

      if (availableTasks.length > 0) {
        task = availableTasks[0];
      }
    } catch (e) {
      task = null;
    }

    // 4. If an available campaign task is found, allocate it and return
    const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString();

    if (task) {
      let allocationId = null;
      if (userId) {
        const { data: allocRecord } = await supabase
          .from("allocated_tasks")
          .insert({
            user_id: userId,
            task_id: task.id,
            task_type: taskType,
            status: "allocated",
            expires_at: expiresAt,
          })
          .select()
          .single();
        allocationId = allocRecord?.id;
      }

      return res.status(200).json({
        id: task.id,
        _id: task.id,
        allocationId,
        title: task.title,
        taskType,
        taskPlatform: task.platform || platform,
        platform: task.platform || platform,
        caption: task.caption || `Promote with Zargigs on ${platform.toUpperCase()}. Earn daily income with ease!`,
        link: task.action_link || task.link || (platform === "facebook" ? "https://facebook.com" : platform === "instagram" ? "https://instagram.com" : platform === "twitter" ? "https://x.com" : "https://zargigs.com"),
        mediaUrl:
          task.media_url ||
          task.mediaUrl ||
          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
        earningPerTask: Number(task.earner_fee) || (taskType === "advert" ? 100 : 10),
        earner_fee: Number(task.earner_fee) || (taskType === "advert" ? 100 : 10),
        timeLeftS: 3600,
        status: "pending",
        createdAt: task.created_at || new Date().toISOString(),
      });
    }

    // 5. If no manual advertiser tasks exist, return no-task available
    const platformDisplayName = platform.charAt(0).toUpperCase() + platform.slice(1);
    return res.status(200).json({
      failed: true,
      hasTask: false,
      message: `There are currently no active tasks available for ${platformDisplayName}. Please check back later or explore other platforms!`,
    });
  } catch (error) {
    console.error("generateTask error:", error);
    next(error);
  }
};

export const cancelGeneratedTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userRecord = await resolveUserRecord(req);
    const userId = userRecord?.id || req.user?.id || req.user?._id;

    if (id && isValidUUID(id)) {
      if (userId) {
        await supabase
          .from("cancelled_tasks")
          .insert({
            user_id: userId,
            task_id: id,
            task_type: "advert",
          })
          .catch(() => {});

        await supabase
          .from("allocated_tasks")
          .delete()
          .or(`id.eq.${id},task_id.eq.${id}`)
          .eq("user_id", userId);
      }
    } else if (id && userId) {
      await supabase.from("allocated_tasks").delete().eq("user_id", userId);
    }

    return res.status(200).json({ failed: false, message: "Task cancelled successfully" });
  } catch (error) {
    next(error);
  }
};

export const getUserTasksHistory = async (req, res, next) => {
  try {
    const userRecord = await resolveUserRecord(req);
    const userId = userRecord?.id || req.user?.id || req.user?._id;
    const requestedStatus = (req.query.status || "").toLowerCase().trim();

    const [
      inReviewRes,
      completedRes,
      pendingRes,
      failedRes,
      cancelledRes,
      advertsRes,
      engagementsRes,
    ] = await Promise.all([
      userId ? supabase.from("in_review_tasks").select("*").eq("user_id", userId).order("created_at", { ascending: false }) : { data: [] },
      userId ? supabase.from("completed_tasks").select("*").eq("user_id", userId).order("created_at", { ascending: false }) : { data: [] },
      userId ? supabase.from("allocated_tasks").select("*").eq("user_id", userId).order("created_at", { ascending: false }) : { data: [] },
      userId ? supabase.from("failed_tasks").select("*").eq("user_id", userId).order("created_at", { ascending: false }) : { data: [] },
      userId ? supabase.from("cancelled_tasks").select("*").eq("user_id", userId).order("created_at", { ascending: false }) : { data: [] },
      supabase.from("advert_tasks").select("id, title, platform, earner_fee, task_type"),
      supabase.from("engagement_tasks").select("id, title, platform, earner_fee, task_type"),
    ]);

    const advMap = new Map((advertsRes.data || []).map((t) => [t.id, t]));
    const engMap = new Map((engagementsRes.data || []).map((t) => [t.id, t]));

    const formatList = (list, defaultStatus) =>
      (list || []).map((item) => {
        const taskId = item.task_id || item.taskId || item.id;
        const parentTask = engMap.get(taskId) || advMap.get(taskId);
        const resolvedType = parentTask?.task_type || item.task_type || (advMap.has(taskId) ? "advert" : "engagement");
        const resolvedPlatform = parentTask?.platform || item.platform || item.task_platform || (resolvedType === "advert" ? "whatsapp" : "social");
        const resolvedFee = Number(parentTask?.earner_fee ?? item.reward ?? item.earner_fee ?? (resolvedType === "advert" ? 100 : 25));
        const resolvedTitle =
          parentTask?.title ||
          item.title ||
          (resolvedType === "advert"
            ? `Post Advert on ${resolvedPlatform.toUpperCase()} Status`
            : `Perform Verified ${resolvedPlatform.toUpperCase()} Task`);

        return {
          id: item.id,
          _id: item.id,
          taskId: taskId,
          title: resolvedTitle,
          taskType: resolvedType,
          taskPlatform: resolvedPlatform,
          platform: resolvedPlatform,
          earningPerTask: resolvedFee,
          reward: resolvedFee,
          earner_fee: resolvedFee,
          status: item.status || defaultStatus,
          createdAt: item.created_at || new Date().toISOString(),
          ...item,
        };
      });

    const inReview = formatList(inReviewRes.data, "in-review");
    const completed = formatList(completedRes.data, "completed");
    const pending = formatList(pendingRes.data, "pending");
    const failed = formatList(failedRes.data, "failed");
    const cancelled = formatList(cancelledRes.data, "cancelled");

    if (requestedStatus === "in-review" || requestedStatus === "inreview") {
      return res.status(200).json(inReview);
    }
    if (requestedStatus === "completed") {
      return res.status(200).json(completed);
    }
    if (requestedStatus === "pending") {
      return res.status(200).json(pending);
    }
    if (requestedStatus === "failed") {
      return res.status(200).json(failed);
    }
    if (requestedStatus === "cancelled") {
      return res.status(200).json(cancelled);
    }

    return res.status(200).json({
      failed: false,
      "in-review": inReview,
      inReview,
      completed,
      pending,
      failed,
      cancelled,
    });
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const userRecord = await resolveUserRecord(req);
    const userId = userRecord?.id || req.user?.id || req.user?._id;
    const taskStatus = (req.query.status || "pending").toLowerCase();
    const taskType = req.query.type || "advert";
    const platform = req.query.platform || "all";

    if (taskStatus === "in-review" && userId) {
      const { data: inReviewList } = await supabase
        .from("in_review_tasks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      const enriched = (inReviewList || []).map((t) => ({
        id: t.id,
        _id: t.id,
        taskId: t.task_id,
        title:
          t.task_type === "advert" || taskType === "advert"
            ? `Post Advert on ${(platform !== "all" ? platform : "WhatsApp").toUpperCase()} Status`
            : `Perform Verified ${(platform !== "all" ? platform : "Social").toUpperCase()} Task`,
        taskType: t.task_type || taskType,
        taskPlatform: platform !== "all" ? platform : "whatsapp",
        platform: platform !== "all" ? platform : "whatsapp",
        earningPerTask: t.task_type === "advert" || taskType === "advert" ? 100 : 25,
        earner_fee: t.task_type === "advert" || taskType === "advert" ? 100 : 25,
        status: "in-review",
        createdAt: t.created_at,
      }));

      return res.status(200).json({ failed: false, data: enriched });
    }

    if (taskStatus === "completed" && userId) {
      const { data: completedList } = await supabase
        .from("completed_tasks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      const enriched = (completedList || []).map((t) => ({
        id: t.id,
        _id: t.id,
        taskId: t.task_id,
        title:
          t.task_type === "advert" || taskType === "advert"
            ? `Post Advert on ${(platform !== "all" ? platform : "WhatsApp").toUpperCase()} Status`
            : `Perform Verified ${(platform !== "all" ? platform : "Social").toUpperCase()} Task`,
        taskType: t.task_type || taskType,
        taskPlatform: platform !== "all" ? platform : "whatsapp",
        platform: platform !== "all" ? platform : "whatsapp",
        earningPerTask: Number(t.reward) || (t.task_type === "advert" || taskType === "advert" ? 100 : 25),
        earner_fee: Number(t.reward) || (t.task_type === "advert" || taskType === "advert" ? 100 : 25),
        status: "completed",
        createdAt: t.created_at,
      }));

      return res.status(200).json({ failed: false, data: enriched });
    }

    if (taskStatus === "failed" && userId) {
      const { data: failedList } = await supabase
        .from("failed_tasks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      const enriched = (failedList || []).map((t) => ({
        id: t.id,
        _id: t.id,
        taskId: t.task_id,
        title:
          t.task_type === "advert" || taskType === "advert"
            ? `Post Advert on ${(platform !== "all" ? platform : "WhatsApp").toUpperCase()} Status`
            : `Perform Verified ${(platform !== "all" ? platform : "Social").toUpperCase()} Task`,
        taskType: t.task_type || taskType,
        taskPlatform: platform !== "all" ? platform : "whatsapp",
        platform: platform !== "all" ? platform : "whatsapp",
        earningPerTask: t.task_type === "advert" || taskType === "advert" ? 100 : 25,
        earner_fee: t.task_type === "advert" || taskType === "advert" ? 100 : 25,
        status: "failed",
        createdAt: t.created_at,
      }));

      return res.status(200).json({ failed: false, data: enriched });
    }

    if (taskStatus === "cancelled" && userId) {
      const { data: cancelledList } = await supabase
        .from("cancelled_tasks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      const enriched = (cancelledList || []).map((t) => ({
        id: t.id,
        _id: t.id,
        taskId: t.task_id,
        title:
          t.task_type === "advert" || taskType === "advert"
            ? `Post Advert on ${(platform !== "all" ? platform : "WhatsApp").toUpperCase()} Status`
            : `Perform Verified ${(platform !== "all" ? platform : "Social").toUpperCase()} Task`,
        taskType: t.task_type || taskType,
        taskPlatform: platform !== "all" ? platform : "whatsapp",
        platform: platform !== "all" ? platform : "whatsapp",
        earningPerTask: t.task_type === "advert" || taskType === "advert" ? 100 : 25,
        earner_fee: t.task_type === "advert" || taskType === "advert" ? 100 : 25,
        status: "cancelled",
        createdAt: t.created_at,
      }));

      return res.status(200).json({ failed: false, data: enriched });
    }

    const [adverts, engagements] = await Promise.all([
      taskService.getAdvertTasks({ status: "pending" }),
      taskService.getEngagementTasks({ status: "pending" }),
    ]);

    let allTasks = [...adverts, ...engagements];

    if (userId) {
      const [compRes, revRes, powRes, allocRes] = await Promise.all([
        supabase.from("completed_tasks").select("task_id").eq("user_id", userId),
        supabase.from("in_review_tasks").select("task_id").eq("user_id", userId),
        supabase.from("proof_of_work").select("task_id").eq("user_id", userId),
        supabase.from("allocated_tasks").select("task_id").eq("user_id", userId),
      ]);

      const doneTaskIds = new Set(
        [
          ...(compRes.data || []).map((r) => r.task_id),
          ...(revRes.data || []).map((r) => r.task_id),
          ...(powRes.data || []).map((r) => r.task_id),
          ...(allocRes.data || []).map((r) => r.task_id),
        ].filter(Boolean)
      );

      allTasks = allTasks.filter(
        (t) => !doneTaskIds.has(t.id) && t.user_id !== userId && t.creator_id !== userId
      );
    }

    return res.status(200).json({
      failed: false,
      data: allTasks,
    });
  } catch (error) {
    next(error);
  }
};

export const getTask = async (req, res, next) => {
  const { id } = req.params;
  const { type = "advert", platform = "whatsapp" } = req.query;
  try {
    let task = await taskService.getTaskById(id, type);

    if (!task) {
      const otherType = type === "engagement" ? "advert" : "engagement";
      task = await taskService.getTaskById(id, otherType);
    }

    const resolvedPlatform = (task?.platform || platform || "whatsapp").toLowerCase();
    let resolvedTask;
    if (!task) {
      const platformDisplay = resolvedPlatform.charAt(0).toUpperCase() + resolvedPlatform.slice(1);
      resolvedTask = {
        id,
        _id: id,
        title: type === "advert"
          ? `Post Advert on ${platformDisplay} ${resolvedPlatform === "whatsapp" ? "Status" : resolvedPlatform === "instagram" ? "Story / Feed" : "Profile / Group"}`
          : `Perform Verified ${platformDisplay} Task`,
        taskType: type,
        taskPlatform: resolvedPlatform,
        platform: resolvedPlatform,
        caption: `Check out Zargigs! Monetize your ${platformDisplay} social media and earn daily cash. Join here: https://zargigs.com #Zargigs`,
        link: resolvedPlatform === "facebook" ? "https://facebook.com" : resolvedPlatform === "instagram" ? "https://instagram.com" : resolvedPlatform === "twitter" ? "https://x.com" : "https://zargigs.com",
        mediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
        earningPerTask: type === "advert" ? 100 : 25,
        earner_fee: type === "advert" ? 100 : 25,
        timeLeftS: 3600,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
    } else {
      resolvedTask = {
        ...task,
        id: task.id,
        _id: task.id,
        title: task.title || `Post Advert on ${resolvedPlatform.toUpperCase()}`,
        taskType: type,
        taskPlatform: resolvedPlatform,
        platform: resolvedPlatform,
        caption: task.caption || `Promote with Zargigs on ${resolvedPlatform}. Earn daily cash!`,
        link: task.action_link || task.link || (resolvedPlatform === "facebook" ? "https://facebook.com" : "https://zargigs.com"),
        mediaUrl: task.media_url || task.mediaUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
        earningPerTask: Number(task.earner_fee) || (type === "advert" ? 100 : 25),
        earner_fee: Number(task.earner_fee) || (type === "advert" ? 100 : 25),
        timeLeftS: 3600,
        status: "pending",
        createdAt: task.created_at || task.createdAt || new Date().toISOString(),
      };
    }

    return res.status(200).json({
      failed: false,
      data: resolvedTask,
      ...resolvedTask,
    });
  } catch (error) {
    next(error);
  }
};

export const requestForReview = async (req, res, next) => {
  try {
    const {
      taskId,
      id,
      parentId,
      allocationId,
      taskType = "advert",
      type,
      imageProof,
      image,
      usernameProof,
      username,
      notes,
    } = req.body;

    // Resiliently resolve verified public.users record
    const userRecord = await resolveUserRecord(req);
    const userId = userRecord?.id;

    if (!userId) {
      return res.status(401).json({
        failed: true,
        message: "Authenticated user record not found. Please refresh and log in again.",
      });
    }

    // 1. Proof Image Validation (Prevent empty or fake submissions)
    const resolvedImage = (imageProof || image || "").trim();
    const resolvedUsername = (usernameProof || username || "").trim();

    if (!resolvedImage || !resolvedImage.startsWith("http")) {
      return res.status(400).json({
        failed: true,
        message: "A valid screenshot image proof is required. Please upload your proof screenshot before submitting.",
      });
    }

    // Resolve taskId - ensure valid UUID
    let rawTaskId = taskId || parentId || id || allocationId;
    let resolvedTaskId = rawTaskId;
    if (!resolvedTaskId || typeof resolvedTaskId !== "string" || !isValidUUID(resolvedTaskId)) {
      resolvedTaskId = uuidv4();
    }

    const resolvedTaskType = taskType || type || "advert";

    // 2. Anti-Duplicate Task Check (User CANNOT perform or submit proof for the same task multiple times)
    const [existingProof, existingInReview, existingCompleted] = await Promise.all([
      supabase.from("proof_of_work").select("id").eq("user_id", userId).eq("task_id", resolvedTaskId).maybeSingle(),
      supabase.from("in_review_tasks").select("id").eq("user_id", userId).eq("task_id", resolvedTaskId).maybeSingle(),
      supabase.from("completed_tasks").select("id").eq("user_id", userId).eq("task_id", resolvedTaskId).maybeSingle(),
    ]);

    if (existingProof?.data || existingInReview?.data || existingCompleted?.data) {
      return res.status(400).json({
        failed: true,
        message: "Duplicate Task: You have already submitted proof for this task. Each task can only be performed once.",
      });
    }

    // 3. Anti-Screenshot Recycling (Prevent reusing the exact same screenshot across different tasks)
    const { data: reusedImageProof } = await supabase
      .from("proof_of_work")
      .select("id, created_at")
      .eq("user_id", userId)
      .eq("image_proof", resolvedImage)
      .limit(1);

    if (reusedImageProof && reusedImageProof.length > 0) {
      return res.status(400).json({
        failed: true,
        message: "Fraud Protection: This screenshot has already been submitted for another task. Please upload genuine, unique proof.",
      });
    }

    // 4. Rate-limiting / Rapid Submission Cooldown (5 seconds between submissions)
    const { data: recentSubmissions } = await supabase
      .from("proof_of_work")
      .select("created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (recentSubmissions && recentSubmissions.length > 0) {
      const lastSubmissionTime = new Date(recentSubmissions[0].created_at).getTime();
      if (Date.now() - lastSubmissionTime < 5000) {
        return res.status(429).json({
          failed: true,
          message: "Please wait a moment before submitting another task proof.",
        });
      }
    }

    // 5. Submit Proof of Work
    const proof = await taskService.submitProofOfWork({
      userId,
      taskId: resolvedTaskId,
      taskType: resolvedTaskType,
      imageProof: resolvedImage,
      usernameProof: resolvedUsername,
      notes,
    });

    const payload = {
      user_id: userId,
      task_id: resolvedTaskId,
      task_type: resolvedTaskType,
      proof_id: proof.id,
      status: "in-review",
    };
    await supabase.from("in_review_tasks").insert(payload);

    // Clean up active allocation
    if (rawTaskId && typeof rawTaskId === "string" && isValidUUID(rawTaskId)) {
      await supabase
        .from("allocated_tasks")
        .delete()
        .eq("task_id", rawTaskId)
        .eq("user_id", userId);

      // Increment campaign tasks_done if in database
      const campaignTable = resolvedTaskType === "advert" ? "advert_tasks" : "engagement_tasks";
      const { data: campaignRow } = await supabase.from(campaignTable).select("tasks_done, number_of_tasks").eq("id", rawTaskId).maybeSingle();
      if (campaignRow) {
        const nextDone = (Number(campaignRow.tasks_done) || 0) + 1;
        const updates = { tasks_done: nextDone };
        if (nextDone >= Number(campaignRow.number_of_tasks)) {
          updates.status = "completed";
        }
        await supabase.from(campaignTable).update(updates).eq("id", rawTaskId);
      }
    }

    return res.status(200).json({
      failed: false,
      message: "Proof submitted for review successfully",
      data: proof,
    });
  } catch (error) {
    next(error);
  }
};

export const getProofsOfWork = async (req, res, next) => {
  try {
    const { id, taskId } = req.query;
    let query = supabase
      .from("proof_of_work")
      .select("*, users:user_id(id, firstname, lastname, username, avatar_url, email)")
      .order("created_at", { ascending: false });

    const filterTaskId = id || taskId;
    if (filterTaskId && isValidUUID(filterTaskId)) {
      query = query.eq("task_id", filterTaskId);
    }

    const { data: proofs, error } = await query;
    if (error) throw error;

    const formattedProofs = (proofs || []).map((p) => ({
      id: p.id,
      _id: p.id,
      parentId: p.task_id,
      taskId: p.task_id,
      userId: p.user_id,
      posterUsername: p.users?.username || "Earner",
      username: p.username_proof || p.users?.username || "Earner",
      posterImage:
        p.users?.avatar_url ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      imageUrl: p.image_proof || p.image || "",
      image: p.image_proof || p.image || "",
      imageProof: p.image_proof || p.image || "",
      notes: p.notes || "",
      status: p.status || "pending",
      createdAt: p.created_at,
      ...p,
    }));

    return res.status(200).json(formattedProofs);
  } catch (error) {
    next(error);
  }
};

export const sanctionTask = async (req, res, next) => {
  try {
    const id = req.body?.id || req.query?.id;
    const rawSanction =
      req.body?.sanction !== undefined ? req.body.sanction : req.query?.sanction;
    const parentId = req.body?.parentId || req.query?.parentId;
    const userId = req.body?.userId || req.query?.userId;
    const reward = req.body?.reward || req.query?.reward || 0;
    const reason = req.body?.reason || req.query?.reason || "";

    const action =
      rawSanction === "approve" || rawSanction === 1 || rawSanction === "1"
        ? "approve"
        : "reject";

    const result = await sanction(id, action, parentId, userId, reward, reason);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const sanction = async (
  id,
  action,
  parentId,
  userId,
  reward = 0,
  reason = ""
) => {
  try {
    let targetUserId = userId;
    let targetTaskId = parentId;

    if (id && isValidUUID(id)) {
      const { data: proof } = await supabase
        .from("proof_of_work")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (proof) {
        targetUserId = targetUserId || proof.user_id;
        targetTaskId = targetTaskId || proof.task_id;
        await supabase
          .from("proof_of_work")
          .update({ status: action === "approve" ? "approved" : "rejected" })
          .eq("id", id);
      }
      await supabase
        .from("in_review_tasks")
        .delete()
        .or(`proof_id.eq.${id},id.eq.${id}`);
    }

    if (action === "approve") {
      let taskReward = Number(reward);
      if (!taskReward && targetTaskId && isValidUUID(targetTaskId)) {
        const { data: advert } = await supabase
          .from("advert_tasks")
          .select("earner_fee")
          .eq("id", targetTaskId)
          .maybeSingle();
        taskReward = Number(advert?.earner_fee || 100);
      }
      if (!taskReward) taskReward = 100;

      if (targetUserId && isValidUUID(targetUserId)) {
        await supabase.from("completed_tasks").insert({
          user_id: targetUserId,
          task_id: targetTaskId || uuidv4(),
          task_type: "advert",
          reward: taskReward,
          status: "completed",
        });

        if (taskReward > 0) {
          await userService.incrementBalance(targetUserId, taskReward);
        }

        if (targetTaskId && isValidUUID(targetTaskId)) {
          const { data: adv } = await supabase
            .from("advert_tasks")
            .select("tasks_done, number_of_tasks")
            .eq("id", targetTaskId)
            .maybeSingle();
          if (adv) {
            const nextDone = (Number(adv.tasks_done) || 0) + 1;
            const newStatus =
              nextDone >= Number(adv.number_of_tasks) ? "completed" : "active";
            await supabase
              .from("advert_tasks")
              .update({ tasks_done: nextDone, status: newStatus })
              .eq("id", targetTaskId);
          }
        }

        const notification = {
          userId: targetUserId,
          title: "Task Approved!",
          message: `Your task submission has been approved and ₦${numeral(
            taskReward
          ).format("0,0.00")} credited to your wallet.`,
          type: "fund",
        };
        await sendNotitfication(notification).catch(() => {});
      }
    } else {
      if (targetUserId && isValidUUID(targetUserId)) {
        await supabase.from("failed_tasks").insert({
          user_id: targetUserId,
          task_id: targetTaskId || uuidv4(),
          task_type: "advert",
          reason: reason || "Proof rejected by reviewer",
        });
      }
    }

    return {
      failed: false,
      message: `Task ${action === "approve" ? "approved" : "rejected"} successfully`,
    };
  } catch (error) {
    console.error("sanction error:", error);
    return { failed: true, message: error.message };
  }
};

export const sanctionAllTask = async (req, res, next) => {
  try {
    return res.status(200).json({ failed: false, message: "All tasks sanctioned" });
  } catch (error) {
    next(error);
  }
};

// ==============================================================================
// 5. PAYMENT PROCESSING UTILITY
// ==============================================================================

export const processPayment = async (amount, type, userIdentifier, email = null, username = null) => {
  try {
    let user = null;
    if (userIdentifier) {
      try {
        user = await userService.findById(userIdentifier);
      } catch (e) {
        user = null;
      }
      if (!user && typeof userIdentifier === "string" && userIdentifier.includes("@")) {
        user = await userService.findByEmail(userIdentifier);
      }
      if (!user && typeof userIdentifier === "string") {
        user = await userService.findByUsername(userIdentifier);
      }
    }
    if (!user && email) {
      user = await userService.findByEmail(email);
    }
    if (!user && username) {
      user = await userService.findByUsername(username);
    }

    if (!user) {
      return {
        status: false,
        failed: true,
        message: "Valid user details not found.",
      };
    }

    const currentBalance = Number(user.balance) || 0;
    if (currentBalance < Number(amount)) {
      return {
        status: false,
        failed: true,
        message: `Insufficient funds. Total cost: ₦${Number(amount).toLocaleString()} (Available: ₦${currentBalance.toLocaleString()}). Please fund your wallet.`,
      };
    }

    await userService.decrementBalance(user.id, Number(amount));

    const notification = {
      userId: user.id,
      title: "Purchase Completed!",
      message: `Your ${type} order worth ₦${numeral(amount).format(
        "0,0.00"
      )} has been received. Thanks for choosing Zargigs.`,
      type,
    };
    await sendNotitfication(notification).catch(() => {});

    return {
      status: true,
      failed: false,
      message: "Payment process successful",
      user,
    };
  } catch (error) {
    console.error("processPayment error:", error);
    return {
      status: false,
      failed: true,
      message: "An error occurred while processing payment.",
    };
  }
};
