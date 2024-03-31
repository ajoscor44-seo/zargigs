import express from "express";
import {
  getNotifications,
  postNotifications,
} from "../Controllers/notification.controller.js";

const router = express.Router();

router.post("/", postNotifications);
router.get("/", getNotifications);

export default router;
