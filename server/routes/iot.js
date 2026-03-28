const express = require("express");
const router = express.Router();

// In-memory store for now (replace with DB later)
let dispenseLogs = [];
let pendingCommands = [];

// Arduino calls this after dispensing
router.post("/dispense", (req, res) => {
  const { deviceId, patientId, medicineId, status } = req.body;
  console.log(`📦 Dispense event from ${deviceId}: ${status}`);

  const log = {
    id: Date.now(),
    deviceId,
    patientId,
    medicineId,
    status, // "dispensed" | "missed" | "error"
    dispensed_at: new Date().toISOString()
  };
  dispenseLogs.push(log);
  res.json({ success: true, log });
});

// Arduino polls this every 10 seconds for commands
router.get("/commands/:deviceId", (req, res) => {
  const { deviceId } = req.params;
  const cmds = pendingCommands.filter(c => c.deviceId === deviceId);
  // Clear delivered commands
  pendingCommands = pendingCommands.filter(c => c.deviceId !== deviceId);
  console.log(`📡 Commands fetched by ${deviceId}:`, cmds);
  res.json({ success: true, commands: cmds });
});

// Frontend sends command to dispenser
router.post("/command", (req, res) => {
  const { deviceId, command } = req.body;
  pendingCommands.push({ deviceId, command, created_at: new Date().toISOString() });
  console.log(`🎛️ Command queued for ${deviceId}: ${command}`);
  res.json({ success: true, message: "Command queued" });
});

// Frontend fetches logs
router.get("/status/:deviceId", (req, res) => {
  const logs = dispenseLogs
    .filter(l => l.deviceId === req.params.deviceId)
    .slice(-20); // last 20
  res.json({ success: true, data: logs });
});

module.exports = router;