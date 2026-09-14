import { sanction } from "../Controllers/tasks.controller.js";
import { supabase } from "../config/supabase.config.js";
import { userService } from "../services/supabaseDb.service.js";
import logger from "./logger.util.js";

/**
 * Automatically approves submissions if the creator/advertiser has not reviewed them within 24 hours.
 * Releases escrow funds and credits the earner's wallet balance.
 */
const approveTasks = async (req, res) => {
  let approvedCount = 0;
  const now = new Date().toISOString();
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  try {
    // 1. Process Marketplace Task Submissions (task_submissions)
    // Find submissions where status is pending and auto_approve_at has passed OR created > 24 hours ago
    const { data: marketplaceSubmissions, error: mErr } = await supabase
      .from("task_submissions")
      .select(`
        id,
        task_id,
        worker_id,
        reward_amount,
        status,
        auto_approve_at,
        created_at,
        task:task_id (
          id,
          title,
          reward_per_worker
        )
      `)
      .eq("status", "pending")
      .or(`auto_approve_at.lte.${now},created_at.lte.${twentyFourHoursAgo}`);

    if (mErr) {
      logger.warn("Auto-approve marketplace query error:", mErr.message);
    } else if (marketplaceSubmissions && marketplaceSubmissions.length > 0) {
      for (const sub of marketplaceSubmissions) {
        try {
          const reward = Number(sub.reward_amount || sub.task?.reward_per_worker || 0);

          // Mark submission as auto_approved
          await supabase
            .from("task_submissions")
            .update({
              status: "auto_approved",
              creator_feedback: "Auto-approved by system (24h review window expired)",
              reviewed_at: now,
            })
            .eq("id", sub.id);

          // Credit worker balance
          if (sub.worker_id && reward > 0) {
            await userService.incrementBalance(sub.worker_id, reward);
          }

          // Send notification to worker
          await supabase.from("notifications").insert({
            user_id: sub.worker_id,
            title: "Task Auto-Approved & Paid! 💰",
            message: `Your submission for "${sub.task?.title || "Campaign Task"}" was automatically approved after 24 hours without creator review. ₦${reward} has been credited to your wallet!`,
          });

          approvedCount++;
          logger.info(`Marketplace submission ${sub.id} auto-approved and ₦${reward} credited to user ${sub.worker_id}`);
        } catch (subErr) {
          logger.error(`Error auto-approving marketplace submission ${sub.id}:`, subErr);
        }
      }
    }

    // 2. Process Broadcast Advert & Engagement Submissions (proof_of_work)
    const { data: proofSubmissions, error: pErr } = await supabase
      .from("proof_of_work")
      .select("*")
      .eq("status", "pending")
      .lte("created_at", twentyFourHoursAgo);

    if (pErr) {
      logger.warn("Auto-approve proof_of_work query error:", pErr.message);
    } else if (proofSubmissions && proofSubmissions.length > 0) {
      for (const proof of proofSubmissions) {
        try {
          await sanction(
            proof.id,
            "approve",
            proof.task_id,
            proof.user_id,
            proof.reward || proof.earner_fee || 0
          );
          approvedCount++;
          logger.info(`Proof submission ${proof.id} auto-approved after 24 hours`);
        } catch (proofErr) {
          logger.error(`Error auto-approving proof ${proof.id}:`, proofErr);
        }
      }
    }

    // 3. Process Legacy in_review_tasks if present
    const { data: legacyTasks } = await supabase
      .from("in_review_tasks")
      .select("*")
      .lt("created_at", twentyFourHoursAgo);

    if (legacyTasks && legacyTasks.length > 0) {
      for (const task of legacyTasks) {
        try {
          await sanction(task.id, "approve", task.task_id, task.user_id, 0);
          approvedCount++;
          logger.info(`Legacy task ${task.id} auto-approved after 24 hours`);
        } catch (legErr) {
          logger.error(`Error auto-approving legacy task ${task.id}:`, legErr);
        }
      }
    }

    if (res) {
      return res.status(200).json({
        failed: false,
        message: `Auto-approval run complete. ${approvedCount} tasks processed and paid.`,
        approvedCount,
      });
    }
  } catch (err) {
    logger.error("Failed to automatically approve tasks:", err);
    if (res) {
      return res.status(500).json({ failed: true, message: err.message });
    }
  }
};

export default approveTasks;
