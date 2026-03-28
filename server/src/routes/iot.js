const express = require("express");
const router = express.Router();
const db = require("../db"); // your existing db connection

// Arduino/Pi sends this when medicine is dispensed
router.post("/dispense", async (req, res) => {
  const { deviceId, patientId, medicineId, status, timestamp } = req.body;
  // status: "dispensed" | "missed" | "error"
  try {
    await db.query(
      "INSERT INTO dispense_logs (device_id, patient_id, medicine_id, status, dispensed_at) VALUES (?, ?, ?, ?, ?)",
      [deviceId, patientId, medicineId, status, timestamp || new Date()]
    );

    // If missed, create an alert for caretaker
    if (status === "missed") {
      await db.query(
        "INSERT INTO alerts (patient_id, type, message, created_at) VALUES (?, 'missed_dose', ?, NOW())",
        [patientId, `Patient missed their medicine dose at ${timestamp}`]
      );
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Frontend polls this to get device status
router.get("/status/:deviceId", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM dispense_logs WHERE device_id = ? ORDER BY dispensed_at DESC LIMIT 10",
      [req.params.deviceId]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Frontend sends command to dispense medicine
router.post("/command", async (req, res) => {
  const { deviceId, command } = req.body;
  // command: "dispense" | "refill_alert" | "lock" | "unlock"
  try {
    await db.query(
      "INSERT INTO device_commands (device_id, command, status, created_at) VALUES (?, ?, 'pending', NOW())",
      [deviceId, command]
    );
    res.json({ success: true, message: "Command queued" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Arduino polls this to get pending commands
router.get("/commands/:deviceId", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM device_commands WHERE device_id = ? AND status = 'pending'",
      [req.params.deviceId]
    );
    // Mark as delivered
    if (rows.length > 0) {
      await db.query(
        "UPDATE device_commands SET status = 'delivered' WHERE device_id = ? AND status = 'pending'",
        [req.params.deviceId]
      );
    }
    res.json({ success: true, commands: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;