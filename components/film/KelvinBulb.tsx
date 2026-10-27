'use client';

import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { kelvinLabel, kelvinStill, kelvinToRgb, kelvinValueText } from '@/lib/kelvin';
import { drawCover } from './frames';
import { filmStore, progressOf } from './store';

const STILLS = [3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500];
const MIN = STILLS[0];
const MAX = STILLS[STILLS.length - 1];

// The slider and the picture are siblings in the dusk chapter, so they share the value through this tiny store.
let current = MIN;
const listeners = new Set<(k: number) => void>();
const setKelvin = (k: number) => {
  current = k;
  listeners.forEach((l) => l(k));
};

const rgb = (k: number) => kelvinToRgb(k).join(' ');

/**
 * The bulb close-up, rendered at eight colour temperatures. Where the dusk film ends (it ends on the 3000K render)
 * this layer fades in over it, so dragging the slider relights the bulb and the wall around it.
 */
export function KelvinPicture() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = canvas.current;
    const ctx = cvs?.getContext('2d', { alpha: false });
    if (!cvs || !ctx) return;
    const size = window.matchMedia('(orientation: portrait)').matches ? 'm' : 'd';
    const still = document.documentElement.classList.contains('still');
    const images: (HTMLImageElement | null)[] = STILLS.map(() => null);
    let started = false;

    const draw = () => {
      const { a, b, t } = kelvinStill(current, STILLS);
      const A = images[a];
      if (!A) return;
      drawCover(ctx, A);
      const B = images[b];
      if (B && t > 0) drawCover(ctx, B, t);
      cvs.dataset.ready = 'true';
    };
    const load = () => {
      if (started) return;
      started = true;
      STILLS.forEach((k, i) => {
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => {
          images[i] = img;
          draw();
        };
        img.src = `/film/kelvin/${size}/${k}.webp`;
      });
    };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cvs.width = Math.round(cvs.clientWidth * dpr);
      cvs.height = Math.round(cvs.clientHeight * dpr);
      draw();
    };
    resize();
    window.addEventListener('resize', resize);
    listeners.add(draw);

    let unsub = () => {};
    if (still) {
      load();
    } else {
      unsub = filmStore.subscribe((s) => {
        const p = progressOf('dusk', s);
        if (p > 0.4) load();
        const clamp = (x: number) => Math.min(1, Math.max(0, x));
        // In over the end of dusk; out over the first moments of night, as the camera leaves the bulb.
        const o = s.chapter === 'dusk' ? clamp((p - 0.8) / 0.08) : s.chapter === 'night' ? 1 - clamp(s.progress / 0.1) : 0;
        cvs.style.opacity = o.toFixed(3);
      });
    }
    return () => {
      unsub();
      listeners.delete(draw);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvas} className="kelvin__picture" aria-hidden="true" />;
}

export function KelvinControl({ label }: { label: string }) {
  const id = useId();
  const [k, setK] = useState(current);
  const onChange = (v: number) => {
    setK(v);
    setKelvin(v);
  };
  const style = {
    '--kelvin-rgb': rgb(k),
    '--kelvin-warm': rgb(MIN),
    '--kelvin-mid': rgb(4500),
    '--kelvin-cool': rgb(MAX),
  } as CSSProperties;

  return (
    <div className="kelvin" style={style}>
      <div className="kelvin__head">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id} className="kelvin__value" aria-hidden="true">
          <span className="kelvin__swatch" />
          {k}K <span>{kelvinLabel(k)}</span>
        </output>
      </div>
      <input
        id={id}
        className="kelvin__range"
        type="range"
        min={MIN}
        max={MAX}
        step={100}
        value={k}
        aria-valuetext={kelvinValueText(k)}
        onChange={(e) => onChange(e.currentTarget.valueAsNumber)}
      />
      <div className="kelvin__ends" aria-hidden="true">
        <span>Warm white</span>
        <span>Daylight</span>
      </div>
    </div>
  );
}
