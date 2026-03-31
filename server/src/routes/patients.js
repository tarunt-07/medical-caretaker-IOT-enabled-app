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
    return success(res, "Patients fetched", await listRecords("patients"));
  } catch (error) {
    return failure(res, error.message, 500);
  }
});

router.get("/:id", async (req, res) => {
  const patient = await getRecordById("patients", req.params.id);
  if (!patient) return failure(res, "Patient not found", 404);
  return success(res, "Patient fetched", patient);
});

router.post("/", async (req, res) => {
  const { name, age, gender, condition } = req.body;
  if (!name || !age || !gender || !condition) {
    return failure(res, "Name, age, gender and condition are required", 400);
  }

  try {
    const patient = await insertRecord("patients", {
      name,
      age: Number(age),
      gender,
      condition,
      illness: req.body.illness ?? null,
      allergies: req.body.allergies ?? null,
      emergencyContact: req.body.emergencyContact ?? null,
      assignedDoctorId: req.body.assignedDoctorId ? Number(req.body.assignedDoctorId) : null,
      assignedCaretakerId: req.body.assignedCaretakerId ? Number(req.body.assignedCaretakerId) : null,
      weight: req.body.weight ? Number(req.body.weight) : null,
      height: req.body.height ? Number(req.body.height) : null,
      illnessHistory: req.body.illnessHistory || [],
      treatments: req.body.treatments || [],
      doctorNotes: req.body.doctorNotes || [],
      firstAidGuidance: req.body.firstAidGuidance || [],
      createdAt: new Date().toISOString(),
    });

    return success(res, "Patient created", patient, 201);
  } catch (error) {
    return failure(res, error.message, 500);
  }
});

router.put("/:id", async (req, res) => {
  const patient = await getRecordById("patients", req.params.id);
  if (!patient) return failure(res, "Patient not found", 404);

  try {
    const updated = await updateRecordById("patients", req.params.id, {
      name: req.body.name ?? patient.name,
      age: req.body.age !== undefined ? Number(req.body.age) : patient.age,
      gender: req.body.gender ?? patient.gender,
      condition: req.body.condition ?? patient.condition,
      illness: req.body.illness ?? patient.illness,
      allergies: req.body.allergies ?? patient.allergies,
      emergencyContact: req.body.emergencyContact ?? patient.emergencyContact,
      assignedDoctorId:
        req.body.assignedDoctorId !== undefined
          ? Number(req.body.assignedDoctorId)
          : patient.assignedDoctorId,
      assignedCaretakerId:
        req.body.assignedCaretakerId !== undefined
          ? Number(req.body.assignedCaretakerId)
          : patient.assignedCaretakerId,
      weight: req.body.weight !== undefined ? Number(req.body.weight) : patient.weight,
      height: req.body.height !== undefined ? Number(req.body.height) : patient.height,
      illnessHistory: req.body.illnessHistory ?? patient.illnessHistory,
      treatments: req.body.treatments ?? patient.treatments,
      doctorNotes: req.body.doctorNotes ?? patient.doctorNotes,
      firstAidGuidance: req.body.firstAidGuidance ?? patient.firstAidGuidance ?? [],
    });

    return success(res, "Patient updated", updated);
  } catch (error) {
    return failure(res, error.message, 500);
  }
});

router.delete("/:id", async (req, res) => {
  const deleted = await deleteRecordById("patients", req.params.id);
  if (!deleted) return failure(res, "Patient not found", 404);
  return success(res, "Patient deleted", deleted);
});

export default router;
