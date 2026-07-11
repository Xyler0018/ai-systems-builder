import { NextRequest, NextResponse } from "next/server";
import { getBackup, getDelegate } from "@/lib/data";
import { modules } from "@/lib/module-config";
import { assertApiRequest, securityResponseHeaders } from "@/lib/security";
import { toCsv } from "@/lib/utils";

type Params = {
  params: Promise<{ type: string }>;
};

export async function GET(request: NextRequest, { params }: Params) {
  const blocked = assertApiRequest(request, { limit: 30 });
  if (blocked) return blocked;
  const { type } = await params;

  if (type === "backup") {
    return NextResponse.json({ version: 1, ...(await getBackup()) }, { headers: securityResponseHeaders() });
  }

  const mapping: Record<string, string> = {
    roadmap: "roadmapPhase",
    "daily-logs": "dailyLog",
    "weekly-reviews": "weeklyReview",
    projects: "project"
  };
  const model = mapping[type] ?? modules.find((module) => module.key === type)?.model;
  if (!model) return NextResponse.json({ error: "Unknown export type" }, { status: 404 });

  const rows = (await getDelegate(model).findMany()) as Record<string, unknown>[];
  const csv = type === "roadmap" || type === "backup-json" ? JSON.stringify(rows, null, 2) : toCsv(rows);

  return new NextResponse(csv, {
    headers: {
      ...securityResponseHeaders(),
      "content-type": type === "roadmap" ? "application/json" : "text/csv",
      "content-disposition": `attachment; filename="${type}.${type === "roadmap" ? "json" : "csv"}"`
    }
  });
}
