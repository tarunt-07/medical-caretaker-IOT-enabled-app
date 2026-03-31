import express from "express";
import { insertRecord, listRecords } from "../lib/dataStore.js";
import { success, failure } from "../lib/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    return success(res, "Logs fetched", await listRecords("logs"));
  } catch (error) {
    return failure(res, error.message, 500);
  }
});

router.post("/", async (req, res) => {
  const { patientName, temperature, bloodPressure, sugar, note } = req.body;
  if (!note) {
    return failure(res, "note is required", 400);
  }

  try {
    const log = await insertRecord("logs", {
      patientId: req.body.patientId ? Number(req.body.patientId) : null,
      patientName: patientName ?? null,
      temperature: temperature ?? null,
      bloodPressure: bloodPressure ?? null,
      sugar: sugar ?? null,
      date: req.body.date ?? new Date().toISOString().split("T")[0],
      by: req.body.by ?? "Caretaker",
      note,
      createdAt: new Date().toISOString(),
    });

    return success(res, "Log saved", log, 201);
  } catch (error) {
    return failure(res, error.message, 500);
  }
});

export default router;
