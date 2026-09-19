import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find all in-review tasks older than 24 hours
    const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const nowIso = new Date().toISOString();

    const results = [];

    // 1. Process legacy in_review_tasks
    const { data: pendingTasks } = await supabase
      .from("in_review_tasks")
      .select("*")
      .lt("created_at", cutoffDate);

    for (const task of pendingTasks || []) {
      const reward = Number(task.reward || task.amount || 0);
      const userId = task.user_id;

      const { error: insErr } = await supabase.from("performed_tasks").insert({
        user_id: userId,
        task_id: task.task_id,
        task_type: task.task_type || "microtask",
        reward: reward,
        proof_text: task.proof_text || "",
        proof_image: task.proof_image || "",
        status: "approved",
        approved_at: new Date().toISOString(),
      });

      if (insErr) continue;

      await supabase.from("in_review_tasks").delete().eq("id", task.id);

      // Credit worker balance
      const { data: user } = await supabase
        .from("users")
        .select("id, email, firstname, username, balance, pending_balance")
        .eq("id", userId)
        .maybeSingle();

      if (user) {
        const currentBalance = Number(user.balance || 0);
        const currentPending = Number(user.pending_balance || 0);

        await supabase
          .from("users")
          .update({
            balance: currentBalance + reward,
            pending_balance: Math.max(0, currentPending - reward),
          })
          .eq("id", userId);

        // Send email notification
        if (user.email) {
          try {
            await supabase.functions.invoke("send-email", {
              body: {
                to: user.email,
                name: user.firstname || user.username || "Earner",
                type: "task_approved",
                data: {
                  taskTitle: task.task_type || "Marketplace Task",
                  reward: reward,
                },
                senderName: "DocsZAR Rewards",
              },
            });
          } catch {}
        }
      }

      // Send in-app notification
      await supabase.from("notifications").insert({
        user_id: userId,
        title: "Task Auto-Approved! 🎉",
        message: `Your submitted task was auto-approved after 24 hours. ₦${reward.toFixed(2)} has been added to your wallet.`,
        is_read: false,
      });

      results.push({ taskId: task.id, userId, reward, status: "approved" });
    }

    // 2. Process marketplace task_submissions where auto_approve_at <= now() or older than 24h
    const { data: pendingSubmissions } = await supabase
      .from("task_submissions")
      .select("id, task_id, worker_id, reward_amount, created_at")
      .eq("status", "pending")
      .or(`auto_approve_at.lte.${nowIso},created_at.lte.${cutoffDate}`);

    for (const sub of pendingSubmissions || []) {
      const reward = Number(sub.reward_amount || 0);
      const workerId = sub.worker_id;

      // Mark approved
      await supabase
        .from("task_submissions")
        .update({
          status: "auto_approved",
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", sub.id);

      // Fetch task details for title
      const { data: taskDetail } = await supabase
        .from("marketplace_tasks")
        .select("title")
        .eq("id", sub.task_id)
        .maybeSingle();

      // Credit worker balance
      const { data: worker } = await supabase
        .from("users")
        .select("id, email, firstname, username, balance")
        .eq("id", workerId)
        .maybeSingle();

      if (worker && reward > 0) {
        const currentBalance = Number(worker.balance || 0);
        await supabase
          .from("users")
          .update({
            balance: currentBalance + reward,
          })
          .eq("id", workerId);

        // Send email notification to worker
        if (worker.email) {
          try {
            await supabase.functions.invoke("send-email", {
              body: {
                to: worker.email,
                name: worker.firstname || worker.username || "Earner",
                type: "task_approved",
                data: {
                  taskTitle: taskDetail?.title || "Campaign Task",
                  reward: reward,
                },
                senderName: "DocsZAR Rewards",
              },
            });
          } catch {}
        }
      }

      // Send in-app notification
      await supabase.from("notifications").insert({
        user_id: workerId,
        title: "Task Auto-Approved! 🎉",
        message: `Your proof for "${taskDetail?.title || "Task"}" was auto-approved! ₦${reward.toFixed(2)} credited to your wallet.`,
        is_read: false,
      });

      results.push({ submissionId: sub.id, workerId, reward, status: "auto_approved" });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${results.length} auto-approved tasks & submissions.`,
        data: results,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
