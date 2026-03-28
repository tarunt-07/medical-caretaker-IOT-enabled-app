import express from "express";
import { readDb, writeDb, nextId, success, failure } from "../lib/db.js";

const router = express.Router();

router.get("/", (req, res) => {
  const db = readDb();
  return success(res, "Patients fetched", db.patients);
});

router.get("/:id", (req, res) => {
  const db = readDb();
  const patient = db.patients.find((p) => p.id === Number(req.params.id));
  if (!patient) return failure(res, "Patient not found", 404);
  return success(res, "Patient fetched", patient);
});

router.post("/", (req, res) => {
  const { name, age, gender, condition } = req.body;
  if (!name || !age || !gender || !condition) {
    return failure(res, "Name, age, gender and condition are required", 400);
  }

  const db = readDb();
  const patient = {
    id: nextId(db.patients),
    name,
    age: Number(age),
    gender,
    condition,
    illnessHistory: req.body.illnessHistory || [],
    treatments: req.body.treatments || [],
    doctorNotes: req.body.doctorNotes || []
  };

  db.patients.push(patient);
  writeDb(db);
  return success(res, "Patient created", patient, 201);
});

router.put("/:id", (req, res) => {
  const db = readDb();
  const patient = db.patients.find((p) => p.id === Number(req.params.id));
  if (!patient) return failure(res, "Patient not found", 404);

  patient.name = req.body.name ?? patient.name;
  patient.age = req.body.age !== undefined ? Number(req.body.age) : patient.age;
  patient.gender = req.body.gender ?? patient.gender;
  patient.condition = req.body.condition ?? patient.condition;
  patient.illnessHistory = req.body.illnessHistory ?? patient.illnessHistory;
  patient.treatments = req.body.treatments ?? patient.treatments;
  patient.doctorNotes = req.body.doctorNotes ?? patient.doctorNotes;

  writeDb(db);
  return success(res, "Patient updated", patient);
});

router.delete("/:id", (req, res) => {
  const db = readDb();
  const index = db.patients.findIndex((p) => p.id === Number(req.params.id));
  if (index === -1) return failure(res, "Patient not found", 404);

  const deleted = db.patients[index];
  db.patients.splice(index, 1);
  writeDb(db);
  return success(res, "Patient deleted", deleted);
});

export default router;