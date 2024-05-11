import express from "express";
import {
  getAnnouncement,
  postAnnouncement,
} from "../Controllers/announcement.controller.js";
import { getAUser, getAllUsers } from "../Controllers/users.controller.js";

const router = express.Router();

// Users Routes
router.get("/users", getAllUsers);
router.get("/user", getAUser);

// Announcement Routes
router.post("/announcement", postAnnouncement);
router.get("/announcement", getAnnouncement);

// Complaints Routes
// router.post("/complaints", postAnnouncement);
// router.get("/complaints", getAnnouncement);

export default router;
