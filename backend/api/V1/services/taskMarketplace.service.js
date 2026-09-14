import { supabase } from "../config/supabase.config.js";

const formatRecord = (rec) => {
  if (!rec) return null;
  if (Array.isArray(rec)) return rec.map(formatRecord);
  return {
    ...rec,
    _id: rec.id,
  };
};

export const taskMarketplaceService = {
  // Fetch marketplace tasks for workers with targeting & status evaluation
  async getMarketplaceTasks(workerUserId, filters = {}) {
    try {
      let query = supabase
        .from("marketplace_tasks")
        .select(`
          *,
          creator:creator_id (
            id,
            firstname,
            lastname,
            username,
            avatar_url
          )
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (filters.category && filters.category !== "all") {
        query = query.eq("category", filters.category);
      }

      if (filters.search) {
        query = query.ilike("title", `%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) {
        console.warn("marketplace_tasks query error (falling back to standard tasks):", error.message);
        const [advRes, engRes] = await Promise.allSettled([
          supabase.from("advert_tasks").select("*, users:user_id(username, avatar_url)").eq("status", "active").limit(30),
          supabase.from("engagement_tasks").select("*, users:user_id(username, avatar_url)").eq("status", "active").limit(30),
        ]);
        const advList = advRes.status === "fulfilled" && advRes.value?.data ? advRes.value.data : [];
        const engList = engRes.status === "fulfilled" && engRes.value?.data ? engRes.value.data : [];
        return [
          ...advList.map((t) => ({
            id: t.id,
            _id: t.id,
            title: t.title || "Post WhatsApp Advert",
            category: "social",
            platform: (t.platform || "whatsapp").toLowerCase(),
            description: t.caption || "Post campaign advert on social media.",
            reward_per_worker: Number(t.earner_fee) || 100,
            rewardAmount: Number(t.earner_fee) || 100,
            total_slots: t.number_of_tasks || 50,
            slots_completed: t.tasks_done || 0,
            slots_remaining: Math.max(0, (t.number_of_tasks || 50) - (t.tasks_done || 0)),
            status: "active",
            created_at: t.created_at,
            creator: {
              username: t.users?.username || "Verified Advertiser",
              avatar_url: t.users?.avatar_url || "",
            },
          })),
          ...engList.map((t) => ({
            id: t.id,
            _id: t.id,
            title: t.title || "Social Engagement Task",
            category: "social",
            platform: (t.platform || "instagram").toLowerCase(),
            description: t.caption || "Perform social engagement task.",
            reward_per_worker: Number(t.earner_fee) || 25,
            rewardAmount: Number(t.earner_fee) || 25,
            total_slots: t.number_of_tasks || 50,
            slots_completed: t.tasks_done || 0,
            slots_remaining: Math.max(0, (t.number_of_tasks || 50) - (t.tasks_done || 0)),
            status: "active",
            created_at: t.created_at,
            creator: {
              username: t.users?.username || "Verified Advertiser",
              avatar_url: t.users?.avatar_url || "",
            },
          })),
        ];
      }

      const tasks = formatRecord(data || []);

      // If worker logged in, check their reservations and submissions
      if (workerUserId && tasks.length > 0) {
        try {
          const taskIds = tasks.map((t) => t.id);

          const { data: userSubmissions } = await supabase
            .from("task_submissions")
            .select("task_id, status, created_at")
            .eq("worker_id", workerUserId)
            .in("task_id", taskIds);

          const { data: userReservations } = await supabase
            .from("task_reservations")
            .select("id, task_id, status, expires_at")
            .eq("worker_id", workerUserId)
            .eq("status", "active")
            .in("task_id", taskIds);

          const subMap = new Map((userSubmissions || []).map((s) => [s.task_id, s]));
          const resMap = new Map((userReservations || []).map((r) => [r.task_id, r]));

          return tasks.map((task) => {
            const userSub = subMap.get(task.id);
            const userRes = resMap.get(task.id);
            const isExpired = userRes && new Date(userRes.expires_at) < new Date();

            return {
              ...task,
              hasSubmitted: !!userSub,
              submissionStatus: userSub?.status || null,
              isReserved: !!userRes && !isExpired,
              activeReservationId: userRes && !isExpired ? userRes.id : null,
              reservationExpiresAt: userRes && !isExpired ? userRes.expires_at : null,
            };
          });
        } catch {
          return tasks;
        }
      }

      return tasks;
    } catch (err) {
      console.error("getMarketplaceTasks exception:", err);
      return [];
    }
  },

  // Get single task by ID
  async getTaskById(taskId, workerUserId = null) {
    let task = null;

    try {
      const { data, error } = await supabase
        .from("marketplace_tasks")
        .select(`
          *,
          creator:creator_id (
            id,
            firstname,
            lastname,
            username,
            avatar_url
          )
        `)
        .eq("id", taskId)
        .maybeSingle();

      if (data && !error) {
        task = formatRecord(data);
      }
    } catch {
      // Fallback below
    }

    if (!task) {
      try {
        const { data: adv } = await supabase
          .from("advert_tasks")
          .select("*")
          .eq("id", taskId)
          .maybeSingle();
        if (adv) task = { ...formatRecord(adv), category: "advert" };

        if (!task) {
          const { data: eng } = await supabase
            .from("engagement_tasks")
            .select("*")
            .eq("id", taskId)
            .maybeSingle();
          if (eng) task = { ...formatRecord(eng), category: "engagement" };
        }
      } catch {
        // Return null
      }
    }

    if (!task) return null;

    if (workerUserId) {
      try {
        const { data: userSub } = await supabase
          .from("task_submissions")
          .select("*")
          .eq("task_id", taskId)
          .eq("worker_id", workerUserId)
          .maybeSingle();

        const { data: userRes } = await supabase
          .from("task_reservations")
          .select("*")
          .eq("task_id", taskId)
          .eq("worker_id", workerUserId)
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        const isExpired = userRes && new Date(userRes.expires_at) < new Date();

        return {
          ...task,
          mySubmission: formatRecord(userSub),
          activeReservation: userRes && !isExpired ? formatRecord(userRes) : null,
        };
      } catch {
        return task;
      }
    }

    return task;
  },

  // Helper to find user flexibly by id, email, or username
  async findUser(identifier, email = null, username = null) {
    if (identifier) {
      // 1. Direct match by id
      const { data: byId } = await supabase
        .from("users")
        .select("*")
        .eq("id", identifier)
        .maybeSingle();
      if (byId) return byId;

      // 2. Match by email if identifier is email-like
      if (typeof identifier === "string" && identifier.includes("@")) {
        const { data: byEmail } = await supabase
          .from("users")
          .select("*")
          .ilike("email", identifier.trim())
          .maybeSingle();
        if (byEmail) return byEmail;
      }
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
      const { data: byUsername } = await supabase
        .from("users")
        .select("*")
        .ilike("username", username.trim())
        .maybeSingle();
      if (byUsername) return byUsername;
    }

    return null;
  },

  // Create new task campaign with Escrow Lock
  async createTaskCampaign(creatorId, taskData) {
    const totalSlots = parseInt(taskData.totalSlots || taskData.total_slots || 10, 10);
    const rewardPerWorker = parseFloat(taskData.rewardPerWorker || taskData.reward_per_worker || 100);
    const feePercent = parseFloat(taskData.platformFeePercent || 15);
    const workerBudget = totalSlots * rewardPerWorker;
    const platformFee = (workerBudget * feePercent) / 100;
    const totalEscrowBudget = workerBudget + platformFee;

    // Resilient lookup of creator account
    const identifier = creatorId || taskData.creatorId || taskData.userId || taskData.creator_id;
    const email = taskData.email || taskData.creatorEmail;
    const username = taskData.username || taskData.creatorUsername;

    const creator = await this.findUser(identifier, email, username);

    if (!creator) {
      throw new Error("Creator account not found. Please log in or refresh your session.");
    }

    const resolvedCreatorId = creator.id;
    const currentBalance = parseFloat(creator.balance || 0);

    if (currentBalance < totalEscrowBudget) {
      throw new Error(
        `Insufficient wallet balance. Total required: ₦${totalEscrowBudget.toLocaleString()} (Available: ₦${currentBalance.toLocaleString()}). Please fund your wallet.`
      );
    }

    // Deduct escrow from creator wallet
    const newBalance = currentBalance - totalEscrowBudget;
    await supabase
      .from("users")
      .update({ balance: newBalance })
      .eq("id", resolvedCreatorId);

    // Format guidelines and steps
    const customSteps = Array.isArray(taskData.steps) && taskData.steps.length > 0
      ? taskData.steps
      : Array.isArray(taskData.guidelines) && taskData.guidelines.length > 0
      ? taskData.guidelines
      : [];

    const targetUrl = String(taskData.targetUrl || taskData.target_url || taskData.appLink || taskData.link || "").trim();

    // Insert task
    const payload = {
      creator_id: resolvedCreatorId,
      title: taskData.title,
      category: taskData.category || "custom",
      description: taskData.description || "",
      instructions: taskData.instructions || "",
      guidelines: customSteps,
      target_url: targetUrl || null,
      has_survey: !!taskData.hasSurvey || !!taskData.has_survey || taskData.category === "survey",
      survey_questions: taskData.surveyQuestions || taskData.survey_questions || [],
      proof_types: taskData.proofTypes || taskData.proof_types || ["screenshot"],
      proof_instructions: taskData.proofInstructions || taskData.proof_instructions || "",
      targeting: taskData.targeting || { target_all: true },
      total_slots: totalSlots,
      slots_remaining: totalSlots,
      slots_reserved: 0,
      slots_completed: 0,
      reward_per_worker: rewardPerWorker,
      platform_fee_percent: feePercent,
      total_escrow_budget: totalEscrowBudget,
      escrow_status: "funded",
      estimated_minutes: parseInt(taskData.estimatedMinutes || 10, 10),
      reservation_time_limit_mins: parseInt(taskData.reservationTimeLimitMins || 30, 10),
      review_window_hours: parseInt(taskData.reviewWindowHours || 48, 10),
      status: "pending",
      moderation_status: "pending",
    };

    let { data: newTask, error: insertError } = await supabase
      .from("marketplace_tasks")
      .insert(payload)
      .select()
      .single();

    // If target_url column doesn't exist yet on DB, retry payload without target_url column and retain it in guidelines
    if (insertError && (insertError.message?.includes("target_url") || insertError.code === "PGRST204" || insertError.code === "42703")) {
      const fallbackPayload = {
        ...payload,
        guidelines: {
          steps: customSteps,
          target_url: targetUrl,
          app_name: taskData.appName || taskData.app_name || "",
        },
      };
      delete fallbackPayload.target_url;

      const retryRes = await supabase
        .from("marketplace_tasks")
        .insert(fallbackPayload)
        .select()
        .single();

      if (retryRes.error) {
        insertError = retryRes.error;
      } else {
        newTask = retryRes.data;
        insertError = null;
      }
    }

    if (insertError) {
      // Refund on failure
      await supabase.from("users").update({ balance: currentBalance }).eq("id", resolvedCreatorId);
      throw insertError;
    }

    return formatRecord(newTask);
  },

  // Reserve slot with timer
  async reserveSlot(taskId, workerUserId) {
    const task = await this.getTaskById(taskId, workerUserId);
    if (!task) throw new Error("Task not found.");
    if (task.status !== "active") throw new Error("This task is no longer active.");
    if (task.slots_remaining <= 0) throw new Error("No slots remaining for this task.");

    // Check if worker already submitted or reserved
    if (task.mySubmission) throw new Error("You have already submitted this task.");
    if (task.activeReservation) return task.activeReservation;

    const timeLimitMins = task.reservation_time_limit_mins || 30;
    const expiresAt = new Date(Date.now() + timeLimitMins * 60 * 1000).toISOString();

    const { data: reservation, error } = await supabase
      .from("task_reservations")
      .insert({
        task_id: taskId,
        worker_id: workerUserId,
        expires_at: expiresAt,
        status: "active",
      })
      .select()
      .single();

    if (error) throw error;

    // Decrement slots remaining, increment reserved
    await supabase
      .from("marketplace_tasks")
      .update({
        slots_remaining: Math.max(0, task.slots_remaining - 1),
        slots_reserved: (task.slots_reserved || 0) + 1,
      })
      .eq("id", taskId);

    return formatRecord(reservation);
  },

  // Release reservation (Worker gives up slot)
  async releaseReservation(reservationId, workerUserId) {
    const { data: reservation } = await supabase
      .from("task_reservations")
      .select("*")
      .eq("id", reservationId)
      .eq("worker_id", workerUserId)
      .single();

    if (!reservation) return;

    await supabase
      .from("task_reservations")
      .update({ status: "released" })
      .eq("id", reservationId);

    // Restore slot
    const { data: task } = await supabase
      .from("marketplace_tasks")
      .select("id, slots_remaining, slots_reserved")
      .eq("id", reservation.task_id)
      .single();

    if (task) {
      await supabase
        .from("marketplace_tasks")
        .update({
          slots_remaining: task.slots_remaining + 1,
          slots_reserved: Math.max(0, (task.slots_reserved || 1) - 1),
        })
        .eq("id", task.id);
    }
  },

  // Submit proof / survey answers
  async submitTaskProof(taskId, workerUserId, submissionPayload) {
    if (!workerUserId) throw new Error("Unauthorized. Please log in.");

    // Direct check in task_submissions to block duplicates
    const { data: existingSub } = await supabase
      .from("task_submissions")
      .select("id, status")
      .eq("task_id", taskId)
      .eq("worker_id", workerUserId)
      .maybeSingle();

    if (existingSub) {
      throw new Error("You have already submitted this task. Duplicate submissions are not permitted.");
    }

    const task = await this.getTaskById(taskId, workerUserId);
    if (!task) throw new Error("Task not found.");
    if (task.mySubmission) throw new Error("You have already submitted this task.");

    const autoApproveHours = task.review_window_hours || 24;
    const autoApproveAt = new Date(Date.now() + autoApproveHours * 3600 * 1000).toISOString();

    const payload = {
      task_id: taskId,
      worker_id: workerUserId,
      reservation_id: submissionPayload.reservationId || null,
      proof_text: submissionPayload.proofText || "",
      proof_urls: submissionPayload.proofUrls || [],
      survey_answers: submissionPayload.surveyAnswers || {},
      location_data: submissionPayload.locationData || null,
      status: "pending",
      reward_amount: task.reward_per_worker,
      auto_approve_at: autoApproveAt,
    };

    const { data: submission, error } = await supabase
      .from("task_submissions")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;

    // Update reservation if existed
    if (submissionPayload.reservationId) {
      await supabase
        .from("task_reservations")
        .update({ status: "submitted" })
        .eq("id", submissionPayload.reservationId);
    }

    // Update task counters
    await supabase
      .from("marketplace_tasks")
      .update({
        slots_reserved: Math.max(0, (task.slots_reserved || 1) - 1),
        slots_completed: (task.slots_completed || 0) + 1,
      })
      .eq("id", taskId);

    // Notify creator
    try {
      await supabase.from("notifications").insert({
        user_id: task.creator_id,
        title: "New Task Submission",
        message: `A worker submitted proof for "${task.title}". Review it before auto-approval in ${autoApproveHours}h.`,
      });
    } catch (e) {
      // Non-blocking notification
    }

    return formatRecord(submission);
  },

  // Get Creator's Campaigns
  async getCreatorCampaigns(creatorId) {
    const { data: tasks, error } = await supabase
      .from("marketplace_tasks")
      .select("*")
      .eq("creator_id", creatorId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const taskIds = (tasks || []).map((t) => t.id);
    if (taskIds.length === 0) return [];

    const { data: submissions } = await supabase
      .from("task_submissions")
      .select("task_id, status");

    const countsMap = new Map();
    (submissions || []).forEach((s) => {
      const prev = countsMap.get(s.task_id) || { pending: 0, approved: 0, rejected: 0 };
      if (s.status === "pending") prev.pending++;
      if (s.status === "approved" || s.status === "auto_approved") prev.approved++;
      if (s.status === "rejected") prev.rejected++;
      countsMap.set(s.task_id, prev);
    });

    return (tasks || []).map((t) => ({
      ...formatRecord(t),
      stats: countsMap.get(t.id) || { pending: 0, approved: 0, rejected: 0 },
    }));
  },

  // Get Submissions for Creator to Review
  async getSubmissionsForTask(taskId, creatorId) {
    // Validate creator owns the task
    const { data: task, error: taskErr } = await supabase
      .from("marketplace_tasks")
      .select("id, creator_id, title, category, has_survey, survey_questions")
      .eq("id", taskId)
      .eq("creator_id", creatorId)
      .single();

    if (taskErr || !task) throw new Error("Unauthorized or task not found.");

    const { data: submissions, error } = await supabase
      .from("task_submissions")
      .select(`
        *,
        worker:worker_id (
          id,
          firstname,
          lastname,
          username,
          avatar_url
        )
      `)
      .eq("task_id", taskId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return {
      task: formatRecord(task),
      submissions: formatRecord(submissions || []),
    };
  },

  // Review submission (Approve / Reject)
  async reviewSubmission(submissionId, creatorId, { decision, rejectionReason, feedback, rating = 5 }) {
    const { data: sub, error: subErr } = await supabase
      .from("task_submissions")
      .select(`
        *,
        task:task_id (
          id,
          creator_id,
          title,
          reward_per_worker
        )
      `)
      .eq("id", submissionId)
      .single();

    if (subErr || !sub) throw new Error("Submission not found.");
    if (sub.task.creator_id !== creatorId) throw new Error("Unauthorized to review this submission.");
    if (sub.worker_id === creatorId) throw new Error("Fraud Prevention: Campaign creators cannot earn from their own task campaigns.");
    if (sub.status !== "pending") throw new Error(`Submission is already ${sub.status}.`);

    if (decision === "approved") {
      // 1. Mark submission approved
      await supabase
        .from("task_submissions")
        .update({
          status: "approved",
          creator_feedback: feedback || null,
          creator_rating: rating,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", submissionId);

      // 2. Credit worker's wallet
      const { data: worker } = await supabase
        .from("users")
        .select("id, balance")
        .eq("id", sub.worker_id)
        .single();

      if (worker) {
        const reward = parseFloat(sub.reward_amount || sub.task.reward_per_worker || 0);
        await supabase
          .from("users")
          .update({ balance: parseFloat(worker.balance || 0) + reward })
          .eq("id", sub.worker_id);
      }

      // 3. Notify worker
      await supabase.from("notifications").insert({
        user_id: sub.worker_id,
        title: "Task Approved & Paid! 💰",
        message: `Your submission for "${sub.task.title}" was approved! ₦${sub.reward_amount} has been added to your wallet.`,
      });

      return { success: true, message: "Submission approved and worker paid successfully." };
    } else if (decision === "rejected") {
      if (!rejectionReason) throw new Error("Please provide a reason for rejecting this submission.");

      // 1. Mark submission rejected
      await supabase
        .from("task_submissions")
        .update({
          status: "rejected",
          rejection_reason: rejectionReason,
          creator_feedback: feedback || null,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", submissionId);

      // 2. Restore slot on task so another worker can complete
      const { data: task } = await supabase
        .from("marketplace_tasks")
        .select("id, slots_remaining, slots_completed")
        .eq("id", sub.task_id)
        .single();

      if (task) {
        await supabase
          .from("marketplace_tasks")
          .update({
            slots_remaining: task.slots_remaining + 1,
            slots_completed: Math.max(0, (task.slots_completed || 1) - 1),
          })
          .eq("id", task.id);
      }

      // 3. Notify worker
      await supabase.from("notifications").insert({
        user_id: sub.worker_id,
        title: "Submission Rejected",
        message: `Your submission for "${sub.task.title}" was rejected. Reason: ${rejectionReason}. You can dispute if unfair.`,
      });

      return { success: true, message: "Submission rejected." };
    } else {
      throw new Error("Invalid decision. Must be 'approved' or 'rejected'.");
    }
  },

  // Dispute rejected submission
  async fileDispute(submissionId, workerUserId, { workerReason, evidenceUrls = [] }) {
    const { data: sub } = await supabase
      .from("task_submissions")
      .select("id, task_id, worker_id, status, task:task_id (creator_id)")
      .eq("id", submissionId)
      .eq("worker_id", workerUserId)
      .single();

    if (!sub) throw new Error("Submission not found.");
    if (sub.status !== "rejected") throw new Error("Only rejected submissions can be disputed.");

    const { data: dispute, error } = await supabase
      .from("task_disputes")
      .insert({
        submission_id: submissionId,
        task_id: sub.task_id,
        worker_id: workerUserId,
        creator_id: sub.task.creator_id,
        worker_reason: workerReason,
        worker_evidence_urls: evidenceUrls,
        status: "open",
      })
      .select()
      .single();

    if (error) throw error;

    await supabase
      .from("task_submissions")
      .update({ status: "disputed" })
      .eq("id", submissionId);

    return formatRecord(dispute);
  },
};

export default taskMarketplaceService;
