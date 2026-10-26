'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  ShaderMaterial,
  Sprite,
  SpriteMaterial,
  Vector3,
} from 'three';
import type { SectionId, Vec3 } from '@/lib/cameraKeyframes';
import { readScroll } from '@/lib/scrollStore';
import { blendAt } from '@/lib/blend';
import { glowTexture } from './glow';

/**
 * Hand-authored path. Anchored waypoints sit at each set piece (where the particle rests while
 * the camera holds); the unanchored ones in between shape the arcs it flies along.
 */
const WAYPOINTS: { id?: SectionId; p: Vec3 }[] = [
  { id: 'hero', p: [3.1, 2.4, 7.5] },
  { p: [4.6, 5.2, 2] },
  { id: 'source', p: [4, 7.4, -5] },
  { p: [1.6, 3.6, -1.8] },
  { id: 'capture', p: [-0.16, 1.12, 0.44] },
  { p: [4.6, 2.5, -0.6] },
  { id: 'storage', p: [8.8, 0.78, -2.55] },
  { p: [13.6, 2.3, -3.6] },
  { id: 'light', p: [18, 1.47, -6] },
  { p: [21.8, 2.7, -6.6] },
  { id: 'collection', p: [25, 3.8, -7.2] },
];

const curve = new CatmullRomCurve3(
  WAYPOINTS.map((w) => new Vector3(...w.p)),
  false,
  'catmullrom',
  0.5,
);

// For a non-closed CatmullRomCurve3, getPoint(k / (N - 1)) lands exactly on waypoint k,
// so each section's anchor is just its index over the segment count (not arc length).
const ANCHOR: Partial<Record<SectionId, number>> = {};
WAYPOINTS.forEach((w, k) => {
  if (w.id) ANCHOR[w.id] = k / (WAYPOINTS.length - 1);
});
const anchorOf = (id: SectionId) => ANCHOR[id] ?? ANCHOR.collection!;

const VISIBLE: SectionId[] = ['hero', 'source', 'capture', 'storage', 'light'];
const SUNLIGHT = new Color('#ffc46b');
const CURRENT = new Color('#63d79b');
const WHITE = new Color('#ffffff');
const TRAIL = 28;

const trailVertex = /* glsl */ `
  attribute float aAge;
  uniform float uSize;
  uniform float uPixelRatio;
  varying float vAge;
  void main() {
    vAge = aAge;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * uPixelRatio * (1.0 - aAge * 0.85) / -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;
const trailFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAge;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d) * (1.0 - vAge) * uOpacity;
    gl_FragColor = vec4(uColor * a, a);
  }
`;

export function EnergyParticle() {
  const group = useRef<Group>(null);
  const core = useRef<Mesh>(null);
  const halo = useRef<Sprite>(null);
  const smoothedVel = useRef(0);
  const pos = useMemo(() => new Vector3(...WAYPOINTS[0].p), []);
  const want = useMemo(() => new Vector3(), []);
  const color = useMemo(() => new Color(), []);

  const trail = useMemo(() => {
    const geo = new BufferGeometry();
    const positions = new Float32Array(TRAIL * 3);
    const ages = new Float32Array(TRAIL);
    for (let i = 0; i < TRAIL; i++) {
      ages[i] = i / (TRAIL - 1);
      positions.set(WAYPOINTS[0].p, i * 3);
    }
    geo.setAttribute('position', new BufferAttribute(positions, 3));
    geo.setAttribute('aAge', new BufferAttribute(ages, 1));
    const mat = new ShaderMaterial({
      vertexShader: trailVertex,
      fragmentShader: trailFragment,
      uniforms: { uColor: { value: new Color() }, uOpacity: { value: 1 }, uSize: { value: 38 }, uPixelRatio: { value: 1 } },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    });
    return { geo, mat, positions };
  }, []);

  const coreMat = useMemo(() => new MeshBasicMaterial({ color: '#ffffff', toneMapped: false, transparent: true }), []);

  useFrame(({ clock, gl }, dt) => {
    const { progress, ranges, velocity } = readScroll();
    const b = blendAt(ranges, progress);
    const tA = anchorOf(b.from);
    const tB = anchorOf(b.to);
    const t = MathUtils.lerp(tA, tB, b.t);
    curve.getPoint(t, want);

    // Gentle hover while resting so it never looks parked.
    const time = clock.elapsedTime;
    want.x += Math.sin(time * 1.3) * 0.03;
    want.y += Math.sin(time * 1.9) * 0.04;
    pos.lerp(want, 1 - Math.exp(-dt * 8));

    // Visible hero -> light; fades out on the way to the collection, gone before loyalty.
    let opacity = 0;
    if (VISIBLE.includes(b.from) && VISIBLE.includes(b.to)) opacity = 1;
    else if (b.from === 'light' && b.to === 'collection') opacity = 1 - MathUtils.smoothstep(b.t, 0, 0.7);

    // Sunlight until it reaches the panel, electricity after.
    const conv = MathUtils.smoothstep(t, anchorOf('capture') - 0.04, anchorOf('capture') + 0.02);
    color.copy(SUNLIGHT).lerp(CURRENT, conv);

    const v = Math.min(1, Math.abs(velocity) / 2600);
    smoothedVel.current += (v - smoothedVel.current) * (1 - Math.exp(-dt * 4));
    const pulse = 1 + smoothedVel.current * 1.4 + Math.sin(time * 3) * 0.06;

    if (group.current) group.current.visible = opacity > 0.002;
    if (core.current) {
      core.current.position.copy(pos);
      core.current.scale.setScalar(0.032 * pulse);
    }
    coreMat.color.copy(color).lerp(WHITE, 0.55).multiplyScalar(2 + smoothedVel.current * 2);
    coreMat.opacity = opacity;
    if (halo.current) {
      halo.current.position.copy(pos);
      halo.current.scale.setScalar(0.42 * pulse);
      const hm = halo.current.material as SpriteMaterial;
      hm.color.copy(color);
      hm.opacity = opacity * 0.85;
    }

    // Shift the trail one slot and write the head.
    const arr = trail.positions;
    arr.copyWithin(3, 0, (TRAIL - 1) * 3);
    arr[0] = pos.x;
    arr[1] = pos.y;
    arr[2] = pos.z;
    (trail.geo.getAttribute('position') as BufferAttribute).needsUpdate = true;
    trail.mat.uniforms.uColor.value.copy(color);
    trail.mat.uniforms.uOpacity.value = opacity * 0.75;
    trail.mat.uniforms.uPixelRatio.value = gl.getPixelRatio();
  });

  return (
    <group ref={group}>
      <mesh ref={core} material={coreMat}>
        <sphereGeometry args={[1, 20, 12]} />
      </mesh>
      <sprite ref={halo}>
        <spriteMaterial map={glowTexture()} blending={AdditiveBlending} transparent depthWrite={false} toneMapped={false} />
      </sprite>
      <points geometry={trail.geo} material={trail.mat} frustumCulled={false} />
    </group>
  );
}
