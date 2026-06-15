// Tiny zero-dependency test harness. No frameworks, no deps — just collect
// tests with test(), assert with assert()/eq(), and run() them. Kept
// deliberately small so the test suite stays as cheap to run as the project.

const tests = [];
let passed = 0;
let failed = 0;

export function test(name, fn) {
  tests.push({ name, fn });
}

export function assert(cond, message = "assertion failed") {
  if (!cond) throw new Error(message);
}

// Deep-ish equality via JSON, which is plenty for the plain objects/arrays
// these tests deal with.
export function eq(actual, expected, message) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) throw new Error(message || `expected ${e}, got ${a}`);
}

export async function run() {
  for (const { name, fn } of tests) {
    try {
      await fn();
      passed++;
      console.log(`  ✓ ${name}`);
    } catch (err) {
      failed++;
      console.log(`  ✗ ${name}`);
      console.log(`      ${err.message}`);
    }
  }
  console.log(`\n${passed} passed, ${failed} failed`);
  return failed === 0;
}
