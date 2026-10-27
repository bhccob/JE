'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

interface FitTextProps {
  text: string;
  className?: string;
  /** Split into letters (.c > .ci) so they can rise; 'end' rises with the last stretch of the page (PageMotion). */
  chars?: boolean | 'end';
  /** What a screen reader hears. Without it the fitted word is decorative and hidden from assistive tech. */
  label?: string;
}

/**
 * A word sized to fill its row exactly: JONTAI in the hero, CUMANA 73 at the visit, JONTAI ENERGY in the footer.
 * Measured at 100px and scaled to the row, again whenever the row's width changes and once the font has loaded, so a
 * late font never leaves it overflowing or short. CSS gives it a close size before the first measure.
 */
export function FitText({ text, className = '', chars = false, label }: FitTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    const inner = el?.querySelector<HTMLElement>('.fit');
    if (!el || !inner) return;
    let width = 0;
    const fit = () => {
      width = el.clientWidth;
      el.style.fontSize = '100px';
      const natural = inner.getBoundingClientRect().width;
      if (natural > 0) el.style.fontSize = `${(100 * width) / natural}px`;
    };
    fit();
    // Only a change of width refits; the height change a refit causes must not set it off again.
    const ro = new ResizeObserver(() => {
      if (el.clientWidth !== width) fit();
    });
    ro.observe(el);
    let live = true;
    document.fonts?.ready.then(() => live && fit());
    return () => {
      live = false;
      ro.disconnect();
    };
  }, [text]);

  const body = chars
    ? [...text].map((ch, i) =>
        ch === ' ' ? (
          ' '
        ) : (
          <span key={i} className="c">
            <span className="ci">{ch}</span>
          </span>
        ),
      )
    : text;

  return (
    <p
      ref={ref}
      className={className}
      data-fit=""
      data-chars={chars === 'end' ? 'end' : chars ? '' : undefined}
      aria-hidden={label ? undefined : true}
    >
      {label && <span className="visually-hidden">{label}</span>}
      <span className="fit" aria-hidden={label ? true : undefined}>
        {body}
      </span>
    </p>
  );
}
