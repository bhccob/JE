// Loads a chapter's frames coarse to fine (every 8th, then 4th, 2nd, all) so scrubbing works before the set is
// complete; drawing falls back to the nearest frame that has arrived.

import { FILM, framePath, type ChapterId, type FrameSize } from '@/lib/film';

export class FrameStore {
  private sets = new Map<ChapterId, (HTMLImageElement | null)[]>();
  private started = new Set<ChapterId>();

  constructor(
    private size: FrameSize,
    private onFrame: (id: ChapterId, i: number) => void,
  ) {
    for (const c of FILM) this.sets.set(c.id, new Array(c.frames[size]).fill(null));
  }

  count(id: ChapterId) {
    return this.sets.get(id)!.length;
  }

  private loadOne(id: ChapterId, i: number) {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        this.sets.get(id)![i] = img;
        this.onFrame(id, i);
        resolve();
      };
      img.onerror = () => resolve();
      img.src = framePath(id, this.size, i);
    });
  }

  /** Loads frames [from, to) in full, for stretches that must play smoothly at once (the sunrise intro). */
  async loadRange(id: ChapterId, from: number, to: number) {
    const frames = this.sets.get(id)!;
    const batch: Promise<void>[] = [];
    for (let i = from; i < Math.min(to, frames.length); i++) if (!frames[i]) batch.push(this.loadOne(id, i));
    await Promise.all(batch);
  }

  async load(id: ChapterId) {
    if (this.started.has(id)) return;
    this.started.add(id);
    const frames = this.sets.get(id)!;
    const last = frames.length - 1;
    await Promise.all([this.loadOne(id, 0), this.loadOne(id, last)]);
    for (const stride of [8, 4, 2, 1]) {
      const batch: Promise<void>[] = [];
      for (let i = 0; i < frames.length; i += stride) if (!frames[i]) batch.push(this.loadOne(id, i));
      await Promise.all(batch);
    }
  }

  get(id: ChapterId, i: number) {
    return this.sets.get(id)?.[i] ?? null;
  }

  nearest(id: ChapterId, i: number) {
    const frames = this.sets.get(id)!;
    for (let d = 0; d < frames.length; d++) {
      if (frames[i - d]) return frames[i - d];
      if (frames[i + d]) return frames[i + d];
    }
    return null;
  }
}

/** Draws `img` to cover the canvas, centred. */
export function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, alpha = 1) {
  const { width: w, height: h } = ctx.canvas;
  const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * s;
  const dh = img.naturalHeight * s;
  ctx.globalAlpha = alpha;
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  ctx.globalAlpha = 1;
}
