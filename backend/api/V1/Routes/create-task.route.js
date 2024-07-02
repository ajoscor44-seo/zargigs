import express from "express";
import {
  getAllAdvertCreators,
  getAllEngagementCreators,
} from "../Controllers/create-task.controller.js";

const router = express.Router();

// Task Creator Routes
router.get("/create-advert", getAllAdvertCreators);
router.get("/create-engagement", getAllEngagementCreators);

export default router;
