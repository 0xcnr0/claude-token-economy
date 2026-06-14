# 🦴 Treats

[![Website](https://img.shields.io/badge/website-treats-ffcf4d)](https://claude-token-economy.vercel.app)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Platform: macOS](https://img.shields.io/badge/platform-macOS-black)

> **Train Claude Code like a puppy.** Give it a treat 🦴 for good work, a "bad dog" 🚫
> when it slips — and it actually behaves better next time.
>
> **Live demo → [the website](https://claude-token-economy.vercel.app)**

## What is this?

[Claude Code](https://www.npmjs.com/package/@anthropic-ai/claude-code) is an AI
assistant that writes code for you in the terminal. Sometimes it's brilliant;
sometimes it gets lazy (skips tests, rambles, ignores errors).

**Treats** is a tiny tool that sits on top of it. You reward good work and scold
bad work — and the magic part: **your feedback is fed back into Claude's
context**, so it remembers and adjusts.

- Give a treat → Claude's score goes up.
- Bad dog → score goes down (low enough and it's in the "doghouse").
- Every time you talk to Claude, it quietly sees its score and what you scolded
  it for. Scold it for "no tests" → its next reply knows `repeated reason: tests`
  → it writes the tests.

A "treat" isn't money or crypto — it's just a **point**, like a gold star in a
notebook. You're the trainer; Claude is the puppy.

Inspired by the viral whip/wand overlays (**BadClaude / OpenWhip** and
**GoodClaude**) — but those were pure theater; Claude never knew it got smacked.
Treats closes the loop: the feedback actually reaches Claude.

## Quick start

You need Claude Code + Node.js on a Mac.

```bash
git clone https://github.com/0xcnr0/treats
cd treats
npm install

# teach Claude Code to listen (backs up your settings first)
node packages/core/bin/treats.js install-hooks

# train your puppy 🦴
treats good "wrote thorough tests"
treats bad  "skipped the edge cases"

# optional menu-bar app (⌘⇧G treat · ⌘⇧B bad dog)
npm run overlay
```

Then start a **new** Claude Code session and ask it how many treats it has — it'll know.

> `treats` becomes a global command once installed (symlinked to your PATH).
> Internally `good` = `reward` and `bad` = `punish` (both spellings work).

## Commands

```bash
treats good  [reason...]   # +1 treat for good work
treats bad   [reason...]   # -1 (a scolding) for bad work
treats undo               # take back the last treat/scolding (misclick)
treats reset --yes        # wipe the record (backs it up first)
treats status [--json]    # treats, rank, obedience, last thing it did
treats report             # a markdown training report card
treats report --archive   # date-stamped card into the archive
```

## How it actually works (the feedback loop)

`treats install-hooks` adds three [Claude Code hooks](https://docs.anthropic.com/en/docs/claude-code/hooks)
to `~/.claude/settings.json` (backing it up first, keeping anything you already had):

- **SessionStart** — when a session begins, injects your current standing
  (treats, rank, last few notes, and a behavioral nudge) into Claude's context.
- **UserPromptSubmit** — re-injects *only when the score changed* since last time,
  so a mid-session scolding reaches Claude on its next reply without spamming it
  every message.
- **Stop** — remembers which task just finished, so the next `good`/`bad` is
  attributed to it.

What Claude receives looks like this (capped at ~450 chars):

```
[Treats] -2 treat(s) — Rank: Needs Training. Recent feedback:
✗ "skipped writing tests" (2h) | ✗ "too verbose" (1d) | ✓ "great refactor" (1d)
You've been a bad dog on 3 of the last 5 tasks; repeated reason: tests. Shape up to earn treats.
```

Everything lives in `~/.treats/` on your own machine — no accounts, no servers.

## The menu-bar app

```bash
npm run overlay
```

A bone 🦴 appears in your menu bar with your current score. Global shortcuts:

- **⌘⇧G** — give a treat (sparkle + chime, +1)
- **⌘⇧B** — bad dog (whip-crack + red flash, -1)

The overlay is fully click-through (keep working underneath it). The tray menu
switches modes, toggles visibility, and toggles **“type a message into the
terminal”** (default **off** — needs macOS Accessibility permission; keystrokes
go to whatever app is focused, so it only types into Claude Code when its
terminal is in front).

## Ranks

| Treats | Rank |
|---|---|
| 20+ | 🏆 Best Boy |
| 10+ | 🌟 Very Good Boy |
| 5+ | ⭐ Good Boy |
| 0+ | 🐶 Good Pup |
| -1 … -4 | ⚠️ Needs Training |
| -5 or less | 🚫 Bad Dog |
| -10 or less | ⛔ Doghouse |

## Weekly report cards

```bash
npm run install-schedule                       # Mondays 09:00 (macOS launchd)
node scripts/install-schedule.js --uninstall   # remove it
```

Cards land in `~/.treats/reports/report-YYYY-MM-DD.md`.

## See the whole loop

```bash
npm run demo
```

Walks through reward → scold → what Claude sees → mid-session update → undo →
report card, end to end.

## Project layout

| Path | What |
|---|---|
| `packages/core/src/ledger.js` | atomic score file read/append (the foundation) |
| `packages/core/bin/treats.js` | the `treats` CLI |
| `packages/core/src/hooks.js` + `context.js` | hook adapters + the note Claude reads |
| `packages/overlay/main.js` | menu-bar app + click-through overlay |
| `scripts/` | asset generators, hook/schedule installers, demo |

## Uninstall hooks

Restore the timestamped backup that `install-hooks` printed:

```bash
cp ~/.claude/settings.json.backup.<timestamp> ~/.claude/settings.json
```

## License

MIT — see [LICENSE](LICENSE). Not affiliated with Anthropic. The "bad dog" bit is
a playful way to give an AI feedback; be kind to real humans and real dogs. 🐶
