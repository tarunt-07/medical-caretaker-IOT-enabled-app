import express from "express";
import { readDb, success } from "../lib/db.js";

const router = express.Router();

router.get("/:role", (req, res) => {
  const db = readDb();
  const role = req.params.role;

  const totalNotifications = db.alerts.length;
  const totalPendingPills = db.prescriptions.filter((p) => p.status === "pending").length;
  const totalAlerts = db.alerts.filter((a) => a.level === "high").length;

  if (role === "doctor") {
    return success(res, "Doctor dashboard fetched", {
      notifications: totalNotifications,
      alerts: totalAlerts,
      pills: totalPendingPills,
      patients: db.patients
    });
  }

  if (role === "caretaker") {
    return success(res, "Caretaker dashboard fetched", {
      notifications: totalNotifications,
      alerts: totalAlerts,
      pills: totalPendingPills,
      medicines: db.prescriptions,
      alertsList: db.alerts.slice(-5).reverse()
    });
  }

  return success(res, "Patient dashboard fetched", {
    notifications: totalNotifications,
    alerts: totalAlerts,
    pills: totalPendingPills,
    condition: db.patients[0]?.condition || "Stable",
    appointment: db.appointments[0]
      ? `${db.appointments[0].date} - ${db.appointments[0].time}`
      : "No appointment"
  });
});

export default router;