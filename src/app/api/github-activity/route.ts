import { NextResponse } from "next/server";
import { getGitHubActivity } from "@/lib/github";

export const dynamic = "force-dynamic";
export async function GET() {
  try { return NextResponse.json(await getGitHubActivity(), { headers: { "Cache-Control": "no-store" } }); }
  catch { return NextResponse.json({ error: "GitHub Activity indisponível" }, { status: 503, headers: { "Cache-Control": "no-store" } }); }
}
