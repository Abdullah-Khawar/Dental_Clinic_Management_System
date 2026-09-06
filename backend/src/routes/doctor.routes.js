import express from "express";
import doctorController from "../controllers/doctor.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import {
  doctorValidator,
  patchDoctorValidator,
} from "../validators/doctor.validator.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/", doctorController.getAllDoctors);
router.get("/:id", doctorController.getDoctorById);
router.post("/", doctorValidator, validate, doctorController.createDoctor);
router.patch(
  "/:id",
  patchDoctorValidator,
  validate,
  doctorController.updateDoctor,
);
router.delete("/:id", doctorController.deleteDoctor);

export default router;
