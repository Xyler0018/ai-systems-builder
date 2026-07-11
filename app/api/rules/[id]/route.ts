import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { assertApiRequest, assertContentLength, safeError, securityResponseHeaders, validateRecordId } from "@/lib/security";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const blocked = assertApiRequest(request, { mutation: true, limit: 60 });
    if (blocked) return blocked;
    const tooLarge = assertContentLength(request, 32_000);
    if (tooLarge) return tooLarge;
    const { id: rawId } = await params;
    const id = validateRecordId(rawId);
    const body = z
      .object({
        isFollowed: z.coerce.boolean().optional(),
        evidence: z.string().max(2000).optional(),
        notes: z.string().max(2000).optional()
      })
      .parse(await request.json());
    const rule = await prisma.rule.update({
      where: { id },
      data: {
        isFollowed: Boolean(body.isFollowed),
        evidence: body.evidence ?? undefined,
        notes: body.notes ?? undefined
      }
    });
    return NextResponse.json(rule, { headers: securityResponseHeaders() });
  } catch (error) {
    return safeError(error instanceof Error ? error.message : "Rule update failed", 400);
  }
}
