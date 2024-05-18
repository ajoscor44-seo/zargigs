import express from "express";
import userRoutes from "./user.route.js";
import activityRoutes from "./recent-activities.route.js";
import notificationRoutes from "./notification.route.js";
import tasksRoutes from "./tasks.route.js";
import adminRoutes from "./admin.route.js";
import creatorRoutes from "./create-task.route.js";
import earnerRoutes from "./earn-task.route.js";
import authorizeAdmin from "../Middleware/authorization.js";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/activities", activityRoutes);
router.use("/notifications", notificationRoutes);
router.use("/tasks", tasksRoutes);
router.use("/creator", creatorRoutes);
router.use("/earner", earnerRoutes);
router.use("/admin", authorizeAdmin, adminRoutes);

export default router;
