import { readFileSync } from "fs";
import { resolve } from "path";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const dbPath = resolve(process.cwd(), "db.json");
const source = JSON.parse(readFileSync(dbPath, "utf8"));
const collections = [
  "users",
  "patients",
  "prescriptions",
  "alerts",
  "appointments",
  "logs",
  "reports",
  "devices",
];

for (const collection of collections) {
  const records = source[collection] || [];
  if (records.length === 0) continue;

  const { error } = await supabase.from(collection).upsert(records, { onConflict: "id" });
  if (error) {
    throw new Error(`Failed to sync ${collection}: ${error.message}`);
  }

  console.log(`Synced ${records.length} records into ${collection}`);
}

console.log("Supabase sync complete.");
