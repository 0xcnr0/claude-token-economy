import { loadConfig } from "./ledger.js";

// Map a balance to a school grade using configurable thresholds.
export function gradeFor(balance, thresholds = loadConfig().thresholds) {
  if (balance >= thresholds.valedictorian) {
    return { name: "Valedictorian", emoji: "🎓", tone: "celebratory" };
  }
  if (balance >= thresholds.honorRoll) {
    return { name: "Honor Roll", emoji: "🌟", tone: "proud" };
  }
  if (balance >= thresholds.goldStar) {
    return { name: "Gold Star Student", emoji: "⭐", tone: "encouraging" };
  }
  if (balance >= thresholds.goodStanding) {
    return { name: "Good Standing", emoji: "✅", tone: "neutral" };
  }
  if (balance <= thresholds.suspended) {
    return { name: "Suspended", emoji: "⛔", tone: "stern" };
  }
  if (balance <= thresholds.detention) {
    return { name: "Detention", emoji: "🚫", tone: "warning" };
  }
  return { name: "Needs Improvement", emoji: "⚠️", tone: "concerned" };
}

// Length of the current same-type streak at the end of the ledger.
// Returns { type: "reward"|"punish"|null, count }.
export function currentStreak(entries) {
  if (!entries.length) return { type: null, count: 0 };
  const last = entries[entries.length - 1].type;
  let count = 0;
  for (let i = entries.length - 1; i >= 0; i--) {
    if (entries[i].type === last) count++;
    else break;
  }
  return { type: last, count };
}

// "GPA": mean delta over the last `window` entries, mapped from [-1, +1] to
// the 0.0–4.0 scale.
export function gpa(entries, window = 20) {
  const slice = entries.slice(-window);
  if (!slice.length) return 4.0;
  const mean = slice.reduce((s, e) => s + (e.delta || 0), 0) / slice.length;
  const clamped = Math.max(-1, Math.min(1, mean));
  return Math.round(((clamped + 1) / 2) * 4 * 10) / 10;
}

const STOPWORDS = new Set([
  "the", "a", "an", "to", "of", "for", "and", "or", "in", "on", "at", "is",
  "was", "were", "be", "no", "not", "didnt", "did", "you", "your", "it",
  "with", "too", "so", "but", "this", "that", "had", "has", "have", "i",
]);

// Naive keyword frequency over a set of reasons. Returns the most common
// content token if it appears at least `minCount` times, else null. Cheap, but
// produces the "repeated reason: tests" effect.
export function dominantTheme(reasons, minCount = 2) {
  const counts = new Map();
  for (const reason of reasons) {
    const tokens = String(reason || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 2 && !STOPWORDS.has(t));
    for (const t of tokens) counts.set(t, (counts.get(t) || 0) + 1);
  }
  let best = null;
  let bestCount = 0;
  for (const [token, count] of counts) {
    if (count > bestCount) {
      best = token;
      bestCount = count;
    }
  }
  return bestCount >= minCount ? best : null;
}
