import express from "express";
import {
  getRecentActivities,
  postRecentActivities,
} from "../Controllers/recent-activity.controller.js";

const router = express.Router();

router.post("/recent-activities", postRecentActivities);
router.get("/recent-activities", getRecentActivities);

export default router;
