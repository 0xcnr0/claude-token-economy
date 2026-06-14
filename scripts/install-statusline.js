import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CLAUDE_SETTINGS_PATH } from "../packages/core/src/paths.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TREATS_BIN = path.resolve(__dirname, "../packages/core/bin/treats.js");

// Quote a path for safe shell use (the project path may contain spaces).
function shq(p) {
  return `'${String(p).replace(/'/g, "'\\''")}'`;
}

function readSettings() {
  if (!fs.existsSync(CLAUDE_SETTINGS_PATH)) return {};
  try {
    return JSON.parse(fs.readFileSync(CLAUDE_SETTINGS_PATH, "utf8"));
  } catch (err) {
    throw new Error(
      `~/.claude/settings.json exists but is not valid JSON (${err.message}). Refusing to overwrite.`,
    );
  }
}

export function installStatusline() {
  const settings = readSettings();
  const command = `${shq(process.execPath)} ${shq(TREATS_BIN)} statusline`;

  const previous = settings.statusLine;
  const alreadyOurs =
    previous && typeof previous.command === "string" && previous.command.includes("treats.js");

  // Back up before touching an existing settings file.
  let backupPath = null;
  if (fs.existsSync(CLAUDE_SETTINGS_PATH)) {
    backupPath = `${CLAUDE_SETTINGS_PATH}.backup.${Date.now()}`;
    fs.copyFileSync(CLAUDE_SETTINGS_PATH, backupPath);
  }

  settings.statusLine = {
    type: "command",
    command,
    refreshInterval: 1, // re-run every second so the animal "walks"
    padding: 0,
  };

  fs.mkdirSync(path.dirname(CLAUDE_SETTINGS_PATH), { recursive: true });
  fs.writeFileSync(CLAUDE_SETTINGS_PATH, JSON.stringify(settings, null, 2));

  console.log("🦴 Treats status line installed.");
  if (backupPath) console.log(`   Backup: ${backupPath}`);
  if (previous && !alreadyOurs) {
    console.log("   ⚠️  Replaced your existing statusLine (restore it from the backup if needed).");
    console.log(`   Previous command: ${previous.command || "(non-command type)"}`);
  }
  console.log("   Your animal now walks in Claude Code's status bar, with its treat count.");
  console.log("\nRestart any running `claude` session to see it.");
}
