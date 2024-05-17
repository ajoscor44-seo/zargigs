import express from "express";
import {
  getAdvertCreators,
  getEngagementCreators,
} from "../Controllers/create-task.controller.js";

const router = express.Router();

// Task Creator Routes
router.get("/create-advert", getAdvertCreators);
router.get("/create-engagement", getEngagementCreators);

export default router;
