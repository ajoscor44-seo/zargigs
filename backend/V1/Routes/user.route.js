import express from "express";
import { getUser } from "../Controllers/user.controller.js";

const router = express.Router();

router.get("/user-details", getUser);

export default router;
