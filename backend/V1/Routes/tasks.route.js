import express from "express";
import {
  getAdvertTask,
  getAdvertTasks,
  postAdvertTask,
} from "../Controllers/tasks.controller.js";

const router = express.Router();

router.post("/adverts", postAdvertTask);
router.get("/adverts/:id", getAdvertTask);
router.get("/adverts", getAdvertTasks);
router.post("/engagements", postAdvertTask);
router.get("/engagements", getAdvertTasks);

export default router;
