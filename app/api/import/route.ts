import { NextRequest, NextResponse } from "next/server";
import { getDelegate } from "@/lib/data";
import { modules } from "@/lib/module-config";
import { normalizePayload } from "@/lib/mutations";
import {
  assertApiRequest,
  assertContentLength,
  rejectUnsafeKeys,
  safeError,
  securityResponseHeaders,
  validateRecordId
} from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    const blocked = assertApiRequest(request, { mutation: true, limit: 10 });
    if (blocked) return blocked;
    const tooLarge = assertContentLength(request, 1_000_000);
    if (tooLarge) return tooLarge;

    const body = (await request.json()) as {
      data?: Record<string, Record<string, unknown>[]>;
    };
    rejectUnsafeKeys(body);
    if (!body.data) {
      return safeError("Backup JSON must include a data object.", 400);
    }

    let imported = 0;
    const allowedModels = new Set(modules.map((module) => module.model));
    for (const key of Object.keys(body.data)) {
      if (!allowedModels.has(key)) return safeError(`Unknown backup object type: ${key}`, 400);
    }

    for (const moduleConfig of modules) {
      const rows = body.data[moduleConfig.model] ?? [];
      if (!Array.isArray(rows)) return safeError(`${moduleConfig.model} must be an array.`, 400);
      if (rows.length > 1000) return safeError(`${moduleConfig.model} contains too many records.`, 413);
      const delegate = getDelegate(moduleConfig.model);
      for (const row of rows) {
        const { createdAt: _createdAt, updatedAt: _updatedAt, ...data } = row;
        if (!data.id) continue;
        const id = validateRecordId(data.id);
        const normalized = normalizePayload(moduleConfig.model, data);
        await delegate.update({ where: { id }, data: normalized }).catch(async () => {
          await delegate.create({ data: { id, ...normalized } });
        });
        imported += 1;
      }
    }

    return NextResponse.json({ imported }, { headers: securityResponseHeaders() });
  } catch (error) {
    return safeError(error instanceof Error ? error.message : "Import failed", 400);
  }
}
