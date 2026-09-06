import User from "./user.model.js";
import Doctor from "./doctor.model.js";
import Appointment from "./appointment.model.js";

Doctor.hasMany(Appointment, {
  foreignKey: "doctorId",
  as: "appointments",
});

Appointment.belongsTo(Doctor, {
  foreignKey: "doctorId",
  as: "doctor",
});

export { User, Doctor, Appointment };
