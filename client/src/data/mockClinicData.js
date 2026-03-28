export const CARE_PATIENTS = [
  {
    id: 1,
    name: "Rahul Sharma",
    age: 58,
    gender: "Male",
    bloodGroup: "B+",
    condition: "Post-surgery recovery",
    doctor: "Dr. Tarun Kumar",
    caretaker: "Tarunk",
    allergies: ["Penicillin"],
    vitals: { bp: "122/82", pulse: "76 bpm", sugar: "112 mg/dL", oxygen: "98%" },
    medicines: [
      { name: "Paracetamol", dosage: "500 mg", schedule: "8:00 AM / 8:00 PM", status: "On track" },
      { name: "Vitamin D3", dosage: "1 tablet", schedule: "1:00 PM", status: "Pending noon dose" },
    ],
    history: [
      "Hypertension diagnosed in 2018",
      "Knee replacement surgery in December 2025",
      "Observed mild fatigue during week 2 recovery",
    ],
    reports: ["Blood Test - January 2026", "ECG - February 2026", "Post-op Review - March 2026"],
    notes: [
      "Encourage hydration and gentle mobility exercises",
      "Monitor wound healing and report any redness",
    ],
    nextAppointment: "April 3, 2026 at 10:30 AM",
  },
  {
    id: 2,
    name: "Meena Devi",
    age: 64,
    gender: "Female",
    bloodGroup: "O+",
    condition: "Cardiac monitoring",
    doctor: "Dr. Priya Sharma",
    caretaker: "Tarunk",
    allergies: ["Shellfish"],
    vitals: { bp: "136/88", pulse: "82 bpm", sugar: "104 mg/dL", oxygen: "97%" },
    medicines: [
      { name: "Amlodipine", dosage: "5 mg", schedule: "9:00 AM", status: "Taken" },
      { name: "Aspirin", dosage: "75 mg", schedule: "9:00 PM", status: "Tonight" },
    ],
    history: [
      "High blood pressure under treatment since 2020",
      "Shortness of breath episode logged on March 14, 2026",
    ],
    reports: ["BP Monitoring Report", "2D Echo", "Cardiology Review"],
    notes: [
      "Needs low-salt diet tracking",
      "Doctor requested evening BP logs for 7 days",
    ],
    nextAppointment: "April 1, 2026 at 2:00 PM",
  },
  {
    id: 3,
    name: "Arjun Singh",
    age: 45,
    gender: "Male",
    bloodGroup: "A+",
    condition: "Diabetes review",
    doctor: "Dr. Anil Mehta",
    caretaker: "Tarunk",
    allergies: [],
    vitals: { bp: "118/78", pulse: "74 bpm", sugar: "148 mg/dL", oxygen: "99%" },
    medicines: [
      { name: "Metformin", dosage: "500 mg", schedule: "7:30 AM / 7:30 PM", status: "On track" },
      { name: "B12", dosage: "1 capsule", schedule: "1:00 PM", status: "Pending" },
    ],
    history: [
      "Type 2 diabetes diagnosed in 2021",
      "Latest HbA1c showed moderate improvement",
    ],
    reports: ["HbA1c Test", "Fasting Sugar Report", "Diet Follow-up"],
    notes: [
      "Check pre-dinner sugar levels this week",
      "Review meal adherence before next consult",
    ],
    nextAppointment: "April 5, 2026 at 11:00 AM",
  },
];

export const CARETAKER_ACTIONS = [
  "Review complete medical records for assigned patients",
  "Upload new reports and attach daily observation notes",
  "Track medicine adherence and missed-dose reasons",
  "Escalate urgent findings directly to doctors",
  "Prepare appointment summaries before consultations",
  "Use Prantar Assist for care guidance and reminders",
];

export const CHAT_CONTACTS_BY_ROLE = {
  caretaker: [
    { id: 101, name: "Dr. Tarun Kumar", role: "doctor", specialization: "General Physician" },
    { id: 102, name: "Dr. Priya Sharma", role: "doctor", specialization: "Cardiologist" },
    { id: 103, name: "Dr. Anil Mehta", role: "doctor", specialization: "Neurologist" },
  ],
  doctor: [
    { id: 201, name: "Tarunk Caretaker", role: "caretaker", specialization: "Recovery Coordinator" },
    { id: 202, name: "Priya Caretaker", role: "caretaker", specialization: "Home Monitoring Lead" },
    { id: 203, name: "Megha Caretaker", role: "caretaker", specialization: "Medication Support" },
  ],
  patient: [
    { id: 101, name: "Dr. Tarun Kumar", role: "doctor", specialization: "General Physician" },
    { id: 201, name: "Tarunk Caretaker", role: "caretaker", specialization: "Recovery Coordinator" },
  ],
};

export const CHAT_MESSAGES = {
  101: [
    { id: 1, from: 4, to: 101, text: "Rahul's blood pressure is stable after lunch.", createdAt: "2026-03-28T09:05:00Z" },
    { id: 2, from: 101, to: 4, text: "Great. Please upload the evening reading too.", createdAt: "2026-03-28T09:10:00Z" },
  ],
  102: [
    { id: 3, from: 102, to: 4, text: "Continue Meena Devi's current medication and log symptoms nightly.", createdAt: "2026-03-27T12:20:00Z" },
  ],
  103: [
    { id: 4, from: 103, to: 4, text: "Please schedule the diabetes review and share Arjun's latest diet log.", createdAt: "2026-03-26T08:30:00Z" },
  ],
  201: [
    { id: 5, from: 201, to: 1, text: "Doctor, Rahul's wound dressing has been changed and he reports less pain today.", createdAt: "2026-03-28T07:50:00Z" },
    { id: 6, from: 1, to: 201, text: "Good update. Please keep observing for any swelling around the incision.", createdAt: "2026-03-28T08:05:00Z" },
  ],
  202: [
    { id: 7, from: 202, to: 1, text: "Meena Devi missed her evening walk yesterday due to fatigue.", createdAt: "2026-03-27T16:10:00Z" },
  ],
  203: [
    { id: 8, from: 203, to: 1, text: "Arjun's sugar reading was slightly elevated before dinner.", createdAt: "2026-03-27T18:45:00Z" },
  ],
};

export const AI_HELPER_FACTS = [
  "Try asking for a medicine reminder summary or a patient handover note.",
  "Caretakers can use quick guidance for symptoms, appointments, and report follow-ups.",
  "Doctors can request a concise daily status summary before reviewing reports.",
];
