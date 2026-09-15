import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SENDBYTE_API_KEY = Deno.env.get("SENDBYTE_API_KEY");
const SMTP_HOST = Deno.env.get("SMTP_HOST") || "smtp.sendbyte.africa";
const SMTP_PORT = 587;
const SENDER_EMAIL = "support@docszar.com";
const DEFAULT_SENDER_NAME = "Joscor of ZAR";

const wrapHtml = (title: string, content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #e2e8f0;">
    <!-- Header -->
    <tr>
      <td style="background-color: #0f172a; padding: 28px 24px; text-align: center;">
        <div style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); width: 42px; height: 42px; border-radius: 12px; line-height: 42px; text-align: center; color: #ffffff; font-weight: 800; font-size: 22px; margin-bottom: 8px;">D</div>
        <h1 style="color: #ffffff; font-size: 22px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">Docs<span style="color: #34d399;">Zar</span></h1>
        <p style="color: #94a3b8; font-size: 12px; margin: 4px 0 0 0; font-weight: 500;">Nigeria's #1 Social Microtasks & Growth Platform</p>
      </td>
    </tr>
    <!-- Content -->
    <tr>
      <td style="padding: 32px 24px; color: #1e293b; font-size: 15px; line-height: 1.65;">
        ${content}
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td style="background-color: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
        <p style="margin: 0 0 6px 0;">Sent with ❤️ from the ZAR & DocsZar Team.</p>
        <p style="margin: 0; color: #94a3b8; font-size: 11px;">&copy; ${new Date().getFullYear()} DocsZar Technologies &bull; <a href="https://www.docszar.com" style="color: #10b981; text-decoration: none;">www.docszar.com</a></p>
      </td>
    </tr>
  </table>
