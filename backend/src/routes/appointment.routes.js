import express from "express";
import appointmentController from "../controllers/appointment.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import {
  appointmentValidator,
  patchAppointmentValidator,
} from "../validators/appointment.validator.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/", appointmentController.getAllAppointments);
router.get("/:id", appointmentController.getAppointmentById);
router.post(
  "/",
  appointmentValidator,
  validate,
  appointmentController.createAppointment,
);
router.patch(
  "/:id",
  patchAppointmentValidator,
  validate,
  appointmentController.updateAppointment,
);
router.delete("/:id", appointmentController.deleteAppointment);

export default router;
