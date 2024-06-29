import express from "express";
import { postComplaint } from "../Controllers/complaint.controller.js";

const router = express.Router();

router.post("/post", postComplaint);

export default router;
