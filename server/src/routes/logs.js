import express from "express";
import { readDb, writeDb, nextId, success, failure } from "../lib/db.js";

const router = express.Router();

router.get("/", (req, res) => {
  const db = readDb();
  return success(res, "Logs fetched", db.logs);
});

router.post("/", (req, res) => {
  const { patientName, temperature, bloodPressure, sugar, note } = req.body;
  if (!patientName || !temperature || !bloodPressure || !sugar || !note) {
    return failure(res, "All log fields are required", 400);
  }

  const db = readDb();
  const log = {
    id: nextId(db.logs),
    patientName,
    temperature,
    bloodPressure,
    sugar,
    note
  };

  db.logs.push(log);
  writeDb(db);
  return success(res, "Log saved", log, 201);
});

export default router;