import express from "express";
import {
  getUserWithdrawalRequests,
  postWithdrawalRequests,
} from "../Controllers/withdrawal_requests.controller.js";

const router = express.Router();

router.post("/request", postWithdrawalRequests);
router.get("/history/:id", getUserWithdrawalRequests);

export default router;
