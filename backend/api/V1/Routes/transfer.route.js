import express from "express";
import {
  getUserTransfers,
  makeTransfer,
} from "../Controllers/transfer.controller.js";

const router = express.Router();

router.get("/transfers", getUserTransfers);
router.post("/make", makeTransfer);

export default router;
