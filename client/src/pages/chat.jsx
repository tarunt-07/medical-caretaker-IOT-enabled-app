import { useEffect, useMemo, useRef, useState } from "react";
import RoleSidebar from "../components/layout/RoleSidebar";
import RoleTopbar from "../components/layout/RoleTopbar";

const USER_FALLBACKS = {
  doctor: { id: 1, name: "Dr. Tarun Kumar", role: "doctor" },
  caretaker: { id: 4, name: "Tarunk Caretaker", role: "caretaker" },
  patient: { id: 7, name: "Rahul Sharma", role: "patient" },
};

const CHAT_DIRECTORY = {
  doctor: [
    { id: 4, name: "Tarunk Caretaker", role: "caretaker", specialization: "Recovery Coordinator" },
    { id: 5, name: "Megha Caretaker", role: "caretaker", specialization: "Medication Support" },
  ],
  caretaker: [
    { id: 1, name: "Dr. Tarun Kumar", role: "doctor", specialization: "General Physician" },
    { id: 2, name: "Dr. Priya Sharma", role: "doctor", specialization: "Cardiologist" },
  ],
  patient: [
    { id: 1, name: "Dr. Tarun Kumar", role: "doctor", specialization: "General Physician" },
    { id: 4, name: "Tarunk Caretaker", role: "caretaker", specialization: "Recovery Coordinator" },
  ],
};

const CHAT_STORAGE_KEY = "prantar_chat_threads";

const SEED_THREADS = {
  "1_4": [
    {
      id: 1001,
      from: 4,
      to: 1,
      text: "Rahul's blood pressure is stable after breakfast.",
      createdAt: "2026-03-28T08:10:00Z",
      readBy: [4],
    },
    {
      id: 1002,
      from: 1,
      to: 4,
      text: "Good. Please upload the evening reading as well.",
      createdAt: "2026-03-28T08:18:00Z",
      readBy: [1],
    },
  ],
  "2_4": [
    {
      id: 1101,
      from: 2,
      to: 4,
      text: "Please continue Meena Devi's current medication and monitor fatigue.",
      createdAt: "2026-03-27T13:20:00Z",
      readBy: [2],
    },
  ],
};

function getThreadKey(a, b) {
  return [a, b].sort((left, right) => left - right).join("_");
}

function readThreads() {
  const raw = localStorage.getItem(CHAT_STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(SEED_THREADS));
    return SEED_THREADS;
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(SEED_THREADS));
    return SEED_THREADS;
  }
}

function writeThreads(nextThreads) {
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(nextThreads));
}

function getCurrentUser() {
  const stored = JSON.parse(localStorage.getItem("user") || "{}");
  const role = stored.role || "caretaker";
  return { ...USER_FALLBACKS[role], ...stored, role, id: stored.id || USER_FALLBACKS[role].id };
}

