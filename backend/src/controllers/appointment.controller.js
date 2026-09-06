import appointmentService from "../services/appointment.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { isValidUuid } from "../utils/isValidUuid.js";
import {
  successResponse,
  createdResponse,
} from "../lib/httpResponse.js";

const createAppointment = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.createAppointment(req.body);
  createdResponse(res, "Appointment created successfully", appointment);
});

const getAllAppointments = asyncHandler(async (req, res) => {
  const appointments = await appointmentService.getAllAppointments(req.query);
  successResponse(res, "Appointments retrieved successfully", appointments);
});

const getAppointmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidUuid(id)) {
    throw new AppError("Invalid appointment ID", 400);
  }

  const appointment = await appointmentService.getAppointmentById(id);
  successResponse(res, "Appointment retrieved successfully", appointment);
});

const updateAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidUuid(id)) {
    throw new AppError("Invalid appointment ID", 400);
  }

  const appointment = await appointmentService.updateAppointment(id, req.body);
  successResponse(res, "Appointment updated successfully", appointment);
});

const deleteAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidUuid(id)) {
    throw new AppError("Invalid appointment ID", 400);
  }

  await appointmentService.deleteAppointment(id);
  successResponse(res, "Appointment deleted successfully", {});
});

export default {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};
