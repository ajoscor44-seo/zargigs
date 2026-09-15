import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import nodemailer from "npm:nodemailer@6.9.13";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SENDBYTE_API_KEY = Deno.env.get("SENDBYTE_API_KEY") || "1243c8d70441e84cf49dbc4e6646caf725a7bb8892ebf114ccc9e7485bff318b";
const SMTP_HOST = Deno.env.get("SMTP_HOST") || "smtp.sendbyte.africa";
const SMTP_PORT = Number(Deno.env.get("SMTP_PORT") || 587);
const SENDER_EMAIL = Deno.env.get("SENDER_EMAIL") || "support@docszar.com";
const DEFAULT_SENDER_NAME = "Joscor from DocsZar";

const wrapHtml = (title: string, content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 28px 12px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); overflow: hidden; border: 1px solid #e2e8f0;">
    <!-- Clean Minimalist Brand Header -->
    <tr>
      <td style="background-color: #ffffff; padding: 28px 24px 20px 24px; text-align: center; border-bottom: 2px solid #f1f5f9;">
        <div style="display: inline-block;">
          <span style="font-size: 26px; font-weight: 900; letter-spacing: -0.5px; color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            Docs<span style="color: #10b981;">Zar</span>
          </span>
        </div>
        <p style="color: #64748b; font-size: 11px; margin: 4px 0 0 0; font-weight: 600; text-transform: uppercase; letter-spacing: 1.2px;">
          Social Microtasks & Growth Hub
        </p>
      </td>
    </tr>
    <!-- Main Email Body -->
    <tr>
      <td style="padding: 32px 28px; color: #334155; font-size: 15px; line-height: 1.7;">
        ${content}
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
        <p style="margin: 0 0 8px 0; font-weight: 600; color: #475569;">
          DocsZar &bull; Empowering Nigerian Creators & Digital Earners
        </p>
        <p style="margin: 0 0 10px 0; color: #94a3b8; font-size: 11px;">
          &copy; ${new Date().getFullYear()} DocsZar Technologies. All rights reserved.
        </p>
        <div style="font-size: 11px;">
          <a href="https://www.docszar.com/dashboard" style="color: #10b981; text-decoration: none; font-weight: 700; margin: 0 8px;">Dashboard</a> &bull;
          <a href="https://www.docszar.com/help-support" style="color: #10b981; text-decoration: none; font-weight: 700; margin: 0 8px;">Support Center</a> &bull;
          <a href="https://wa.me/2349027662488" style="color: #10b981; text-decoration: none; font-weight: 700; margin: 0 8px;">WhatsApp: 090 2766 2488</a>
        </div>
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
          <p>I'm <strong>Joscor</strong>, and I want to personally welcome you to the <strong>DocsZar community</strong>! 🚀</p>
          <p>Whether your goal is to earn steady income by performing verified social media tasks, or to scale your brand and social presence across Nigeria, you're in the right place.</p>
          
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <h3 style="color: #166534; font-size: 15px; margin: 0 0 10px 0; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Quick Tips to Get Started:</h3>
            <ul style="margin: 0; padding-left: 20px; color: #15803d; font-size: 14px; line-height: 1.8;">
              <li><strong>Complete your profile & bank details</strong> to unlock instant payouts.</li>
              <li><strong>Browse daily tasks</strong> on WhatsApp, Instagram, TikTok, and Twitter to earn cash.</li>
              <li><strong>Invite friends with your referral link</strong> to earn ₦600 instant bonus on VIP upgrades + 10% of their first withdrawal.</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 28px 0;">
            <a href="https://www.docszar.com/dashboard" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: 800; font-size: 15px; display: inline-block; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);">Go to My Dashboard &rarr;</a>
          </div>

          <p style="margin-bottom: 24px;">If you ever have any questions, suggestions, or need help with your account, our team is always just a click away.</p>

          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; font-weight: 800; color: #0f172a; font-size: 15px;">Joscor</p>
            <p style="margin: 2px 0 0 0; font-size: 13px; color: #64748b;">Founder & Team Lead, DocsZar</p>
          </div>
        `);
        break;

      case "wallet_funded":
        emailSubject = `💰 Wallet Deposit Confirmed: ₦${Number(data?.amount || 0).toLocaleString()}`;
        bodyHtml = wrapHtml(emailSubject, `
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="display: inline-block; background: #dcfce7; color: #15803d; width: 48px; height: 48px; border-radius: 50%; line-height: 48px; font-size: 24px; font-weight: bold;">
              ₦
            </div>
          </div>
          <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin-top: 0; text-align: center;">Deposit Successful! 🎉</h2>
          <p style="text-align: center; color: #64748b; font-size: 14px; margin-top: -6px;">Your payment has been received and credited to your wallet balance.</p>
          
          <p>${greeting}</p>
          <p>We are pleased to inform you that your DocsZar wallet has been successfully credited with <strong>₦${Number(data?.amount || 0).toLocaleString()}</strong>.</p>
          
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px; margin: 24px 0;">
            <table width="100%" style="font-size: 14px; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Amount Credited:</td>
                <td style="padding: 6px 0; text-align: right; font-weight: 800; color: #10b981; font-size: 16px;">₦${Number(data?.amount || 0).toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Payment Method:</td>
                <td style="padding: 6px 0; text-align: right; font-weight: 600; color: #1e293b;">${data?.paymentMethod || "Dedicated Bank Transfer"}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Reference:</td>
                <td style="padding: 6px 0; text-align: right; font-family: monospace; font-size: 11px; color: #475569;">${data?.reference || "N/A"}</td>
              </tr>
              ${data?.newBalance !== undefined ? `
              <tr style="border-top: 1px dashed #cbd5e1;">
                <td style="padding: 10px 0 0 0; color: #0f172a; font-weight: 700;">New Wallet Balance:</td>
                <td style="padding: 10px 0 0 0; text-align: right; font-weight: 900; color: #0f172a; font-size: 17px;">₦${Number(data?.newBalance || 0).toLocaleString()}</td>
              </tr>
              ` : ""}
            </table>
          </div>

          <div style="text-align: center; margin: 28px 0;">
            <a href="https://www.docszar.com/dashboard" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: 800; font-size: 14px; display: inline-block; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);">View Dashboard Balance &rarr;</a>
          </div>
        `);
        break;

      case "withdrawal_requested":
        emailSubject = `📤 Withdrawal Request Received: ₦${Number(data?.amount || 0).toLocaleString()}`;
        bodyHtml = wrapHtml(emailSubject, `
          <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin-top: 0;">Withdrawal In Progress ⏳</h2>
          <p>${greeting}</p>
          <p>We received your withdrawal request of <strong>₦${Number(data?.amount || 0).toLocaleString()}</strong> to your Nigerian bank account.</p>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px; margin: 20px 0;">
            <div style="font-size: 13px; color: #475569; margin-bottom: 6px;"><strong>Bank Name:</strong> ${data?.bankName || "Registered Bank"}</div>
            <div style="font-size: 13px; color: #475569; margin-bottom: 6px;"><strong>Account:</strong> ${data?.accountNumber || "N/A"} (${data?.accountName || ""})</div>
            <div style="font-size: 13px; color: #475569;"><strong>Status:</strong> <span style="color: #f59e0b; font-weight: 700;">Processing</span></div>
          </div>
          <p style="font-size: 13px; color: #64748b;">Withdrawals are typically settled directly into your bank account promptly.</p>
        `);
        break;

      case "withdrawal_completed":
        emailSubject = `✅ Withdrawal Sent: ₦${Number(data?.amount || 0).toLocaleString()}`;
        bodyHtml = wrapHtml(emailSubject, `
          <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin-top: 0;">Funds Dispatched! 🚀</h2>
          <p>${greeting}</p>
          <p>Your withdrawal of <strong>₦${Number(data?.amount || 0).toLocaleString()}</strong> has been dispatched to your bank account.</p>
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 14px; padding: 18px; margin: 20px 0;">
            <div style="font-size: 13px; color: #166534; margin-bottom: 6px;"><strong>Bank Details:</strong> ${data?.accountNumber || ""} (${data?.bankName || ""})</div>
            <div style="font-size: 13px; color: #166534;"><strong>Status:</strong> <span style="color: #10b981; font-weight: 800;">Completed</span></div>
          </div>
        `);
        break;

      case "task_approved":
        emailSubject = `🎉 Task Approved: ₦${Number(data?.reward || 0).toLocaleString()} Earned!`;
        bodyHtml = wrapHtml(emailSubject, `
          <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin-top: 0;">Submission Approved! 🌟</h2>
          <p>${greeting}</p>
          <p>Great job! Your submission for <strong>"${data?.taskTitle || "Task"}"</strong> has been approved.</p>
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 14px; padding: 18px; margin: 20px 0;">
            <div style="font-size: 15px; color: #166534; font-weight: 800;">Reward Credited: ₦${Number(data?.reward || 0).toLocaleString()}</div>
          </div>
          <div style="text-align: center; margin-top: 24px;">
            <a href="https://www.docszar.com/earn" style="background-color: #10b981; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 10px; font-weight: 700; display: inline-block;">Find More Tasks &rarr;</a>
          </div>
        `);
        break;

      case "referral_earned":
        emailSubject = `🎁 Referral Commission Earned: ₦${Number(data?.amount || 0).toLocaleString()}`;
        bodyHtml = wrapHtml(emailSubject, `
          <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin-top: 0;">Referral Commission Credited! 🎊</h2>
          <p>${greeting}</p>
          <p>Your referred friend <strong>@${data?.referredUsername || "friend"}</strong> ${data?.reason || "activated their account"}!</p>
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 14px; padding: 18px; margin: 20px 0;">
            <div style="font-size: 16px; color: #166534; font-weight: 800;">Bonus Amount: ₦${Number(data?.amount || 0).toLocaleString()}</div>
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
              <a href="${data.actionUrl}" style="background-color: #10b981; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 10px; font-weight: 700; display: inline-block;">${data?.actionLabel || "View Dashboard"}</a>
            </div>
          ` : ""}
        `);
        break;
    }

    // 1. Dispatch email via nodemailer using SendByte SMTP
    let sendError = null;
    try {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465,
        auth: {
          user: "apikey",
          pass: SENDBYTE_API_KEY,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      const info = await transporter.sendMail({
        from: `"${activeSender}" <${SENDER_EMAIL}>`,
        to,
        subject: emailSubject,
        html: bodyHtml,
      });

      return new Response(
        JSON.stringify({ status: "success", message: `Email sent to ${to}`, messageId: info?.messageId }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    } catch (smtpErr) {
      console.warn("SMTP attempt error:", smtpErr.message);
      sendError = smtpErr;
    }

    // 2. Fallback: Dispatch via SendByte REST API
    try {
      const restRes = await fetch("https://api.sendbyte.africa/v1/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SENDBYTE_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          from: `"${activeSender}" <${SENDER_EMAIL}>`,
          to: [to],
          subject: emailSubject,
          html: bodyHtml,
        }),
      });

      if (restRes.ok) {
        const restJson = await restRes.json().catch(() => ({}));
        return new Response(
          JSON.stringify({ status: "success", message: `Email sent via REST to ${to}`, data: restJson }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
        );
      }
    } catch (restErr) {
      console.warn("REST attempt error:", restErr.message);
    }

    // Return response with error details if both failed
    return new Response(
      JSON.stringify({ status: "error", message: sendError?.message || "Failed to dispatch email via SMTP and REST" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  } catch (error) {
    console.error("send-email top-level error:", error);
    return new Response(
      JSON.stringify({ status: "error", message: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