function Chat() {
  const user = getCurrentUser();
  const sidebarRole = user.role.charAt(0).toUpperCase() + user.role.slice(1);
  const isMobileLayout = typeof window !== "undefined" && window.innerWidth < 960;

  const [threads, setThreads] = useState(() => readThreads());
  const [activeContactId, setActiveContactId] = useState(
    () => CHAT_DIRECTORY[user.role]?.[0]?.id ?? null
  );
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [sending, setSending] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    writeThreads(threads);
  }, [threads]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleStorage = () => setThreads(readThreads());
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const contacts = useMemo(() => {
    const base = CHAT_DIRECTORY[user.role] || CHAT_DIRECTORY.caretaker;
    return base
      .map((contact) => {
        const threadKey = getThreadKey(user.id, contact.id);
        const items = threads[threadKey] || [];
        const last = items[items.length - 1];
        const unread = items.filter(
          (message) => message.to === user.id && !(message.readBy || []).includes(user.id)
        ).length;
        return {
          ...contact,
          lastMessage: last?.text || "Start a conversation",
          lastTime: last?.createdAt || null,
          unread,
        };
      })
      .sort((a, b) => new Date(b.lastTime || 0) - new Date(a.lastTime || 0));
  }, [threads, user.id, user.role]);

  const activeContact =
    contacts.find((contact) => contact.id === activeContactId) || contacts[0] || null;

  const messages = useMemo(() => {
    if (!activeContact) return [];
    return threads[getThreadKey(user.id, activeContact.id)] || [];
  }, [activeContact, threads, user.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filteredContacts = contacts.filter((contact) =>
    `${contact.name} ${contact.specialization}`.toLowerCase().includes(search.toLowerCase())
  );

  const markThreadRead = (contactId) => {
    const threadKey = getThreadKey(user.id, contactId);
    const items = threads[threadKey] || [];
    const nextItems = items.map((message) =>
      message.to === user.id && !(message.readBy || []).includes(user.id)
        ? { ...message, readBy: [...(message.readBy || []), user.id] }
        : message
    );
    const nextThreads = { ...threads, [threadKey]: nextItems };
    setThreads(nextThreads);
    writeThreads(nextThreads);
  };

  const updateActiveThread = (updater) => {
    if (!activeContact) return;
    const threadKey = getThreadKey(user.id, activeContact.id);
    const currentItems = threads[threadKey] || [];
    const nextItems = updater(currentItems);
    const nextThreads = { ...threads, [threadKey]: nextItems };
    setThreads(nextThreads);
    writeThreads(nextThreads);
  };

  const handleContactSelect = (contactId) => {
    setActiveContactId(contactId);
    setEditingMessageId(null);
    setEditingText("");
    markThreadRead(contactId);
  };

  const handleSend = () => {
    if (!input.trim() || !activeContact) return;
    setSending(true);
    const nextMessage = {
      id: Date.now(),
      from: user.id,
      to: activeContact.id,
      text: input.trim(),
      createdAt: new Date().toISOString(),
      readBy: [user.id],
    };
    const threadKey = getThreadKey(user.id, activeContact.id);
    const nextThreads = {
      ...threads,
      [threadKey]: [...(threads[threadKey] || []), nextMessage],
    };
    setThreads(nextThreads);
    writeThreads(nextThreads);
    setInput("");
    setSending(false);
  };

  const handleEditStart = (message) => {
    setEditingMessageId(message.id);
    setEditingText(message.text);
  };

  const handleEditCancel = () => {
    setEditingMessageId(null);
    setEditingText("");
  };

  const handleEditSave = () => {
    if (!editingText.trim()) return;
    updateActiveThread((currentItems) =>
      currentItems.map((message) =>
        message.id === editingMessageId
          ? {
              ...message,
              text: editingText.trim(),
              editedAt: new Date().toISOString(),
            }
          : message
      )
    );
    handleEditCancel();
  };

  const handleDeleteMessage = (messageId) => {
    updateActiveThread((currentItems) => currentItems.filter((message) => message.id !== messageId));
    if (editingMessageId === messageId) {
      handleEditCancel();
    }
  };

  const unreadMessages = contacts.reduce((sum, contact) => sum + contact.unread, 0);

  const formatTime = (iso) =>
    iso ? new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

  const formatPreviewDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString([], { month: "short", day: "numeric" }) : "";

  return (
    <div className="dashboard-layout medical-bg">
      <RoleSidebar role={sidebarRole} />
      <main className="main-panel">
        <RoleTopbar
          name={user.name}
          role={sidebarRole}
          alerts={2}
          pills={4}
          notifications={unreadMessages}
        />

        <div className="page-header">
          <div>
            <div className="page-title">Care Team Chat</div>
            <div className="page-subtitle">
              Messenger-style local chat between doctors, caretakers, and patients using this app.
            </div>
          </div>
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.06)",
              color: isOnline ? "#a8ffde" : "#ffe1ab",
              fontWeight: 700,
            }}
          >
            {isOnline ? "Ready to sync" : "Offline mode"}
          </div>
        </div>

        <div
          className="glass-card"
          style={{
            display: "grid",
            gridTemplateColumns: isMobileLayout ? "1fr" : "320px minmax(0, 1fr)",
            minHeight: "calc(100vh - 260px)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              borderRight: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              flexDirection: "column",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <div style={{ padding: "18px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <div
                style={{
                  marginBottom: "12px",
                  color: "var(--muted)",
                  fontSize: "0.78rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Conversations
              </div>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={`Search ${user.role === "doctor" ? "caretakers" : "care team"}...`}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(4,14,24,0.82)",
                  color: "#f4fbff",
                }}
              />
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
              {filteredContacts.map((contact) => (
                <button
                  key={contact.id}
                  type="button"
                  onClick={() => handleContactSelect(contact.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    gap: "12px",
                    alignItems: "center",
                    textAlign: "left",
                    marginBottom: "8px",
                    padding: "12px 14px",
                    borderRadius: "16px",
                    border:
                      activeContact?.id === contact.id
                        ? "1px solid rgba(99,169,255,0.48)"
                        : "1px solid rgba(255,255,255,0.06)",
                    background:
                      activeContact?.id === contact.id
                        ? "linear-gradient(135deg, rgba(33,199,207,0.16), rgba(99,169,255,0.16))"
                        : "rgba(255,255,255,0.03)",
                    color: "#f3fbff",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontWeight: 800,
                      background: "linear-gradient(135deg, #22c6ce, #63a9ff)",
                      color: "#04111b",
                    }}
                  >
                    {contact.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
                      <div style={{ fontWeight: 700 }}>{contact.name}</div>
                      <div style={{ color: "var(--muted)", fontSize: "0.76rem" }}>
                        {formatPreviewDate(contact.lastTime)}
                      </div>
                    </div>
                    <div style={{ color: "#9fd9f0", fontSize: "0.76rem", marginTop: "2px" }}>
                      {contact.role === "doctor"
                        ? "Doctor"
                        : contact.role === "caretaker"
                          ? "Caretaker"
                          : "Patient"}{" "}
                      • {contact.specialization}
                    </div>
                    <div
                      style={{
                        color: "var(--muted)",
                        fontSize: "0.8rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        marginTop: "5px",
                      }}
                    >
                      {contact.lastMessage}
                    </div>
                  </div>
                  {contact.unread > 0 && (
                    <div
                      style={{
                        minWidth: "24px",
                        height: "24px",
                        borderRadius: "999px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#ff7c8f",
                        color: "#fff",
                        fontSize: "0.74rem",
                        fontWeight: 800,
                      }}
                    >
                      {contact.unread}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {activeContact ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  padding: "18px 20px",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "12px",
                  alignItems: "center",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: "1rem" }}>{activeContact.name}</div>
                  <div style={{ color: "#9fdaf0", fontSize: "0.82rem" }}>
                    {activeContact.role === "doctor"
                      ? "Doctor"
                      : activeContact.role === "caretaker"
                        ? "Caretaker"
                        : "Patient"}{" "}
                    • {activeContact.specialization}
                  </div>
                </div>
                <div style={{ color: isOnline ? "#9dffd8" : "#ffd9a5", fontWeight: 700 }}>
                  {isOnline ? "Connected" : "Offline"}
                </div>
              </div>

              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  background: "rgba(2,10,18,0.24)",
                }}
              >
                {messages.map((message) => {
                  const sent = message.from === user.id;
                  const isEditing = editingMessageId === message.id;

                  return (
                    <div
                      key={message.id}
                      style={{ display: "flex", justifyContent: sent ? "flex-end" : "flex-start" }}
                    >
                      <div style={{ width: "100%", maxWidth: "66%" }}>
                        <div
                          style={{
                            padding: "12px 16px",
                            borderRadius: sent ? "18px 18px 6px 18px" : "18px 18px 18px 6px",
                            background: sent
                              ? "linear-gradient(135deg, #22c6ce, #5fa8ff)"
                              : "rgba(255,255,255,0.08)",
                            color: sent ? "#03141c" : "#f3fbff",
                            fontWeight: 500,
                            lineHeight: 1.55,
                          }}
                        >
                          {isEditing ? (
                            <div style={{ display: "grid", gap: "10px" }}>
                              <textarea
                                value={editingText}
                                onChange={(event) => setEditingText(event.target.value)}
                                rows={3}
                                style={{
                                  width: "100%",
                                  resize: "vertical",
                                  padding: "10px 12px",
                                  borderRadius: "12px",
                                  border: "1px solid rgba(3,20,28,0.18)",
                                  background: "rgba(255,255,255,0.82)",
                                  color: "#03141c",
                                  font: "inherit",
                                }}
                              />
                              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                                <button type="button" className="btn btn-ghost" onClick={handleEditCancel}>
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={handleEditSave}
                                  disabled={!editingText.trim()}
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            message.text
                          )}
                        </div>
                        <div
                          style={{
                            marginTop: "6px",
                            fontSize: "0.72rem",
                            color: "var(--muted)",
                            textAlign: sent ? "right" : "left",
                          }}
                        >
                          {formatTime(message.createdAt)}
                          {message.editedAt ? " • Edited" : ""}
                        </div>
                        {sent && !isEditing ? (
                          <div
                            style={{
                              marginTop: "8px",
                              display: "flex",
                              justifyContent: "flex-end",
                              gap: "8px",
                            }}
                          >
                            <button
                              type="button"
                              className="btn btn-ghost"
                              onClick={() => handleEditStart(message)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-ghost"
                              onClick={() => handleDeleteMessage(message.id)}
                            >
                              Delete
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div
                style={{
                  padding: "16px 20px",
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && handleSend()}
                  placeholder={`Message ${activeContact.name}...`}
                  style={{
                    flex: "1 1 220px",
                    padding: "12px 14px",
                    borderRadius: "14px",
                    border: "1px solid rgba(255,255,255,0.14)",
                    background: "rgba(4,14,24,0.82)",
                    color: "#f4fbff",
                  }}
                />
                <button className="btn btn-primary" onClick={handleSend} disabled={sending || !input.trim()} style={{ width: "auto" }}>
                  {sending ? "Sending..." : "Send"}
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--muted)",
              }}
            >
              Select a conversation
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Chat;
