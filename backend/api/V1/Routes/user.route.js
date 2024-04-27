import express from "express";
import {
  getUserDetails,
  addUserDetails,
  becomeAMember,
} from "../Controllers/user.controller.js";

const router = express.Router();

router.get("/user-details", getUserDetails);
router.post("/user-details", addUserDetails);
router.put("/become-a-member", becomeAMember);

export default router;
