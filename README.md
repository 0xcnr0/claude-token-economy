# 🦴 Treats

[![Website](https://img.shields.io/badge/website-treats-ffcf4d)](https://treats-ai.vercel.app)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Platform](https://img.shields.io/badge/CLI-macOS%20%C2%B7%20Windows%20%C2%B7%20Linux-black)

> **A cute little pet that helps you train your AI.**
> Pet it with your mouse 🖐️ when your AI does good work, give it a stern look when
> it slips — and the AI actually pays attention and does better next time.
>
> **Live demo → [the website](https://treats-ai.vercel.app)**

## What is this?

You know those AI helpers that write code for you — like
[Claude Code](https://www.npmjs.com/package/@anthropic-ai/claude-code)? They're
great, but sometimes they get lazy (skip tests, ramble, ignore errors).

**Treats** gives you a tiny animal that sits in the corner of your screen. When
the AI nails it, you **pet the animal with your mouse** (or press one key) and it
gets a treat 🦴. When it slips, you give it a stern look. The cute part is the
front; the useful part is underneath: **your reaction is quietly handed back to
the AI**, so it remembers and tries harder.

> Nothing to memorize, no second window — just reach over and pet the little guy.

- Pet it → the score goes up.
- Scold it → the score goes down (low enough and it's in the "doghouse").
- Before the AI answers you next time, it quietly sees its score and what you were
  unhappy about. Scold it for skipping tests → next time it remembers, and writes
  them.

A "treat" isn't money or crypto — it's just a **point**, like a gold star in a
notebook. You're the trainer; the AI is the puppy.

Inspired by the viral whip/wand overlays (**BadClaude / OpenWhip** and
**GoodClaude**) — but those were pure theater; Claude never knew it got smacked.
Treats closes the loop: the feedback actually reaches Claude.

## The desktop pet (the cute way) 🖐️

A little animal sits in the corner of your screen. **Pet it with your mouse** (or
press one key) when Claude does well; **right-click to scold** when it doesn't.
It bounces, throws hearts, and quietly tells Claude how it's doing.

```bash
git clone https://github.com/0xcnr0/treats
cd treats
npm install
node packages/core/bin/treats.js install   # wire it into Claude Code
npm run pet                                 # 🐶 your pet appears, bottom-right (macOS)
```

- **Click / stroke** the pet → a treat (+1) 🦴
- **Right-click** the pet → bad dog (-1) 🚫
- **⌘⇧G / Ctrl+Shift+G** and **⌘⇧B / Ctrl+Shift+B** → same, from anywhere (no app focus needed)
- Drag it wherever you like. Switch animals from the menu-bar icon.

No commands to type, no second terminal — just pet the little guy when you're happy.

## The one-line install (no pet, just the feedback) — Claude Code plugin

Prefer zero setup? In any Claude Code session, run two lines once:

```
/plugin marketplace add 0xcnr0/treats
/plugin install treats
```

The feedback hooks wire up automatically. You react with optional slash commands
when you feel like it — no terminal, no clone, no npm:

```
/treats:good wrote thorough tests      /treats:bad skipped the edge cases
/treats:status   /treats:report   /treats:undo   /treats:animal cat   /treats:statusline
```

(`treats install` from source does the same wiring locally, plus the global
`treats` CLI and the `/treats:*` commands in `~/.claude/commands/`.)

## Pick your animal 🐶🐱🐉🐴🐹🦜🦊🐼🐸🐧🐰🐝

Your AI doesn't have to be a dog. `treats animal cat` (or `/treats:animal cat`)
and the whole thing re-themes — emojis, ranks and phrasing follow. A cat climbs
from *Fine Feline* to *Top Cat* (or lands at the *Spray Bottle*); a dragon grows
its hoard from *Hatchling* to *Elder Wyrm*. Twelve animals in all. Try them live
on the [website](https://treats-ai.vercel.app).

Want a different animal for one repo? `treats animal cat --here` sets it for the
current project only, leaving the global default alone. `treats animal default
--here` reverts that project to the global animal.

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

## It rewards good habits on its own 🎓

Beyond your manual pets, Treats nudges the AI toward genuinely better work:

- **Auto-treats from real outcomes.** When Claude runs your tests, linter or build
  and they **pass**, the pet automatically earns a treat (rate-limited so it can't
  farm them). So the AI learns: *running tests and keeping them green = treats.*
  Failing runs are left alone by default (a red test mid-development is normal) —
  flip on `autoScold` in `~/.treats/config.json` if you want failures to cost a
  treat and nudge Claude to fix them.
- **Good-habit skills.** It ships three skills the AI can reach for on its own:
  **plan-first** (sketch the approach before a multi-file change), **test-first**
  (cover changes with tests), and **self-review** (re-read the diff before saying
  "done"). They're framed as ways to *earn treats*, so the carrot points at better
  engineering.
- **Learned house rules.** The recurring reasons you scold a project for become
  standing rules injected at the start of every session there — e.g. scold "no
  tests" a few times and each new session opens with *"House rule: always write
  and run tests."* The score turns into an actual lesson.
- **Guard dog (opt-in).** Set `guardDog: true` in `~/.treats/config.json` and
  genuinely destructive commands (`rm -rf /`, `git push --force`, `git reset
  --hard`, fork bombs…) get blocked with a *"Bad dog!"* before they run.

All of the above are part of the plugin, or installed by `treats install` from source.

## One pet, many projects 📁

Run several Claude Code sessions across different projects at once? Treats scores
**each project separately** (by its git repo root). So:

- Each Claude session only ever sees **its own project's** standing — project A's
  score never leaks into project B.
- The desktop pet **follows the project you're currently working in** (the last
  session that sent a prompt), and shows its name under the score. Petting it
  credits *that* project.
- `treats status` shows the current folder's score; **`treats projects`** lists
  every project and its rank; `treats reset` clears just this project (or
  `--all`).

## The pet, in detail

`npm run pet` opens a small, draggable, always-on-top window with your animal.
It's alive: it **barks/meows/rawrs** (a synthesized per-animal voice) and pops a
speech bubble when you treat it, **whimpers** when scolded, hops and throws hearts,
**wiggles** on its own now and then, and curls up to **sleep 💤** after you've been
idle — waking the moment you touch it. The menu-bar icon shows the score, lets you
switch animal, and toggles an optional "type a message into the terminal" feature
(off by default; needs macOS Accessibility permission).

- **Click / stroke** → treat · **right-click** → scold · **drag** → move it
- **⌘⇧G / Ctrl+Shift+G**, **⌘⇧B / Ctrl+Shift+B** work from anywhere

> The CLI, hooks and sounds run on macOS, Windows and Linux. The pet (Electron)
> is developed on macOS first; it should run elsewhere too.

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

## Your animal in the status bar 🐶

Want to see your pet *inside* every Claude Code session? Install the status line:

```bash
npm run install-statusline       # adds it to ~/.claude/settings.json (backs up first)
```

Your animal then walks along the bottom status bar of the terminal Claude Code,
showing its treat count, rank, and the session's context usage — refreshed every
second, so it actually strolls back and forth:

```
🦴 ··🐶··  +3 treats · 🐶 Good Pup · ctx 18%
```

> This is the one spot a third-party tool can paint inside a Claude Code session
> (the terminal's status line). The mascot in the corner of the desktop/Antigravity
> GUI is Anthropic's own UI — there's no public hook to add ours there.

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

## Troubleshooting

Everything Treats touches lives in two places: your data and config in `~/.treats/`,
and the Claude Code hooks in `~/.claude/settings.json`. Most issues are one of those
two not being wired up. Quick checks:

- **The pet window doesn't appear.** `npm run pet` needs Electron and runs best on
  macOS. Make sure `npm install` finished without errors, then re-run `npm run pet`.
  The window is small, always-on-top and starts bottom-right — if it's hiding behind
  another window, drag it out. The score and animal also live in the menu-bar icon.
- **The ⌘⇧G / ⌘⇧B (Ctrl+Shift+G/B) shortcuts do nothing.** Another app may already
  own that global shortcut. Pet/right-click the animal directly to confirm scoring
  works, then free up the shortcut in the other app.
- **Claude doesn't seem to notice the feedback.** The hooks run on the *next* turn,
  not retroactively. Confirm they're installed by looking for a `Treats` entry in
  `~/.claude/settings.json` (or re-run `treats install-hooks`, which backs up first),
  then start a fresh prompt. The mid-session nudge only re-injects when the score has
  changed since Claude last saw it, so an unchanged score is silent by design.
- **The score didn't change, or changed the wrong project.** Treats scores each git
  repo separately. Run `treats status` in the project folder to see its standing, and
  `treats projects` to list them all. The desktop pet credits whichever project sent
  the last prompt — check the name shown under the score.
- **No sound.** Sounds are synthesized per-animal and can be toggled in
  `~/.treats/config.json` (`"sounds": false` to silence). Run `npm run gen-assets` if
  the sound/icon files are missing.
- **"Type a message into the terminal" does nothing (macOS).** That feature is off by
  default and needs Accessibility permission — grant your terminal/Electron app access
  under System Settings → Privacy & Security → Accessibility.
- **`~/.treats` is read-only or full.** Treats fails gracefully and keeps the pet
  running, but new treats won't be saved until the volume is writable again.

## Uninstall hooks

Restore the timestamped backup that `install-hooks` printed:

```bash
cp ~/.claude/settings.json.backup.<timestamp> ~/.claude/settings.json
```

## License

MIT — see [LICENSE](LICENSE). Not affiliated with Anthropic. The "bad dog" bit is
a playful way to give an AI feedback; be kind to real humans and real dogs. 🐶
