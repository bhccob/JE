/**
 * Build the site's icons from the store's logo.
 *
 * node tools/brand/icons.mjs
 *
 * logo.jpg is the leaf-and-house mark over the "Jontai Energy" wordmark on pale grey. The icons use the mark alone,
 * since the wordmark is unreadable at tab size. The grey is lifted out (the house and the vein stay cut out, as in the
 * logo) for the browser tab icons; the home-screen icon puts the mark on white, as iOS fills transparency with black.
 */
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const pub = (p) => fileURLToPath(new URL(`../../public/${p}`, import.meta.url));

// The mark sits above this row of logo.jpg, the wordmark below it. The photo's edges carry a darker line; skip them.
const WORDMARK_TOP = 575;
const EDGE = 24;

const { data, info } = await sharp(here('logo.jpg')).raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;
const bg = [data[0], data[1], data[2]];

// Opacity grows with distance from the grey, so the anti-aliased edges stay soft; JPEG noise in the grey stays clear.
const rgba = Buffer.alloc(W * H * 4);
const box = { x0: W, y0: H, x1: 0, y1: 0 };
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * C;
    const o = (y * W + x) * 4;
    const d = Math.max(Math.abs(data[i] - bg[0]), Math.abs(data[i + 1] - bg[1]), Math.abs(data[i + 2] - bg[2]));
    const inside = y >= EDGE && y < WORDMARK_TOP && x >= EDGE && x < W - EDGE;
    const a = inside ? Math.min(1, Math.max(0, (d - 16) / 48)) : 0;
    rgba[o] = data[i];
    rgba[o + 1] = data[i + 1];
    rgba[o + 2] = data[i + 2];
    rgba[o + 3] = Math.round(a * 255);
    if (a > 0) Object.assign(box, { x0: Math.min(box.x0, x), y0: Math.min(box.y0, y), x1: Math.max(box.x1, x), y1: Math.max(box.y1, y) });
  }
}

const markW = box.x1 - box.x0 + 1;
const markH = box.y1 - box.y0 + 1;
const mark = await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
  .extract({ left: box.x0, top: box.y0, width: markW, height: markH })
  .png()
  .toBuffer();

/** The mark centred on a square canvas `size` px wide, filling `fill` of it, over `background`. */
async function icon(size, fill, background, out) {
  const inner = Math.round(size * fill);
  const scaled = await sharp(mark).resize({ width: inner, height: inner, fit: 'inside', kernel: 'lanczos3' }).toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: scaled, gravity: 'centre' }])
    .png({ compressionLevel: 9 })
    .toFile(pub(out));
  console.log(out, `${size}x${size}`);
}

const clear = { r: 0, g: 0, b: 0, alpha: 0 };
await icon(32, 1, clear, 'icon-32.png');
await icon(192, 0.92, clear, 'icon-192.png');
await icon(180, 0.76, { r: 255, g: 255, b: 255, alpha: 1 }, 'apple-icon.png');
