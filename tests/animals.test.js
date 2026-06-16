// Unit tests for packages/core/src/animals.js. These are pure structural
// checks — no ledger, no ~/.treats — that guard the contract every animal must
// satisfy so newly added animals can't silently break grading or the pet UI.

import { test, assert, eq } from "./harness.js";
import { ANIMALS, DEFAULT_ANIMAL, getAnimal, animalKeys } from "../packages/core/src/animals.js";

// grades.js destructures exactly seven tiers in a fixed order
// ([vale, honor, gold, good, needs, bad, bottom]); fewer would leave a rank
// undefined, so this count is a hard contract.
const TIER_COUNT = 7;
const STRING_FIELDS = ["key", "label", "emoji", "treat", "voice", "give", "scold", "badPhrase", "speak"];

// --- per-animal shape ------------------------------------------------------

for (const [key, animal] of Object.entries(ANIMALS)) {
  test(`animal "${key}": key matches its map entry`, () => {
    eq(animal.key, key);
  });

  test(`animal "${key}": has all required string fields, non-empty`, () => {
    for (const field of STRING_FIELDS) {
      assert(typeof animal[field] === "string", `${key}.${field} should be a string`);
      assert(animal[field].length > 0, `${key}.${field} should not be empty`);
    }
  });

  test(`animal "${key}": has exactly ${TIER_COUNT} tiers, each with name + emoji`, () => {
    assert(Array.isArray(animal.tiers), `${key}.tiers should be an array`);
    eq(animal.tiers.length, TIER_COUNT, `${key} should have ${TIER_COUNT} tiers`);
    for (const tier of animal.tiers) {
      assert(typeof tier.name === "string" && tier.name.length > 0, `${key} tier name`);
      assert(typeof tier.emoji === "string" && tier.emoji.length > 0, `${key} tier emoji`);
    }
  });
}

// --- getAnimal -------------------------------------------------------------

test("getAnimal: returns the requested animal", () => {
  eq(getAnimal("cat").key, "cat");
  eq(getAnimal("dragon").key, "dragon");
});

test("getAnimal: falls back to the default for unknown keys", () => {
  eq(getAnimal("unicorn").key, DEFAULT_ANIMAL);
  eq(getAnimal(undefined).key, DEFAULT_ANIMAL);
  eq(getAnimal("").key, DEFAULT_ANIMAL);
});

test("getAnimal: the default animal exists", () => {
  assert(ANIMALS[DEFAULT_ANIMAL], "DEFAULT_ANIMAL must be a real animal");
});

// --- animalKeys ------------------------------------------------------------

test("animalKeys: lists every animal in ANIMALS", () => {
  eq(animalKeys(), Object.keys(ANIMALS));
});

test("animalKeys: includes the default and has no duplicates", () => {
  const keys = animalKeys();
  assert(keys.includes(DEFAULT_ANIMAL), "default animal should be listed");
  eq(keys.length, new Set(keys).size, "animal keys should be unique");
});
