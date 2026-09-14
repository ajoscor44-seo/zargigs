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
    const { userId, membershipFee = 1000 } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, message: "userId is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Get the newly activated user
    const { data: newUser, error: userErr } = await supabase
      .from("users")
      .select("id, username, firstname, lastname, referred_by")
      .eq("id", userId)
      .single();

    if (userErr || !newUser) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const referrerUsername = newUser.referred_by;

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
      .select("id, username, balance")
      .ilike("username", referrerUsername)
      .maybeSingle();

    if (refErr || !referrer) {
      return new Response(
        JSON.stringify({ success: true, message: `Referrer @${referrerUsername} not found.` }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Compute 60% Referral Bonus
    const bonus = Number(membershipFee) * 0.6; // 60% instant commission (₦600 on ₦1,000 fee)

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
      description: `60% Referral commission from @${newUser.username}'s VIP Membership activation`,
    });

    // 6. Notify Referrer
    await supabase.from("notifications").insert({
      user_id: referrer.id,
      title: "60% Referral Bonus Received! 🎁",
      message: `Congratulations! Your friend @${newUser.username} just activated their VIP Membership. ₦${bonus.toFixed(2)} has been deposited into your wallet!`,
      is_read: false,
    });

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
