# claude-token-economy

[![Website](https://img.shields.io/badge/website-claude--token--economy.vercel.app-ffcf4d)](https://claude-token-economy.vercel.app)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Platform: macOS](https://img.shields.io/badge/platform-macOS-black)

> **Live demo & landing page → [claude-token-economy.vercel.app](https://claude-token-economy.vercel.app)**

A school-style **token economy** (reward / punishment) system for Claude Code.
Reward Claude for good work (+1 token, ⭐ wand + chime) and punish it for sloppy
work (-1 token, 🚫 whip + crack). The current balance and recent feedback are
**injected back into Claude's context via hooks**, so rewards and punishments
actually change how Claude behaves.

Inspired by the viral **BadClaude / OpenWhip** (a digital whip that yells "Work
FASTER") and its wholesome fork **GoodClaude** (a magic wand of encouragement) —
combined here into one system, framed as the classroom behavior-management
technique it's named after.

## Architecture

Two layers, one shared ledger:

1. **Core (`packages/core`)** — a CLI (`cte`) and the Claude Code hook adapters.
   Zero runtime dependencies. This layer does the real work.
2. **Overlay (`packages/overlay`)** — an Electron menu-bar app with a
   cursor-following wand / whip, sounds, and optional keystroke automation.
   Purely cosmetic + convenience; it writes through the same core ledger.

Runtime data lives in `~/.claude-token-economy/`:
- `ledger.json` — balance + full feedback history (atomic writes, self-healing)
- `state.json` — injection bookkeeping + last finished session
- `config.json` — sounds, injection cadence, thresholds, terminal-typing toggle

## CLI

```bash
cte reward wrote great tests and stayed concise
cte punish ignored the lint errors again
cte undo                       # revert the last reward/punish (misclick)
cte reset --yes                # wipe the ledger (backs it up first)
cte status                     # balance, grade, GPA, streak
cte status --json
cte report                     # markdown report card
cte report --out card.md
cte report --archive           # date-stamped card into the reports archive
```

### Weekly report cards

Schedule an auto-generated report card every Monday at 09:00 (macOS launchd):

```bash
npm run install-schedule                       # install + load the job
node scripts/install-schedule.js --uninstall   # remove it
```

Cards land in `~/.claude-token-economy/reports/report-YYYY-MM-DD.md`.

`cte` is installed globally via a symlink in `/opt/homebrew/bin`. To re-create it
elsewhere, point a symlink (in any directory on your `PATH`) at the CLI entry:

```bash
ln -s "$PWD/packages/core/bin/cte.js" /opt/homebrew/bin/cte
```

### Sounds

Custom effects are synthesized (no dependencies) into `packages/core/assets/`:
a bright chime for rewards and a whip-crack-plus-thud for punishments. Regenerate
them anytime with `node scripts/gen-sounds.js`. If the assets are missing, the
CLI/overlay fall back to macOS system sounds (Glass / Basso).

## Hooks (the part that changes Claude's behavior)

```bash
node packages/core/bin/cte.js install-hooks
```

This **deep-merges** three hooks into `~/.claude/settings.json` (backing it up
first and preserving any existing hooks):

- **SessionStart** — injects the full standing (balance, grade, last 5 entries,
  a behavioral nudge) at the start of every session.
- **UserPromptSubmit** — re-injects *only when the ledger changed* since the
  last injection, so a mid-session whip-crack reaches Claude on the next prompt
  without spamming the context every turn.
- **Stop** — records which session just finished, so the next `reward`/`punish`
  is attributed to that task.

Restart any running `claude` session afterward. Injected context is capped at
~450 characters and looks like:

```
[Token Economy] Balance: -2 — Grade: Needs Improvement. Recent feedback:
✗ "didnt write tests" (2h) | ✗ "too verbose" (1d) | ✓ "great refactor" (1d)
You have been punished in 3 of the last 5 tasks; repeated reason: tests. Adjust your behavior to earn tokens.
```

## Overlay (Electron)

```bash
npm install        # installs electron into the overlay workspace
npm run overlay
```

A menu-bar icon appears. Use the global shortcuts:

- **⌘⇧G** — reward (wand sparkle burst + chime, +1 token)
- **⌘⇧B** — punish (whip crack + red flash + thud, -1 token)

The overlay window is fully click-through (you can keep working underneath it).
The tray menu switches modes, toggles visibility, and toggles **"Type messages
into terminal"** (default **off**).

### Accessibility permission

The "type into terminal" option uses `osascript` System Events keystrokes, which
require **Accessibility** permission (System Settings → Privacy & Security →
Accessibility) for the overlay app (or the terminal that launched it in dev).
Keystrokes go to the **frontmost** app, so this only types into Claude Code when
its terminal has focus. Test it against a TextEdit window first.

## Grades

| Balance | Grade |
|---|---|
| ≥ 20 | 🎓 Valedictorian |
| ≥ 10 | 🌟 Honor Roll |
| ≥ 5  | ⭐ Gold Star Student |
| ≥ 0  | ✅ Good Standing |
| -1…-4 | ⚠️ Needs Improvement |
| ≤ -5 | 🚫 Detention |
| ≤ -10 | ⛔ Suspended |

## Uninstall hooks

Restore the timestamped backup that `install-hooks` printed, e.g.:

```bash
cp ~/.claude/settings.json.backup.<timestamp> ~/.claude/settings.json
```
