import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./V1/Routes/user.route.js";
import activityRoutes from "./V1/Routes/recent-activities.route.js";
import authRoutes from "./V1/Routes/auth.route.js";
dotenv.config();
import cors from "cors";
import authenticateToken from "./V1/Middleware/authenticate.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,HEAD,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
// Parses json bodies
app.use(express.json());
// Parses cookie
app.use(cookieParser());
app.use(morgan("tiny"));

//Public Client authentication route
app.use("/api/v1/auth", authRoutes);

// Authenticate User with token
app.use(authenticateToken);

//Protected Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/activities", activityRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    failed: true,
    message,
    statusCode,
  });
});

app.listen(3000, () => {
  console.log("Server running on Port: 3000");
});
