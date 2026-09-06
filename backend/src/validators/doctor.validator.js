import { body } from "express-validator";
import { PK_PHONE_MESSAGE, PK_PHONE_REGEX } from "../utils/phone.js";

const doctorValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Doctor name is required")
    .isLength({ min: 2 })
    .withMessage("Doctor name must be at least 2 characters"),

  body("specialization")
    .trim()
    .notEmpty()
    .withMessage("Specialization is required"),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(PK_PHONE_REGEX)
    .withMessage(PK_PHONE_MESSAGE),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("availability")
    .trim()
    .notEmpty()
    .withMessage("Availability is required"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

const patchDoctorValidator = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Doctor name cannot be empty")
    .isLength({ min: 2 })
    .withMessage("Doctor name must be at least 2 characters"),

  body("specialization")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Specialization cannot be empty"),

  body("phone")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Phone number cannot be empty")
    .matches(PK_PHONE_REGEX)
    .withMessage(PK_PHONE_MESSAGE),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("availability")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Availability cannot be empty"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

export { doctorValidator, patchDoctorValidator };
