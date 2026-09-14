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
    const { userId, amount, bankName, accountNumber, accountName } = await req.json();

    const withdrawAmount = Number(amount);

    if (!userId || !withdrawAmount || withdrawAmount <= 0) {
      return new Response(
        JSON.stringify({ success: false, message: "Valid userId and amount are required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Fetch Admin Settings
    const { data: adminSettings } = await supabase
      .from("admin_settings")
      .select("min_withdrawal, withdrawal_charges, is_withdrawal_active")
      .single();

    const minWithdrawal = Number(adminSettings?.min_withdrawal || 1000);
    const fee = Number(adminSettings?.withdrawal_charges || 50);

    if (adminSettings?.is_withdrawal_active === false) {
      return new Response(
        JSON.stringify({ success: false, message: "Withdrawals are temporarily paused for system maintenance." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (withdrawAmount < minWithdrawal) {
      return new Response(
        JSON.stringify({ success: false, message: `Minimum withdrawal amount is ₦${minWithdrawal.toLocaleString()}.` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Fetch User & verify balance
    const { data: user, error: userErr } = await supabase
      .from("users")
      .select("id, balance, is_member, is_banned")
      .eq("id", userId)
      .single();

    if (userErr || !user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (user.is_banned) {
      return new Response(
        JSON.stringify({ success: false, message: "Account is restricted. Contact support." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!user.is_member) {
      return new Response(
        JSON.stringify({ success: false, message: "Please activate your VIP membership to enable withdrawals." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const currentBalance = Number(user.balance || 0);
    const totalDeduction = withdrawAmount + fee;

    if (currentBalance < totalDeduction) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `Insufficient balance. You need ₦${totalDeduction.toLocaleString()} (including ₦${fee} transfer charge). Available: ₦${currentBalance.toLocaleString()}`,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Deduct from balance
    await supabase
      .from("users")
      .update({
        balance: currentBalance - totalDeduction,
      })
      .eq("id", userId);

    // 4. Create Withdrawal Request
    const { data: request, error: reqErr } = await supabase
      .from("withdrawal_requests")
      .insert({
        user_id: userId,
        amount: withdrawAmount,
        charges: fee,
        bank_name: bankName,
        account_number: accountNumber,
        account_name: accountName,
        status: "pending",
      })
      .select()
      .single();

    if (reqErr) throw reqErr;

    // 5. Create Transaction Record
    await supabase.from("transactions").insert({
      user_id: userId,
      amount: withdrawAmount,
      fee: fee,
      type: "withdrawal",
      status: "pending",
      description: `Withdrawal request of ₦${withdrawAmount.toLocaleString()} to ${bankName} (${accountNumber})`,
    });

    // 6. Notify user
    await supabase.from("notifications").insert({
      user_id: userId,
      title: "Withdrawal Request Submitted 💳",
      message: `Your withdrawal request for ₦${withdrawAmount.toLocaleString()} is being processed and will arrive in your bank account shortly.`,
      is_read: false,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Withdrawal request submitted successfully.",
        data: request,
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
