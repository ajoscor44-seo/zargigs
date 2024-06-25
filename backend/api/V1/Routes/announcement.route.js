import express from "express";
import { getAnnouncement } from "../Controllers/announcement.controller.js";

const router = express.Router();

router.get("/", getAnnouncement);

export default router;
