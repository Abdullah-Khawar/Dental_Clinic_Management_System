import express from "express";
import { login, logout } from "../controllers/auth.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.post("/login", asyncHandler(login));
router.post("/logout", asyncHandler(logout));

export default router;
