import express from "express";
import {
  generateTask,
  getTotalTasks,
  getAdvertTask,
  getAdvertTasks,
  postAdvertTask,
  getEngagementTask,
  getEngagementTasks,
  postEngagementTask,
  getPendingEngagementTasks,
  postPendingEngagementTask,
} from "../Controllers/tasks.controller.js";

const router = express.Router();

router.get("/total", getTotalTasks);
router.get("/generate", generateTask);
router.post("/adverts", postAdvertTask);
router.get("/adverts/:id", getAdvertTask);
router.get("/adverts", getAdvertTasks);
router.get("/engagements/pending", getPendingEngagementTasks);
router.post("/engagements/pending", postPendingEngagementTask);
router.get("/engagements/:id", getEngagementTask);
router.get("/engagements", getEngagementTasks);
router.post("/engagements", postEngagementTask);

export default router;
