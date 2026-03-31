import express from "express";
import {
  deleteRecordById,
  getRecordById,
  insertRecord,
  listRecords,
  updateRecordById,
} from "../lib/dataStore.js";
import { success, failure } from "../lib/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    return success(res, "Prescriptions fetched", await listRecords("prescriptions"));
  } catch (error) {
    return failure(res, error.message, 500);
  }
});

router.post("/", async (req, res) => {
  const { patientId, medicine, dosage, frequency } = req.body;
  if (!patientId || !medicine || !dosage || !frequency) {
    return failure(res, "All prescription fields are required", 400);
  }

  try {
    const item = await insertRecord("prescriptions", {
      patientId: Number(patientId),
      doctorId: req.body.doctorId ? Number(req.body.doctorId) : null,
      medicine,
      dosage,
      frequency,
      duration: req.body.duration ?? null,
      notes: req.body.notes ?? null,
      status: req.body.status || "pending",
      createdAt: new Date().toISOString(),
    });

    return success(res, "Prescription added", item, 201);
  } catch (error) {
    return failure(res, error.message, 500);
  }
});

router.put("/:id", async (req, res) => {
  const item = await getRecordById("prescriptions", req.params.id);
  if (!item) return failure(res, "Prescription not found", 404);

  try {
    const updated = await updateRecordById("prescriptions", req.params.id, {
      patientId: req.body.patientId !== undefined ? Number(req.body.patientId) : item.patientId,
      doctorId: req.body.doctorId !== undefined ? Number(req.body.doctorId) : item.doctorId,
      medicine: req.body.medicine ?? item.medicine,
      dosage: req.body.dosage ?? item.dosage,
      frequency: req.body.frequency ?? item.frequency,
      duration: req.body.duration ?? item.duration,
      notes: req.body.notes ?? item.notes,
      status: req.body.status ?? item.status,
    });

    return success(res, "Prescription updated", updated);
  } catch (error) {
    return failure(res, error.message, 500);
  }
});

router.delete("/:id", async (req, res) => {
  const deleted = await deleteRecordById("prescriptions", req.params.id);
  if (!deleted) return failure(res, "Prescription not found", 404);
  return success(res, "Prescription deleted", deleted);
});

export default router;
