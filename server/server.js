import express from "express";
import cors from "cors";
import { createRequire } from "module";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const express = require("express");
const cors = require("cors");
const jsonServer = require("json-server");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ─── json-server (your existing db.json) ──────────────
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();
app.use("/api", middlewares);
app.use("/api", router);

// ─── IoT routes ───────────────────────────────────────
let dispenseLogs = [];
let pendingCommands = [];

app.post("/iot/dispense", (req, res) => {
  const { deviceId, patientId, medicineId, status } = req.body;
  console.log(`💊 Dispense from ${deviceId}: ${status}`);
  const log = {
    id: Date.now(),
    deviceId, patientId, medicineId, status,
    dispensed_at: new Date().toISOString()
  };
  dispenseLogs.push(log);
  res.json({ success: true, log });
});

app.get("/iot/commands/:deviceId", (req, res) => {
  const { deviceId } = req.params;
  const cmds = pendingCommands.filter(c => c.deviceId === deviceId);
  pendingCommands = pendingCommands.filter(c => c.deviceId !== deviceId);
  res.json({ success: true, commands: cmds });
});

app.post("/iot/command", (req, res) => {
  const { deviceId, command } = req.body;
  pendingCommands.push({ deviceId, command, created_at: new Date().toISOString() });
  res.json({ success: true, message: "Command queued" });
});

app.get("/iot/status/:deviceId", (req, res) => {
  const logs = dispenseLogs
    .filter(l => l.deviceId === req.params.deviceId)
    .slice(-20);
  res.json({ success: true, data: logs });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`📦 JSON API  → http://localhost:${PORT}/api`);
  console.log(`🤖 IoT API   → http://localhost:${PORT}/iot`);
});