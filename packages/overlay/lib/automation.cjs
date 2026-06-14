const { spawn } = require("node:child_process");

// Escape a string for embedding inside an AppleScript double-quoted literal.
function escapeAppleScript(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

// Type `message` into the frontmost application via System Events, then press
// Return. Requires Accessibility permission for the app (or the launching
// terminal in dev). Keystrokes go to whatever app currently has focus — so the
// caller must ensure the Claude Code terminal is frontmost.
//
// Fire-and-forget: errors are swallowed (missing permission shouldn't crash the
// overlay). `sendInterrupt` first issues Ctrl-C (OpenWhip-style) before typing.
function typeIntoFocusedApp(message, { sendInterrupt = false } = {}) {
  const parts = [];
  if (sendInterrupt) {
    parts.push('keystroke "c" using control down');
    parts.push("delay 0.15");
  }
  parts.push(`keystroke "${escapeAppleScript(message)}"`);
  parts.push("keystroke return");

  const script = `tell application "System Events"\n${parts.join("\n")}\nend tell`;

  try {
    const child = spawn("osascript", ["-e", script], { stdio: "ignore" });
    child.on("error", () => {});
  } catch {
    /* osascript unavailable — non-fatal */
  }
}

module.exports = { typeIntoFocusedApp };
