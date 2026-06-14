import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "./ledger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSET_DIR = path.resolve(__dirname, "../assets");

// Built-in macOS system sounds (in /System/Library/Sounds) — fallback when a
// custom synthesized asset isn't present.
const SYSTEM_SOUND = (name) => `/System/Library/Sounds/${name}.aiff`;

// Custom synthesized assets (see scripts/gen-sounds.js), keyed by sound name.
const CUSTOM = {
  reward: path.join(ASSET_DIR, "reward.wav"),
  punish: path.join(ASSET_DIR, "punish.wav"),
  levelUp: path.join(ASSET_DIR, "levelup.wav"),
};

const SYSTEM = {
  reward: SYSTEM_SOUND("Glass"),
  punish: SYSTEM_SOUND("Basso"),
  report: SYSTEM_SOUND("Tink"),
  levelUp: SYSTEM_SOUND("Hero"),
};

// Resolve a sound key to a file: prefer the custom asset, fall back to the
// system sound, and finally treat the key itself as a literal path.
function resolveSound(key) {
  if (CUSTOM[key] && fs.existsSync(CUSTOM[key])) return CUSTOM[key];
  if (SYSTEM[key]) return SYSTEM[key];
  return key;
}

export const SOUNDS = SYSTEM; // backward-compatible export

// Fire-and-forget audio: spawn detached + unref so the CLI exits immediately
// without waiting for playback.
export function play(key, { force = false } = {}) {
  if (!force && !loadConfig().sounds) return;
  const file = resolveSound(key);
  try {
    const child = spawn("afplay", [file], {
      detached: true,
      stdio: "ignore",
    });
    child.unref();
  } catch {
    /* afplay missing or failed — non-fatal */
  }
}

// Spoken warning via macOS `say`, also fire-and-forget.
export function speak(text, { force = false } = {}) {
  if (!force && !loadConfig().sounds) return;
  try {
    const child = spawn("say", [String(text)], {
      detached: true,
      stdio: "ignore",
    });
    child.unref();
  } catch {
    /* say missing or failed — non-fatal */
  }
}
