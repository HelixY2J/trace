import { NextResponse } from "next/server";
import { query, sql } from "../../../lib/db";
import { WorkflowSchema, type Workflow } from "../../../src/workflow/schema";

type ErrorResponse = { error: { code: string; message: string } };
type SaveResponse = { id: string } | ErrorResponse;
type LoadResponse = { workflow: Workflow | null } | ErrorResponse;

export async function POST(req: Request) {
  try {
    console.log("[/api/workflow] POST");
    const body = await req.json().catch(() => null);
    const parsed = WorkflowSchema.safeParse(body);
    if (!parsed.success) {
      const message =
        parsed.error.issues
          .map((i) => (i.path.length ? `${i.path.join(".")}: ${i.message}` : i.message))
          .join("; ") || "Invalid workflow";
      return NextResponse.json<ErrorResponse>({ error: { code: "BAD_REQUEST", message } }, { status: 400 });
    }

    const wf: Workflow = parsed.data;
    console.log(`[/api/workflow] Validated v${wf.version}, nodes=${Array.isArray((wf as any).nodes) ? (wf as any).nodes.length : 0}, edges=${Array.isArray((wf as any).edges) ? (wf as any).edges.length : 0}`);
    // Persist to DB
    const name = `Workflow v${wf.version}`;
    const res: any = await sql`
      INSERT INTO workflows (name, version, data)
      VALUES (${name}, ${wf.version}, ${JSON.stringify(wf)}::jsonb)
      RETURNING id
    `;
    const returnedId = Array.isArray(res) ? res[0]?.id : res?.rows?.[0]?.id;
    console.log(`[/api/workflow] Saved id=${returnedId}`);
    return NextResponse.json<SaveResponse>({ id: String(returnedId) }, { status: 200 });
  } catch (err: any) {
    console.error("[/api/workflow] ERROR:", err?.stack || err);
    const message = typeof err?.message === "string" ? err.message : "Failed to save workflow";
    return NextResponse.json<ErrorResponse>({ error: { code: "DB_ERROR", message } }, { status: 500 });
  }
}

export async function GET() {
  try {
    const rows = await query<{ data: Workflow }>(
      `SELECT data FROM workflows ORDER BY created_at DESC LIMIT 1`
    );
    const wf = rows[0]?.data ?? null;
    return NextResponse.json<LoadResponse>({ workflow: wf }, { status: 200 });
  } catch (err: any) {
    const message = typeof err?.message === "string" ? err.message : "Failed to load workflow";
    return NextResponse.json<ErrorResponse>({ error: { code: "DB_ERROR", message } }, { status: 500 });
  }
}


