import express from "express";
import {
  getTotalTasks,
  getAdvertTask,
  getAdvertTasks,
  postAdvertTask,
  getEngagementTask,
  getEngagementTasks,
  postEngagementTask,
} from "../Controllers/tasks.controller.js";

const router = express.Router();

router.get("/total", getTotalTasks);
router.post("/adverts", postAdvertTask);
router.get("/adverts/:id", getAdvertTask);
router.get("/adverts", getAdvertTasks);
router.post("/engagements", postEngagementTask);
router.get("/engagements/:id", getEngagementTask);
router.get("/engagements", getEngagementTasks);

export default router;
