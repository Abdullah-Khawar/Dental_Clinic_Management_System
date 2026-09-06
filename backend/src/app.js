import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { notFound, globalErrorHandler } from "./middleware/error.middleware.js";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import doctorRoutes from "./routes/doctor.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ success: true, message: "Dental Clinic API is running" });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    error: false,
    message: "OK",
    data: { status: "healthy" },
    code: 200,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
