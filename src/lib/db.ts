import { neon } from "@neondatabase/serverless";
import {
  DatabaseSchema,
  getInitialDatabaseSeed,
} from "@/data/initialStoreSeed";

export * from "@/data/initialStoreSeed";

function getNeonClient() {
  const rawUrl = process.env.DATABASE_URL?.trim();
  if (!rawUrl) {
    throw new Error("DATABASE_URL is not configured in environment variables.");
  }
  const parsed = new URL(rawUrl);
  parsed.searchParams.delete("channel_binding");
  return neon(parsed.toString());
}

/**
 * Reads the live store state directly from Neon Serverless PostgreSQL (`neondb`).
 */
export async function readDbAsync(): Promise<DatabaseSchema> {
  try {
    const sql = getNeonClient();
    const rows = await sql`
      SELECT value FROM store_kv WHERE key = 'store_state' LIMIT 1;
    `;
    if (rows.length > 0 && rows[0].value) {
      const val = rows[0].value;
      return typeof val === "string"
        ? (JSON.parse(val) as DatabaseSchema)
        : (val as DatabaseSchema);
    }
    return getInitialDatabaseSeed();
  } catch (err) {
    console.error("Neon readDbAsync error:", err);
    return getInitialDatabaseSeed();
  }
}

/**
 * Writes the updated store state directly to Neon Serverless PostgreSQL (`neondb`).
 */
export async function writeDbAsync(
  data: DatabaseSchema
): Promise<DatabaseSchema> {
  const sql = getNeonClient();
  const payload = JSON.stringify(data);
  await sql`
    INSERT INTO store_kv (key, value, updated_at)
    VALUES ('store_state', ${payload}::jsonb, NOW())
    ON CONFLICT (key) DO UPDATE
      SET value = EXCLUDED.value,
          updated_at = NOW();
  `;
  return data;
}
