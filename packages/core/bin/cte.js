#!/usr/bin/env node
import fs from "node:fs";
import { append, undoLast, resetLedger, loadLedger, loadState, ensureConfig } from "../src/ledger.js";
import { gradeFor, currentStreak, gpa } from "../src/grades.js";
import { buildReport, archiveReport } from "../src/report.js";
import { play, speak } from "../src/sound.js";
import { runHook } from "../src/hooks.js";

function usage() {
  return `cte — Claude Token Economy

Usage:
  cte reward [reason...]    Give Claude a token (+1) for good work
  cte punish [reason...]    Take a token (-1) for poor work
  cte undo                  Revert the most recent reward/punish entry
  cte reset --yes           Wipe the whole ledger (backs it up first)
  cte status [--json]       Show current balance, grade and last entry
  cte report [--out FILE]   Print (or write) a markdown report card
  cte report --archive      Write a date-stamped card to the reports archive
  cte hook <event>          Internal: Claude Code hook adapter
  cte install-hooks         Install hooks into ~/.claude/settings.json

Examples:
  cte reward wrote great tests and kept it concise
  cte punish ignored the lint errors again
  cte status --json
`;
}

function gradeLine(balance) {
  const g = gradeFor(balance);
  return `${g.emoji} ${g.name}`;
}

function cmdReward(args) {
  const reason = args.join(" ");
  // Attribute to the last finished task's session, if Stop recorded one.
  const sessionId = loadState().lastStopSessionId || null;
  const { balance } = append({ type: "reward", reason, sessionId });
  play("reward");
  console.log(`⭐ Reward recorded (+1). Balance: ${balance} — ${gradeLine(balance)}`);
  if (reason) console.log(`   Reason: ${reason}`);
}

function cmdPunish(args) {
  const reason = args.join(" ");
  const sessionId = loadState().lastStopSessionId || null;
  const { balance } = append({ type: "punish", reason, sessionId });
  play("punish");
  const grade = gradeFor(balance);
  console.log(`🚫 Punishment recorded (-1). Balance: ${balance} — ${grade.emoji} ${grade.name}`);
  if (reason) console.log(`   Reason: ${reason}`);
  // Audible scolding once Claude drops into Detention or worse.
  if (grade.tone === "warning" || grade.tone === "stern") {
    speak(`Detention. Balance is ${balance}.`);
  }
}

function cmdUndo() {
  const result = undoLast();
  if (!result) {
    console.log("Nothing to undo — ledger is empty.");
    return;
  }
  const { entry, balance } = result;
  const mark = entry.type === "reward" ? "reward (+1)" : "punishment (-1)";
  play("report");
  console.log(`↩️  Undid last ${mark}. Balance: ${balance} — ${gradeLine(balance)}`);
  if (entry.reason) console.log(`   Removed reason: ${entry.reason}`);
}

function cmdStatus(args) {
  const { entries, balance } = loadLedger();
  const grade = gradeFor(balance);
  const streak = currentStreak(entries);
  const last = entries[entries.length - 1];

  if (args.includes("--json")) {
    console.log(
      JSON.stringify({
        balance,
        grade: grade.name,
        emoji: grade.emoji,
        gpa: gpa(entries),
        streak,
        total: entries.length,
        last: last || null,
      }),
    );
    return;
  }

  console.log(`${grade.emoji} ${grade.name}  |  Balance: ${balance}  |  GPA: ${gpa(entries).toFixed(1)}`);
  if (streak.type) {
    console.log(`   Streak: ${streak.count} ${streak.type}(s) in a row`);
  }
  if (last) {
    const mark = last.type === "reward" ? "✓" : "✗";
    console.log(`   Last: ${mark} ${last.reason || "(no reason)"}`);
  } else {
    console.log("   No feedback recorded yet.");
  }
}

function cmdReport(args) {
  if (args.includes("--archive")) {
    const file = archiveReport();
    console.log(`Report archived to ${file}`);
    return;
  }
  const md = buildReport();
  const outIdx = args.indexOf("--out");
  if (outIdx !== -1 && args[outIdx + 1]) {
    fs.writeFileSync(args[outIdx + 1], md);
    console.log(`Report written to ${args[outIdx + 1]}`);
  } else {
    console.log(md);
  }
}

function cmdReset(args) {
  if (!args.includes("--yes")) {
    const { balance, entries } = loadLedger();
    console.log("⚠️  This wipes the entire ledger.");
    console.log(`   Current: ${entries.length} entries, balance ${balance}.`);
    console.log("   Re-run with --yes to confirm:  cte reset --yes");
    return;
  }
  const backup = resetLedger();
  console.log("🧹 Ledger reset. Fresh start — Balance: 0.");
  if (backup) console.log(`   Backup: ${backup}`);
}

async function main() {
  ensureConfig();
  const [cmd, ...args] = process.argv.slice(2);

  switch (cmd) {
    case "reward":
      cmdReward(args);
      break;
    case "punish":
      cmdPunish(args);
      break;
    case "undo":
      cmdUndo();
      break;
    case "reset":
      cmdReset(args);
      break;
    case "status":
      cmdStatus(args);
      break;
    case "report":
      cmdReport(args);
      break;
    case "hook":
      await runHook(args[0]);
      break;
    case "install-hooks": {
      const { installHooks } = await import("../../../scripts/install-hooks.js");
      installHooks();
      break;
    }
    case "help":
    case "--help":
    case "-h":
    case undefined:
      console.log(usage());
      break;
    default:
      console.error(`Unknown command: ${cmd}\n`);
      console.log(usage());
      process.exitCode = 1;
  }
}

main();
