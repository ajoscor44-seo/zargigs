import express from "express";
import {
  generateTask,
  cancelGeneratedTask,
  getTotalTasks,
  getAdvertTask,
  getAdvertTasks,
  postAdvertTask,
  getEngagementTask,
  getEngagementTasks,
  postEngagementTask,
  getTasks,
} from "../Controllers/tasks.controller.js";

const router = express.Router();

router.get("/", getTasks);
router.get("/total", getTotalTasks);
router.get("/generate", generateTask);
router.delete("/cancel-task", cancelGeneratedTask);
router.post("/adverts", postAdvertTask);
router.get("/adverts/:id", getAdvertTask);
router.get("/adverts", getAdvertTasks);
router.get("/engagements/:id", getEngagementTask);
router.get("/engagements", getEngagementTasks);
router.post("/engagements", postEngagementTask);

export default router;
