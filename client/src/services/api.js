import {
  CARE_PATIENTS,
  CHAT_CONTACTS_BY_ROLE,
  CHAT_MESSAGES,
} from "../data/mockClinicData";

const BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const STORAGE_KEY = "prantar_offline_store_v1";

const DEFAULT_USERS = [
  {
    id: 1,
    name: "Dr. Tarun Kumar",
    email: "doctor@prantar.io",
    password: "doctor123",
    role: "doctor",
  },
  {
    id: 4,
    name: "Tarunk Caretaker",
    email: "caretaker@prantar.io",
    password: "caretaker123",
    role: "caretaker",
  },
  {
    id: 7,
    name: "Rahul Sharma",
    email: "patient@prantar.io",
    password: "patient123",
    role: "patient",
  },
];

const DEFAULT_PATIENTS = CARE_PATIENTS.map((patient) => ({
  id: patient.id,
  name: patient.name,
  age: patient.age,
  gender: patient.gender,
  bloodGroup: patient.bloodGroup,
  condition: patient.condition.includes("recovery") ? "Stable" : "Under observation",
  doctor: patient.doctor,
  caretaker: patient.caretaker,
  allergies: patient.allergies,
  vitals: patient.vitals,
  nextAppointment: patient.nextAppointment,
}));

const DEFAULT_PRESCRIPTIONS = CARE_PATIENTS.flatMap((patient) =>
  patient.medicines.map((medicine, index) => ({
    id: Number(`${patient.id}${index + 1}`),
    patientId: patient.id,
    patientName: patient.name,
    medicine: medicine.name,
    dosage: medicine.dosage,
    frequency: medicine.schedule,
    status: medicine.status,
  }))
);

const DEFAULT_APPOINTMENTS = [
  {
    id: 1,
    patientId: 1,
    patientName: "Rahul Sharma",
    doctorId: 1,
    doctorName: "Dr. Tarun Kumar",
    date: "2026-04-03",
    time: "10:30",
    type: "General Review",
    status: "scheduled",
  },
  {
    id: 2,
    patientId: 2,
    patientName: "Meena Devi",
    doctorId: 2,
    doctorName: "Dr. Priya Sharma",
    date: "2026-04-01",
    time: "14:00",
    type: "BP Check",
    status: "scheduled",
  },
  {
    id: 3,
    patientId: 3,
    patientName: "Arjun Singh",
    doctorId: 3,
    doctorName: "Dr. Anil Mehta",
    date: "2026-04-05",
    time: "11:00",
    type: "Diabetes Review",
    status: "scheduled",
  },
];

const DEFAULT_REPORTS = [
  {
    id: 1,
    patientId: 1,
    title: "Blood Test Report",
    type: "blood_test",
    status: "reviewed",
    uploadedBy: "Tarunk Caretaker",
    reviewedBy: "Dr. Tarun Kumar",
    notes: "Hemoglobin slightly low, iron supplement recommended.",
    createdAt: "2026-03-12T00:00:00Z",
  },
  {
    id: 2,
    patientId: 2,
    title: "BP Monitoring Report",
    type: "bp_report",
    status: "pending",
    uploadedBy: "Priya Caretaker",
    reviewedBy: null,
    notes: "",
    createdAt: "2026-03-18T00:00:00Z",
  },
  {
    id: 3,
    patientId: 3,
    title: "HbA1c Test",
    type: "blood_test",
    status: "pending",
    uploadedBy: "Megha Caretaker",
    reviewedBy: null,
    notes: "",
    createdAt: "2026-03-20T00:00:00Z",
  },
];

const DEFAULT_LOGS = [
  {
    id: 1,
    date: "2026-03-28",
    note: "Patient had a good morning. All medicines taken on time.",
    by: "Tarunk Caretaker",
  },
  {
    id: 2,
    date: "2026-03-27",
    note: "Mild fatigue observed after lunch. Monitoring hydration levels.",
    by: "Priya Caretaker",
  },
];

const DEFAULT_DEVICES = [
  {
    id: 1,
    name: "Smart Dispenser #1",
    type: "Arduino/ESP32",
    status: "connected",
    patientId: 1,
    pillsRemaining: 14,
    pillsDispensed: 6,
    lastSync: "2026-03-28T08:02:00Z",
  },
  {
    id: 2,
    name: "Smart Dispenser #2",
    type: "Raspberry Pi",
    status: "offline",
    patientId: 2,
    pillsRemaining: 0,
    pillsDispensed: 0,
    lastSync: "2026-03-28T05:00:00Z",
  },
];

function threadKey(left, right) {
  return [left, right].sort((a, b) => a - b).join("_");
}

function seedContacts() {
  const contacts = {};

  Object.entries(CHAT_CONTACTS_BY_ROLE).forEach(([role, items]) => {
    contacts[role] = items.map((contact) => ({ ...contact }));
  });

  return contacts;
}

