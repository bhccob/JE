// Loads a chapter's frames coarse to fine (every 8th, then 4th, 2nd, all) so scrubbing works before the set is
// complete. Files stay compressed in memory; only the frames around the playhead are decoded, off the main thread
// (createImageBitmap), so drawing a new frame never waits on a decode and memory stays bounded. Drawing falls back to
// the nearest decoded frame while the one it wants is still decoding.

import { FILM, FRAME_SIZE, framePath, type ChapterId, type FrameSize } from '@/lib/film';

/** A decoded frame. `key` names it, so the film can tell when a closer frame has arrived and redraw. */
export interface Frame {
  image: ImageBitmap;
  key: string;
}

/** Frames kept decoded behind and ahead of the playhead, in the direction of travel. A frame is about 8 MB decoded
 *  on desktop and 6 MB on a phone, so this holds about 170 MB and 90 MB. */
const WINDOW: Record<FrameSize, { behind: number; ahead: number }> = {
  d: { behind: 6, ahead: 14 },
  m: { behind: 4, ahead: 10 },
};
const DECODERS = 4;

export class FrameStore {
  // Every chapter's frames end to end on one strip, so the decode window runs across chapter cuts.
  private offset = new Map<ChapterId, number>();
  private chapterAt: ChapterId[] = [];
  private files: (Blob | null)[] = [];
  private decoded = new Map<number, ImageBitmap>();
  private pending = new Set<number>();
  private started = new Set<ChapterId>();
  private head = 0;
  private dir: 1 | -1 = 1;
  private disposed = false;

  constructor(
    private size: FrameSize,
    private onFrame: (id: ChapterId, i: number) => void,
  ) {
    for (const c of FILM) {
      this.offset.set(c.id, this.chapterAt.length);
      for (let i = 0; i < c.frames[size]; i++) this.chapterAt.push(c.id);
    }
    this.files = new Array(this.chapterAt.length).fill(null);
  }

  count(id: ChapterId) {
    return FILM.find((c) => c.id === id)!.frames[this.size];
  }

  private at(id: ChapterId, i: number) {
    return this.offset.get(id)! + i;
  }

  private async fetchOne(id: ChapterId, i: number) {
    const g = this.at(id, i);
    try {
      const res = await fetch(framePath(id, this.size, i));
      if (!res.ok) return;
      this.files[g] = await res.blob();
      if (this.inWindow(g)) this.pump();
    } catch {
      // A missing frame is skipped; drawing uses its neighbour.
    }
  }

  /** Loads frames [from, to) in full, for stretches that must play smoothly at once (the sunrise intro). */
  async loadRange(id: ChapterId, from: number, to: number) {
    const batch: Promise<void>[] = [];
    for (let i = from; i < Math.min(to, this.count(id)); i++) if (!this.files[this.at(id, i)]) batch.push(this.fetchOne(id, i));
    await Promise.all(batch);
  }

  async load(id: ChapterId) {
    if (this.started.has(id)) return;
    this.started.add(id);
    const count = this.count(id);
    await Promise.all([this.fetchOne(id, 0), this.fetchOne(id, count - 1)]);
    for (const stride of [8, 4, 2, 1]) {
      const batch: Promise<void>[] = [];
      for (let i = 0; i < count; i += stride) if (!this.files[this.at(id, i)]) batch.push(this.fetchOne(id, i));
      await Promise.all(batch);
    }
  }

  /** Moves the playhead: frames that fell out of the window are released and the ones now in it start decoding. */
  seek(id: ChapterId, i: number) {
    const g = this.at(id, i);
    if (g === this.head) return;
    this.dir = g > this.head ? 1 : -1;
    this.head = g;
    for (const [k, image] of this.decoded) {
      if (this.inWindow(k, 2)) continue;
      image.close();
      this.decoded.delete(k);
    }
    this.pump();
  }

  private inWindow(g: number, margin = 0) {
    const { behind, ahead } = WINDOW[this.size];
    const lo = this.head - (this.dir > 0 ? behind : ahead) - margin;
    const hi = this.head + (this.dir > 0 ? ahead : behind) + margin;
    return g >= lo && g <= hi;
  }

  // Decodes the wanted frames nearest the playhead first: the frame itself, the one it mixes toward, then ahead.
  private pump() {
    if (this.disposed) return;
    const { behind, ahead } = WINDOW[this.size];
    const order = [this.head, this.head + 1];
    for (let d = 1; d <= ahead; d++) order.push(this.head + this.dir * d);
    for (let d = 1; d <= behind; d++) order.push(this.head - this.dir * d);
    for (const g of order) {
      if (this.pending.size >= DECODERS) return;
      const file = this.files[g];
      if (!file || this.decoded.has(g) || this.pending.has(g)) continue;
      this.pending.add(g);
      createImageBitmap(file)
        .then((image) => {
          this.pending.delete(g);
          if (this.disposed || !this.inWindow(g, 2)) {
            image.close();
          } else {
            this.decoded.set(g, image);
            const id = this.chapterAt[g];
            this.onFrame(id, g - this.offset.get(id)!);
          }
          this.pump();
        })
        .catch(() => {
          this.pending.delete(g);
          this.files[g] = null;
          this.pump();
        });
    }
  }

  get(id: ChapterId, i: number): Frame | null {
    if (i < 0 || i >= this.count(id)) return null;
    const image = this.decoded.get(this.at(id, i));
    return image ? { image, key: `${id}:${i}` } : null;
  }

  nearest(id: ChapterId, i: number): Frame | null {
    const count = this.count(id);
    for (let d = 0; d < count; d++) {
      const frame = this.get(id, i - d) ?? this.get(id, i + d);
      if (frame) return frame;
    }
    return null;
  }

  dispose() {
    this.disposed = true;
    for (const image of this.decoded.values()) image.close();
    this.decoded.clear();
  }
}

/**
 * Sizes a canvas's backing store to its box at the screen's pixel density, but never past the frames' own
 * resolution: beyond it a bigger canvas adds no detail, only pixels to fill on every draw. CSS scales it up.
 */
export function fitCanvas(cvs: HTMLCanvasElement, size: FrameSize) {
  const [fw, fh] = FRAME_SIZE[size];
  const w = cvs.clientWidth;
  const h = cvs.clientHeight;
  const scale = Math.min(window.devicePixelRatio || 1, 2, 1 / Math.max(w / fw, h / fh));
  cvs.width = Math.round(w * scale);
  cvs.height = Math.round(h * scale);
}

/** Draws `img` to cover the canvas, centred. */
export function drawCover(ctx: CanvasRenderingContext2D, img: ImageBitmap, alpha = 1) {
  const { width: w, height: h } = ctx.canvas;
  const s = Math.max(w / img.width, h / img.height);
  const dw = img.width * s;
  const dh = img.height * s;
  ctx.globalAlpha = alpha;
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  ctx.globalAlpha = 1;
}
