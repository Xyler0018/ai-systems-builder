import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

const databasePath = process.env.DOCKER_SQLITE_PATH ?? "/app/data/dev.db";
const shouldInitialize = !existsSync(databasePath);

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit", shell: process.platform === "win32" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

if (shouldInitialize) {
  console.log("Initializing SQLite database...");
  run("npm", ["run", "db:apply"]);
  run("npm", ["run", "seed"]);
}

run("npm", ["run", "start"]);
