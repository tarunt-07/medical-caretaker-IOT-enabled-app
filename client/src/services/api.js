const BASE = "http://localhost:5000/api";

async function request(path, options = {}) {
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    return await res.json();
  } catch (err) {
    console.warn("API offline, using mock data:", err.message);
    return { success: false, message: "Server offline" };
  }
}

export const api = {
  login: (data) => request("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  signup: (data) => request("/auth/signup", { method: "POST", body: JSON.stringify(data) }),
  getDashboard: (role) => request(`/dashboard/${role}`),
  getPatients: () => request("/patients"),
  getPrescriptions: () => request("/prescriptions"),
  addPrescription: (data) => request("/prescriptions", { method: "POST", body: JSON.stringify(data) }),
  getLogs: () => request("/logs"),
  addLog: (data) => request("/logs", { method: "POST", body: JSON.stringify(data) }),
  getAppointments: () => request("/appointments"),
  addAppointment: (data) => request("/appointments", { method: "POST", body: JSON.stringify(data) }),
  updateAppointmentStatus: (id, status) => request(`/appointments/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  deleteAppointment: (id) => request(`/appointments/${id}`, { method: "DELETE" }),
  getContacts: (userId) => request(`/chat/contacts/${userId}`),
  getConversation: (userId, contactId) => request(`/chat/conversation/${userId}/${contactId}`),
  sendMessage: (data) => request("/chat/message", { method: "POST", body: JSON.stringify(data) }),
  getDevices: () => request("/devices"),
  connectDevice: (data) => request("/devices/connect", { method: "POST", body: JSON.stringify(data) }),
  sendArduinoEvent: (data) => request("/devices/arduino-event", { method: "POST", body: JSON.stringify(data) }),
};