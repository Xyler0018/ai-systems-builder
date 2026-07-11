import { toCsv } from "../lib/utils";

const baseUrl = process.env.APP_URL ?? "http://127.0.0.1:3001";

async function request(path: string, init?: RequestInit) {
  return fetch(`${baseUrl}${path}`, {
    headers: { "content-type": "application/json", ...(init?.headers ?? {}) },
    ...init
  });
}

async function main() {
  const checks: Array<[string, boolean]> = [];

  const crossSite = await request("/api/settings", {
    method: "PATCH",
    headers: { origin: "https://attacker.example", "sec-fetch-site": "cross-site" },
    body: JSON.stringify({})
  });
  checks.push(["cross-site mutation rejected", crossSite.status === 403]);

  const badUrl = await request("/api/records/project", {
    method: "POST",
    body: JSON.stringify({
      name: "Security Smoke URL",
      category: "Test",
      description: "Test",
      technicalStack: "Test",
      githubUrl: "javascript:alert(1)"
    })
  });
  checks.push(["dangerous URL rejected", badUrl.status === 400]);

  const prototypeImport = await request("/api/import", {
    method: "POST",
    body: JSON.stringify({ data: { project: [{ id: "abc123456", name: "x", "__proto__": { polluted: true } }] } })
  });
  checks.push(["prototype pollution import rejected", prototypeImport.status === 400]);

  const csv = toCsv([{ name: "=HYPERLINK(\"https://attacker.example\")" }]);
  checks.push(["csv formula neutralized", csv.includes("'=HYPERLINK")]);

  const backup = await request("/api/export/backup");
  checks.push(["local backup export still works", backup.status === 200]);

  const failed = checks.filter(([, ok]) => !ok);
  for (const [name, ok] of checks) {
    console.log(`${ok ? "PASS" : "FAIL"} ${name}`);
  }
  if (failed.length) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
