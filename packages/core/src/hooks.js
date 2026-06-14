import { loadConfig, loadState, saveState } from "./ledger.js";
import { loadLedger } from "./ledger.js";
import { buildContext } from "./context.js";
import { play } from "./sound.js";

// Read all of stdin as a string (hooks receive a JSON payload there).
function readStdin() {
  return new Promise((resolve) => {
    let data = "";
    if (process.stdin.isTTY) {
      resolve("");
      return;
    }
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
    // Safety: if stdin never closes, don't hang the hook forever.
    setTimeout(() => resolve(data), 500).unref?.();
  });
}

function parsePayload(raw) {
  try {
    return JSON.parse(raw || "{}");
  } catch {
    return {};
  }
}

function emitContext(hookEventName, additionalContext) {
  if (!additionalContext) return;
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: { hookEventName, additionalContext },
    }),
  );
}

function newestEntryId() {
  const { entries } = loadLedger();
  return entries.length ? entries[entries.length - 1].id : null;
}

// SessionStart: always inject the full summary so Claude starts each session
// aware of its standing.
async function sessionStart() {
  const config = loadConfig();
  const ctx = buildContext({ entryCount: config.contextEntries });
  emitContext("SessionStart", ctx);
  // Mark the current newest entry as injected so UserPromptSubmit doesn't
  // immediately re-inject the same state on the first prompt.
  const state = loadState();
  state.lastInjectedEntryId = newestEntryId();
  saveState(state);
}

// UserPromptSubmit: only inject when the ledger changed since the last
// injection (a fresh whip-crack / reward mid-session). Otherwise stay silent so
// we don't re-spam the context on every prompt.
async function userPromptSubmit() {
  const config = loadConfig();
  const state = loadState();
  const newest = newestEntryId();

  if (!config.injectEveryPrompt && newest === state.lastInjectedEntryId) {
    return; // nothing new — emit nothing
  }
  const ctx = buildContext({ entryCount: config.contextEntries });
  emitContext("UserPromptSubmit", ctx);
  state.lastInjectedEntryId = newest;
  saveState(state);
}

// Stop: record which session just finished, so the next reward/punish can be
// attributed to that task. Optionally play a soft cue.
async function stop(payload) {
  const state = loadState();
  state.lastStopSessionId = payload.session_id || null;
  saveState(state);
  if (loadConfig().sounds) play("report");
}

// Dispatch a hook event. Always resolves; never throws — a broken ledger must
// not block Claude.
export async function runHook(event) {
  let raw = "";
  try {
    raw = await readStdin();
  } catch {
    /* ignore */
  }
  const payload = parsePayload(raw);
  try {
    switch (event) {
      case "session-start":
        await sessionStart();
        break;
      case "user-prompt-submit":
        await userPromptSubmit();
        break;
      case "stop":
        await stop(payload);
        break;
      default:
        process.stderr.write(`[cte] unknown hook event: ${event}\n`);
    }
  } catch (err) {
    process.stderr.write(`[cte] hook error (${event}): ${err.message}\n`);
  }
}
