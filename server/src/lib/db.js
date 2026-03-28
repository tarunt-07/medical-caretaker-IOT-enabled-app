import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, "../../db.json");

export function readDb() {
  return JSON.parse(readFileSync(DB_PATH, "utf-8"));
}
export function writeDb(data) {
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}
export function nextId(arr) {
  return arr.length > 0 ? Math.max(...arr.map(i => i.id)) + 1 : 1;
}
export function success(res, message, data = null, status = 200) {
  return res.status(status).json({ success: true, message, data });
}
export function failure(res, message, status = 400) {
  return res.status(status).json({ success: false, message });
}