import { z } from "zod";
import { modules, type FieldConfig } from "@/lib/module-config";
import { assertSafeUrl, validateRecordId } from "@/lib/security";
import { clamp } from "@/lib/utils";

export const payloadSchema = z.record(z.unknown());

export function normalizePayload(model: string, raw: Record<string, unknown>) {
  const moduleConfig = modules.find((item) => item.model === model);
  if (!moduleConfig) throw new Error("Unknown module");

  const data: Record<string, unknown> = {};
  for (const field of moduleConfig.fields) {
    data[field.name] = normalizeField(field, raw[field.name]);
  }

  if (model === "dailyLog") {
    const review = Number(data.reviewMinutes ?? 0);
    const learning = Number(data.learningMinutes ?? 0);
    const building = Number(data.buildingMinutes ?? 0);
    const debugging = Number(data.debuggingMinutes ?? 0);
    const total = review + learning + building + debugging;
    data.totalMinutes = total;
    data.buildRatio = total > 0 ? Number((building / total).toFixed(2)) : 0;
    data.dailyProofStatus = data.proofUrl || data.commitUrl || data.githubCommitDone ? "Verified" : total > 0 ? "Missing" : "Missing";
  }

  for (const key of ["progress", "confidencePercent", "dailyScore", "weeklyScore", "score"]) {
    if (typeof data[key] === "number") {
      data[key] = clamp(Number(data[key]), 0, key.includes("Score") || key === "score" ? 10 : 100);
    }
  }

  return data;
}

function normalizeField(field: FieldConfig, value: unknown) {
  if (value === "" || value === undefined || value === null) {
    if (field.type === "boolean") return false;
    if (field.type === "number") return 0;
    return null;
  }

  if (field.type === "number") {
    const number = Number(value);
    if (!Number.isFinite(number)) throw new Error(`${field.label} must be a finite number.`);
    return Math.max(0, number);
  }
  if (field.type === "boolean") return Boolean(value);
  if (field.type === "date") {
    const date = new Date(String(value));
    if (Number.isNaN(date.getTime())) throw new Error(`${field.label} must be a valid date.`);
    return date;
  }
  if (field.type === "select" && field.options?.length) {
    const text = String(value);
    if (!field.options.includes(text)) throw new Error(`${field.label} has an invalid value.`);
    return text;
  }
  if (field.type === "relation") return validateRecordId(value);
  if (field.type === "url") return assertSafeUrl(value);
  const text = String(value);
  if (text.length > 5000) throw new Error(`${field.label} is too long.`);
  return text;
}
