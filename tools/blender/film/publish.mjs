// Turns the rendered PNGs (tools/blender/film/out) into the webp frames the site plays (public/film).
//
//   node tools/blender/film/publish.mjs [d|m] [chapter...]
//
// Each chapter also gets poster.webp: the frame that stands for it when the film does not play (reduced motion,
// Save-Data, no scripts). Re-running only converts frames that are new or changed.
import { mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../..');
const OUT = path.join(here, 'out');
const PUBLIC = path.join(root, 'public', 'film');

const CHAPTERS = ['dawn', 'noon', 'heat', 'afternoon', 'dusk', 'night', 'outage', 'morning'];
// Where in each chapter its poster frame sits (0..1).
const POSTER_AT = { dawn: 0.45, noon: 1, heat: 0.75, afternoon: 0.95, dusk: 1, night: 0.85, outage: 0.9, morning: 1 };
const QUALITY = { d: 74, m: 72 };

const exists = async (p) => !!(await stat(p).catch(() => null));

async function newer(src, dst) {
  const [a, b] = await Promise.all([stat(src), stat(dst).catch(() => null)]);
  return !b || a.mtimeMs > b.mtimeMs;
}

async function chapter(size, id) {
  const dir = path.join(OUT, size, id);
  if (!(await exists(dir))) return null;
  const files = (await readdir(dir)).filter((f) => f.endsWith('.png')).sort();
  const dest = path.join(PUBLIC, size, id);
  await mkdir(dest, { recursive: true });
  let bytes = 0;
  for (const f of files) {
    const to = path.join(dest, f.replace('.png', '.webp'));
    if (await newer(path.join(dir, f), to)) {
      await sharp(path.join(dir, f)).webp({ quality: QUALITY[size], effort: 5, smartSubsample: true }).toFile(to);
    }
    bytes += (await stat(to)).size;
  }
  const pick = files[Math.round(POSTER_AT[id] * (files.length - 1))];
  if (pick) await sharp(path.join(dir, pick)).webp({ quality: 80, effort: 5 }).toFile(path.join(dest, 'poster.webp'));
  return { id, frames: files.length, kb: Math.round(bytes / 1024) };
}

async function kelvin(size) {
  const dir = path.join(OUT, 'kelvin', size);
  if (!(await exists(dir))) return null;
  const dest = path.join(PUBLIC, 'kelvin', size);
  await mkdir(dest, { recursive: true });
  const files = (await readdir(dir)).filter((f) => f.endsWith('.png'));
  for (const f of files) {
    await sharp(path.join(dir, f)).webp({ quality: 80, effort: 5 }).toFile(path.join(dest, f.replace('.png', '.webp')));
  }
  return { id: 'kelvin', frames: files.length };
}

const [only, ...ids] = process.argv.slice(2);
for (const size of only ? [only] : ['d', 'm']) {
  for (const id of ids.length ? ids : CHAPTERS) {
    const r = await chapter(size, id);
    if (r) console.log(size, r.id, `${r.frames} frames`, `${r.kb} KB`);
  }
  const k = await kelvin(size);
  if (k) console.log(size, 'kelvin', `${k.frames} stills`);
}
