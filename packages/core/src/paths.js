import os from "node:os";
import path from "node:path";

// Runtime data lives outside the repo, in the user's home dir, because hooks
// fire from any project cwd and the treat count should follow Claude everywhere.
export const DATA_DIR = path.join(os.homedir(), ".treats");

export const LEDGER_PATH = path.join(DATA_DIR, "ledger.json");
export const STATE_PATH = path.join(DATA_DIR, "state.json");
export const CONFIG_PATH = path.join(DATA_DIR, "config.json");

// Where `treats install-hooks` writes. Claude Code reads hooks from here.
export const CLAUDE_SETTINGS_PATH = path.join(
  os.homedir(),
  ".claude",
  "settings.json",
);
