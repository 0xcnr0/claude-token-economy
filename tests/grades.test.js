// Unit tests for packages/core/src/grades.js. gradeFor() takes an explicit cfg,
// so these run without touching the real ledger or ~/.treats.

import { test, assert, eq } from "./harness.js";
import {
  gradeFor,
  currentStreak,
  gpa,
  dominantTheme,
  topThemes,
} from "../packages/core/src/grades.js";

// Default thresholds + the dog animal's tier names.
const cfg = {
  animal: "dog",
  thresholds: {
    valedictorian: 20,
    honorRoll: 10,
    goldStar: 5,
    goodStanding: 0,
    detention: -5,
    suspended: -10,
  },
};

const grade = (balance) => gradeFor(balance, cfg);

// --- gradeFor thresholds ---------------------------------------------------

test("gradeFor: valedictorian at/above top threshold", () => {
  eq(grade(25).name, "Best Boy");
  eq(grade(20).name, "Best Boy");
  eq(grade(25).tone, "celebratory");
});

test("gradeFor: honor roll band", () => {
  eq(grade(15).name, "Very Good Boy");
  eq(grade(10).name, "Very Good Boy");
  eq(grade(15).tone, "proud");
});

test("gradeFor: gold star band", () => {
  eq(grade(7).name, "Good Boy");
  eq(grade(5).name, "Good Boy");
  eq(grade(7).tone, "encouraging");
});

test("gradeFor: good standing at zero", () => {
  eq(grade(2).name, "Good Pup");
  eq(grade(0).name, "Good Pup");
  eq(grade(0).tone, "neutral");
});

test("gradeFor: needs training between standing and detention", () => {
  eq(grade(-3).name, "Needs Training");
  eq(grade(-3).tone, "concerned");
});

test("gradeFor: detention band (boundary inclusive)", () => {
  eq(grade(-5).name, "Bad Dog");
  eq(grade(-7).name, "Bad Dog");
  eq(grade(-5).tone, "warning");
});

test("gradeFor: suspended at/below bottom threshold", () => {
  eq(grade(-10).name, "Doghouse");
  eq(grade(-12).name, "Doghouse");
  eq(grade(-10).tone, "stern");
});

test("gradeFor: animal theming follows cfg.animal", () => {
  const catCfg = { ...cfg, animal: "cat" };
  eq(gradeFor(25, catCfg).name, "Top Cat");
  eq(gradeFor(-10, catCfg).name, "Spray Bottle");
});

// --- currentStreak ---------------------------------------------------------

test("currentStreak: empty ledger", () => {
  eq(currentStreak([]), { type: null, count: 0 });
});

test("currentStreak: single entry", () => {
  eq(currentStreak([{ type: "reward" }]), { type: "reward", count: 1 });
});

test("currentStreak: counts only the trailing same-type run", () => {
  const entries = [
    { type: "reward" },
    { type: "punish" },
    { type: "punish" },
  ];
  eq(currentStreak(entries), { type: "punish", count: 2 });
});

test("currentStreak: all same type", () => {
  const entries = [{ type: "reward" }, { type: "reward" }, { type: "reward" }];
  eq(currentStreak(entries), { type: "reward", count: 3 });
});

// --- gpa -------------------------------------------------------------------

test("gpa: empty ledger is a perfect 4.0", () => {
  eq(gpa([]), 4.0);
});

test("gpa: all positive deltas max out at 4.0", () => {
  eq(gpa([{ delta: 1 }, { delta: 1 }, { delta: 1 }]), 4.0);
});

test("gpa: all negative deltas bottom out at 0.0", () => {
  eq(gpa([{ delta: -1 }, { delta: -1 }]), 0.0);
});

test("gpa: balanced deltas land at the 2.0 midpoint", () => {
  eq(gpa([{ delta: 1 }, { delta: -1 }]), 2.0);
});

test("gpa: rounds to one decimal", () => {
  // mean = 0.5 -> (0.5 + 1) / 2 * 4 = 3.0
  eq(gpa([{ delta: 1 }, { delta: 0 }]), 3.0);
});

test("gpa: only the last `window` entries count", () => {
  const entries = [{ delta: -1 }, { delta: -1 }, { delta: 1 }, { delta: 1 }];
  eq(gpa(entries, 2), 4.0);
});

test("gpa: missing delta treated as zero", () => {
  eq(gpa([{}, {}]), 2.0);
});

// --- dominantTheme ---------------------------------------------------------

test("dominantTheme: returns the most repeated content token", () => {
  const reasons = ["fixed the tests", "tests passed", "ran tests"];
  eq(dominantTheme(reasons), "tests");
});

test("dominantTheme: null when nothing meets minCount", () => {
  eq(dominantTheme(["good job"]), null);
});

test("dominantTheme: filters stopwords", () => {
  eq(dominantTheme(["you did the work", "the work again"]), "work");
});

test("dominantTheme: respects custom minCount", () => {
  eq(dominantTheme(["tests", "tests"], 3), null);
  eq(dominantTheme(["tests", "tests"], 2), "tests");
});

// --- topThemes -------------------------------------------------------------

test("topThemes: returns recurring tokens sorted by frequency", () => {
  const reasons = ["tests failed", "tests again", "lint error", "lint bad"];
  eq(topThemes(reasons), ["tests", "lint"]);
});

test("topThemes: empty input yields empty array", () => {
  eq(topThemes([]), []);
});

test("topThemes: respects n cap", () => {
  const reasons = ["foo foo", "bar bar", "baz baz", "qux qux"];
  eq(topThemes(reasons, 2).length, 2);
});

test("topThemes: drops tokens below minCount", () => {
  eq(topThemes(["only once here"]), []);
});
