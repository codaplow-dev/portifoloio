import { NextResponse } from "next/server";
import { getGitHubActivity } from "@/lib/github";

export const dynamic = "force-dynamic";
export async function GET() {
  try { return NextResponse.json(await getGitHubActivity(), { headers: { "Cache-Control": "no-store" } }); }
  catch (error) { if (process.env.NODE_ENV !== "production") console.error("[GitHub Activity]", error instanceof Error ? error.message : error); return NextResponse.json({ error: "GitHub Activity indisponível" }, { status: 503, headers: { "Cache-Control": "no-store" } }); }
}

