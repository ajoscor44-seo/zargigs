import express from "express";
import {
  fundUserWallet,
  getFundings,
  updateFunding,
} from "../Controllers/funding.controller.js";

const router = express.Router();

router.get("/", getFundings);
router.post("/fund-wallet", fundUserWallet);
router.put("/fund-wallet", updateFunding);

export default router;
