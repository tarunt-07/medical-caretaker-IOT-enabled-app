import express from "express";
import {
  listRecords,
  insertRecord,
  updateRecordById,
} from "../lib/dataStore.js";
import { success, failure } from "../lib/db.js";

const router = express.Router();

function today() {
  return new Date().toISOString().split("T")[0];
}

async function findDevice(deviceId) {
  const devices = await listRecords("devices");
  return (
    devices.find((device) => String(device.id) === String(deviceId)) ||
    devices.find((device) => String(device.name) === String(deviceId)) ||
    null
  );
}

async function syncDevice(deviceId, payload = {}) {
  const device = await findDevice(deviceId);
  if (!device) return null;

  return updateRecordById("devices", device.id, {
    ...payload,
    lastSync: new Date().toISOString(),
  });
}

router.get("/status/:deviceId", async (req, res) => {
  try {
    const rows = await listRecords("logs");
    const data = rows
      .filter(
        (row) =>
          row.type === "iot-dispense" && String(row.deviceId) === String(req.params.deviceId)
      )
      .sort(
        (left, right) =>
          new Date(right.dispensed_at || right.createdAt || 0) -
          new Date(left.dispensed_at || left.createdAt || 0)
      )
      .slice(0, 10);

    return success(res, "IoT status fetched", data);
  } catch (error) {
    return failure(res, error.message, 500);
  }
});

router.post("/command", async (req, res) => {
  const { deviceId, command } = req.body;
  if (!deviceId || !command) {
    return failure(res, "deviceId and command are required", 400);
  }

  try {
    await insertRecord("logs", {
      type: "iot-command",
      deviceId: String(deviceId),
      command,
      commandStatus: "pending",
      by: req.body.by || "doctor",
      date: today(),
      note: `Command "${command}" queued for device ${deviceId}.`,
      createdAt: new Date().toISOString(),
    });

    await syncDevice(deviceId, { status: "connected" });

    return success(res, "Command queued", {
      deviceId: String(deviceId),
      command,
      status: "pending",
    });
  } catch (error) {
    return failure(res, error.message, 500);
  }
});

router.post("/dispense", async (req, res) => {
  const { deviceId, patientId, medicineId, status = "dispensed", timestamp } = req.body;
  if (!deviceId) {
    return failure(res, "deviceId is required", 400);
  }

  const dispensedAt = timestamp || new Date().toISOString();

  try {
    const log = await insertRecord("logs", {
      type: "iot-dispense",
      deviceId: String(deviceId),
      patientId: patientId ? Number(patientId) : null,
      medicine_id: medicineId ? Number(medicineId) : null,
      status,
      dispensed_at: dispensedAt,
      date: dispensedAt.split("T")[0],
      by: String(deviceId),
      note: req.body.note || `Device ${deviceId} reported ${status}.`,
      createdAt: new Date().toISOString(),
    });

    if (status === "missed") {
      await insertRecord("alerts", {
        title: "Missed Dose Alert",
        message: `Device ${deviceId} reported a missed dose.`,
        level: "high",
        patientId: patientId ? Number(patientId) : null,
        read: false,
        createdAt: new Date().toISOString(),
      });
    }

    const device = await syncDevice(deviceId, { status: status === "error" ? "offline" : "connected" });

    if (device && typeof device.pillsDispensed === "number" && status === "dispensed") {
      await updateRecordById("devices", device.id, {
        pillsDispensed: (device.pillsDispensed || 0) + 1,
        pillsRemaining:
          typeof device.pillsRemaining === "number"
            ? Math.max(0, device.pillsRemaining - 1)
            : device.pillsRemaining,
      });
    }

    return success(res, "Dispense event recorded", log, 201);
  } catch (error) {
    return failure(res, error.message, 500);
  }
});

router.get("/commands/:deviceId", async (req, res) => {
  try {
    const rows = await listRecords("logs");
    const commands = rows
      .filter(
        (row) =>
          row.type === "iot-command" &&
          String(row.deviceId) === String(req.params.deviceId) &&
          row.commandStatus === "pending"
      )
      .sort((left, right) => new Date(left.createdAt || 0) - new Date(right.createdAt || 0));

    await Promise.all(
      commands.map((command) =>
        updateRecordById("logs", command.id, { commandStatus: "delivered" })
      )
    );

    return success(
      res,
      "Pending commands fetched",
      commands.map((command) => ({
        id: command.id,
        command: command.command,
        createdAt: command.createdAt,
        status: "pending",
      }))
    );
  } catch (error) {
    return failure(res, error.message, 500);
  }
});

router.post("/status/:deviceId", async (req, res) => {
  const deviceId = req.params.deviceId;

  try {
    const device = await syncDevice(deviceId, {
      status: req.body.status || "connected",
    });

    if (!device) {
      return failure(res, `Device ${deviceId} not found`, 404);
    }

    return success(res, "Device status updated", device);
  } catch (error) {
    return failure(res, error.message, 500);
  }
});

export default router;
