import doctorService from "../services/doctor.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { isValidUuid } from "../utils/isValidUuid.js";
import {
  successResponse,
  createdResponse,
} from "../lib/httpResponse.js";

const createDoctor = asyncHandler(async (req, res) => {
  const doctor = await doctorService.createDoctor(req.body);
  createdResponse(res, "Doctor created successfully", doctor);
});

const getAllDoctors = asyncHandler(async (req, res) => {
  const doctors = await doctorService.getAllDoctors(req.query);
  successResponse(res, "Doctors retrieved successfully", doctors);
});

const getDoctorById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidUuid(id)) {
    throw new AppError("Invalid doctor ID", 400);
  }

  const doctor = await doctorService.getDoctorById(id);
  successResponse(res, "Doctor retrieved successfully", doctor);
});

const updateDoctor = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidUuid(id)) {
    throw new AppError("Invalid doctor ID", 400);
  }

  const doctor = await doctorService.updateDoctor(id, req.body);
  successResponse(res, "Doctor updated successfully", doctor);
});

const deleteDoctor = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidUuid(id)) {
    throw new AppError("Invalid doctor ID", 400);
  }

  await doctorService.deleteDoctor(id);
  successResponse(res, "Doctor deleted successfully", {});
});

export default {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};
