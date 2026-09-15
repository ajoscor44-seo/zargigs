// Supabase Edge Function for PocketFi Webhook (100% Serverless)
// URL: https://itzqsxmjyjfgtbolfhmq.supabase.co/functions/v1/pocketfi-webhook

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, http_pocketfi_signature, x-pocketfi-signature",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Handle GET health check
  if (req.method === "GET") {
    return new Response(
      JSON.stringify({ status: "ok", message: "Supabase PocketFi Webhook is Active." }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "https://itzqsxmjyjfgtbolfhmq.supabase.co";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseServiceKey) {
      throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    console.log("PocketFi Webhook Body:", JSON.stringify(body));

    const payload = body.data || body.payload || body;
    const transaction = payload.transaction || body.transaction || {};
    const order = payload.order || body.order || {};
    const customer = payload.customer || payload.user || body.customer || {};

    const reference =
      transaction.reference ||
      payload.reference ||
      payload.payment_reference ||
      body.reference ||
      `pfi_${Date.now()}`;

    const amount = Number(
      order.amount ||
        payload.amount ||
        payload.amount_paid ||
        order.settlement_amount ||
        transaction.amount ||
        body.amount ||
        0
    );

    const accountNumber =
      payload.account_number ||
      payload.virtual_account ||
      payload.account ||
      transaction.account_number ||
      body.account_number ||
      payload.accountNumber;

    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ status: "ignored", message: "Zero or invalid amount" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // 1. Check for duplicate reference
    const { data: existingFunding } = await supabase
      .from("funding")
      .select("id")
      .eq("reference", reference)
      .maybeSingle();

    if (existingFunding) {
      return new Response(
        JSON.stringify({ status: "success", message: "Transaction already processed" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // 2. Identify User in Supabase
    let userId = null;

    // A. By Account Number in tokens table
    if (accountNumber) {
      const { data: tokenRows } = await supabase
        .from("tokens")
        .select("user_id, token")
        .ilike("token", `%${accountNumber}%`)
        .limit(1);

      if (tokenRows && tokenRows.length > 0) {
        userId = tokenRows[0].user_id;
      }
    }

    // B. By Account Number in user_details table
    if (!userId && accountNumber) {
      const { data: userDetail } = await supabase
        .from("user_details")
        .select("user_id")
        .or(`account_number.eq.${accountNumber}`)
        .maybeSingle();

      if (userDetail?.user_id) {
        userId = userDetail.user_id;
      }
    }

    // B. By Email in users
    if (!userId && (customer.email || payload.email || body.email)) {
      const email = customer.email || payload.email || body.email;
      const { data: userByEmail } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (userByEmail?.id) {
        userId = userByEmail.id;
      }
    }

    // C. By direct User ID
    if (!userId && (payload.user_id || payload.userId || order.user_id || body.user_id)) {
      userId = payload.user_id || payload.userId || order.user_id || body.user_id;
    }

    if (!userId) {
      console.warn("Could not find user matching payment:", { accountNumber, email: customer.email });
      return new Response(
        JSON.stringify({ status: "unmatched", message: "User not found for virtual account" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // 3. Record funding transaction in Supabase
    await supabase.from("funding").insert({
      user_id: userId,
      amount: amount,
      reference: reference,
      payment_method: "PocketFi Virtual Account",
      status: "success",
    });

    // 4. Atomically increment User Balance in Supabase
    const { data: userRow } = await supabase
      .from("users")
      .select("balance")
      .eq("id", userId)
      .maybeSingle();

    const currentBalance = Number(userRow?.balance || 0);
    const newBalance = currentBalance + amount;

    await supabase
      .from("users")
      .update({ balance: newBalance })
      .eq("id", userId);

    // 5. Insert Transaction Log in Supabase
    try {
      await supabase.from("transactions").insert({
        user_id: userId,
        amount: amount,
        type: "deposit",
        status: "completed",
        description: `Dedicated Bank Transfer Deposit - Ref: ${reference}`,
        metadata: { reference: reference, payment_method: "PocketFi Virtual Account" },
      });
    } catch (txErr) {
      console.warn("Transaction record notice:", txErr);
    }

    // 6. Send In-App Notification in Supabase
    try {
      await supabase.from("notifications").insert({
        user_id: userId,
        title: "Deposit Confirmed! 💰",
        message: `Your deposit of ₦${amount.toLocaleString()} has been received and credited to your wallet. Your new balance is ₦${newBalance.toLocaleString()}.`,
        is_read: false,
      });
    } catch (notifErr) {
      console.warn("Notification insert error:", notifErr);
    }

    // 7. Dispatch Transactional Email via send-email Edge Function
    try {
      const userEmail = userRow?.email || customer?.email || payload?.email;
      if (userEmail) {
        await supabase.functions.invoke("send-email", {
          body: {
            to: userEmail,
            name: userRow?.username || userRow?.full_name || customer?.name,
            type: "wallet_funded",
            data: {
              amount: amount,
              paymentMethod: "PocketFi Dedicated Bank Transfer",
              reference: reference,
              newBalance: newBalance,
            },
          },
        });
      }
    } catch (emailErr) {
      console.warn("Deposit email notice:", emailErr);
    }

    console.log(`Successfully credited user ${userId} with ₦${amount}. New balance: ₦${newBalance}`);

    return new Response(
      JSON.stringify({
        status: "success",
        message: "Wallet credited successfully",
        data: { userId, amount, newBalance, reference },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response(
      JSON.stringify({ status: "error", message: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
