import { readFileSync } from "node:fs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_PRODUCTION_DB_TOOLS !== "true") {
    throw new Error("Refusing to run db:apply in production without ALLOW_PRODUCTION_DB_TOOLS=true.");
  }
  const sql = readFileSync("prisma/migration.sql", "utf8");
  const statements = sql
    .split(/;\s*(?:\r?\n|$)/)
    .map((statement) => statement.trim())
    .filter(Boolean)
    .filter((statement) => !statement.startsWith("warn "));

  for (const statement of statements) {
    await prisma.$executeRawUnsafe(statement);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
