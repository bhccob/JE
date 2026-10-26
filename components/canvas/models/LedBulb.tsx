'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  AdditiveBlending,
  CatmullRomCurve3,
  Color,
  LatheGeometry,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PointLight,
  ShaderMaterial,
  Sprite,
  SpriteMaterial,
  TubeGeometry,
  Vector2,
  Vector3,
} from 'three';
import { readScroll, sectionProgress } from '@/lib/scrollStore';
import { kelvinToRgb } from '@/lib/kelvin';
import { glowTexture } from '../glow';

// A60 glass profile, bottom to neck (radius, y). Pendant: the base points up.
const GLASS: [number, number][] = [
  [0.0001, -0.34], [0.1, -0.326], [0.18, -0.286], [0.238, -0.222], [0.276, -0.135], [0.292, -0.035],
  [0.284, 0.06], [0.252, 0.13], [0.2, 0.185], [0.158, 0.225], [0.142, 0.252],
];

function screwProfile() {
  const pts: Vector2[] = [new Vector2(0.142, 0.25), new Vector2(0.15, 0.265)];
  // E27 thread: radius alternates every 0.0125 along the base.
  for (let i = 0; i <= 16; i++) pts.push(new Vector2(i % 2 ? 0.146 : 0.137, 0.275 + i * 0.0125));
  pts.push(new Vector2(0.128, 0.48), new Vector2(0.09, 0.49), new Vector2(0.05, 0.5), new Vector2(0.0001, 0.502));
  return pts;
}

/**
 * Filament: a helix around the stem, closed by two short legs back to the stem tip.
 * Parameterised by turns so the tube reads as one continuous LED filament.
 */
function filamentCurve() {
  const pts: Vector3[] = [new Vector3(0, 0.05, 0), new Vector3(0.05, 0.03, 0)];
  const turns = 3.25;
  const n = 64;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const a = t * turns * Math.PI * 2;
    const r = 0.078 - 0.012 * Math.sin(t * Math.PI);
    pts.push(new Vector3(Math.cos(a) * r, 0.01 - t * 0.2, Math.sin(a) * r));
  }
  pts.push(new Vector3(0.02, -0.21, 0), new Vector3(0, -0.2, 0));
  return new CatmullRomCurve3(pts, false, 'centripetal');
}

