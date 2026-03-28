import express from "express";
import { readDb, writeDb, nextId, success, failure } from "../lib/db.js";

const router = express.Router();

router.post("/signup", (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return failure(res, "All fields are required", 400);
  }

  const db = readDb();
  const exists = db.users.find((u) => u.email === email);
  if (exists) return failure(res, "User already exists", 409);

  const user = {
    id: nextId(db.users),
    name,
    email,
    password,
    role
  };

  db.users.push(user);
  writeDb(db);

  return success(
    res,
    "Signup successful",
    { id: user.id, name: user.name, email: user.email, role: user.role },
    201
  );
});

router.post("/login", (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return failure(res, "Email, password and role are required", 400);
  }

  const db = readDb();
  const user = db.users.find(
    (u) => u.email === email && u.password === password && u.role === role
  );

  if (!user) return failure(res, "Invalid credentials", 401);

  return success(res, "Login successful", {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  });
});

export default router;