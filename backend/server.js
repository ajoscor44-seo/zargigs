import express from "express";
import mongoose from "mongoose";
import { app, server } from "./api/V1/socket/socket.js";
import dotenv from "dotenv";
import authRoutes from "../backend/api/V1/Routes/auth.route.js";
import v1Routes from "./api/V1/Routes/index.js";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authenticateToken from "./api/V1/Middleware/authenticate.js";
import { getAdminData } from "./api/V1/Controllers/admin.controller.js";

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
      ? [
          process.env.DEV_CLIENT_URL,
          process.env.DEV_ADMIN_URL,
          process.env.DEV_HOME_URL,
        ]
      : [
          process.env.PROD_CLIENT_URL,
          process.env.PROD_ADMIN_URL,
          process.env.PROD_HOME_URL,
        ],
  credentials: true,
};

// CORS configuration
app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions));

// Parses json bodies
app.use(express.json());
app.use(cookieParser());
app.use(morgan("tiny"));

app.get("/api/v1/admin-data", getAdminData);

// Authentication route
app.use("/api/auth/", authRoutes);

// Authenticate User with token
app.use(authenticateToken);

//Protected Routes
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
});
