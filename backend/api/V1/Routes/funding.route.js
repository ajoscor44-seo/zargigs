import express from "express";
import {
  fundLocalWallet,
  getFundings,
} from "../Controllers/funding.controller.js";

const router = express.Router();

router.get("/", getFundings);
router.post("/fund-wallet", fundLocalWallet);

export default router;
