import express from "express";
import userRoutes from "./user.route.js";
import activityRoutes from "./recent-activities.route.js";
import notificationRoutes from "./notification.route.js";
import authRoutes from "./auth.route.js";
import tasksRoutes from "./tasks.route.js";
import authenticateToken from "../Middleware/authenticate.js";
import { app } from "../socket/socket.js";

const router = express.Router();

//Public Client authentication route
router.use("/api/v1/auth", authRoutes);

// Authenticate User with token
app.use(authenticateToken);

router.use("/user", userRoutes);
router.use("/activities", activityRoutes);
router.use("/notifications", notificationRoutes);
router.use("/tasks", tasksRoutes);

export default router;
