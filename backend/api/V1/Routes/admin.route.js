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
  setAdminData,
  updateAdminData,
} from "../Controllers/admin.controller.js";
import {
  postAdvertCreator,
  postEngagementCreator,
  updateAdvertCreator,
  updateEngagementCreator,
} from "../Controllers/create-task.controller.js";
import {
  postAdvertEarner,
  postEngagementEarner,
  updateAdvertEarner,
  updateEngagementEarner,
} from "../Controllers/earn-task.controller.js";
import {
  approveWithdrawalRequests,
  disapproveWithdrawalRequests,
  getAllWithdrawalRequests,
} from "../Controllers/withdrawal_requests.controller.js";

const router = express.Router();

// Admin Data Routes
router.post("/", setAdminData);
router.put("/", updateAdminData);

// Users Routes
router.get("/users", getAllUsers);
router.get("/user", getAUser);

// Advert Creator Routes
router.put("/create-advert", updateAdvertCreator);
router.post("/create-advert", postAdvertCreator);

// Engagement Creator Routes
router.put("/create-engagement", updateEngagementCreator);
router.post("/create-engagement", postEngagementCreator);

// Advert Earner Routes
router.put("/earn-advert", updateAdvertEarner);
router.post("/earn-advert", postAdvertEarner);

// Engagement Earner Routes
router.put("/earn-engagement", updateEngagementEarner);
router.post("/earn-engagement", postEngagementEarner);

// Announcement Routes
router.post("/announcement", postAnnouncement);
router.get("/announcement", getAnnouncement);

// Complaints Routes
router.post("/complaints", postComplaint);
router.get("/complaints", getAllComplaint);
router.put("/complaint", resolveComplaint);

// Update user status - (Ban user and Lift ban on user)
router.put("/update-status", updateUserStatus);

// Update withdrawal status - (Approve withdrawal and Disapprove withdrawal)
router.get("/withdrawal-request", getAllWithdrawalRequests);
router.put("/withdrawal-request", approveWithdrawalRequests);
router.patch("/withdrawal-request", disapproveWithdrawalRequests);

export default router;
