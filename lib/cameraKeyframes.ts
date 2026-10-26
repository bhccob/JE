export type Vec3 = [number, number, number];

export const SECTION_IDS = [
  'hero',
  'source',
  'capture',
  'storage',
  'light',
  'collection',
  'loyalty',
  'impact',
  'commitment',
  'footer',
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export interface CameraKeyframe {
  id: SectionId;
  position: Vec3;
  target: Vec3;
  fov: number;
}

/**
 * World layout the keyframes point at (keep in sync with components/canvas):
 *   sun          (40, 20, -150)   far behind everything, drives the sky halo
 *   solar panel  (0, 0, 0)
 *   battery      (9, 0, -3)
 *   bulb         (18, 1.55, -6)   wall patch 1.6 units behind it
 *   carousel     (28, 0, -8)      ring radius 2.6
 *   loyalty+     an empty patch of night sky; the camera parks there
 */
const LOYALTY_PARK: Pick<CameraKeyframe, 'position' | 'target' | 'fov'> = {
  position: [44, 26, 6],
  target: [44, 70, -60],
  fov: 40,
};

export const cameraKeyframes: CameraKeyframe[] = [
  { id: 'hero', position: [0, 1.35, 15], target: [1.5, 4.2, -60], fov: 38 },
  { id: 'source', position: [-1.5, 3.4, 12], target: [6.5, 11.5, -60], fov: 42 },
  { id: 'capture', position: [-0.35, 1.5, 6.4], target: [-1.0, 0.62, 0], fov: 34 },
  { id: 'storage', position: [10.7, 1.35, 2.3], target: [10.25, 0.82, -3], fov: 34 },
  { id: 'light', position: [18, 1.45, -1.4], target: [18, 1.2, -6], fov: 34 },
  { id: 'collection', position: [28, 1.2, 0.4], target: [28, 0.5, -5.4], fov: 32 },
  { id: 'loyalty', ...LOYALTY_PARK },
  { id: 'impact', ...LOYALTY_PARK },
  { id: 'commitment', ...LOYALTY_PARK },
  { id: 'footer', ...LOYALTY_PARK },
];

// Portrait phones: objects sit centered in the upper half of the screen, copy below.
export const mobileCameraKeyframes: CameraKeyframe[] = [
  { id: 'hero', position: [0, 1.6, 13], target: [4.2, 6.2, -60], fov: 46 },
  { id: 'source', position: [0, 3.2, 10], target: [5.5, 14, -60], fov: 46 },
  { id: 'capture', position: [0, 0.35, 4.9], target: [0, 0.05, 0], fov: 40 },
  { id: 'storage', position: [9.1, 0.5, 2.9], target: [9, 0.4, -3], fov: 40 },
  { id: 'light', position: [18, 0.95, -2.2], target: [18, 0.82, -6], fov: 40 },
  { id: 'collection', position: [28, 0.95, 1.8], target: [28, 0.42, -5.4], fov: 40 },
  { id: 'loyalty', ...LOYALTY_PARK },
  { id: 'impact', ...LOYALTY_PARK },
  { id: 'commitment', ...LOYALTY_PARK },
  { id: 'footer', ...LOYALTY_PARK },
];

export const MOBILE_QUERY = '(max-width: 768px)';

export function keyframesFor(isMobile: boolean) {
  return isMobile ? mobileCameraKeyframes : cameraKeyframes;
}