function seedConversations() {
  const conversations = {};

  Object.values(CHAT_MESSAGES)
    .flat()
    .forEach((message) => {
      const key = threadKey(message.from, message.to);
      conversations[key] = [...(conversations[key] || []), { ...message }];
    });

  return conversations;
}

function createDefaultStore() {
  return {
    users: DEFAULT_USERS,
    patients: DEFAULT_PATIENTS,
    prescriptions: DEFAULT_PRESCRIPTIONS,
    appointments: DEFAULT_APPOINTMENTS,
    reports: DEFAULT_REPORTS,
    logs: DEFAULT_LOGS,
    devices: DEFAULT_DEVICES,
    contacts: seedContacts(),
    conversations: seedConversations(),
  };
}

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  return store;
}

function ensureStore() {
  const existing = readStore();
  if (existing) return existing;
  return writeStore(createDefaultStore());
}

function updateStore(updater) {
  const store = ensureStore();
  return writeStore(updater(store));
}

function nextId(items) {
  return items.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
}

function withMeta(data, offline = true, message = null) {
  return { success: true, data, offline, message };
}

async function tryServer(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

async function preferServer(path, fallback, options) {
  try {
    const result = await tryServer(path, options);
    return { ...result, offline: false };
  } catch (error) {
    console.warn("API offline, using local store:", error.message);
    return fallback();
  }
}

function sanitizeUser(user) {
  if (!user) return null;
  const safeUser = { ...user };
  delete safeUser.password;
  return safeUser;
}

function getDashboardData(role) {
  const store = ensureStore();
  const alerts = store.logs.length;
  const notifications = store.reports.filter((report) => report.status === "pending").length;
  const pills = store.prescriptions.filter((prescription) => prescription.status !== "Taken").length;

  if (role === "doctor") {
    return {
      alerts,
      notifications,
      pills,
      patients: store.patients.slice(0, 5).map((patient) => ({
        id: patient.id,
        name: patient.name,
        condition: patient.condition,
        note: `${patient.doctor} review ${patient.nextAppointment ? "scheduled" : "recommended"}`,
      })),
    };
  }

  if (role === "caretaker") {
    return {
      alerts,
      notifications,
      pills,
      medicines: store.prescriptions.slice(0, 5),
      alertsList: store.logs.slice(0, 3).map((log) => ({
        id: log.id,
        title: "Care log update",
        message: log.note,
        level: "high",
      })),
    };
  }

  return {
    alerts,
    notifications,
    pills,
  };
}

function findUserByRole(role) {
  return sanitizeUser(ensureStore().users.find((user) => user.role === role)) || {
    id: Date.now(),
    name: "PranTar User",
    role,
  };
}

export const api = {
  async login(payload) {
    return preferServer(
      "/auth/login",
      () => {
        const store = ensureStore();
        const matchedUser = store.users.find(
          (user) =>
            user.email.toLowerCase() === payload.email.toLowerCase() &&
            user.password === payload.password &&
            user.role === payload.role
        );

        if (matchedUser) {
          return withMeta(sanitizeUser(matchedUser), true, "Logged in using offline mode.");
        }

        return {
          success: true,
          data: findUserByRole(payload.role || "doctor"),
          offline: true,
          message: "Server offline. Signed in with an offline demo account.",
        };
      },
      { method: "POST", body: JSON.stringify(payload) }
    );
  },

  async signup(payload) {
    return preferServer(
      "/auth/signup",
      () => {
        const store = ensureStore();
        const emailTaken = store.users.some(
          (user) => user.email.toLowerCase() === payload.email.toLowerCase()
        );

        if (emailTaken) {
          return { success: false, message: "An account with this email already exists." };
        }

        const newUser = {
          id: nextId(store.users),
          name: payload.name,
          email: payload.email,
          password: payload.password,
          role: payload.role,
        };

        updateStore((current) => ({
          ...current,
          users: [...current.users, newUser],
        }));

        return withMeta(sanitizeUser(newUser), true, "Account created in offline mode.");
      },
      { method: "POST", body: JSON.stringify(payload) }
    );
  },

  async getDashboard(role) {
    return preferServer(`/dashboard/${role}`, () => withMeta(getDashboardData(role)));
  },

  async getPatients() {
    return preferServer("/patients", () => withMeta(ensureStore().patients));
  },

  async getPrescriptions() {
    return preferServer("/prescriptions", () => withMeta(ensureStore().prescriptions));
  },

  async addPrescription(data) {
    return preferServer(
      "/prescriptions",
      () => {
        const store = ensureStore();
        const nextPrescription = { id: nextId(store.prescriptions), ...data };
        updateStore((current) => ({
          ...current,
          prescriptions: [...current.prescriptions, nextPrescription],
        }));
        return withMeta(nextPrescription);
      },
      { method: "POST", body: JSON.stringify(data) }
    );
  },

  async getLogs() {
    return preferServer("/logs", () => withMeta(ensureStore().logs));
  },

  async addLog(data) {
    return preferServer(
      "/logs",
      () => {
        const store = ensureStore();
        const nextLog = {
          id: nextId(store.logs),
          date: new Date().toISOString().split("T")[0],
          by: "Caretaker",
          ...data,
        };
        updateStore((current) => ({
          ...current,
          logs: [nextLog, ...current.logs],
        }));
        return withMeta(nextLog);
      },
      { method: "POST", body: JSON.stringify(data) }
    );
  },

  async getAppointments() {
    return preferServer("/appointments", () => withMeta(ensureStore().appointments));
  },

  async addAppointment(data) {
    return preferServer(
      "/appointments",
      () => {
        const store = ensureStore();
        const nextAppointment = { id: nextId(store.appointments), ...data };
        updateStore((current) => ({
          ...current,
          appointments: [...current.appointments, nextAppointment],
        }));
        return withMeta(nextAppointment);
      },
      { method: "POST", body: JSON.stringify(data) }
    );
  },

  async updateAppointmentStatus(id, status) {
    return preferServer(
      `/appointments/${id}/status`,
      () => {
        let updated = null;
        updateStore((current) => ({
          ...current,
          appointments: current.appointments.map((appointment) => {
            if (appointment.id !== id) return appointment;
            updated = { ...appointment, status };
            return updated;
          }),
        }));
        return withMeta(updated);
      },
      { method: "PATCH", body: JSON.stringify({ status }) }
    );
  },

  async deleteAppointment(id) {
    return preferServer(
      `/appointments/${id}`,
      () => {
        updateStore((current) => ({
          ...current,
          appointments: current.appointments.filter((appointment) => appointment.id !== id),
        }));
        return withMeta({ id });
      },
      { method: "DELETE" }
    );
  },

  async getReports() {
    return preferServer("/reports", () => withMeta(ensureStore().reports));
  },

  async addReport(data) {
    return preferServer(
      "/reports",
      () => {
        const store = ensureStore();
        const nextReport = {
          id: nextId(store.reports),
          status: "pending",
          reviewedBy: null,
          notes: "",
          createdAt: new Date().toISOString(),
          ...data,
          patientId: Number(data.patientId),
        };
        updateStore((current) => ({
          ...current,
          reports: [...current.reports, nextReport],
        }));
        return withMeta(nextReport);
      },
      { method: "POST", body: JSON.stringify(data) }
    );
  },

  async reviewReport(id, data) {
    return preferServer(
      `/reports/${id}/review`,
      () => {
        let updated = null;
        updateStore((current) => ({
          ...current,
          reports: current.reports.map((report) => {
            if (report.id !== id) return report;
            updated = {
              ...report,
              status: "reviewed",
              reviewedBy: data.reviewedBy,
              notes: data.notes,
            };
            return updated;
          }),
        }));
        return withMeta(updated);
      },
      { method: "PATCH", body: JSON.stringify(data) }
    );
  },

  async deleteReport(id) {
    return preferServer(
      `/reports/${id}`,
      () => {
        updateStore((current) => ({
          ...current,
          reports: current.reports.filter((report) => report.id !== id),
        }));
        return withMeta({ id });
      },
      { method: "DELETE" }
    );
  },

  async getContacts(userId) {
    return withMeta(
      Object.values(ensureStore().contacts)
        .flat()
        .filter((contact, index, items) => {
          const firstIndex = items.findIndex((item) => item.id === contact.id);
          return firstIndex === index && contact.id !== userId;
        })
    );
  },

  async getConversation(userId, contactId) {
    return withMeta(ensureStore().conversations[threadKey(userId, contactId)] || []);
  },

  async sendMessage(data) {
    const key = threadKey(data.from, data.to);
    const store = ensureStore();
    const thread = store.conversations[key] || [];
    const nextMessage = {
      id: nextId(thread),
      createdAt: new Date().toISOString(),
      ...data,
    };
    updateStore((current) => ({
      ...current,
      conversations: {
        ...current.conversations,
        [key]: [...(current.conversations[key] || []), nextMessage],
      },
    }));
    return withMeta(nextMessage);
  },

  async getDevices() {
    return preferServer("/devices", () => withMeta(ensureStore().devices));
  },

  async connectDevice(data) {
    return preferServer(
      "/devices/connect",
      () => {
        const store = ensureStore();
        const nextDevice = {
          id: nextId(store.devices),
          status: "connected",
          pillsRemaining: 0,
          pillsDispensed: 0,
          lastSync: new Date().toISOString(),
          ...data,
        };
        updateStore((current) => ({
          ...current,
          devices: [...current.devices, nextDevice],
        }));
        return withMeta(nextDevice);
      },
      { method: "POST", body: JSON.stringify(data) }
    );
  },

  async sendArduinoEvent(data) {
    return preferServer(
      "/devices/arduino-event",
      async () => {
        const note = data.message || `${data.eventType} from ${data.deviceName}`;
        await api.addLog({ note, by: data.deviceName });
        return withMeta({
          eventType: data.eventType,
          deviceName: data.deviceName,
          processedAt: new Date().toISOString(),
        });
      },
      { method: "POST", body: JSON.stringify(data) }
    );
  },
};
