import express from "express";
import { findRecord, insertRecord } from "../lib/dataStore.js";
import { success, failure } from "../lib/db.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return failure(res, "All fields are required", 400);
  }

  try {
    const exists = await findRecord("users", { email });
    if (exists) return failure(res, "User already exists", 409);

    const user = await insertRecord("users", {
      name,
      email,
      password,
      role,
      phone: req.body.phone ?? null,
      specialization: req.body.specialization ?? null,
      avatar: req.body.avatar ?? null,
      createdAt: new Date().toISOString(),
    });

    return success(
      res,
      "Signup successful",
      { id: user.id, name: user.name, email: user.email, role: user.role },
      201
    );
  } catch (error) {
    return failure(res, error.message, 500);
  }
});

router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return failure(res, "Email, password and role are required", 400);
  }

  try {
    const user = await findRecord("users", { email, password, role });

    if (!user) return failure(res, "Invalid credentials", 401);

    return success(res, "Login successful", {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    return failure(res, error.message, 500);
  }
});

export default router;
