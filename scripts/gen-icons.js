// Generate macOS menu-bar tray icons as template PNGs, with no dependencies
// (hand-rolled PNG encoder). Run: node scripts/gen-icons.js
//
// A "template" image for the macOS menu bar is black pixels with an alpha mask;
// macOS recolors it automatically for light/dark menu bars. We therefore only
// vary the alpha channel (RGB stays 0). Produces, in packages/overlay/assets/:
//   trayTemplate.png      (18x18)
//   trayTemplate@2x.png   (36x36)
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "../packages/overlay/assets");

// CRC-32 (PNG chunk checksum).
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

// Encode an RGBA pixel buffer (Uint8Array, w*h*4) as a PNG.
function encodePng(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth
  ihdr.writeUInt8(6, 9); // color type RGBA
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace

  // raw scanlines each prefixed with filter byte 0
  const raw = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    raw[y * (1 + width * 4)] = 0;
    rgba.subarray(y * width * 4, (y + 1) * width * 4).forEach((v, i) => {
      raw[y * (1 + width * 4) + 1 + i] = v;
    });
  }
  const idat = zlib.deflateSync(raw, { level: 9 });

  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// Signed-area test: is point (px,py) inside the polygon?
function inPoly(px, py, pts) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const xi = pts[i][0],
      yi = pts[i][1];
    const xj = pts[j][0],
      yj = pts[j][1];
    const intersect =
      yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

// Build a 5-point star polygon centered in a size x size box.
function starPoints(size) {
  const cx = size / 2;
  const cy = size / 2;
  const outer = size * 0.46;
  const inner = outer * 0.42;
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const ang = (Math.PI / 5) * i - Math.PI / 2;
    pts.push([cx + r * Math.cos(ang), cy + r * Math.sin(ang)]);
  }
  return pts;
}

// Render a star as a black template image with antialiased alpha via 3x3
// supersampling.
function renderStar(size) {
  const pts = starPoints(size);
  const rgba = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let hits = 0;
      for (let sy = 0; sy < 3; sy++) {
        for (let sx = 0; sx < 3; sx++) {
          if (inPoly(x + (sx + 0.5) / 3, y + (sy + 0.5) / 3, pts)) hits++;
        }
      }
      const alpha = Math.round((hits / 9) * 255);
      const o = (y * size + x) * 4;
      rgba[o] = 0; // R (black; macOS recolors template)
      rgba[o + 1] = 0;
      rgba[o + 2] = 0;
      rgba[o + 3] = alpha;
    }
  }
  return rgba;
}

fs.mkdirSync(OUT_DIR, { recursive: true });
const variants = [
  ["trayTemplate.png", 18],
  ["trayTemplate@2x.png", 36],
];
for (const [name, size] of variants) {
  const png = encodePng(size, size, renderStar(size));
  const file = path.join(OUT_DIR, name);
  fs.writeFileSync(file, png);
  console.log(`wrote ${file} (${size}x${size}, ${png.length} bytes)`);
}
