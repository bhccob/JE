'use client';

import { useEffect, useRef } from 'react';
import { formatHour } from '@/lib/film';
import { filmStore } from './store';

/**
 * A small clock for the film: the sun travels a half arc from 06:00 to 18:00, then the moon takes it overnight.
 * Decorative (the copy says the same thing), and written straight to the DOM on each scroll update.
 */
export function SunDial() {
  const root = useRef<HTMLDivElement>(null);
  const time = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || document.documentElement.classList.contains('still')) return;
    return filmStore.subscribe((s) => {
      // 06:00 -> left end of the arc, 12:00 -> top, 18:00 -> right end. At night the moon takes the same arc.
      const h = s.hour;
      const day = h >= 6 && h <= 18;
      const a = Math.PI * (1 - (day ? h - 6 : (h - 18 + 24) % 24) / 12);
      el.style.setProperty('--sun-x', (0.5 + 0.5 * Math.cos(a)).toFixed(4));
      el.style.setProperty('--sun-y', (1 - Math.sin(a)).toFixed(4));
      el.dataset.night = String(!day);
      el.dataset.visible = String(s.visible);
      if (time.current) time.current.textContent = formatHour(h);
    });
  }, []);

  return (
    <div ref={root} className="dial glass" aria-hidden="true">
      <svg className="dial__arc" viewBox="0 0 100 50" preserveAspectRatio="none">
        <path d="M 2 50 A 48 48 0 0 1 98 50" />
      </svg>
      <span className="dial__sun" />
      <span ref={time} className="dial__time">
        05:30
      </span>
    </div>
  );
}
