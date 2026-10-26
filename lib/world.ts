import type { Vec3 } from './cameraKeyframes';

// Where every set piece lives. cameraKeyframes.ts frames these positions.
export const WORLD = {
  sun: [40, 20, -150] as Vec3,
  panel: [0, 0, 0] as Vec3,
  battery: [9, 0, -3] as Vec3,
  bulb: [18, 1.55, -6] as Vec3,
  carousel: [28, 0, -8] as Vec3,
  ringRadius: 2.6,
};
