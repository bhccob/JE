'use client';

import { useEffect, useId, useState } from 'react';
import { kelvinLabel, kelvinToRgb, kelvinValueText } from '@/lib/kelvin';

/**
 * The bulb's colour, from warm 3000K to daylight 6500K. Its light washes over every [data-glow] layer (the product
 * stage and the phone picture) through a multiply blend, so it reaches the edges and never shows a box.
 */
export function KelvinSlider() {
  const id = useId();
  const [k, setK] = useState(3000);

  useEffect(() => {
    const [r, g, b] = kelvinToRgb(k);
    document.querySelectorAll<HTMLElement>('[data-glow]').forEach((el) => el.style.setProperty('--glow', `rgb(${r} ${g} ${b})`));
  }, [k]);

  return (
    <div className="kelvin" data-reveal>
      <div className="kelvin__row">
        <label className="label" htmlFor={id}>
          Try a colour
        </label>
        <span className="kelvin__read" aria-hidden="true">
          <span className="kelvin__value figure">{k}K</span>
          <span className="label">{kelvinLabel(k)}</span>
        </span>
      </div>
      <input
        id={id}
        className="range"
        type="range"
        min={3000}
        max={6500}
        step={100}
        value={k}
        aria-valuetext={kelvinValueText(k)}
        onChange={(e) => setK(e.currentTarget.valueAsNumber)}
      />
      <div className="kelvin__ends label" aria-hidden="true">
        <span>3000K</span>
        <span>6500K</span>
      </div>
    </div>
  );
}
