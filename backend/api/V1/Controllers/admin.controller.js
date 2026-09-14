import { adminService, userService, userDetailsService, walletService, notificationService } from "../services/supabaseDb.service.js";
import { supabase } from "../config/supabase.config.js";
import { ErrorHandler } from "../utils/error.js";
import { sendNotitfication } from "../utils/notification.js";
import numeral from "numeral";

// 1. ADMIN SETTINGS
export const setAdminData = async (req, res, next) => {
  try {
    const {
      appName,
      membershipFee,
      withdrawalCharges,
      minimumFollowers,
      appLogo,
    } = req.body;

    const payload = {
      app_name: appName,
      membership_fee: membershipFee,
      min_withdrawal: withdrawalCharges || 1000,
      referral_bonus: 500,
    };

    const { data, error } = await supabase.from("admin_settings").insert(payload).select().single();
    if (error) throw error;

    return res.status(200).json({
      failed: false,
      message: "Admin data set successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateAdminData = async (req, res, next) => {
  try {
    const {
      appName,
      appLogo,
      membershipFee,
      withdrawalCharges,
      minWithdrawal,
      referralBonus,
      contactEmail,
      contactPhone,
      whatsappSupport,
    } = req.body;

    const payload = {};
    if (appName !== undefined) payload.app_name = appName;
    if (membershipFee !== undefined) payload.membership_fee = Number(membershipFee);
    if (withdrawalCharges !== undefined) payload.min_withdrawal = Number(withdrawalCharges);
    if (referralBonus !== undefined) payload.referral_bonus = Number(referralBonus);

    const { data: existing } = await supabase.from("admin_settings").select("id").limit(1).maybeSingle();
    if (existing) {
      await supabase.from("admin_settings").update(payload).eq("id", existing.id);
    } else {
      await supabase.from("admin_settings").insert(payload);
    }

    return res.status(200).json({
      failed: false,
      message: "Admin settings updated successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminData = async (req, res, next) => {
  try {
    const adminData = await adminService.getAdminSettings();

    const formatted = [
      {
        id: adminData.id || "1",
        _id: adminData.id || "1",
        appName: adminData.app_name || adminData.appName || "Zargigs",
        membershipFee: adminData.membership_fee || adminData.membershipFee || 1000,
        withdrawalCharges: adminData.min_withdrawal || 50,
        minWithdrawal: adminData.min_withdrawal || 1000,
        referralBonus: adminData.referral_bonus || 500,
        fundingAccount: {
          accountNumber: "0123456789",
          accountName: "Zargigs Technologies",
          bankName: "Moniepoint / PocketFi",
        },
      },
    ];

    return res.status(200).json(formatted);
  } catch (error) {
    next(error);
  }
};

// 2. USER FULL EDITOR (Edit everything for any user)
export const updateAnyUserProfile = async (req, res, next) => {
  try {
    const {
      id,
      firstname,
      lastname,
      username,
      email,
      phone,
      balance,
      pendingBalance,
      role,
      isMember,
      isBanned,
      isNINVerified,
      isEmailVerified,
      bankDetails,
    } = req.body;

    if (!id) {
      return res.status(400).json({ failed: true, message: "User ID is required" });
    }

    const userUpdates = {};
    if (firstname !== undefined) userUpdates.firstname = firstname;
    if (lastname !== undefined) userUpdates.lastname = lastname;
    if (username !== undefined) userUpdates.username = username;
    if (email !== undefined) userUpdates.email = email;
    if (phone !== undefined) userUpdates.phone = phone;
    if (balance !== undefined) userUpdates.balance = Number(balance);
    if (pendingBalance !== undefined) userUpdates.pending_balance = Number(pendingBalance);
    if (role !== undefined) userUpdates.role = role;
    if (isMember !== undefined) userUpdates.is_member = Boolean(isMember);
    if (isBanned !== undefined) userUpdates.is_banned = Boolean(isBanned);
    if (isNINVerified !== undefined) userUpdates.is_nin_verified = Boolean(isNINVerified);
    if (isEmailVerified !== undefined) userUpdates.is_email_verified = Boolean(isEmailVerified);

    if (Object.keys(userUpdates).length > 0) {
      await userService.updateUser(id, userUpdates);
    }

    if (bankDetails) {
      await userDetailsService.upsertUserDetails(id, {
        bankName: bankDetails.bankName,
        accountNumber: bankDetails.accountNumber,
        accountName: bankDetails.accountName,
      });
    }

    return res.status(200).json({
      failed: false,
      message: "User profile updated successfully",
    });
  } catch (error) {
    console.error("updateAnyUserProfile error:", error);
    next(error);
  }
};

// 3. ALL TASKS & CAMPAIGNS (View, Edit & Moderate all microtasks, adverts, engagements)
export const getAllPlatformTasks = async (req, res, next) => {
  try {
    const [advertsRes, engagementsRes, marketplaceRes] = await Promise.all([
      supabase.from("advert_tasks").select("*, users:user_id(username, email, firstname, lastname)").order("created_at", { ascending: false }).limit(100),
      supabase.from("engagement_tasks").select("*, users:user_id(username, email, firstname, lastname)").order("created_at", { ascending: false }).limit(100),
      supabase.from("marketplace_tasks").select("*, users:creator_id(username, email, firstname, lastname)").order("created_at", { ascending: false }).limit(100).catch(() => ({ data: [] })),
    ]);

    const allTasks = [
      ...(marketplaceRes.data || []).map((t) => ({
        ...t,
        sourceTable: "marketplace_tasks",
        typeName: `Microtask (${t.category || "General"})`,
        number_of_tasks: t.total_slots || 10,
        tasks_done: t.slots_completed || 0,
        earner_fee: t.reward_per_worker || 100,
        amount_paid: t.total_escrow_budget || 0,
        action_link: t.target_url || t.guidelines?.target_url || "",
      })),
      ...(advertsRes.data || []).map((t) => ({
        ...t,
        sourceTable: "advert_tasks",
        typeName: "Social Advert",
        action_link: t.media_url || "",
      })),
      ...(engagementsRes.data || []).map((t) => ({
        ...t,
        sourceTable: "engagement_tasks",
        typeName: "Engagement Task",
        action_link: t.action_link || "",
      })),
    ];

    allTasks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return res.status(200).json({
      failed: false,
      tasks: allTasks,
      data: allTasks,
    });
  } catch (error) {
    console.error("getAllPlatformTasks error:", error);
    next(error);
  }
};

export const updatePlatformTask = async (req, res, next) => {
  try {
    const {
      id,
      sourceTable = "marketplace_tasks",
      status,
      moderationStatus,
      moderationNotes,
      title,
      description,
      instructions,
      caption,
      actionLink,
      targetUrl,
      earnerFee,
      amountPaid,
      numberOfTasks,
      totalSlots,
    } = req.body;

    if (!id) {
      return res.status(400).json({ failed: true, message: "Task ID is required" });
    }

    const payload = {};
    if (status) payload.status = status;
    if (title) payload.title = title;
    if (description !== undefined) payload.description = description;
    if (instructions !== undefined) payload.instructions = instructions;
    if (caption !== undefined) payload.caption = caption;
    if (actionLink !== undefined) payload.action_link = actionLink;
    if (targetUrl !== undefined) payload.target_url = targetUrl;
    if (moderationNotes !== undefined) payload.moderation_notes = moderationNotes;

    // Table-specific column mappings
    if (sourceTable === "marketplace_tasks") {
      if (status === "active") {
        payload.moderation_status = "approved";
      } else if (status === "rejected") {
        payload.moderation_status = "rejected";
        payload.escrow_status = "refunded";
      }
      if (moderationStatus) payload.moderation_status = moderationStatus;
      if (earnerFee !== undefined) payload.reward_per_worker = Number(earnerFee);
      if (amountPaid !== undefined) payload.total_escrow_budget = Number(amountPaid);
      if (numberOfTasks !== undefined || totalSlots !== undefined) {
        payload.total_slots = Number(totalSlots || numberOfTasks);
      }
    } else {
      if (earnerFee !== undefined) payload.earner_fee = Number(earnerFee);
      if (amountPaid !== undefined) payload.amount_paid = Number(amountPaid);
      if (numberOfTasks !== undefined) payload.number_of_tasks = Number(numberOfTasks);
    }
    payload.updated_at = new Date().toISOString();

    // Fetch existing task to handle refunds if rejected
    const { data: existingTask } = await supabase.from(sourceTable).select("*").eq("id", id).maybeSingle();

    const { error } = await supabase.from(sourceTable).update(payload).eq("id", id);
    if (error) throw error;

    // If Admin REJECTS a campaign, refund the creator's wallet
    if (status === "rejected" && existingTask && existingTask.status !== "rejected") {
      const creatorId = existingTask.creator_id || existingTask.user_id;
      const refundAmount = Number(
        existingTask.total_escrow_budget || existingTask.amount_paid || 0
      );

      if (creatorId && refundAmount > 0) {
        const { data: creatorUser } = await supabase.from("users").select("balance").eq("id", creatorId).maybeSingle();
        if (creatorUser) {
          const currentBal = Number(creatorUser.balance || 0);
          await supabase.from("users").update({ balance: currentBal + refundAmount }).eq("id", creatorId);

          await supabase.from("notifications").insert({
            user_id: creatorId,
            title: "Task Campaign Rejected & Refunded",
            message: `Your task campaign "${existingTask.title}" was rejected by admin (${moderationNotes || "Content guideline violation"}). ₦${refundAmount.toLocaleString()} has been refunded to your wallet balance.`,
            type: "warning",
            created_at: new Date().toISOString(),
          }).catch(() => {});
        }
      }
    } else if (status === "active" && existingTask && existingTask.status === "pending") {
      // Notify creator of approval
      const creatorId = existingTask.creator_id || existingTask.user_id;
      if (creatorId) {
        await supabase.from("notifications").insert({
          user_id: creatorId,
          title: "Campaign Approved & Live! 🎉",
          message: `Your task campaign "${existingTask.title}" has been approved by admin and is now live on the marketplace for workers.`,
          type: "success",
          created_at: new Date().toISOString(),
        }).catch(() => {});
      }
    }

    return res.status(200).json({
      failed: false,
      message: `Task updated successfully${status === "active" ? " and published live" : status === "rejected" ? " and refunded to creator" : ""}.`,
    });
  } catch (error) {
    console.error("updatePlatformTask error:", error);
    next(error);
  }
};

export const deletePlatformTask = async (req, res, next) => {
  try {
    const { id, sourceTable = "marketplace_tasks" } = req.query;
    const { error } = await supabase.from(sourceTable).delete().eq("id", id);
    if (error) throw error;

    return res.status(200).json({
      failed: false,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("deletePlatformTask error:", error);
    next(error);
  }
};

// 4. SUBMISSIONS & PROOF OF WORK (Review & Force Approve/Reject)
export const getAllSubmissions = async (req, res, next) => {
  try {
    const [marketplaceSubs, powSubs] = await Promise.allSettled([
      supabase
        .from("task_submissions")
        .select("*, users:worker_id(username, email, firstname, lastname), marketplace_tasks:task_id(title, category)")
        .order("created_at", { ascending: false })
        .limit(60),
      supabase
        .from("proof_of_work")
        .select("*, users:user_id(username, email, firstname, lastname)")
        .order("created_at", { ascending: false })
        .limit(60),
    ]);

    const mktList = marketplaceSubs.status === "fulfilled" && marketplaceSubs.value?.data ? marketplaceSubs.value.data : [];
    const powList = powSubs.status === "fulfilled" && powSubs.value?.data ? powSubs.value.data : [];

    const formattedMkt = mktList.map((s) => ({
      id: s.id,
      _id: s.id,
      taskId: s.task_id,
      taskTitle: s.marketplace_tasks?.title || "Marketplace Microtask",
      taskType: "microtask",
      workerId: s.worker_id,
      user_id: s.worker_id,
      username: s.users?.username || "Worker",
      email: s.users?.email || "",
      proof_text: s.proof_text,
      proof_url: Array.isArray(s.proof_urls) ? s.proof_urls[0] : s.proof_urls,
      image_proof: Array.isArray(s.proof_urls) ? s.proof_urls[0] : s.proof_urls,
      reward: s.reward_amount || 100,
      status: s.status || "pending",
      created_at: s.created_at,
      sourceTable: "task_submissions",
      ...s,
    }));

    const formattedPow = powList.map((s) => ({
      id: s.id,
      _id: s.id,
      taskId: s.task_id,
      taskTitle: `Social Task (${s.task_type || "Advert"})`,
      taskType: s.task_type || "advert",
      workerId: s.user_id,
      user_id: s.user_id,
      username: s.users?.username || s.username_proof || "Worker",
      email: s.users?.email || "",
      proof_text: s.notes || s.username_proof,
      proof_url: s.image_proof,
      image_proof: s.image_proof,
      reward: 100,
      status: s.status === "submitted" ? "pending" : s.status,
      created_at: s.created_at,
      sourceTable: "proof_of_work",
      ...s,
    }));

    const combined = [...formattedMkt, ...formattedPow].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    return res.status(200).json({
      failed: false,
      submissions: combined,
      data: combined,
    });
  } catch (error) {
    console.error("getAllSubmissions error:", error);
    next(error);
  }
};

export const reviewSubmission = async (req, res, next) => {
  try {
    const { id, status, earnerId, earnerFee = 0, sourceTable = "task_submissions" } = req.body;

    if (sourceTable === "task_submissions") {
      await supabase
        .from("task_submissions")
        .update({ status, reviewed_at: new Date().toISOString() })
        .eq("id", id);
    } else {
      await supabase
        .from("proof_of_work")
        .update({ status: status === "approved" ? "approved" : "rejected" })
        .eq("id", id);
    }

    if (status === "approved" && earnerId && Number(earnerFee) > 0) {
      await userService.incrementBalance(earnerId, Number(earnerFee));
      const notif = {
        userId: earnerId,
        title: "Task Approved by Admin! 🎉",
        message: `Your task submission has been verified by an admin and ₦${numeral(earnerFee).format("0,0.00")} was credited to your balance.`,
        type: "earner",
      };
      await sendNotitfication(notif).catch(() => {});
    }

    return res.status(200).json({
      failed: false,
      message: `Submission marked as ${status}`,
    });
  } catch (error) {
    console.error("reviewSubmission error:", error);
    next(error);
  }
};

// 5. ALL FUNDINGS & MANUAL DEPOSIT APPROVAL
export const getAllFundings = async (req, res, next) => {
  try {
    const { data: fundings, error } = await supabase
      .from("funding")
      .select("*, users:user_id(username, email, firstname, lastname)")
      .order("created_at", { ascending: false })
      .limit(60);

    if (error) throw error;

    return res.status(200).json({
      failed: false,
      fundings: fundings || [],
      data: fundings || [],
    });
  } catch (error) {
    console.error("getAllFundings error:", error);
    next(error);
  }
};

export const approveManualFunding = async (req, res, next) => {
  try {
    const { id, userId, amount } = req.body;

    const { error } = await supabase
      .from("funding")
      .update({ status: "success", updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;

    if (userId && Number(amount) > 0) {
      await userService.incrementBalance(userId, Number(amount));
      const notification = {
        userId,
        title: "Manual Deposit Approved! 💰",
        message: `Your manual deposit of ₦${numeral(amount).format("0,0.00")} has been approved by admin and credited to your wallet balance.`,
        type: "fund",
      };
      await sendNotitfication(notification);
    }

    return res.status(200).json({
      failed: false,
      message: "Deposit approved and user credited successfully",
    });
  } catch (error) {
    console.error("approveManualFunding error:", error);
    next(error);
  }
};

// 6. PRICING CONFIGURATION (View & Edit Task & Advert Pricing)
export const getPricingConfig = async (req, res, next) => {
  try {
    const [createAdv, createEng, earnAdv, earnEng] = await Promise.all([
      supabase.from("create_advert_config").select("*"),
      supabase.from("create_engagement_config").select("*"),
      supabase.from("earn_advert_config").select("*"),
      supabase.from("earn_engagement_config").select("*"),
    ]);

    return res.status(200).json({
      failed: false,
      createAdvert: createAdv.data || [],
      createEngagement: createEng.data || [],
      earnAdvert: earnAdv.data || [],
      earnEngagement: earnEng.data || [],
    });
  } catch (error) {
    console.error("getPricingConfig error:", error);
    next(error);
  }
};

export const updatePricingItem = async (req, res, next) => {
  try {
    const { table, id, price, fee, description, title } = req.body;

    if (!table || !id) {
      return res.status(400).json({ failed: true, message: "Table and ID are required" });
    }

    const updates = {};
    if (price !== undefined) updates.price = Number(price);
    if (fee !== undefined) updates.fee = Number(fee);
    if (description !== undefined) updates.description = description;
    if (title !== undefined) updates.title = title;

    const { error } = await supabase.from(table).update(updates).eq("id", id);
    if (error) throw error;

    return res.status(200).json({
      failed: false,
      message: "Pricing tier updated successfully",
    });
  } catch (error) {
    console.error("updatePricingItem error:", error);
    next(error);
  }
};
