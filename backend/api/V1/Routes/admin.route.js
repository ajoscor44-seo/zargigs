import express from "express";
import {
  deleteAnnouncement,
  postAnnouncement,
} from "../Controllers/announcement.controller.js";
import {
  getAUser,
  getAllUsers,
  getUsersTotals,
} from "../Controllers/users.controller.js";
import {
  getAllComplaint,
  resolveComplaint,
} from "../Controllers/complaint.controller.js";
import { updateUserStatus } from "../Controllers/update_status.controller.js";
import {
  setAdminData,
  updateAdminData,
  getAdminData,
  updateAnyUserProfile,
  getAllPlatformTasks,
  updatePlatformTask,
  deletePlatformTask,
  getAllSubmissions,
  reviewSubmission,
  getAllFundings,
  approveManualFunding,
  getPricingConfig,
  updatePricingItem,
} from "../Controllers/admin.controller.js";
import {
  getAdvertCreators,
  getEngagementCreators,
  postAdvertCreator,
  postEngagementCreator,
  updateAdvertCreator,
  updateEngagementCreator,
} from "../Controllers/create-task.controller.js";
import {
  getAdvertEarners,
  getEngagementEarners,
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
import { getTransfers } from "../Controllers/transfer.controller.js";
import { getAllAdvertisements } from "../Controllers/advertisement.controller.js";

const router = express.Router();

// Admin Data Routes
router.post("/", setAdminData);
router.put("/", updateAdminData);
router.get("/settings", getAdminData);

// Users Directory & Profile Editor
router.get("/users/totals", getUsersTotals);
router.get("/users", getAllUsers);
router.get("/user", getAUser);
router.put("/user/edit", updateAnyUserProfile);
router.put("/update-status", updateUserStatus);

// Tasks & Campaigns Full Management
router.get("/tasks", getAllPlatformTasks);
router.put("/task", updatePlatformTask);
router.delete("/task", deletePlatformTask);

// Proof Submissions & Verification
router.get("/submissions", getAllSubmissions);
router.put("/submission/review", reviewSubmission);

// Deposits, Fundings & Manual Transfer Approval
router.get("/fundings", getAllFundings);
router.put("/funding/approve", approveManualFunding);

// Pricing Configuration & Platform Rates
router.get("/pricing", getPricingConfig);
router.put("/pricing", updatePricingItem);

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
router.delete("/announcement", deleteAnnouncement);

// Complaints Routes
router.get("/complaints", getAllComplaint);
router.put("/complaint", resolveComplaint);

// Withdrawal requests
router.get("/withdrawal-request", getAllWithdrawalRequests);
router.put("/withdrawal-request", approveWithdrawalRequests);
router.patch("/withdrawal-request", disapproveWithdrawalRequests);

// All transfers route
router.get("/all-transfers", getTransfers);

// Admin adverts and engagement earners routes
router.get("/earn-advert", getAdvertEarners);
router.get("/earn-engagement", getEngagementEarners);

// Admin adverts and engagement creators routes
router.get("/create-advert", getAdvertCreators);
router.get("/create-engagement", getEngagementCreators);

// Advertisements
router.get("/all-advertisements", getAllAdvertisements);

export default router;
