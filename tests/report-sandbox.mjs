// Exercises archiveReport() against a sandbox HOME so the real ~/.treats is
// never touched. Run by tests/report.test.js in a child process with HOME
// pointed at a throwaway temp dir; prints a JSON result blob on stdout for the
// parent to assert on. Not named *.test.js, so the runner never picks it up.
import fs from "node:fs";
import { append, DATA_DIR } from "../packages/core/src/ledger.js";
import { archiveReport, REPORTS_DIR } from "../packages/core/src/report.js";

// Hard safety guard: if DATA_DIR somehow points outside the sandbox HOME, bail
// before writing anything rather than risk clobbering the real ledger.
if (!DATA_DIR.startsWith(process.env.HOME)) {
  process.stderr.write(
    `refusing to run: DATA_DIR ${DATA_DIR} is outside sandbox HOME ${process.env.HOME}\n`,
  );
  process.exit(2);
}

// Seed three projects worth of feedback.
append({ type: "reward", project: "/proj/alpha" });
append({ type: "punish", project: "/proj/beta" });
append({ type: "reward", project: "/proj/beta" });
append({ type: "reward", project: "/work/gamma" });

const out = {};

// A fixed date keeps the stamped filenames deterministic.
const files = archiveReport(new Date("2026-06-16T12:00:00Z"));
out.count = files.length; // one card per project
out.allExist = files.every((f) => fs.existsSync(f));
out.allStamped = files.every((f) => f.includes("report-2026-06-16-"));
out.allInReportsDir = files.every((f) => f.startsWith(REPORTS_DIR));
out.uniquePaths = new Set(files).size === files.length;
// Each archived card should name its project.
const alpha = files.find((f) => f.includes("alpha"));
out.alphaWritten = !!alpha && fs.readFileSync(alpha, "utf8").includes("alpha");

process.stdout.write(JSON.stringify(out));
