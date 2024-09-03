import express from "express";
import userRoutes from "./user.route.js";
import activityRoutes from "./recent-activities.route.js";
import notificationRoutes from "./notification.route.js";
import advertisementsRoutes from "./advertisements.route.js";
import tasksRoutes from "./tasks.route.js";
import withdrawalsRoutes from "./withdrawal.route.js";
import transferRoutes from "./transfer.route.js";
import complaintRoutes from "./complaint.route.js";
import adminRoutes from "./admin.route.js";
import announcementRoutes from "./announcement.route.js";
import creatorRoutes from "./create-task.route.js";
import earnerRoutes from "./earn-task.route.js";
import fundingRoutes from "./funding.route.js";
import authorizeAdmin from "../Middleware/authorization.js";
import { subscribe } from "../utils/notification.js";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/activities", activityRoutes);
router.use("/notifications", notificationRoutes);
router.use("/tasks", tasksRoutes);
router.use("/advertisements", advertisementsRoutes);
router.use("/withdraw", withdrawalsRoutes);
router.use("/complaint", complaintRoutes);
router.use("/transfer", transferRoutes);
router.use("/creator", creatorRoutes);
router.use("/earner", earnerRoutes);
router.use("/fundings", fundingRoutes);
router.use("/admin", authorizeAdmin, adminRoutes);
router.use("/announcement", announcementRoutes);
router.post("/subscribe", subscribe);

export default router;
