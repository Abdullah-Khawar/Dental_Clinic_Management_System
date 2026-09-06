import express from "express";
import dashboardController from "../controllers/dashboard.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  authorize("admin"),
  dashboardController.getDashboard,
);

export default router;