const wallVertex = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const wallFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  uniform vec2 uCenter;
  uniform vec2 uSize;
  varying vec2 vUv;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  void main() {
    vec2 p = (vUv - uCenter) * uSize;
    float d = length(p);
    float pool = exp(-d * d / 0.42) * 0.9 + 0.12 / (1.0 + d * d * 4.0);
    vec3 base = vec3(0.012, 0.017, 0.015) * (0.92 + 0.16 * hash(floor(vUv * 900.0)));
    vec3 col = base + uColor * uIntensity * pool * 0.42;
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

interface Props {
  /** Fixed glow and color for the shelf / quick look. Omit to follow the Light section and slider. */
  staticKelvin?: number;
  staticIntensity?: number;
  wall?: boolean;
  cord?: boolean;
}

export default function LedBulb({ staticKelvin, staticIntensity, wall = staticKelvin === undefined, cord = staticKelvin === undefined }: Props) {
  const light = useRef<PointLight>(null);
  const halo = useRef<Sprite>(null);
  const last = useRef({ k: -1, i: -1 });

  const glassGeo = useMemo(() => new LatheGeometry(GLASS.map(([r, y]) => new Vector2(r, y)), 48), []);
  const screwGeo = useMemo(() => new LatheGeometry(screwProfile(), 40), []);
  const filamentGeo = useMemo(() => new TubeGeometry(filamentCurve(), 260, 0.0062, 8, false), []);

  const glassMat = useMemo(
    () =>
      new MeshPhysicalMaterial({
        color: '#ffffff',
        transmission: 1,
        roughness: 0.02,
        thickness: 0.08,
        ior: 1.5,
        specularIntensity: 1,
        attenuationColor: new Color('#fff3e0'),
        attenuationDistance: 1.5,
      }),
    [],
  );
  const metal = useMemo(() => new MeshStandardMaterial({ color: '#d2d5d8', metalness: 1, roughness: 0.24 }), []);
  const filamentMat = useMemo(() => new MeshStandardMaterial({ color: '#000000', emissive: '#ffb16e', emissiveIntensity: 0, toneMapped: false }), []);
  const stemMat = useMemo(() => new MeshStandardMaterial({ color: '#f4efe6', roughness: 0.2, transparent: true, opacity: 0.5 }), []);
  const wallMat = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: wallVertex,
        fragmentShader: wallFragment,
        uniforms: {
          uColor: { value: new Color('#ffb16e') },
          uIntensity: { value: 0 },
          uCenter: { value: new Vector2(0.5, 0.35) },
          uSize: { value: new Vector2(6, 4.6) },
        },
      }),
    [],
  );

  useEffect(
    () => () => {
      [glassGeo, screwGeo, filamentGeo, glassMat, metal, filamentMat, stemMat, wallMat].forEach((o) => o.dispose());
    },
    [glassGeo, screwGeo, filamentGeo, glassMat, metal, filamentMat, stemMat, wallMat],
  );

  const tmp = useMemo(() => new Color(), []);

  useFrame(() => {
    const s = readScroll();
    const kelvin = staticKelvin ?? s.temperature;
    // Filament emissive 0 -> 3 across Light section progress.
    const intensity = staticIntensity ?? 3 * sectionProgress(s.ranges, 'light', s.progress);
    if (kelvin === last.current.k && Math.abs(intensity - last.current.i) < 0.001) return;
    last.current = { k: kelvin, i: intensity };

    const [r, g, b] = kelvinToRgb(kelvin);
    tmp.setRGB(r, g, b);
    filamentMat.emissive.copy(tmp);
    filamentMat.emissiveIntensity = intensity;
    wallMat.uniforms.uColor.value.copy(tmp);
    wallMat.uniforms.uIntensity.value = intensity;
    if (light.current) {
      light.current.color.copy(tmp);
      light.current.intensity = intensity * 1.4;
    }
    if (halo.current) {
      const m = halo.current.material as SpriteMaterial;
      m.color.copy(tmp);
      m.opacity = Math.min(0.6, intensity / 5);
      halo.current.scale.setScalar(0.45 + intensity * 0.12);
    }
  });

  return (
    <group>
      {cord && (
        <mesh position={[0, 0.5 + 1.6, 0]} material={metal}>
          <cylinderGeometry args={[0.006, 0.006, 3.2, 8]} />
        </mesh>
      )}
      <mesh geometry={screwGeo} material={metal} />
      <mesh position={[0, 0.13, 0]} material={stemMat}>
        <cylinderGeometry args={[0.012, 0.02, 0.24, 10]} />
      </mesh>
      <mesh geometry={filamentGeo} material={filamentMat} />
      <mesh geometry={glassGeo} material={glassMat} />
      <sprite ref={halo} position={[0, -0.08, 0]}>
        <spriteMaterial map={glowTexture()} color="#ffb16e" blending={AdditiveBlending} transparent depthWrite={false} opacity={0} toneMapped={false} />
      </sprite>
      {wall && (
        <>
          <pointLight ref={light} position={[0, -0.08, 0]} intensity={0} distance={7} decay={2} />
          {/* The wall patch: same color, same intensity, so it reads as light the bulb is throwing. */}
          <mesh position={[0, 0.7, -1.6]} material={wallMat}>
            <planeGeometry args={[6, 4.6]} />
          </mesh>
          <mesh rotation-x={-Math.PI / 2} position={[0, -1.548, -0.6]}>
            <circleGeometry args={[3.2, 48]} />
            <meshStandardMaterial color="#0a100d" roughness={0.85} />
          </mesh>
        </>
      )}
    </group>
  );
}
