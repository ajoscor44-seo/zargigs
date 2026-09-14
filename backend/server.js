import express from "express";
import http from "http";
import useragent from "express-useragent";
import blockDesktopsMiddleware from "./api/V1/Middleware/blockDesktops.middleware.js";
import dotenv from "dotenv";
import authRoutes from "./api/V1/Routes/auth.route.js";
import v1Routes from "./api/V1/Routes/index.js";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authenticateToken from "./api/V1/Middleware/authenticate.js";
import { getAdminData } from "./api/V1/Controllers/admin.controller.js";
import limiter from "./api/V1/Middleware/limiter.middleware.js";
import { fundLocalWallet } from "./api/V1/Controllers/funding.controller.js";
import {
  resetPassword,
  sendEmail,
  sendResetPasswordLink,
} from "./api/V1/Controllers/auth.controller.js";
import {
  handlePocketfiWebhook,
  getBankList,
  verifyBankAccount,
} from "./api/V1/Controllers/pocketfi.controller.js";
import { getPublicMarketplaceTasks } from "./api/V1/Controllers/marketplace.controller.js";
import connectDb from "./db/db.js";
import webPush from "web-push";
import approveTasks from "./api/V1/utils/approver.js";

const app = express();
const server = http.createServer(app);

connectDb();

// Port Number
const PORT = process.env.PORT || 5000;

// Configure web pusher if keys are available
if (process.env.VAPID_PUB_KEY && process.env.VAPID_PRI_KEY) {
  webPush.setVapidDetails(
    "mailto:zargigstechnologies@gmail.com",
    process.env.VAPID_PUB_KEY,
    process.env.VAPID_PRI_KEY
  );
}

// Configure CORS
const corsOptions = {
  origin:
    process.env.NODE_ENV !== "production"
      ? [
          process.env.DEV_CLIENT_URL || "http://localhost:5173",
          process.env.DEV_ADMIN_URL || "http://localhost:5174",
          process.env.DEV_HOME_URL || "http://localhost:3000",
          process.env.DEV_LIVE_MC_URL || "http://localhost:5175",
          process.env.DEV_MC_URL || "http://localhost:5176",
        ]
      : [
          process.env.PROD_CLIENT_URL,
          process.env.PROD_ADMIN_URL,
          process.env.PROD_HOME_URL,
          process.env.PROD_LIVE_MC_URL,
          process.env.PROD_MC_URL,
        ],
  credentials: true,
};

// CORS configuration
app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions));

// Blocks desktop devices
app.use(useragent.express());
app.use(blockDesktopsMiddleware);

// Rate limits user
app.use(limiter);

// Parses json bodies & captures raw body for webhook signature verification
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(cookieParser());
app.use(morgan("tiny"));

// Public Webhooks & Utilities
app.get("/api/v1/webhook/pocketfi", (req, res) =>
  res.status(200).json({ status: "ok", message: "PocketFi Webhook endpoint is active." })
);
app.get("/api/webhook/pocketfi", (req, res) =>
  res.status(200).json({ status: "ok", message: "PocketFi Webhook endpoint is active." })
);
app.post("/api/v1/webhook/pocketfi", handlePocketfiWebhook);
app.post("/api/webhook/pocketfi", handlePocketfiWebhook);
app.post("/api/v1/webhook", handlePocketfiWebhook);
app.post("/webhook/pocketfi", handlePocketfiWebhook);
app.post("/webhook", handlePocketfiWebhook);
app.get("/api/v1/wallet/public-banks", getBankList);
app.post("/api/v1/wallet/public-verify-account", verifyBankAccount);
app.get("/api/v1/marketplace/public-tasks", getPublicMarketplaceTasks);
app.get("/api/v1/public-tasks", getPublicMarketplaceTasks);

app.get("/api/v1/auto-approve", approveTasks);
app.post("/api/v1/fund-wallet", fundLocalWallet);
app.get("/api/v1/admin-data", getAdminData);
app.post("/api/v1/send-mail", sendEmail);
app.post("/api/v1/forgot-password", sendResetPasswordLink);
app.post("/api/v1/reset-password", resetPassword);

// Authentication route
app.use("/api/auth", authRoutes);

// Authenticate User with token
app.use(authenticateToken);

// Protected Routes
app.use("/api/v1", v1Routes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    failed: true,
    message,
    statusCode,
  });
});

server.listen(PORT, () => {
  console.log(`Server running on Port: ${PORT}`);

  // Auto-approve tasks older than 24 hours immediately on startup and every 15 minutes
  approveTasks().catch((err) => console.error("Initial auto-approve run error:", err));
  setInterval(() => {
    approveTasks().catch((err) => console.error("Periodic auto-approve error:", err));
  }, 15 * 60 * 1000);
});

const gracefulShutdown = (signal) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    console.log("HTTP server closed");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("Forcing shutdown...");
    process.exit(1);
  }, 10000);
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGUSR2", () => gracefulShutdown("SIGUSR2"));

export default app;
