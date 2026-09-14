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

    const { data: pendingTasks, error: fetchErr } = await supabase
      .from("in_review_tasks")
      .select("*")
      .lt("created_at", cutoffDate);

    if (fetchErr) {
      throw fetchErr;
    }

    const results = [];

    for (const task of pendingTasks || []) {
      const reward = Number(task.reward || task.amount || 0);
      const userId = task.user_id;

      // 1. Move to performed_tasks
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

      if (insErr) {
        console.error(`Failed to move task ${task.id} to performed_tasks:`, insErr);
        continue;
      }

      // 2. Remove from in_review_tasks
      await supabase.from("in_review_tasks").delete().eq("id", task.id);

      // 3. Credit worker balance
      const { data: user } = await supabase
        .from("users")
        .select("balance, pending_balance")
        .eq("id", userId)
        .single();

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
      }

      // 4. Update user_earnings table if exists
      const { data: earnings } = await supabase
        .from("user_earnings")
        .select("balance, total_earnings, pending_earnings")
        .eq("user_id", userId)
        .maybeSingle();

      if (earnings) {
        await supabase
          .from("user_earnings")
          .update({
            balance: Number(earnings.balance || 0) + reward,
            total_earnings: Number(earnings.total_earnings || 0) + reward,
            pending_earnings: Math.max(0, Number(earnings.pending_earnings || 0) - reward),
          })
          .eq("user_id", userId);
      }

      // 5. Send approval notification
      await supabase.from("notifications").insert({
        user_id: userId,
        title: "Task Auto-Approved! 🎉",
        message: `Your submitted task was auto-approved after 24 hours. ₦${reward.toFixed(2)} has been added to your wallet.`,
        is_read: false,
      });

      results.push({ taskId: task.id, userId, reward, status: "approved" });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${results.length} auto-approved tasks.`,
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
