import express from "express";
import {
  getMarketplaceTasks,
  getMarketplaceTaskById,
  createMarketplaceTask,
  reserveTaskSlot,
  releaseTaskReservation,
  submitTaskProof,
  getCreatorCampaigns,
  getTaskSubmissions,
  reviewTaskSubmission,
  fileTaskDispute,
  exportSurveyCSV,
} from "../Controllers/marketplace.controller.js";
import authenticateToken from "../Middleware/authenticate.js";

const router = express.Router();

// Public / Authenticated Marketplace Feed
router.get("/tasks", getMarketplaceTasks);
router.get("/tasks/:id", getMarketplaceTaskById);

// Protected Worker Task Actions
router.post("/tasks/:id/reserve", authenticateToken, reserveTaskSlot);
router.post("/reservations/:reservationId/release", authenticateToken, releaseTaskReservation);
router.post("/tasks/:id/submit", authenticateToken, submitTaskProof);
router.post("/submissions/:submissionId/dispute", authenticateToken, fileTaskDispute);

// Protected Creator Actions
router.post("/tasks/create", authenticateToken, createMarketplaceTask);
router.get("/creator/campaigns", authenticateToken, getCreatorCampaigns);
router.get("/creator/tasks/:taskId/submissions", authenticateToken, getTaskSubmissions);
router.post("/creator/submissions/:submissionId/review", authenticateToken, reviewTaskSubmission);
router.get("/creator/tasks/:taskId/export-csv", authenticateToken, exportSurveyCSV);

export default router;
