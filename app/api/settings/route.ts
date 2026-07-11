import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { assertApiRequest, assertContentLength, assertSafeUrl, safeError, securityResponseHeaders } from "@/lib/security";

const settingsSchema = z.object({
  currentWeek: z.union([z.coerce.number().int().min(1).max(24), z.literal(""), z.null()]).optional(),
  currentMonth: z.union([z.coerce.number().int().min(1).max(12), z.literal(""), z.null()]).optional(),
  weeklyTargetHours: z.coerce.number().min(0).max(80).default(12),
  studyDaysPerWeek: z.coerce.number().int().min(0).max(7).default(5),
  githubProfileUrl: z.union([z.string().max(2048), z.literal(""), z.null()]).optional(),
  mainRepositoryUrl: z.union([z.string().max(2048), z.literal(""), z.null()]).optional(),
  ninetyDayLock: z.coerce.boolean().default(true)
});

export async function PATCH(request: NextRequest) {
  try {
    const blocked = assertApiRequest(request, { mutation: true, limit: 30 });
    if (blocked) return blocked;
    const tooLarge = assertContentLength(request, 32_000);
    if (tooLarge) return tooLarge;
    const body = settingsSchema.parse(await request.json());
    const githubProfileUrl = body.githubProfileUrl ? assertSafeUrl(body.githubProfileUrl) : null;
    const mainRepositoryUrl = body.mainRepositoryUrl ? assertSafeUrl(body.mainRepositoryUrl) : null;
    const settings = await prisma.userSettings.upsert({
      where: { id: "default-settings" },
      update: {
        currentWeek: body.currentWeek === "" || body.currentWeek === null ? null : Number(body.currentWeek ?? 1),
        currentMonth: body.currentMonth === "" || body.currentMonth === null ? null : Number(body.currentMonth ?? 1),
        weeklyTargetHours: body.weeklyTargetHours,
        studyDaysPerWeek: body.studyDaysPerWeek,
        githubProfileUrl,
        mainRepositoryUrl,
        ninetyDayLock: body.ninetyDayLock
      },
      create: {
        id: "default-settings",
        currentWeek: body.currentWeek === "" || body.currentWeek === null ? null : Number(body.currentWeek ?? 1),
        currentMonth: body.currentMonth === "" || body.currentMonth === null ? null : Number(body.currentMonth ?? 1),
        weeklyTargetHours: body.weeklyTargetHours,
        studyDaysPerWeek: body.studyDaysPerWeek,
        githubProfileUrl,
        mainRepositoryUrl,
        ninetyDayLock: body.ninetyDayLock
      }
    });
    return NextResponse.json(settings, { headers: securityResponseHeaders() });
  } catch (error) {
    return safeError(error instanceof Error ? error.message : "Settings update failed", 400);
  }
}
