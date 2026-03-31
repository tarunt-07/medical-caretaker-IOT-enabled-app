import express from "express";
import {
  findRecord,
  insertRecord,
  listRecords,
  updateRecordById,
} from "../lib/dataStore.js";
import { success, failure } from "../lib/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    return success(res, "Devices fetched", await listRecords("devices"));
  } catch (error) {
    return failure(res, error.message, 500);
  }
});

router.post("/connect", async (req, res) => {
  const { name, type } = req.body;
  if (!name || !type) return failure(res, "Device name and type are required", 400);

  try {
    const device = await insertRecord("devices", {
      name,
      type,
      patientId: req.body.patientId ? Number(req.body.patientId) : null,
      pillsRemaining: req.body.pillsRemaining ? Number(req.body.pillsRemaining) : 0,
      pillsDispensed: req.body.pillsDispensed ? Number(req.body.pillsDispensed) : 0,
      status: "connected",
      lastSync: new Date().toISOString(),
    });

    return success(res, "Device connected", device, 201);
  } catch (error) {
    return failure(res, error.message, 500);
  }
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
router.post("/arduino-event", async (req, res) => {
  const { eventType, deviceName, medicineId, message } = req.body;
  if (!eventType) return failure(res, "eventType is required", 400);

  try {
    if (deviceName) {
      const device = await findRecord("devices", { name: deviceName });
      if (device) {
        await updateRecordById("devices", device.id, {
          lastSync: new Date().toISOString(),
          status: "connected",
        });
      }
    }

    if (medicineId) {
      const prescription = await findRecord("prescriptions", { id: Number(medicineId) });
      if (prescription) {
        const nextStatus =
          eventType === "pill_taken"
            ? "taken"
            : eventType === "pill_missed"
              ? "missed"
              : eventType === "pill_pending"
                ? "pending"
                : prescription.status;

        await updateRecordById("prescriptions", prescription.id, { status: nextStatus });
      }
    }

    if (eventType === "pill_missed") {
      await insertRecord("alerts", {
        title: "Arduino Missed Dose Alert",
        message: message || "A scheduled pill was missed.",
        level: "high",
        patientId: req.body.patientId ? Number(req.body.patientId) : null,
        read: false,
        createdAt: new Date().toISOString(),
      });
    }

    if (eventType === "device_offline") {
      await insertRecord("alerts", {
        title: "Device Offline",
        message: message || "Smart dispenser device is offline.",
        level: "high",
        patientId: req.body.patientId ? Number(req.body.patientId) : null,
        read: false,
        createdAt: new Date().toISOString(),
      });
    }

    return success(res, "Arduino event processed", { eventType });
  } catch (error) {
    return failure(res, error.message, 500);
  }
});

export default router;
