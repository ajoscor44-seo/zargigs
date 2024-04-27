import express from "express";
import {
  generateTask,
  cancelGeneratedTask,
  getTotalTasks,
  getUserTotalTasks,
  getAdvertTask,
  getAdvertTasks,
  postAdvertTask,
  getEngagementTask,
  getEngagementTasks,
  postEngagementTask,
  getTasks,
  getTask,
  requestForReview,
} from "../Controllers/tasks.controller.js";

const router = express.Router();

router.get("/", getTasks);
router.get("/task/:id", getTask);
router.get("/total", getTotalTasks);
router.get("/user-total", getUserTotalTasks);
router.get("/generate", generateTask);
router.post("/request-review", requestForReview);
router.delete("/cancel-task", cancelGeneratedTask);
router.post("/adverts", postAdvertTask);
router.get("/adverts/:id", getAdvertTask);
router.get("/adverts", getAdvertTasks);
router.get("/engagements/:id", getEngagementTask);
router.get("/engagements", getEngagementTasks);
router.post("/engagements", postEngagementTask);

export default router;
