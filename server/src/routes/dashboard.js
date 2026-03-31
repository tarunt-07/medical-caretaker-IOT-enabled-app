import express from "express";
import { getSnapshot } from "../lib/dataStore.js";
import { success, failure } from "../lib/db.js";

const router = express.Router();

router.get("/:role", async (req, res) => {
  try {
    const db = await getSnapshot(["alerts", "prescriptions", "patients", "appointments"]);
    const role = req.params.role;

    const totalNotifications = db.alerts.length;
    const totalPendingPills = db.prescriptions.filter((p) => p.status === "pending").length;
    const totalAlerts = db.alerts.filter((a) => a.level === "high").length;

    if (role === "doctor") {
      return success(res, "Doctor dashboard fetched", {
        notifications: totalNotifications,
        alerts: totalAlerts,
        pills: totalPendingPills,
        patients: db.patients,
      });
    }

    if (role === "caretaker") {
      return success(res, "Caretaker dashboard fetched", {
        notifications: totalNotifications,
        alerts: totalAlerts,
        pills: totalPendingPills,
        medicines: db.prescriptions,
        alertsList: db.alerts.slice(-5).reverse(),
      });
    }

    return success(res, "Patient dashboard fetched", {
      notifications: totalNotifications,
      alerts: totalAlerts,
      pills: totalPendingPills,
      condition: db.patients[0]?.condition || "Stable",
      appointment: db.appointments[0]
        ? `${db.appointments[0].date} - ${db.appointments[0].time}`
        : "No appointment",
    });
  } catch (error) {
    return failure(res, error.message, 500);
  }
});

export default router;
