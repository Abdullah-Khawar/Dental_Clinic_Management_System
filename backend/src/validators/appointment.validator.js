import { body } from "express-validator";
import { PK_PHONE_MESSAGE, PK_PHONE_REGEX } from "../utils/phone.js";

const appointmentStatuses = ["Pending", "Scheduled", "Completed", "Cancelled"];

const appointmentValidator = [
  body("patientName")
    .trim()
    .notEmpty()
    .withMessage("Patient name is required")
    .isLength({ min: 2 })
    .withMessage("Patient name must be at least 2 characters"),

  body("patientContact")
    .trim()
    .notEmpty()
    .withMessage("Patient contact is required")
    .matches(PK_PHONE_REGEX)
    .withMessage(PK_PHONE_MESSAGE),

  body("doctor")
    .notEmpty()
    .withMessage("Doctor is required")
    .isUUID()
    .withMessage("Doctor must be a valid ID"),

  body("dateTime")
    .notEmpty()
    .withMessage("Appointment date and time is required")
    .isISO8601()
    .withMessage("dateTime must be a valid date"),

  body("reason").trim().notEmpty().withMessage("Reason is required"),

  body("status")
    .optional()
    .isIn(appointmentStatuses)
    .withMessage(`Status must be one of: ${appointmentStatuses.join(", ")}`),
];

const patchAppointmentValidator = [
  body("patientName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Patient name cannot be empty")
    .isLength({ min: 2 })
    .withMessage("Patient name must be at least 2 characters"),

  body("patientContact")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Patient contact cannot be empty")
    .matches(PK_PHONE_REGEX)
    .withMessage(PK_PHONE_MESSAGE),

  body("doctor")
    .optional()
    .isUUID()
    .withMessage("Doctor must be a valid ID"),

  body("dateTime")
    .optional()
    .isISO8601()
    .withMessage("dateTime must be a valid date"),

  body("reason")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Reason cannot be empty"),

  body("status")
    .optional()
    .isIn(appointmentStatuses)
    .withMessage(`Status must be one of: ${appointmentStatuses.join(", ")}`),
];

export { appointmentValidator, patchAppointmentValidator };
