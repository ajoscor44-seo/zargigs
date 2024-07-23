import express from "express";
import {
  createAdvertisement,
  deleteAdvertisement,
  getAdvertisements,
  getAllAdvertisements,
  getUserAdvertisements,
} from "../Controllers/advertisement.controller.js";

const router = express.Router();

router.post("/", createAdvertisement);
router.get("/", getAdvertisements);
router.delete("/", deleteAdvertisement);
router.get("/user", getUserAdvertisements);
router.get("/all", getAllAdvertisements);

export default router;
