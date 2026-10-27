// Contour lines, like a survey map, drawn behind the numbers and the visit section. Each hill is a set of wobbly rings
// around a centre, in a 1600 x 1000 viewBox. Pure maths, so the server and the browser draw the same paths.

export type Hill = readonly [cx: number, cy: number, rings: number];

/** The hills behind "Jontai at a glance". */
export const NUMBERS_HILLS = [[230, 820, 10], [1380, 180, 12], [880, 1080, 7]] as const satisfies readonly Hill[];

/** The hills behind the visit section. */
export const VISIT_HILLS = [[1420, 860, 12], [160, 120, 9]] as const satisfies readonly Hill[];

const STEP = 52;
const POINTS = 140;

/** One closed path per ring, inner rings first, for every hill in order. */
export function contourRings(hills: readonly Hill[]): string[] {
  const rings: string[] = [];
  for (const [cx, cy, count] of hills) {
    for (let ring = 1; ring <= count; ring++) {
      const R = ring * STEP;
      const points: string[] = [];
      for (let i = 0; i <= POINTS; i++) {
        const a = (i / POINTS) * Math.PI * 2;
        const r = R * (1 + 0.11 * Math.sin(3 * a + ring * 0.38 + cx) + 0.06 * Math.sin(5 * a + 1.3 + ring * 0.21) + 0.035 * Math.sin(8 * a + cy));
        points.push(`${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * 0.74 * Math.sin(a)).toFixed(1)}`);
      }
      rings.push(`M${points.join('L')}Z`);
    }
  }
  return rings;
}
