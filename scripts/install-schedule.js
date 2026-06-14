// Install (or remove) a weekly launchd job that archives a report card every
// Monday at 09:00. Usage:
//   node scripts/install-schedule.js            # install + load
//   node scripts/install-schedule.js --uninstall
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CTE_BIN = path.resolve(__dirname, "../packages/core/bin/treats.js");
const NODE = process.execPath;

const LABEL = "com.treats.weekly-report";
const PLIST_PATH = path.join(
  os.homedir(),
  "Library",
  "LaunchAgents",
  `${LABEL}.plist`,
);

function plistContents() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>${LABEL}</string>
    <key>ProgramArguments</key>
    <array>
        <string>${NODE}</string>
        <string>${CTE_BIN}</string>
        <string>report</string>
        <string>--archive</string>
    </array>
    <key>StartCalendarInterval</key>
    <dict>
        <key>Weekday</key>
        <integer>1</integer>
        <key>Hour</key>
        <integer>9</integer>
        <key>Minute</key>
        <integer>0</integer>
    </dict>
    <key>StandardErrorPath</key>
    <string>${path.join(os.homedir(), ".treats", "schedule.log")}</string>
    <key>RunAtLoad</key>
    <false/>
</dict>
</plist>
`;
}

const uninstall = process.argv.includes("--uninstall");

if (uninstall) {
  spawnSync("launchctl", ["unload", PLIST_PATH], { stdio: "ignore" });
  if (fs.existsSync(PLIST_PATH)) fs.rmSync(PLIST_PATH);
  console.log(`🗑️  Removed weekly report job (${LABEL}).`);
  process.exit(0);
}

fs.mkdirSync(path.dirname(PLIST_PATH), { recursive: true });
fs.writeFileSync(PLIST_PATH, plistContents());

// Reload: unload first (ignore errors), then load.
spawnSync("launchctl", ["unload", PLIST_PATH], { stdio: "ignore" });
const res = spawnSync("launchctl", ["load", PLIST_PATH], { encoding: "utf8" });

console.log("📅 Weekly report card scheduled (Mondays 09:00).");
console.log(`   Plist:   ${PLIST_PATH}`);
console.log(`   Output:  ~/.treats/reports/report-YYYY-MM-DD.md`);
if (res.status !== 0 && res.stderr) {
  console.log(`   launchctl: ${res.stderr.trim()}`);
}
console.log("\nUninstall with:  node scripts/install-schedule.js --uninstall");
