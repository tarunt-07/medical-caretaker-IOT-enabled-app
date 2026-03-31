import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.js";
import patientRoutes from "./routes/patients.js";
import prescriptionRoutes from "./routes/prescriptions.js";
import logRoutes from "./routes/logs.js";
import deviceRoutes from "./routes/devices.js";
import iotRoutes from "./routes/iot.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean)
  : [];

app.set("trust proxy", 1);

app.use(
  cors({
    origin(origin, callback) {
      // Allow same-origin requests, server-to-server calls, and local tools.
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS origin not allowed"));
    },
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Medicine Dispenser App backend is running",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/iot", iotRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
