import { NextRequest, NextResponse } from "next/server";
import { getDelegate } from "@/lib/data";
import { normalizePayload, payloadSchema } from "@/lib/mutations";
import { assertApiRequest, assertContentLength, safeError, securityResponseHeaders, validateRecordId } from "@/lib/security";

type Params = {
  params: Promise<{ model: string }>;
};

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const blocked = assertApiRequest(request, { mutation: true, limit: 60 });
    if (blocked) return blocked;
    const tooLarge = assertContentLength(request, 128_000);
    if (tooLarge) return tooLarge;
    const { model } = await params;
    const raw = payloadSchema.parse(await request.json());
    const data = normalizePayload(model, raw);
    const record = await getDelegate(model).create({ data });
    return NextResponse.json(record, { headers: securityResponseHeaders() });
  } catch (error) {
    return safeError(error instanceof Error ? error.message : "Create failed", 400);
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const blocked = assertApiRequest(request, { mutation: true, limit: 90 });
    if (blocked) return blocked;
    const tooLarge = assertContentLength(request, 128_000);
    if (tooLarge) return tooLarge;
    const { model } = await params;
    const body = payloadSchema.parse(await request.json());
    const id = validateRecordId(body.id);
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const { id: _id, ...raw } = body;
    const data = normalizePayload(model, raw);
    const record = await getDelegate(model).update({ where: { id }, data });
    return NextResponse.json(record, { headers: securityResponseHeaders() });
  } catch (error) {
    return safeError(error instanceof Error ? error.message : "Update failed", 400);
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const blocked = assertApiRequest(request, { mutation: true, limit: 30 });
    if (blocked) return blocked;
    const { model } = await params;
    const id = validateRecordId(request.nextUrl.searchParams.get("id"));
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    await getDelegate(model).delete({ where: { id } });
    return NextResponse.json({ ok: true }, { headers: securityResponseHeaders() });
  } catch (error) {
    return safeError(error instanceof Error ? error.message : "Delete failed", 400);
  }
}
