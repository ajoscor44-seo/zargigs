import express from "express";
import {
  getAdvertisements,
  getUserAdvertisements,
} from "../Controllers/advertisement.controller";

const router = express.Router();

router.get("/advertisements", getAdvertisements);
router.get("/user-advertisements", getUserAdvertisements);
