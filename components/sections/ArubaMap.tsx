'use client';

import { forwardRef } from 'react';

type P = [number, number];

// Hand-traced, simplified outline. x runs along the island NW -> SE, y across it (0 = north-east coast).
const RAW: P[] = [
  [0, 34], [18, 20], [46, 12], [80, 10], [118, 8], [160, 14], [200, 22], [240, 32], [282, 44], [322, 58],
  [360, 72], [400, 86], [440, 98], [478, 110], [512, 122], [540, 136], [560, 152], [548, 164], [520, 164],
  [500, 156], [470, 158], [440, 156], [405, 150], [370, 146], [335, 146], [300, 152], [262, 160], [228, 166],
  [196, 170], [164, 172], [132, 164], [104, 150], [80, 132], [62, 112], [46, 92], [30, 70], [14, 52], [4, 42],
];
const ORANJESTAD: P = [170, 168];

// Aruba's long axis runs roughly 40° below horizontal on a north-up map.
const ANGLE = (38 * Math.PI) / 180;
const rot = ([x, y]: P): P => [x * Math.cos(ANGLE) - y * Math.sin(ANGLE), x * Math.sin(ANGLE) + y * Math.cos(ANGLE)];

const pts = RAW.map(rot);
const minX = Math.min(...pts.map((p) => p[0]));
const minY = Math.min(...pts.map((p) => p[1]));
const shift = ([x, y]: P): P => [x - minX + 130, y - minY + 30];
const island = pts.map(shift);
const round = (v: number) => Math.round(v * 10) / 10;
const city = shift(rot(ORANJESTAD)).map(round) as P;
const W = Math.round(Math.max(...island.map((p) => p[0])) + 40);
const H = Math.round(Math.max(...island.map((p) => p[1])) + 30);
// Rays come from off-frame, top right, where the 3D sun sits behind the page.
const SUN: P = [W + 60, -40];

// Closed Catmull-Rom -> cubic Bezier, so a coarse point list still reads as a coastline.
function smoothClosed(points: P[]) {
  const n = points.length;
  let d = `M${points[0][0].toFixed(1)},${points[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];
    const c1: P = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: P = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return `${d}Z`;
}

const PATH = smoothClosed(island);
const RAYS = Array.from({ length: 11 }, (_, k) => {
  const a = ((112 + k * 5.5) * Math.PI) / 180;
  const len = 420 + (k % 3) * 120;
  // Rounded so server and client serialise identical attribute strings.
  return { x2: Math.round((SUN[0] + Math.cos(a) * len) * 10) / 10, y2: Math.round((SUN[1] + Math.sin(a) * len) * 10) / 10 };
});

export const ArubaMap = forwardRef<SVGSVGElement, { label: string }>(function ArubaMap({ label }, ref) {
  return (
    <svg ref={ref} viewBox={`0 0 ${W.toFixed(0)} ${H.toFixed(0)}`} role="img" aria-label={label} className="h-auto w-full overflow-visible">
      <defs>
        <linearGradient id="aruba-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#63d79b" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#2d7a57" stopOpacity="0.06" />
        </linearGradient>
        <linearGradient id="aruba-ray" gradientUnits="userSpaceOnUse" x1={SUN[0]} y1={SUN[1]} x2={SUN[0] - 260} y2={SUN[1] + 460}>
          <stop offset="0%" stopColor="#ffd38a" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#ffd38a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g className="aruba-rays" style={{ transformOrigin: `${SUN[0]}px ${SUN[1]}px` }}>
        {RAYS.map((r, k) => (
          <line key={k} x1={SUN[0]} y1={SUN[1]} x2={r.x2} y2={r.y2} stroke="url(#aruba-ray)" strokeWidth={k % 2 ? 1 : 1.6} strokeLinecap="round" />
        ))}
      </g>
      <path className="aruba-fill" d={PATH} fill="url(#aruba-fill)" />
      <path className="aruba-line" d={PATH} fill="none" stroke="#95e6bd" strokeWidth="1.4" strokeLinejoin="round" pathLength={1} strokeDasharray="1" />
      <g className="aruba-city">
        <circle cx={city[0]} cy={city[1]} r="4" fill="#eaf1eb" />
        <circle cx={city[0]} cy={city[1]} r="10" fill="none" stroke="#eaf1eb" strokeOpacity="0.35" />
        <text x={city[0] - 16} y={city[1] + 6} textAnchor="end" fill="#a8bbb0" fontSize="15" fontFamily="var(--font-geist-mono)" letterSpacing="0.06em">
          ORANJESTAD
        </text>
      </g>
    </svg>
  );
});
