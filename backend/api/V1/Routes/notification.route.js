import express from "express";
import {
  getNotifications,
  getUnRead,
  markAsRead,
  postNotifications,
} from "../Controllers/notification.controller.js";

const router = express.Router();

router.post("/", postNotifications);
router.get("/", getNotifications);
router.put("/", markAsRead);
router.get("/unread", getUnRead);

export default router;
