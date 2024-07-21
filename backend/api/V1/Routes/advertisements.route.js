import express from "express";
import {
  createAdvertisement,
  deleteAdvertisement,
  getAdvertisements,
  getUserAdvertisements,
} from "../Controllers/advertisement.controller";

const router = express.Router();

router.post("/advertisements", createAdvertisement);
router.get("/advertisements", getAdvertisements);
router.delete("/advertisements", deleteAdvertisement);
router.get("/user-advertisements", getUserAdvertisements);
