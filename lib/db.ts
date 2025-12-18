"use server";
import "server-only";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

/**
 * Server-only Neon Postgres client, safe for serverless/edge runtimes.
 * Reads connection string from process.env.DATABASE_URL.
 *
 * Usage:
 *  - Template literal:
 *      const rows = await sql`select now()`;
 *  - Text + params:
 *      const rows = await query("select * from users where id = $1", [userId]);
 */
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  // Avoid throwing during import on build; fail fast at first query instead.
  // eslint-disable-next-line no-console
  console.warn("[db] DATABASE_URL is not set. Set it in your environment for Neon Postgres.");
}

// Create the fetch-based Neon client (edge-compatible)
const sql: NeonQueryFunction<any, any> = connectionString ? neon(connectionString) : (async () => {
  throw new Error("DATABASE_URL is not configured");
}) as unknown as NeonQueryFunction<any, any>;

/** Execute a parameterized query with text + params signature. */
async function query<T = unknown>(text: string, params?: any[]): Promise<T[]> {
  // The Neon client supports either tagged template or function(text, params[])
  // We call it as a function here for dynamic queries.
  return (await (sql as unknown as (t: string, p?: any[]) => Promise<T[]>)(text, params)) as T[];
}

export { sql, query };