</body>
</html>
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { to, subject, type, data, name, senderName } = await req.json();

    if (!to) {
      return new Response(JSON.stringify({ error: "Missing recipient 'to' email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let emailSubject = subject || "DocsZar Account Notification";
    let bodyHtml = "";
    const activeSender = senderName || DEFAULT_SENDER_NAME;

    const greeting = name ? `Hello ${name},` : "Hello,";

    switch (type) {
      case "welcome_email":
        emailSubject = `🎉 Welcome to DocsZar, ${name || "Earner"}! (A note from Joscor)`;
        bodyHtml = wrapHtml(emailSubject, `
          <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin-top: 0;">Welcome to DocsZar! 🎉</h2>
          <p>${greeting}</p>
          <p>I'm <strong>Joscor</strong>, and I want to personally welcome you to the <strong>DocsZar / ZAR community</strong>! 🚀</p>
          <p>Whether your goal is to earn steady income by performing verified social media tasks, or to scale your brand and social presence across Nigeria, you're in the right place.</p>
          
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <h3 style="color: #166534; font-size: 16px; margin: 0 0 12px 0; font-weight: 700;">Quick Tips to Get Started:</h3>
            <ul style="margin: 0; padding-left: 20px; color: #15803d; font-size: 14px; line-height: 1.8;">
              <li><strong>Complete your profile & bank details</strong> to unlock instant payouts.</li>
              <li><strong>Browse daily tasks</strong> on WhatsApp, Instagram, TikTok, and Twitter to start earning immediately.</li>
              <li><strong>Invite friends with your referral link</strong> to earn instant 60% bonuses on activations.</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 28px 0;">
            <a href="https://www.docszar.com/dashboard" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 15px; display: inline-block; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);">Go to My Dashboard &rarr;</a>
          </div>

          <p style="margin-bottom: 24px;">If you ever have any questions, suggestions, or need help with your account, our support team and I are always just a click away.</p>

          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; font-weight: 800; color: #0f172a; font-size: 15px;">Joscor</p>
            <p style="margin: 2px 0 0 0; font-size: 13px; color: #64748b;">Founder & Team Lead, ZAR & DocsZar</p>
          </div>
        `);
        break;

      case "wallet_funded":
        emailSubject = `💰 Wallet Deposit Confirmed: ₦${Number(data?.amount || 0).toLocaleString()}`;
        bodyHtml = wrapHtml(emailSubject, `
          <h2 style="color: #0f172a; font-size: 18px; margin-top: 0;">Deposit Successful 🎉</h2>
          <p>${greeting}</p>
          <p>Your DocsZar wallet has been successfully credited with <strong>₦${Number(data?.amount || 0).toLocaleString()}</strong>.</p>
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <div style="font-size: 13px; color: #166534; margin-bottom: 4px;"><strong>Payment Method:</strong> ${data?.paymentMethod || "Dedicated Bank Transfer"}</div>
            <div style="font-size: 13px; color: #166534; margin-bottom: 4px;"><strong>Reference:</strong> <code>${data?.reference || "N/A"}</code></div>
            <div style="font-size: 15px; color: #15803d; font-weight: 700; margin-top: 8px;">New Balance: ₦${Number(data?.newBalance || 0).toLocaleString()}</div>
          </div>
          <div style="text-align: center; margin-top: 24px;">
            <a href="https://www.docszar.com/dashboard" style="background-color: #10b981; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">View Wallet Balance</a>
          </div>
        `);
        break;

      case "withdrawal_requested":
        emailSubject = `📤 Withdrawal Request Received: ₦${Number(data?.amount || 0).toLocaleString()}`;
        bodyHtml = wrapHtml(emailSubject, `
          <h2 style="color: #0f172a; font-size: 18px; margin-top: 0;">Withdrawal In Progress ⏳</h2>
          <p>${greeting}</p>
          <p>We received your payout request of <strong>₦${Number(data?.amount || 0).toLocaleString()}</strong> to your bank account.</p>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <div style="font-size: 13px; color: #475569; margin-bottom: 4px;"><strong>Bank:</strong> ${data?.bankName || "Registered Bank"}</div>
            <div style="font-size: 13px; color: #475569; margin-bottom: 4px;"><strong>Account:</strong> ${data?.accountNumber || "N/A"} (${data?.accountName || ""})</div>
            <div style="font-size: 13px; color: #475569;"><strong>Status:</strong> Processing</div>
          </div>
          <p style="font-size: 13px; color: #64748b;">Withdrawals are typically reviewed and settled directly into your bank account within minutes.</p>
        `);
        break;

      case "withdrawal_completed":
        emailSubject = `✅ Withdrawal Sent: ₦${Number(data?.amount || 0).toLocaleString()}`;
        bodyHtml = wrapHtml(emailSubject, `
          <h2 style="color: #0f172a; font-size: 18px; margin-top: 0;">Funds Dispatched! 🚀</h2>
          <p>${greeting}</p>
          <p>Your withdrawal of <strong>₦${Number(data?.amount || 0).toLocaleString()}</strong> has been approved and paid out to your bank account.</p>
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <div style="font-size: 13px; color: #166534; margin-bottom: 4px;"><strong>Account:</strong> ${data?.accountNumber || ""} (${data?.bankName || ""})</div>
            <div style="font-size: 13px; color: #166534;"><strong>Status:</strong> Completed</div>
          </div>
        `);
        break;

      case "task_approved":
        emailSubject = `🎉 Task Approved: ₦${Number(data?.reward || 0).toLocaleString()} Earned!`;
        bodyHtml = wrapHtml(emailSubject, `
          <h2 style="color: #0f172a; font-size: 18px; margin-top: 0;">Submission Approved! 🌟</h2>
          <p>${greeting}</p>
          <p>Great job! Your submission for <strong>"${data?.taskTitle || "Microtask"}"</strong> has been approved by the creator.</p>
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <div style="font-size: 14px; color: #166534;"><strong>Reward Credited:</strong> ₦${Number(data?.reward || 0).toLocaleString()}</div>
          </div>
          <div style="text-align: center; margin-top: 24px;">
            <a href="https://www.docszar.com/earn" style="background-color: #10b981; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">Find More Tasks</a>
          </div>
        `);
        break;

      case "referral_earned":
        emailSubject = `🎁 Referral Commission Earned: ₦${Number(data?.amount || 0).toLocaleString()}`;
        bodyHtml = wrapHtml(emailSubject, `
          <h2 style="color: #0f172a; font-size: 18px; margin-top: 0;">Referral Bonus Credited! 🎊</h2>
          <p>${greeting}</p>
          <p>Your referral <strong>@${data?.referredUsername || "user"}</strong> has joined / activated their membership.</p>
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <div style="font-size: 14px; color: #166534; font-weight: 700;">Bonus Amount: ₦${Number(data?.amount || 0).toLocaleString()}</div>
          </div>
        `);
        break;

      default:
        bodyHtml = wrapHtml(emailSubject, `
          <h2 style="color: #0f172a; font-size: 18px; margin-top: 0;">${emailSubject}</h2>
          <p>${greeting}</p>
          <p>${data?.message || "You have a new update on your DocsZar account."}</p>
          ${data?.actionUrl ? `
            <div style="text-align: center; margin-top: 24px;">
              <a href="${data.actionUrl}" style="background-color: #10b981; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">${data?.actionLabel || "View Dashboard"}</a>
            </div>
          ` : ""}
        `);
        break;
    }

    // Send using SendByte SMTP
    const client = new SmtpClient({
      connection: {
        hostname: SMTP_HOST,
        port: SMTP_PORT,
        tls: false,
        auth: {
          username: "apikey",
          password: SENDBYTE_API_KEY,
        },
      },
    });

    await client.send({
      from: `${activeSender} <${SENDER_EMAIL}>`,
      to,
      subject: emailSubject,
      html: bodyHtml,
    });

    await client.close();

    return new Response(
      JSON.stringify({ status: "success", message: `Email sent to ${to}` }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Failed to send transactional email:", error);
    return new Response(
      JSON.stringify({ status: "error", message: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

