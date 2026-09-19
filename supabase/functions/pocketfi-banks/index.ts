// Supabase Edge Function: PocketFi Bank List & Account Verification Proxy
// URL: https://itzqsxmjyjfgtbolfhmq.supabase.co/functions/v1/pocketfi-banks

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-user-id",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const POCKETFI_BASE_URL = "https://api.pocketfi.ng/api/v1";
const POCKETFI_BEARER_TOKEN = "32438|LO9iG4rLGLnVzywfVDlhGoji0JWTpYywEIc3KHGxf837cb4b";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1. GET: Fetch full Nigerian bank list from PocketFi
    if (req.method === "GET") {
      const pocketfiRes = await fetch(`${POCKETFI_BASE_URL}/payout/bank-list`, {
        headers: {
          Authorization: `Bearer ${POCKETFI_BEARER_TOKEN}`,
          Accept: "application/json",
        },
      });

      const resData = await pocketfiRes.json();
      return new Response(JSON.stringify(resData), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: pocketfiRes.status,
      });
    }

    // 2. POST: Verify bank account with PocketFi
    if (req.method === "POST") {
      const body = await req.json();
      const accountNumber = body.accountNumber || body.account_number;
      const bankCode = body.bankCode || body.bank_code;

      if (!accountNumber || !bankCode) {
        return new Response(
          JSON.stringify({
            status: "error",
            message: "Both accountNumber and bankCode are required for PocketFi verification.",
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }

      const verifyRes = await fetch(`${POCKETFI_BASE_URL}/payout/verify-bank`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${POCKETFI_BEARER_TOKEN}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          account_number: String(accountNumber).trim(),
          bank_code: String(bankCode).trim(),
        }),
      });

      const verifyData = await verifyRes.json();
      const rawName = String(
        verifyData?.account_name ||
        verifyData?.data?.account_name ||
        verifyData?.accountName ||
        ""
      ).trim();

      const isInvalidName =
        !rawName ||
        rawName.length < 2 ||
        rawName.toLowerCase().includes("unknown") ||
        rawName.toLowerCase().includes("invalid") ||
        rawName.toLowerCase().includes("error") ||
        rawName.toLowerCase().includes("not found");

      if (!verifyRes.ok || verifyData?.status !== "success" || isInvalidName) {
        return new Response(
          JSON.stringify({
            status: "error",
            message:
              verifyData?.message && !verifyData.message.toLowerCase().includes("unknown")
                ? verifyData.message
                : "Could not verify account name. Please confirm your bank selection and 10-digit account number.",
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }

      return new Response(
        JSON.stringify({
          status: "success",
          account_name: rawName,
          bank_code: verifyData.bank_code || bankCode,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    return new Response(JSON.stringify({ message: "Method not allowed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 405,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ status: "error", message: error.message || "PocketFi API Error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
