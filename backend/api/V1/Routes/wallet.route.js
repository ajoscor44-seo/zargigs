import express from "express";
import {
  getBankList,
  verifyBankAccount,
  getVirtualAccount,
  generateVirtualAccount,
} from "../Controllers/pocketfi.controller.js";

const router = express.Router();

router.get("/banks", getBankList);
router.post("/verify-bank-account", verifyBankAccount);
router.get("/virtual-account", getVirtualAccount);
router.post("/generate-virtual-account", generateVirtualAccount);

export default router;
