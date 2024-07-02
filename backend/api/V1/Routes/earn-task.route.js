import express from "express";
import {
  getAllAdvertEarners,
  getAllEngagementEarners,
} from "../Controllers/earn-task.controller.js";

const router = express.Router();

// Task Creator Routes
router.get("/earn-advert", getAllAdvertEarners);
router.get("/earn-engagement", getAllEngagementEarners);

export default router;
