import express from "express";
import { postAnnouncement } from "../Controllers/announcement.controller.js";

const router = express.Router();

// router.get("/announcement", getAnnouncement);
router.post("/announcement", postAnnouncement);

export default router;
