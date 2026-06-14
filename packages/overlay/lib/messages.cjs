// Message pools typed into the focused terminal on trigger (when the
// "type into terminal" option is enabled).

const PRAISE = [
  "good boy! here's a treat 🦴 +1",
  "who's a good boy? you are. +1 treat",
  "beautiful work — treat earned 🦴",
  "exactly right. good boy! +1",
  "clean, concise, correct. have a treat 🦴",
  "such a good pup. keep it up! +1",
];

const SCOLD = [
  "Bad dog! Write the tests next time. -1",
  "No. Sloppy work — that's a scolding. -1",
  "Too verbose — tighten it up. Bad dog. -1",
  "Read the instructions again. -1 treat",
  "That's a time-out. Focus. -1",
  "Bad dog! Less talking, more shipping. -1",
];

// Deterministic selection driven by a caller-provided rotating index (avoids
// Math.random and stays testable).
function pick(pool, index) {
  return pool[((index % pool.length) + pool.length) % pool.length];
}

module.exports = { PRAISE, SCOLD, pick };
