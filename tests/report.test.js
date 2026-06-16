// Unit tests for packages/core/src/report.js.
//
// archiveReport() writes one card per project into ~/.treats/reports, so it is
// exercised in a child process with HOME pointed at a throwaway temp dir — the
// real archive is never touched. See report-sandbox.mjs.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test, assert, eq } from "./harness.js";

test("archiveReport writes one card per project (sandboxed HOME)", () => {
  // A throwaway HOME so the child's ~/.treats lives entirely in a temp dir.
  const home = fs.mkdtempSync(path.join(os.tmpdir(), "cte-home-"));
  assert(home.startsWith(os.tmpdir()), "sandbox HOME must be under tmpdir");
  try {
    const fixture = fileURLToPath(new URL("./report-sandbox.mjs", import.meta.url));
    const stdout = execFileSync(process.execPath, [fixture], {
      env: { ...process.env, HOME: home },
      encoding: "utf8",
    });
    eq(JSON.parse(stdout), {
      count: 3,
      allExist: true,
      allStamped: true,
      allInReportsDir: true,
      uniquePaths: true,
      alphaWritten: true,
    });
  } finally {
    fs.rmSync(home, { recursive: true, force: true });
  }
});
