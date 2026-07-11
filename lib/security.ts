import { NextRequest, NextResponse } from "next/server";

const rateBuckets = new Map<string, { count: number; resetAt: number }>();
const localHosts = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

export function safeError(message = "Request failed", status = 400) {
  return NextResponse.json({ error: message }, { status, headers: securityResponseHeaders() });
}

export function securityResponseHeaders() {
  return {
    "cache-control": "no-store",
    "x-content-type-options": "nosniff"
  };
}

export function assertApiRequest(
  request: NextRequest,
  options: { mutation?: boolean; limit?: number; windowMs?: number } = {}
) {
  const host = request.headers.get("host") ?? "";
  const hostname = host.split(":")[0]?.toLowerCase();
  const isLocal = localHosts.has(hostname);
  const configuredToken = process.env.APP_ACCESS_TOKEN;
  const authHeader = request.headers.get("authorization") ?? "";
  const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const hasValidToken = Boolean(configuredToken && bearerToken && timingSafeEqual(configuredToken, bearerToken));

  if (!isLocal && !hasValidToken) {
    return safeError("Remote access is disabled unless APP_ACCESS_TOKEN is configured and supplied.", 403);
  }

  if (options.mutation) {
    const csrfError = assertSameOrigin(request);
    if (csrfError) return csrfError;
  }

  const limiterKey = `${request.method}:${clientKey(request)}:${request.nextUrl.pathname}`;
  const rateError = assertRateLimit(limiterKey, options.limit ?? 120, options.windowMs ?? 60_000);
  if (rateError) return rateError;

  return null;
}

export function assertContentLength(request: NextRequest, maxBytes: number) {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(length) && length > maxBytes) {
    return safeError("Request body is too large.", 413);
  }
  return null;
}

export function validateRecordId(value: unknown) {
  const id = String(value ?? "");
  if (!/^[a-zA-Z0-9_-]{6,120}$/.test(id)) {
    throw new Error("Invalid record id.");
  }
  return id;
}

export function rejectUnsafeKeys(value: unknown, depth = 0): void {
  if (depth > 8) throw new Error("Import data is too deeply nested.");
  if (!value || typeof value !== "object") return;
  for (const key of Object.keys(value)) {
    if (key === "__proto__" || key === "prototype" || key === "constructor") {
      throw new Error("Import contains unsafe object keys.");
    }
    rejectUnsafeKeys((value as Record<string, unknown>)[key], depth + 1);
  }
}

export function assertSafeUrl(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  const text = String(value).trim();
  if (text.length > 2048) throw new Error("URL is too long.");
  const url = new URL(text);
  if (!["https:", "http:"].includes(url.protocol)) {
    throw new Error("Only http and https URLs are allowed.");
  }
  return url.toString();
}

function assertSameOrigin(request: NextRequest) {
  const secFetchSite = request.headers.get("sec-fetch-site");
  if (secFetchSite === "cross-site") return safeError("Cross-site requests are not allowed.", 403);

  const host = request.headers.get("host");
  if (!host) return safeError("Missing host header.", 400);

  for (const headerName of ["origin", "referer"]) {
    const value = request.headers.get(headerName);
    if (!value) continue;
    try {
      const url = new URL(value);
      if (url.host !== host) return safeError("Request origin is not allowed.", 403);
    } catch {
      return safeError("Invalid origin header.", 400);
    }
  }
  return null;
}

function assertRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const current = rateBuckets.get(key);
  if (!current || current.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }
  current.count += 1;
  if (current.count > limit) {
    const retryAfter = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
    return NextResponse.json(
      { error: "Too many requests." },
      { status: 429, headers: { ...securityResponseHeaders(), "retry-after": String(retryAfter) } }
    );
  }
  return null;
}

function clientKey(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}

function timingSafeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return result === 0;
}
