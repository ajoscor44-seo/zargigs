// Supabase Edge Function: PocketFi Dedicated Virtual Account Generator & Syncer
// URL: https://itzqsxmjyjfgtbolfhmq.supabase.co/functions/v1/pocketfi-virtual-account

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-user-id",
};

const POCKETFI_BASE_URL = "https://api.pocketfi.ng/api/v1";
const POCKETFI_BUSINESS_ID = "30135";
const POCKETFI_BEARER_TOKEN = "32438|LO9iG4rLGLnVzywfVDlhGoji0JWTpYywEIc3KHGxf837cb4b";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "https://itzqsxmjyjfgtbolfhmq.supabase.co";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0enFzeG1qeWpmZ3Rib2xmaG1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTA3MzYxNCwiZXhwIjoyMTA0NjQ5NjE0fQ.46NwAZEiT7HundS2pGIP3yoNw925247bU2WDyLkw0jA";

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // GET: Retrieve existing virtual account for user
  if (req.method === "GET") {
    try {
      const url = new URL(req.url);
      const userId = url.searchParams.get("userId") || req.headers.get("x-user-id");

      if (!userId) {
        return new Response(
          JSON.stringify({ status: "success", walletDetails: null }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
        );
      }

      // Query Supabase tokens table for stored PocketFi virtual account
      const { data } = await supabase
        .from("tokens")
        .select("token")
        .eq("user_id", userId)
        .ilike("token", "pocketfi_va:%")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data?.token && data.token.startsWith("pocketfi_va:")) {
        try {
          const parsed = JSON.parse(data.token.replace("pocketfi_va:", ""));
          if (parsed?.accountNumber) {
            return new Response(
              JSON.stringify({
                status: "success",
                walletDetails: parsed,
              }),
              { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
            );
          }
        } catch {}
      }

      return new Response(
        JSON.stringify({ status: "success", walletDetails: null }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({ status: "error", message: err.message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
  }

  // POST: Generate a new PocketFi virtual account & store in Supabase DB
  if (req.method === "POST") {
    try {
      const body = await req.json().catch(() => ({}));
      const userId = body.userId || body.user_id || req.headers.get("x-user-id");

      if (!userId) {
        return new Response(
          JSON.stringify({ status: "error", message: "User ID is required" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }

      const forceNew = body.forceNew !== undefined ? body.forceNew : false;

      // 1. If not forcing new, check if user already has an active virtual account in DB
      if (!forceNew) {
        const { data: existing } = await supabase
          .from("tokens")
          .select("token")
          .eq("user_id", userId)
          .ilike("token", "pocketfi_va:%")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (existing?.token && existing.token.startsWith("pocketfi_va:")) {
          try {
            const parsed = JSON.parse(existing.token.replace("pocketfi_va:", ""));
            if (parsed?.accountNumber) {
              return new Response(
                JSON.stringify({
                  status: "success",
                  message: "Active virtual account retrieved",
                  walletDetails: parsed,
                }),
                { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
              );
            }
          } catch {}
        }
      }

      // 2. Fetch user details from Supabase users table
      const { data: userProfile } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      let firstName = String(body.firstname || userProfile?.firstname || "Zargigs").trim();
      let lastName = String(body.lastname || userProfile?.lastname || "Earner").trim();
      if (!firstName || firstName.length < 2) firstName = "Zargigs";
      if (!lastName || lastName.length < 2) lastName = "Earner";

      let email = String(body.email || userProfile?.email || "").trim();
      if (!email || !email.includes("@")) {
        email = `user_${userId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 10)}@zargigs.com`;
      }

      let rawPhone = String(body.phone || userProfile?.phone || "").replace(/[^0-9]/g, "");
      let phone = "08123456789";
      if (rawPhone.startsWith("234") && rawPhone.length === 13) {
        phone = "0" + rawPhone.slice(3);
      } else if (rawPhone.startsWith("0") && rawPhone.length === 11) {
        phone = rawPhone;
      } else if (rawPhone.length === 10) {
        phone = "0" + rawPhone;
      } else if (rawPhone.length > 11) {
        phone = "0" + rawPhone.slice(-10);
      }

      // 3. Call PocketFi API
      const candidateBanks = ["paga", "kuda"];
      let createdAccount = null;
      let lastErrMsg = null;

      for (const bank of candidateBanks) {
        try {
          const pocketfiRes = await fetch(`${POCKETFI_BASE_URL}/virtual-accounts/create`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${POCKETFI_BEARER_TOKEN}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              first_name: firstName,
              last_name: lastName,
              phone: phone,
              email: email,
              bank: bank,
              businessId: POCKETFI_BUSINESS_ID,
            }),
          });

          const resData = await pocketfiRes.json();
          console.log(`PocketFi response (${bank}):`, resData);

          if (resData && resData.status) {
            const banks = resData.banks || [];
            if (banks.length > 0) {
              createdAccount = {
                bankName: (banks[0].bankName || bank).toUpperCase(),
                accountNumber: String(banks[0].accountNumber).trim(),
                accountName: banks[0].accountName || `${firstName} ${lastName}`.trim(),
              };
              break;
            }
          } else {
            lastErrMsg = resData.message || `Could not create ${bank} virtual account.`;
          }
        } catch (callErr) {
          lastErrMsg = callErr.message;
        }
      }

      if (!createdAccount || !createdAccount.accountNumber) {
        return new Response(
          JSON.stringify({
            status: "error",
            message: lastErrMsg || "PocketFi API could not provision virtual account.",
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }

      // 4. Save directly into Supabase tokens table
      await supabase
        .from("tokens")
        .delete()
        .eq("user_id", userId)
        .ilike("token", "pocketfi_va:%");

      await supabase.from("tokens").insert({
        user_id: userId,
        token: `pocketfi_va:${JSON.stringify(createdAccount)}`,
      });

      return new Response(
        JSON.stringify({
          status: "success",
          message: "Dedicated PocketFi virtual account generated and stored in Supabase.",
          walletDetails: createdAccount,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({ status: "error", message: err.message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
  }

  return new Response("Method not allowed", { headers: corsHeaders, status: 405 });
});
