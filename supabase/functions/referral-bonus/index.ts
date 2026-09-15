import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
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
    const body = await req.json();
    const { userId, type = "vip_activation", amount = 1000 } = body;

    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, message: "userId is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Get the newly activated/action user
    const { data: activeUser, error: userErr } = await supabase
      .from("users")
      .select("id, username, firstname, lastname, referred_by")
      .eq("id", userId)
      .single();

    if (userErr || !activeUser) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const referrerUsername = activeUser.referred_by;

    // Check if user was referred by a valid member
    if (!referrerUsername || referrerUsername === "admin" || referrerUsername === "logical") {
      return new Response(
        JSON.stringify({ success: true, message: "No affiliate referrer bonus required." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Fetch the referrer
    const { data: referrer, error: refErr } = await supabase
      .from("users")
      .select("id, username, email, balance")
      .ilike("username", referrerUsername)
      .maybeSingle();

    if (refErr || !referrer) {
      return new Response(
        JSON.stringify({ success: true, message: `Referrer @${referrerUsername} not found.` }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Compute Commission based on type
    let bonus = 0;
    let desc = "";
    let notifTitle = "";
    let notifMsg = "";

    if (type === "first_withdrawal") {
      // 10% of 1st withdrawal
      bonus = Math.round(Number(amount) * 0.1);
      desc = `10% Referral commission from @${activeUser.username}'s first withdrawal of ₦${Number(amount).toLocaleString()}`;
      notifTitle = "10% Referral Withdrawal Bonus! 💸";
      notifMsg = `Great news! Your referral @${activeUser.username} made their first withdrawal. You earned ₦${bonus.toLocaleString()} commission!`;
    } else if (type === "ad_spend") {
      // 5% of first ad campaign spend
      bonus = Math.round(Number(amount) * 0.05);
      desc = `5% Referral commission from @${activeUser.username}'s first ad campaign of ₦${Number(amount).toLocaleString()}`;
      notifTitle = "5% Advertiser Referral Bonus! 📢";
      notifMsg = `Your referral @${activeUser.username} launched their first ad campaign. You earned ₦${bonus.toLocaleString()}!`;
    } else {
      // Default: 60% VIP Membership Activation (₦600 on ₦1,000 fee)
      bonus = Math.round(Number(amount) * 0.6);
      desc = `60% Referral commission from @${activeUser.username}'s VIP Membership activation`;
      notifTitle = "60% VIP Referral Bonus Received! 🎁";
      notifMsg = `Congratulations! Your friend @${activeUser.username} activated their VIP Membership. ₦${bonus.toLocaleString()} has been added to your wallet!`;
    }

    if (bonus <= 0) {
      return new Response(
        JSON.stringify({ success: true, message: "Bonus amount is zero." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Credit Referrer Wallet
    const currentRefBalance = Number(referrer.balance || 0);
    await supabase
      .from("users")
      .update({
        balance: currentRefBalance + bonus,
      })
      .eq("id", referrer.id);

    // Update Referrer User Earnings
    const { data: earnings } = await supabase
      .from("user_earnings")
      .select("balance, total_earnings")
      .eq("user_id", referrer.id)
      .maybeSingle();

    if (earnings) {
      await supabase
        .from("user_earnings")
        .update({
          balance: Number(earnings.balance || 0) + bonus,
          total_earnings: Number(earnings.total_earnings || 0) + bonus,
        })
        .eq("user_id", referrer.id);
    }

    // 5. Record Transaction Log
    await supabase.from("transactions").insert({
      user_id: referrer.id,
      amount: bonus,
      type: "referral_bonus",
      status: "completed",
      description: desc,
    });

    // 6. Notify Referrer in-app
    await supabase.from("notifications").insert({
      user_id: referrer.id,
      title: notifTitle,
      message: notifMsg,
      is_read: false,
    });

    // 7. Send notification email if email function is available
    try {
      if (referrer.email) {
        await supabase.functions.invoke("send-email", {
          body: {
            to: referrer.email,
            template: "referral_earned",
            data: {
              amount: bonus,
              referredUsername: activeUser.username,
            },
          },
        });
      }
    } catch {
      // Non-blocking
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Credited ₦${bonus} to referrer @${referrer.username}`,
        bonus,
        referrerId: referrer.id,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

