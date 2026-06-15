// Zero-dependency test runner. Imports every *.test.js file in this directory,
// runs the collected tests, and exits non-zero if any fail.
//
//   node tests/run.js
//
import { readdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { run } from "./harness.js";

const dir = dirname(fileURLToPath(import.meta.url));
const files = readdirSync(dir)
  .filter((f) => f.endsWith(".test.js"))
  .sort();

for (const f of files) {
  await import(pathToFileURL(join(dir, f)).href);
}

const ok = await run();
process.exit(ok ? 0 : 1);
