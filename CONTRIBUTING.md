# Contributing

Thanks for your interest in claude-token-economy! This is a small, focused
project and contributions are very welcome.

## Ground rules

- **Keep the core dependency-free.** `packages/core` (the CLI + hooks) must have
  zero runtime npm dependencies. Electron lives only in `packages/overlay`.
- **Keep the tone playful, not cruel.** This is a productivity feedback tool
  dressed up as a classroom gimmick. Avoid framing it as "abusing" Claude.
- **Hooks must never block Claude.** Anything in `packages/core/src/hooks.js`
  must exit 0 and swallow errors — a broken ledger can't crash a session.

## Project layout

| Path | What |
|---|---|
| `packages/core/src/ledger.js` | atomic ledger read/append (foundation) |
| `packages/core/bin/treats.js` | CLI router |
| `packages/core/src/hooks.js` + `context.js` | hook adapters + context injection |
| `packages/overlay/main.js` | Electron tray + click-through overlay |
| `scripts/` | asset generators, hook/schedule installers, demo |

## Dev setup

```bash
npm install
npm run gen-assets          # synthesize sounds + tray icons
node packages/core/bin/treats.js install-hooks
npm run demo                # end-to-end walkthrough of the feedback loop
npm run overlay             # launch the Electron overlay
```

## Before you open a PR

1. Run `npm run demo` — it exercises reward/punish/undo/reset, both hooks, and
   the report card. It should complete without errors.
2. `node --check` any file you touched (there's no build step).
3. Keep changes scoped; describe the behavior change in the PR body.

## Reporting bugs / ideas

Use the issue templates. For bugs, include your macOS version, Node version, and
the output of `treats status --json`.
