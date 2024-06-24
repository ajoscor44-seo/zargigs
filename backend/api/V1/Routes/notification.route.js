import express from "express";
import {
  getNotifications,
  markAsRead,
  postNotifications,
} from "../Controllers/notification.controller.js";

const router = express.Router();

router.post("/", postNotifications);
router.get("/", getNotifications);
router.put("/", markAsRead);

export default router;
