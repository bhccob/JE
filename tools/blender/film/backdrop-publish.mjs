// Grades the wall backdrops (out/backdrop/<theme>-<size>.png, from backdrop.py) into the site's own two tones and
// writes them as webp to public/film/backdrop/. The render gives the light and the shadow; the palette gives the colour.
//   node tools/blender/film/backdrop-publish.mjs
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const HERE = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'));
const OUT = path.resolve(HERE, '../../../public/film/backdrop');

// oklch -> sRGB 0..255
function oklch(L, C, h) {
  const a = C * Math.cos((h * Math.PI) / 180);
  const b = C * Math.sin((h * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const lin = [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
  return lin.map((c) => Math.round(255 * Math.min(1, Math.max(0, c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055))));
}

// [shadow, wall]: day is sand plaster under a sage shadow, night is the forest of the evening theme.
const TONES = {
  day: [oklch(0.82, 0.032, 148), oklch(0.94, 0.016, 95)],
  night: [oklch(0.16, 0.024, 172), oklch(0.29, 0.036, 166)],
};

fs.mkdirSync(OUT, { recursive: true });
// The site is in day colours only (owner, 2026-10-27); backdrop.py can still render the night wall.
for (const theme of ['day']) {
  for (const size of ['d', 'm']) {
    const src = path.join(HERE, 'out', 'backdrop', `${theme}-${size}.png`);
    const { data, info } = await sharp(src).greyscale().raw().toBuffer({ resolveWithObject: true });
    const sorted = Uint8Array.from(data).sort();
    const lo = sorted[Math.floor(sorted.length * 0.01)];
    const hi = sorted[Math.floor(sorted.length * 0.99)];
    const [s, w] = TONES[theme];
    const rgb = Buffer.alloc(info.width * info.height * 3);
    for (let i = 0; i < data.length; i++) {
      const t = Math.min(1, Math.max(0, (data[i] - lo) / (hi - lo || 1)));
      for (let c = 0; c < 3; c++) rgb[i * 3 + c] = Math.round(s[c] + (w[c] - s[c]) * t);
    }
    const file = path.join(OUT, `${theme}-${size}.webp`);
    await sharp(rgb, { raw: { width: info.width, height: info.height, channels: 3 } }).webp({ quality: 80 }).toFile(file);
    console.log('wrote', path.relative(process.cwd(), file), Math.round(fs.statSync(file).size / 1024) + ' KB');
  }
}
