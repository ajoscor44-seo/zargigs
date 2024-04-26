import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./api/V1/Routes/user.route.js";
import activityRoutes from "./api/V1/Routes/recent-activities.route.js";
import notificationRoutes from "./api/V1/Routes/notification.route.js";
import tasksRoutes from "./api/V1/Routes/tasks.route.js";
import authRoutes from "./api/V1/Routes/auth.route.js";
dotenv.config();
import cors from "cors";
import authenticateToken from "./api/V1/Middleware/authenticate.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { app, server } from "./api/V1/socket/socket.js";

// Connects to db
mongoose
  .connect(process.env.DATABASE_URI)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(err);
  });
// Port Number
const PORT = process.env.PORT || 5000;

// Configure CORS
const corsOptions = {
  origin:
    process.env.NODE_ENV !== "production"
      ? process.env.DEV_CLIENT_URL
      : process.env.PROD_CLIENT_URL,
  credentials: true,
};
app.use(cors(corsOptions));

// Parses json bodies
app.use(express.json());
app.use(cookieParser());
app.use(morgan("tiny"));

//Public Client authentication route
app.use("/api/v1/auth", authRoutes);

// Authenticate User with token
app.use(authenticateToken);

//Protected Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/activities", activityRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/tasks", tasksRoutes);

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
});
