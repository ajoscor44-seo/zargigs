import express from "express";
import {
  getAnnouncement,
  postAnnouncement,
} from "../Controllers/announcement.controller.js";

const router = express.Router();

// Announcement Routes
router.post("/announcement", postAnnouncement);
router.get("/announcement", getAnnouncement);

// Complaints Routes
// router.post("/complaints", postAnnouncement);
// router.get("/complaints", getAnnouncement);

export default router;
