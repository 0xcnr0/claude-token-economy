// Synthesize the token-economy sound effects as 16-bit mono WAV files, with no
// external dependencies. Run: node scripts/gen-sounds.js
//
// Produces, in packages/core/assets/:
//   reward.wav   — bright ascending chime (gold-star "ding")
//   punish.wav   — whip crack: sharp noise transient + low thud
//   levelup.wav  — short three-note fanfare
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "../packages/core/assets");

const RATE = 44100;

// Build a Float32 sample buffer, then encode to a 16-bit PCM WAV.
function encodeWav(samples) {
  const n = samples.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16); // PCM chunk size
  buf.writeUInt16LE(1, 20); // PCM format
  buf.writeUInt16LE(1, 22); // mono
  buf.writeUInt32LE(RATE, 24);
  buf.writeUInt32LE(RATE * 2, 28); // byte rate
  buf.writeUInt16LE(2, 32); // block align
  buf.writeUInt16LE(16, 34); // bits per sample
  buf.write("data", 36);
  buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE((s * 32767) | 0, 44 + i * 2);
  }
  return buf;
}

const sec = (s) => Math.floor(s * RATE);

// Pseudo-random noise with a fixed seed so output is reproducible (no
// Math.random — keeps regenerated assets byte-identical).
function makeNoise(seed = 12345) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return (state / 0xffffffff) * 2 - 1;
  };
}

// --- reward: ascending chime, three sine notes with soft exponential decay ---
function reward() {
  const dur = sec(0.9);
  const out = new Float32Array(dur);
  const notes = [659.25, 880.0, 1318.5]; // E5, A5, E6
  notes.forEach((freq, idx) => {
    const start = sec(idx * 0.11);
    for (let i = start; i < dur; i++) {
      const t = (i - start) / RATE;
      const env = Math.exp(-4 * t);
      // fundamental + a soft second partial for a bell-like timbre
      const v =
        (Math.sin(2 * Math.PI * freq * t) +
          0.3 * Math.sin(2 * Math.PI * freq * 2 * t)) *
        env *
        0.28;
      out[i] += v;
    }
  });
  return out;
}

// --- punish: whip crack = very fast noise transient + descending low thud ---
function punish() {
  const dur = sec(0.5);
  const out = new Float32Array(dur);
  const noise = makeNoise();
  for (let i = 0; i < dur; i++) {
    const t = i / RATE;
    // crack: white noise with a near-instant attack and fast decay
    const crackEnv = Math.exp(-38 * t);
    const crack = noise() * crackEnv * 0.9;
    // thud: a low sine sweeping down, slightly delayed
    const thudT = Math.max(0, t - 0.01);
    const thudFreq = 150 * Math.exp(-9 * thudT);
    const thud = Math.sin(2 * Math.PI * thudFreq * thudT) * Math.exp(-14 * thudT) * 0.5;
    out[i] = crack + thud;
  }
  return out;
}

// --- levelup: quick three-note major arpeggio fanfare ---
function levelup() {
  const dur = sec(0.7);
  const out = new Float32Array(dur);
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
  notes.forEach((freq, idx) => {
    const start = sec(idx * 0.09);
    for (let i = start; i < dur; i++) {
      const t = (i - start) / RATE;
      const env = Math.exp(-5 * t);
      out[i] += Math.sin(2 * Math.PI * freq * t) * env * 0.22;
    }
  });
  return out;
}

fs.mkdirSync(OUT_DIR, { recursive: true });
const targets = { "reward.wav": reward(), "punish.wav": punish(), "levelup.wav": levelup() };
for (const [name, samples] of Object.entries(targets)) {
  const file = path.join(OUT_DIR, name);
  fs.writeFileSync(file, encodeWav(samples));
  console.log(`wrote ${file} (${samples.length} samples)`);
}
