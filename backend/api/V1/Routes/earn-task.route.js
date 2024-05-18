import express from "express";
import {
  getAdvertEarners,
  getEngagementEarners,
} from "../Controllers/earn-task.controller.js";

const router = express.Router();

// Task Creator Routes
router.get("/earn-advert", getAdvertEarners);
router.get("/earn-engagement", getEngagementEarners);

export default router;
