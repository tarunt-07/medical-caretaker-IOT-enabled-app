import express from "express";
import { readDb, writeDb, nextId, success, failure } from "../lib/db.js";

const router = express.Router();

router.get("/", (req, res) => {
  const db = readDb();
  return success(res, "Devices fetched", db.devices);
});

router.post("/connect", (req, res) => {
  const { name, type } = req.body;
  if (!name || !type) return failure(res, "Device name and type are required", 400);

  const db = readDb();
  const device = {
    id: nextId(db.devices),
    name,
    type,
    status: "connected",
    lastSync: new Date().toISOString()
  };

  db.devices.push(device);
  writeDb(db);
  return success(res, "Device connected", device, 201);
});

/*
Arduino webhook:
POST /api/devices/arduino-event
Body example:
{
  "eventType": "pill_taken",
  "deviceName": "Smart Pill Dispenser",
  "medicineId": 1,
  "message": "Morning pill dispensed"
}
*/
router.post("/arduino-event", (req, res) => {
  const { eventType, deviceName, medicineId, message } = req.body;
  if (!eventType) return failure(res, "eventType is required", 400);

  const db = readDb();

  if (deviceName) {
    const device = db.devices.find((d) => d.name === deviceName);
    if (device) {
      device.lastSync = new Date().toISOString();
      device.status = "connected";
    }
  }

  if (medicineId) {
    const prescription = db.prescriptions.find((p) => p.id === Number(medicineId));
    if (prescription) {
      if (eventType === "pill_taken") prescription.status = "taken";
      if (eventType === "pill_missed") prescription.status = "missed";
      if (eventType === "pill_pending") prescription.status = "pending";
    }
  }

  if (eventType === "pill_missed") {
    db.alerts.push({
      id: nextId(db.alerts),
      title: "Arduino Missed Dose Alert",
      message: message || "A scheduled pill was missed.",
      level: "high",
      createdAt: new Date().toISOString()
    });
  }

  if (eventType === "device_offline") {
    db.alerts.push({
      id: nextId(db.alerts),
      title: "Device Offline",
      message: message || "Smart dispenser device is offline.",
      level: "high",
      createdAt: new Date().toISOString()
    });
  }

  writeDb(db);
  return success(res, "Arduino event processed", { eventType });
});

export default router;