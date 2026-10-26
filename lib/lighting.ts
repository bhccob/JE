import type { SectionId } from './cameraKeyframes';

export type EnvMood = 'sunset' | 'city' | 'amber';

export interface SectionLighting {
  env: EnvMood;
  envIntensity: number;
  ambient: number;
  key: string;
  keyIntensity: number;
  skyTop: string;
  skyHorizon: string;
  ground: string;
  sunGlow: number;
  fogDensity: number;
}

/**
 * Lighting presets per section. The canvas interpolates every numeric/color field
 * with the same progress value the camera uses, so light and framing never drift apart.
 * Env moods are baked locally (components/canvas/EnvironmentRig.tsx); no HDR is fetched.
 */
export const sectionLighting: Record<SectionId, SectionLighting> = {
  hero: { env: 'sunset', envIntensity: 0.9, ambient: 0.18, key: '#ffad6b', keyIntensity: 2.4, skyTop: '#061c16', skyHorizon: '#a8552c', ground: '#06100c', sunGlow: 1, fogDensity: 0.0075 },
  source: { env: 'sunset', envIntensity: 1, ambient: 0.24, key: '#ffc27e', keyIntensity: 2.6, skyTop: '#08241c', skyHorizon: '#b8663a', ground: '#071210', sunGlow: 1.1, fogDensity: 0.007 },
  capture: { env: 'sunset', envIntensity: 1.05, ambient: 0.22, key: '#ffb874', keyIntensity: 2.8, skyTop: '#030d0a', skyHorizon: '#94482a', ground: '#07100c', sunGlow: 0.85, fogDensity: 0.009 },
  storage: { env: 'sunset', envIntensity: 0.7, ambient: 0.14, key: '#f3a77a', keyIntensity: 1.6, skyTop: '#030a08', skyHorizon: '#3d2219', ground: '#060c09', sunGlow: 0.3, fogDensity: 0.014 },
  light: { env: 'city', envIntensity: 0.55, ambient: 0.08, key: '#c9d8ff', keyIntensity: 0.6, skyTop: '#030807', skyHorizon: '#0d1714', ground: '#060a08', sunGlow: 0, fogDensity: 0.02 },
  collection: { env: 'city', envIntensity: 1, ambient: 0.3, key: '#e4ecff', keyIntensity: 2.2, skyTop: '#050b09', skyHorizon: '#13211b', ground: '#08100c', sunGlow: 0, fogDensity: 0.018 },
  loyalty: { env: 'city', envIntensity: 0.2, ambient: 0.05, key: '#e4ecff', keyIntensity: 0.2, skyTop: '#040807', skyHorizon: '#060b09', ground: '#050907', sunGlow: 0, fogDensity: 0.02 },
  impact: { env: 'amber', envIntensity: 0.6, ambient: 0.2, key: '#ffb347', keyIntensity: 1.5, skyTop: '#060a08', skyHorizon: '#2a1a0c', ground: '#070a08', sunGlow: 0, fogDensity: 0.02 },
  commitment: { env: 'amber', envIntensity: 0.6, ambient: 0.2, key: '#ffb347', keyIntensity: 1.5, skyTop: '#060a08', skyHorizon: '#2a1a0c', ground: '#070a08', sunGlow: 0, fogDensity: 0.02 },
  footer: { env: 'amber', envIntensity: 0.6, ambient: 0.2, key: '#ffb347', keyIntensity: 1.5, skyTop: '#060a08', skyHorizon: '#2a1a0c', ground: '#070a08', sunGlow: 0, fogDensity: 0.02 },
};
