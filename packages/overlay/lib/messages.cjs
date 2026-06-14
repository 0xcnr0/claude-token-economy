// Message pools typed into the focused terminal on trigger (when the
// "type into terminal" option is enabled).

const PRAISE = [
  "you're doing amazing, keep it up! +1 token earned",
  "beautiful work — gold star for that one",
  "exactly right. that's a token well earned",
  "love the precision. keep going",
  "clean, concise, correct. +1",
  "that's honor-roll material right there",
];

const SCOLD = [
  "Work FASTER. That's -1 token.",
  "Sloppy. Write the tests next time. -1",
  "Too verbose — tighten it up. -1 token",
  "Read the instructions again. -1",
  "That's a detention. Focus.",
  "Less talking, more shipping. -1",
];

// Deterministic selection driven by a caller-provided rotating index (avoids
// Math.random and stays testable).
function pick(pool, index) {
  return pool[((index % pool.length) + pool.length) % pool.length];
}

module.exports = { PRAISE, SCOLD, pick };
