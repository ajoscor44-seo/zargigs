import express from "express";
import userRoutes from "./user.route.js";
import activityRoutes from "./recent-activities.route.js";
import notificationRoutes from "./notification.route.js";
import tasksRoutes from "./tasks.route.js";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/activities", activityRoutes);
router.use("/notifications", notificationRoutes);
router.use("/tasks", tasksRoutes);

export default router;
