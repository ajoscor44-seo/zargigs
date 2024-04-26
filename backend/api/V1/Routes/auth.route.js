import express from "express";
import { login, signup, google, verifyEmail } from "../Controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", google);
router.post("/verifyWithOTP", verifyEmail);

export default router;
