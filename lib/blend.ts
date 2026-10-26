import type { SectionId } from './cameraKeyframes';
import type { SectionRange } from './scrollStore';

export interface Blend {
  from: SectionId;
  to: SectionId;
  /** 0-1 eased progress of the fly between `from` and `to` (0 while resting inside a hold). */
  t: number;
  /** 0-1 progress through the current hold, used for slow dolly-ins. */
  hold: number;
}

const smoother = (x: number) => x * x * x * (x * (x * 6 - 15) + 10);

/**
 * Where the camera is in the story. Inside a section's hold it rests on that section's keyframe;
 * between holds it travels from one keyframe to the next. Only the two nearest keyframes ever
 * contribute, so lighting, camera and particle all agree on the same pair and the same t.
 */
export function blendAt(ranges: SectionRange[], p: number): Blend {
  if (!ranges.length) return { from: 'hero', to: 'hero', t: 0, hold: 0 };
  if (p <= ranges[0].holdStart) return { from: ranges[0].id, to: ranges[0].id, t: 0, hold: 0 };
  for (let i = 0; i < ranges.length; i++) {
    const r = ranges[i];
    if (p >= r.holdStart && p <= r.holdEnd) {
      const len = r.holdEnd - r.holdStart;
      return { from: r.id, to: r.id, t: 0, hold: len > 0 ? (p - r.holdStart) / len : 0 };
    }
    const next = ranges[i + 1];
    if (next && p > r.holdEnd && p < next.holdStart) {
      const x = (p - r.holdEnd) / (next.holdStart - r.holdEnd);
      return { from: r.id, to: next.id, t: smoother(Math.min(1, Math.max(0, x))), hold: 0 };
    }
  }
  const last = ranges[ranges.length - 1];
  return { from: last.id, to: last.id, t: 0, hold: 1 };
}
