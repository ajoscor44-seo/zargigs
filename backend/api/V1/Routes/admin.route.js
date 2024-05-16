import express from "express";
import {
  getAnnouncement,
  postAnnouncement,
} from "../Controllers/announcement.controller.js";
import { getAUser, getAllUsers } from "../Controllers/users.controller.js";
import {
  getAllComplaint,
  postComplaint,
  resolveComplaint,
} from "../Controllers/complaint.controller.js";
import { updateUserStatus } from "../Controllers/update_status.controller.js";
import {
  getAdminData,
  setAdminData,
  updateAdminData,
} from "../Controllers/admin.controller.js";

const router = express.Router();

// Admin Data Routes
router.post("/", setAdminData);
router.put("/", updateAdminData);

// Users Routes
router.get("/users", getAllUsers);
router.get("/user", getAUser);

// Announcement Routes
router.post("/announcement", postAnnouncement);
router.get("/announcement", getAnnouncement);

// Complaints Routes
router.post("/complaints", postComplaint);
router.get("/complaints", getAllComplaint);
router.put("/complaint", resolveComplaint);

// Update user status - (Ban user and Lift ban on user)
router.put("/update-status", updateUserStatus);

export default router;
