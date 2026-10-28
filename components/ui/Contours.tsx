import { contourRings, type Hill } from '@/lib/contours';

/** Faint contour lines behind a section, drawn in as it scrolls by (data-draw, PageMotion). Decorative. */
export function Contours({ hills, className = '' }: { hills: readonly Hill[]; className?: string }) {
  return (
    <svg
      className={`contours ${className}`.trim()}
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      {contourRings(hills).map((d, i) => (
        <path key={i} d={d} pathLength={1} data-draw="" />
      ))}
    </svg>
  );
}
