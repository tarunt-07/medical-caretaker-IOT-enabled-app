const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

export const API_BASE_URL = rawApiBaseUrl
  ? rawApiBaseUrl.replace(/\/+$/, "")
  : "/api";

export const ARDUINO_EVENT_ENDPOINT = `${API_BASE_URL}/devices/arduino-event`;
