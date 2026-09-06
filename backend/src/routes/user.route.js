import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getProfile } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile", protect, authorize("admin"), asyncHandler(getProfile));

export default router;
