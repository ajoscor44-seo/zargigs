import express from "express";
import {
  login,
  signup,
  google,
  verifyEmail,
  signout,
  resendOTP,
} from "../Controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", signout);
router.post("/google", google);
router.post("/verifyWithOTP", verifyEmail);
router.post("/resend-otp", resendOTP);

export default router;
