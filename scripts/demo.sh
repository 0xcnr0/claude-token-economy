#!/usr/bin/env bash
# Walk through the full token-economy feedback loop end-to-end, demonstrating
# exactly what a live Claude Code session would receive via hooks.
#
# Run: npm run demo   (or: bash scripts/demo.sh)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CTE="node $ROOT/packages/core/bin/cte.js"

hr() { printf '\n\033[2m%s\033[0m\n' "────────────────────────────────────────────"; }
say() { printf '\033[1;36m▶ %s\033[0m\n' "$1"; }

hr; say "1. Starting from a clean slate"
$CTE reset --yes >/dev/null
$CTE status

hr; say "2. Claude does good work — reward it"
$CTE reward wrote thorough tests and kept the diff small

hr; say "3. Two slips — punish them"
$CTE punish skipped writing tests for the new module
$CTE punish response was far too verbose

hr; say "4. What a NEW Claude session sees (SessionStart hook injection):"
echo '{"session_id":"demo","cwd":"'"$PWD"'","hook_event_name":"SessionStart"}' \
  | $CTE hook session-start | node -e 'process.stdin.on("data",d=>{try{console.log(JSON.parse(d).hookSpecificOutput.additionalContext)}catch{process.stdout.write(d)}})'

hr; say "5. Mid-session: another punishment lands..."
$CTE punish ignored the lint errors again

hr; say "   ...the NEXT prompt re-injects automatically (UserPromptSubmit):"
echo '{"session_id":"demo","cwd":"'"$PWD"'","hook_event_name":"UserPromptSubmit"}' \
  | $CTE hook user-prompt-submit | node -e 'process.stdin.on("data",d=>{try{console.log(JSON.parse(d).hookSpecificOutput.additionalContext)}catch{process.stdout.write(d)}})'

hr; say "   ...but an UNCHANGED ledger stays silent (no context spam):"
out=$(echo '{}' | $CTE hook user-prompt-submit || true)
printf '   output: [%s]\n' "$out"

hr; say "6. Oops, that lint punishment was unfair — undo it"
$CTE undo

hr; say "7. The report card"
$CTE report

hr; say "Demo complete. Resetting to a clean slate."
$CTE reset --yes >/dev/null
