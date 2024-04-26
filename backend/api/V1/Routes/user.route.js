import express from "express";
import {
  getUserDetails,
  addUserDetails,
} from "../Controllers/user.controller.js";

const router = express.Router();

router.get("/user-details", getUserDetails);
router.post("/user-details", addUserDetails);

export default router;
