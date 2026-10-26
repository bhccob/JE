'use client';

import { useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  BackSide,
  Color,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  type Texture,
  type WebGLRenderer,
} from 'three';
import { sectionLighting, type EnvMood } from '@/lib/lighting';
import { readScroll } from '@/lib/scrollStore';
import { blendAt } from '@/lib/blend';

type Panel = { color: string; intensity: number; pos: [number, number, number]; scale: [number, number] };

// Local stand-ins for drei's "sunset" / "city" presets: same mood, built from emissive panels, no HDR download.
const MOODS: Record<EnvMood, { top: string; bottom: string; panels: Panel[] }> = {
  sunset: {
    top: '#24324a',
    bottom: '#140d08',
    panels: [
      { color: '#ff9b52', intensity: 7, pos: [-7, 1.2, -6], scale: [10, 3] },
      { color: '#ffcf9a', intensity: 2.2, pos: [6, 4, -5], scale: [4, 4] },
      { color: '#9fb8ff', intensity: 1.2, pos: [5, 3, 6], scale: [2, 7] },
      { color: '#d79a8a', intensity: 0.9, pos: [0, 9, 0], scale: [12, 12] },
    ],
  },
  city: {
    top: '#2b3442',
    bottom: '#0c0f12',
    panels: [
      { color: '#eef3ff', intensity: 5, pos: [0, 8, 0], scale: [7, 7] },
      { color: '#dfe9ff', intensity: 3.5, pos: [-8, 2, 0], scale: [1.6, 7] },
      { color: '#dfe9ff', intensity: 3.5, pos: [8, 2, 0], scale: [1.6, 7] },
      { color: '#a9c2ff', intensity: 1.4, pos: [0, 2, -8], scale: [9, 3] },
    ],
  },
  amber: {
    top: '#3a2a18',
    bottom: '#0f0a06',
    panels: [
      { color: '#ffb347', intensity: 5, pos: [0, 8, 0], scale: [7, 7] },
      { color: '#ffcf8a', intensity: 3, pos: [-8, 2, 0], scale: [1.6, 7] },
      { color: '#ff9d3a', intensity: 2.5, pos: [8, 2, 0], scale: [1.6, 7] },
    ],
  },
};

function bake(gl: WebGLRenderer, mood: EnvMood): Texture {
  const m = MOODS[mood];
  const scene = new Scene();
  const domeGeo = new SphereGeometry(20, 32, 16);
  const domeMat = new ShaderMaterial({
    side: BackSide,
    uniforms: { top: { value: new Color(m.top) }, bottom: { value: new Color(m.bottom) } },
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
    fragmentShader: 'uniform vec3 top; uniform vec3 bottom; varying vec3 vP; void main(){ gl_FragColor = vec4(mix(bottom, top, smoothstep(-0.3, 0.6, vP.y)), 1.); }',
  });
  scene.add(new Mesh(domeGeo, domeMat));
  const planeGeo = new PlaneGeometry(1, 1);
  const mats: MeshBasicMaterial[] = [];
  for (const p of m.panels) {
    const mat = new MeshBasicMaterial({ color: new Color(p.color).multiplyScalar(p.intensity), side: DoubleSide });
    mats.push(mat);
    const mesh = new Mesh(planeGeo, mat);
    mesh.position.set(...p.pos);
    mesh.scale.set(p.scale[0], p.scale[1], 1);
    mesh.lookAt(0, 0, 0);
    scene.add(mesh);
  }
  const pmrem = new PMREMGenerator(gl);
  const rt = pmrem.fromScene(scene, 0.035);
  pmrem.dispose();
  domeGeo.dispose();
  domeMat.dispose();
  planeGeo.dispose();
  mats.forEach((mm) => mm.dispose());
  return rt.texture;
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * Three baked environments; the active one follows the camera blend. When two neighbouring
 * sections use different moods, intensity dips through zero at the midpoint and the map swaps
 * there, so there is never a visible pop.
 */
export function EnvironmentRig() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const maps = useMemo(() => ({ sunset: bake(gl, 'sunset'), city: bake(gl, 'city'), amber: bake(gl, 'amber') }), [gl]);

  useEffect(
    () => () => {
      Object.values(maps).forEach((t) => t.dispose());
      scene.environment = null;
    },
    [maps, scene],
  );

  useFrame(() => {
    const { progress, ranges } = readScroll();
    const b = blendAt(ranges, progress);
    const A = sectionLighting[b.from];
    const B = sectionLighting[b.to];
    let env: EnvMood;
    let intensity: number;
    if (A.env === B.env) {
      env = A.env;
      intensity = A.envIntensity + (B.envIntensity - A.envIntensity) * b.t;
    } else if (b.t < 0.5) {
      env = A.env;
      intensity = A.envIntensity * (1 - smooth(0.2, 0.5, b.t));
    } else {
      env = B.env;
      intensity = B.envIntensity * smooth(0.5, 0.8, b.t);
    }
    if (scene.environment !== maps[env]) scene.environment = maps[env];
    scene.environmentIntensity = intensity;
  });

  return null;
}
