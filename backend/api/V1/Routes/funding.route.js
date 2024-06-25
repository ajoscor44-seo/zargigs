import express from "express";
import {
  initiateFunding,
  getFundings,
  verifyFunding,
} from "../Controllers/funding.controller.js";

const router = express.Router();

router.get("/", getFundings);
router.post("/fund-wallet", initiateFunding);
router.post("/verify-funding", verifyFunding);

export default router;
