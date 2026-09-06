import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Appointment = sequelize.define(
  "Appointment",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    patientName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 255],
      },
    },
    patientContact: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: [/^\+92-\d{3}-\d{7}$/],
          msg: "Phone must be in format +92-3XX-XXXXXXX",
        },
      },
    },
    doctorId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    dateTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Pending",
      validate: {
        isIn: [["Pending", "Scheduled", "Completed", "Cancelled"]],
      },
    },
  },
  {
    tableName: "appointments",
    timestamps: true,
  },
);

Appointment.prototype.toJSON = function toJSON() {
  const values = { ...this.get() };
  values._id = values.id;
  if (values.doctor && typeof values.doctor.toJSON === "function") {
    values.doctor = values.doctor.toJSON();
  }
  return values;
};

export default Appointment;
