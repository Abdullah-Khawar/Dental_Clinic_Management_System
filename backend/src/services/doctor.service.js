import { Op } from "sequelize";
import { Doctor } from "../models/index.js";
import AppError from "../utils/AppError.js";

const getAllDoctors = async (query) => {
  const {
    search,
    specialization,
    isActive,
    sortBy = "id",
    order = "asc",
    limit = 10,
    cursor,
  } = query;

  const parsedLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
  const where = {};

  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
      { phone: { [Op.iLike]: `%${search}%` } },
      { specialization: { [Op.iLike]: `%${search}%` } },
    ];
  }

  if (specialization) {
    where.specialization = specialization;
  }

  if (isActive !== undefined) {
    where.isActive = isActive === "true" || isActive === true;
  }

  const allowedSortFields = {
    name: "name",
    specialization: "specialization",
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

  const doctors = await Doctor.findAll({
    where,
    order: [
      [sortField, sortOrder],
      ["id", sortOrder],
    ],
    limit: parsedLimit + 1,
  });

  const hasNextPage = doctors.length > parsedLimit;

  if (hasNextPage) {
    doctors.pop();
  }

  const nextCursor =
    hasNextPage && doctors.length > 0 ? doctors[doctors.length - 1].id : null;

  return {
    doctors,
    pagination: {
      limit: parsedLimit,
      nextCursor,
      hasNextPage,
    },
  };
};

const getDoctorById = async (id) => {
  const doctor = await Doctor.findByPk(id);

  if (!doctor) {
    throw new AppError("Doctor not found.", 404);
  }

  return doctor;
};

const createDoctor = async (data) => Doctor.create(data);

const updateDoctor = async (id, data) => {
  const doctor = await Doctor.findByPk(id);

  if (!doctor) {
    throw new AppError("Doctor not found.", 404);
  }

  await doctor.update(data);
  return doctor;
};

const deleteDoctor = async (id) => {
  const doctor = await Doctor.findByPk(id);

  if (!doctor) {
    throw new AppError("Doctor not found.", 404);
  }

  await doctor.destroy();
  return doctor;
};

export default {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};
