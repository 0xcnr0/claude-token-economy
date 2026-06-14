#!/usr/bin/env bash
# Walk through the full Treats feedback loop end-to-end, demonstrating exactly
# what a live Claude Code session would receive via hooks.
#
# Run: npm run demo   (or: bash scripts/demo.sh)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# Use a function so paths with spaces (e.g. ".../Claude main/...") are safe.
TREATS() { node "$ROOT/packages/core/bin/treats.js" "$@"; }

hr() { printf '\n\033[2m%s\033[0m\n' "────────────────────────────────────────────"; }
say() { printf '\033[1;36m▶ %s\033[0m\n' "$1"; }

hr; say "1. Starting from a clean slate"
TREATS reset --yes >/dev/null
TREATS status

hr; say "2. Claude does good work — give it a treat"
TREATS good wrote thorough tests and kept the diff small

hr; say "3. Two slips — bad dog"
TREATS bad skipped writing tests for the new module
TREATS bad response was far too verbose

hr; say "4. What a NEW Claude session sees (SessionStart hook injection):"
echo '{"session_id":"demo","cwd":"'"$PWD"'","hook_event_name":"SessionStart"}' \
  | TREATS hook session-start | node -e 'process.stdin.on("data",d=>{try{console.log(JSON.parse(d).hookSpecificOutput.additionalContext)}catch{process.stdout.write(d)}})'

hr; say "5. Mid-session: another scolding lands..."
TREATS bad ignored the lint errors again

hr; say "   ...the NEXT prompt re-injects automatically (UserPromptSubmit):"
echo '{"session_id":"demo","cwd":"'"$PWD"'","hook_event_name":"UserPromptSubmit"}' \
  | TREATS hook user-prompt-submit | node -e 'process.stdin.on("data",d=>{try{console.log(JSON.parse(d).hookSpecificOutput.additionalContext)}catch{process.stdout.write(d)}})'

hr; say "   ...but an UNCHANGED record stays silent (no context spam):"
out=$(echo '{}' | TREATS hook user-prompt-submit || true)
printf '   output: [%s]\n' "$out"

hr; say "6. Oops, that lint scolding was unfair — undo it"
TREATS undo

hr; say "7. The training report card"
TREATS report

hr; say "Demo complete. Resetting to a clean slate."
TREATS reset --yes >/dev/null
