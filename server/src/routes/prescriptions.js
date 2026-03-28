import express from "express";
import { readDb, writeDb, nextId, success, failure } from "../lib/db.js";

const router = express.Router();

router.get("/", (req, res) => {
  const db = readDb();
  return success(res, "Prescriptions fetched", db.prescriptions);
});

router.post("/", (req, res) => {
  const { patientId, medicine, dosage, frequency } = req.body;
  if (!patientId || !medicine || !dosage || !frequency) {
    return failure(res, "All prescription fields are required", 400);
  }

  const db = readDb();
  const item = {
    id: nextId(db.prescriptions),
    patientId: Number(patientId),
    medicine,
    dosage,
    frequency,
    status: req.body.status || "pending"
  };

  db.prescriptions.push(item);
  writeDb(db);
  return success(res, "Prescription added", item, 201);
});

router.put("/:id", (req, res) => {
  const db = readDb();
  const item = db.prescriptions.find((p) => p.id === Number(req.params.id));
  if (!item) return failure(res, "Prescription not found", 404);

  item.patientId = req.body.patientId !== undefined ? Number(req.body.patientId) : item.patientId;
  item.medicine = req.body.medicine ?? item.medicine;
  item.dosage = req.body.dosage ?? item.dosage;
  item.frequency = req.body.frequency ?? item.frequency;
  item.status = req.body.status ?? item.status;

  writeDb(db);
  return success(res, "Prescription updated", item);
});

router.delete("/:id", (req, res) => {
  const db = readDb();
  const index = db.prescriptions.findIndex((p) => p.id === Number(req.params.id));
  if (index === -1) return failure(res, "Prescription not found", 404);

  const deleted = db.prescriptions[index];
  db.prescriptions.splice(index, 1);
  writeDb(db);
  return success(res, "Prescription deleted", deleted);
});

export default router;