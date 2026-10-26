import { CanvasTexture, SRGBColorSpace } from 'three';

let cached: CanvasTexture | null = null;

/** One shared soft radial falloff, used for the sun halo, the particle glow and lamp glows. */
export function glowTexture() {
  if (cached) return cached;
  const size = 128;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.18, 'rgba(255,255,255,0.55)');
  grad.addColorStop(0.45, 'rgba(255,255,255,0.14)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  cached = new CanvasTexture(c);
  cached.colorSpace = SRGBColorSpace;
  return cached;
}
