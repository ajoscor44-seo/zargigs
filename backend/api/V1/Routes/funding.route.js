import express from "express";
import {
  fundLocalWallet,
  getFunding,
  getFundings,
} from "../Controllers/funding.controller.js";

const router = express.Router();

router.get("/", getFundings);
router.get("/:id", getFunding);

export default router;
