import { Op } from "sequelize";
import { Appointment, Doctor } from "../models/index.js";
import AppError from "../utils/AppError.js";

const DEFAULT_APPOINTMENT_DURATION_MS = 60 * 60 * 1000;

const doctorInclude = {
  model: Doctor,
  as: "doctor",
  attributes: ["id", "name", "specialization", "email", "phone", "isActive"],
};

const ACTIVE_BOOKING_STATUSES = ["Pending", "Scheduled"];

const assertDoctorExists = async (doctorId) => {
  const doctor = await Doctor.findByPk(doctorId);

  if (!doctor) {
    throw new AppError("Doctor not found.", 404);
  }

  if (!doctor.isActive) {
    throw new AppError("Cannot book an appointment with an inactive doctor.", 400);
  }

  return doctor;
};

const assertValidBookingDate = (dateTime, status) => {
  if (!ACTIVE_BOOKING_STATUSES.includes(status)) {
    return;
  }

  const appointmentTime = new Date(dateTime);
  const now = new Date();

  if (Number.isNaN(appointmentTime.getTime())) {
    throw new AppError("Appointment date and time is invalid.", 400);
  }

  if (appointmentTime < now) {
    throw new AppError(
      "Pending or Scheduled appointments must use a current or future date and time. Please reschedule to a new slot.",
      400,
    );
  }
};

const assertNoOverlap = async (doctorId, dateTime, excludeId = null) => {
  const start = new Date(dateTime);
  const end = new Date(start.getTime() + DEFAULT_APPOINTMENT_DURATION_MS);

  const where = {
    doctorId,
    status: { [Op.ne]: "Cancelled" },
    dateTime: {
      [Op.gte]: new Date(start.getTime() - DEFAULT_APPOINTMENT_DURATION_MS + 1),
      [Op.lt]: end,
    },
  };

  if (excludeId) {
    where.id = { [Op.ne]: excludeId };
  }

  const overlapping = await Appointment.findOne({ where });

  if (overlapping) {
    throw new AppError(
      "This doctor already has an appointment overlapping that time.",
      409,
    );
  }
};

const normalizeAppointmentPayload = (data) => {
  const payload = { ...data };

  if (payload.doctor) {
    payload.doctorId = payload.doctor;
    delete payload.doctor;
  }

  return payload;
};

const getAllAppointments = async (query) => {
  const {
    search,
    doctor,
    status,
    sortBy = "id",
    order = "asc",
    limit = 10,
    cursor,
  } = query;

  const parsedLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
  const where = {};

  if (search) {
    where[Op.or] = [
      { patientName: { [Op.iLike]: `%${search}%` } },
      { patientContact: { [Op.iLike]: `%${search}%` } },
      { reason: { [Op.iLike]: `%${search}%` } },
    ];
  }

  if (doctor) {
    where.doctorId = doctor;
  }

  if (status) {
    where.status = status;
  }

  const allowedSortFields = {
    dateTime: "dateTime",
    status: "status",
    createdAt: "createdAt",
    id: "id",
    _id: "id",
  };

  const sortField = allowedSortFields[sortBy] || "id";
  const sortOrder = order === "desc" ? "DESC" : "ASC";

  if (cursor) {
    if (sortField !== "id") {
      throw new AppError(
        "Cursor pagination with this sorting option is not supported.",
        400,
      );
    }

    where.id = sortOrder === "ASC" ? { [Op.gt]: cursor } : { [Op.lt]: cursor };
  }

  const appointments = await Appointment.findAll({
    where,
    include: [doctorInclude],
    order: [
      [sortField, sortOrder],
      ["id", sortOrder],
    ],
    limit: parsedLimit + 1,
  });

  const hasNextPage = appointments.length > parsedLimit;

  if (hasNextPage) {
    appointments.pop();
  }

  const nextCursor =
    hasNextPage && appointments.length > 0
      ? appointments[appointments.length - 1].id
      : null;

  return {
    appointments,
    pagination: {
      limit: parsedLimit,
      nextCursor,
      hasNextPage,
    },
  };
};

const getAppointmentById = async (id) => {
  const appointment = await Appointment.findByPk(id, {
    include: [doctorInclude],
  });

  if (!appointment) {
    throw new AppError("Appointment not found.", 404);
  }

  return appointment;
};

const createAppointment = async (data) => {
  const payload = normalizeAppointmentPayload(data);
  const status = payload.status || "Pending";

  await assertDoctorExists(payload.doctorId);
  assertValidBookingDate(payload.dateTime, status);

  if (status !== "Cancelled") {
    await assertNoOverlap(payload.doctorId, payload.dateTime);
  }

  const appointment = await Appointment.create({
    ...payload,
    status,
  });
  return getAppointmentById(appointment.id);
};

const updateAppointment = async (id, data) => {
  const existing = await Appointment.findByPk(id);

  if (!existing) {
    throw new AppError("Appointment not found.", 404);
  }

  const payload = normalizeAppointmentPayload(data);
  const doctorId = payload.doctorId || existing.doctorId;
  const dateTime = payload.dateTime || existing.dateTime;
  const nextStatus = payload.status || existing.status;

  if (payload.doctorId) {
    await assertDoctorExists(payload.doctorId);
  }

  assertValidBookingDate(dateTime, nextStatus);

  if (nextStatus !== "Cancelled") {
    await assertNoOverlap(doctorId, dateTime, id);
  }

  await existing.update(payload);
  return getAppointmentById(id);
};

const deleteAppointment = async (id) => {
  const appointment = await Appointment.findByPk(id);

  if (!appointment) {
    throw new AppError("Appointment not found.", 404);
  }

  await appointment.destroy();
  return appointment;
};

export default {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
};
