import { NextRequest, NextResponse } from "next/server";

const localHosts = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const hostname = host.split(":")[0]?.toLowerCase();
  const isLocal = localHosts.has(hostname);

  if (isLocal) return NextResponse.next();

  const configuredToken = process.env.APP_ACCESS_TOKEN;
  const authHeader = request.headers.get("authorization") ?? "";
  const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (configuredToken && bearerToken && configuredToken === bearerToken) {
    return NextResponse.next();
  }

  return NextResponse.json(
    { error: "Remote access is disabled for this local-first application." },
    { status: 403, headers: { "cache-control": "no-store", "x-content-type-options": "nosniff" } }
  );
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
