import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, "../../db.json");

const COLLECTIONS = [
  "users",
  "patients",
  "prescriptions",
  "alerts",
  "appointments",
  "logs",
  "reports",
  "devices",
];

const DEFAULT_ORDER = {
  users: "id",
  patients: "id",
  prescriptions: "id",
  alerts: "createdAt",
  appointments: "id",
  logs: "id",
  reports: "id",
  devices: "id",
};

function createSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

const supabase = createSupabase();

function ensureCollectionName(collection) {
  if (!COLLECTIONS.includes(collection)) {
    throw new Error(`Unsupported collection: ${collection}`);
  }
}

function readLocalDb() {
  return JSON.parse(readFileSync(DB_PATH, "utf-8"));
}

function writeLocalDb(data) {
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function nextLocalId(items) {
  return items.length > 0 ? Math.max(...items.map((item) => Number(item.id) || 0)) + 1 : 1;
}

function applyFilters(items, filters = {}) {
  return items.filter((item) =>
    Object.entries(filters).every(([key, value]) => item[key] === value)
  );
}

function sortItems(items, collection) {
  const orderKey = DEFAULT_ORDER[collection] || "id";
  return [...items].sort((left, right) => {
    const a = left[orderKey];
    const b = right[orderKey];

    if (typeof a === "string" && typeof b === "string") {
      return a.localeCompare(b);
    }

    return (a ?? 0) - (b ?? 0);
  });
}

function cleanPayload(payload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined)
  );
}

async function fromSupabase(operation, fallback) {
  if (!supabase) {
    return fallback();
  }

  try {
    return await operation(supabase);
  } catch (error) {
    console.warn("Supabase unavailable, falling back to local db.json:", error.message);
    return fallback();
  }
}

function unwrap(result, action, collection) {
  if (result.error) {
    throw new Error(`Supabase ${action} failed for ${collection}: ${result.error.message}`);
  }

  return result.data;
}

export async function listRecords(collection, filters = {}) {
  ensureCollectionName(collection);

  return fromSupabase(
    async (client) => {
      let query = client.from(collection).select("*");
      for (const [key, value] of Object.entries(filters)) {
        query = query.eq(key, value);
      }
      query = query.order(DEFAULT_ORDER[collection] || "id", { ascending: true });
      return unwrap(await query, "select", collection);
    },
    async () => {
      const db = readLocalDb();
      return sortItems(applyFilters(db[collection] || [], filters), collection);
    }
  );
}

export async function getRecordById(collection, id) {
  ensureCollectionName(collection);

  return fromSupabase(
    async (client) => {
      const data = unwrap(
        await client.from(collection).select("*").eq("id", Number(id)).maybeSingle(),
        "select",
        collection
      );
      return data;
    },
    async () => {
      const db = readLocalDb();
      return (db[collection] || []).find((item) => Number(item.id) === Number(id)) || null;
    }
  );
}

export async function findRecord(collection, filters) {
  ensureCollectionName(collection);

  return fromSupabase(
    async (client) => {
      let query = client.from(collection).select("*");
      for (const [key, value] of Object.entries(filters)) {
        query = query.eq(key, value);
      }
      return unwrap(await query.limit(1).maybeSingle(), "select", collection);
    },
    async () => {
      const db = readLocalDb();
      return applyFilters(db[collection] || [], filters)[0] || null;
    }
  );
}

export async function insertRecord(collection, payload) {
  ensureCollectionName(collection);
  const cleaned = cleanPayload(payload);

  return fromSupabase(
    async (client) => {
      const data = unwrap(
        await client.from(collection).insert(cleaned).select("*").single(),
        "insert",
        collection
      );
      return data;
    },
    async () => {
      const db = readLocalDb();
      const record = {
        id: cleaned.id ?? nextLocalId(db[collection] || []),
        ...cleaned,
      };
      db[collection] = [...(db[collection] || []), record];
      writeLocalDb(db);
      return record;
    }
  );
}

export async function updateRecordById(collection, id, payload) {
  ensureCollectionName(collection);
  const cleaned = cleanPayload(payload);

  return fromSupabase(
    async (client) => {
      const data = unwrap(
        await client.from(collection).update(cleaned).eq("id", Number(id)).select("*").maybeSingle(),
        "update",
        collection
      );
      return data;
    },
    async () => {
      const db = readLocalDb();
      const items = db[collection] || [];
      const index = items.findIndex((item) => Number(item.id) === Number(id));
      if (index === -1) return null;

      const updated = { ...items[index], ...cleaned };
      items[index] = updated;
      db[collection] = items;
      writeLocalDb(db);
      return updated;
    }
  );
}

export async function deleteRecordById(collection, id) {
  ensureCollectionName(collection);

  return fromSupabase(
    async (client) => {
      const data = unwrap(
        await client.from(collection).delete().eq("id", Number(id)).select("*").maybeSingle(),
        "delete",
        collection
      );
      return data;
    },
    async () => {
      const db = readLocalDb();
      const items = db[collection] || [];
      const index = items.findIndex((item) => Number(item.id) === Number(id));
      if (index === -1) return null;

      const [deleted] = items.splice(index, 1);
      db[collection] = items;
      writeLocalDb(db);
      return deleted;
    }
  );
}

export async function getSnapshot(collections = COLLECTIONS) {
  return fromSupabase(
    async () => {
      const entries = await Promise.all(
        collections.map(async (collection) => [collection, await listRecords(collection)])
      );
      return Object.fromEntries(entries);
    },
    async () => {
      const db = readLocalDb();
      return Object.fromEntries(
        collections.map((collection) => [collection, sortItems(db[collection] || [], collection)])
      );
    }
  );
}
