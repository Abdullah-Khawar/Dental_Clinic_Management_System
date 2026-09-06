import { Op } from "sequelize";
import { Appointment, Doctor } from "../models/index.js";

const startOfDay = (date) => {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
};

const endOfDay = (date) => {
  const value = new Date(date);
  value.setHours(23, 59, 59, 999);
  return value;
};

const getDashboard = async () => {
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);

  const [
    totalDoctors,
    upcomingAppointments,
    todaysAppointments,
    pendingAppointments,
    recentAppointments,
  ] = await Promise.all([
    Doctor.count({ where: { isActive: true } }),
    Appointment.count({
      where: {
        dateTime: { [Op.gte]: now },
        status: { [Op.in]: ["Pending", "Scheduled"] },
      },
    }),
    Appointment.count({
      where: {
        dateTime: { [Op.between]: [todayStart, todayEnd] },
        status: { [Op.ne]: "Cancelled" },
      },
    }),
    Appointment.count({ where: { status: "Pending" } }),
    Appointment.findAll({
      where: {
        dateTime: { [Op.gte]: now },
        status: { [Op.in]: ["Pending", "Scheduled"] },
      },
      include: [
        {
          model: Doctor,
          as: "doctor",
          attributes: ["id", "name", "specialization"],
        },
      ],
      order: [["dateTime", "ASC"]],
      limit: 5,
    }),
  ]);

  return {
    totalDoctors,
    upcomingAppointments,
    todaysAppointments,
    pendingAppointments,
    recentAppointments,
  };
};

export default {
  getDashboard,
};
