'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { CanvasTexture, Color, InstancedMesh, Mesh, MeshStandardMaterial, Object3D, PointLight, SRGBColorSpace } from 'three';
import { readScroll, sectionProgress } from '@/lib/scrollStore';

const LEAF = new Color('#63d79b');
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

const MOD_W = 0.78;
const MOD_H = 0.34;
const MOD_D = 0.28;
const MOD_GAP = 0.022;
const PLINTH_H = 0.06;

function displayTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 128;
  const g = c.getContext('2d')!;
  g.fillStyle = '#04100b';
  g.fillRect(0, 0, 256, 128);
  g.strokeStyle = '#63d79b';
  g.lineWidth = 4;
  g.strokeRect(22, 40, 58, 48);
  g.fillStyle = '#63d79b';
  g.fillRect(80, 54, 6, 20);
  g.fillRect(30, 48, 42, 32);
  g.font = '600 50px ui-monospace, Menlo, monospace';
  g.fillText('100%', 104, 82);
  g.font = '500 16px ui-sans-serif, system-ui';
  g.fillStyle = 'rgba(99,215,155,0.7)';
  g.fillText('SOLAR  ·  GRID OFF', 24, 116);
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  return tex;
}

interface Props {
  staticProgress?: number;
  modules?: number;
  /** Product-shelf version: no wall, no light, no conduit. */
  compact?: boolean;
}

export default function BatteryStack({ staticProgress, modules = 3, compact = false }: Props) {
  const fill = useRef<Mesh>(null);
  const dots = useRef<InstancedMesh>(null);
  const light = useRef<PointLight>(null);
  const last = useRef(-1);

  const shell = useMemo(() => new MeshStandardMaterial({ color: '#e7ece9', roughness: 0.48, metalness: 0.05 }), []);
  const shellDark = useMemo(() => new MeshStandardMaterial({ color: '#d9dfdc', roughness: 0.42, metalness: 0.08 }), []);
  const trim = useMemo(() => new MeshStandardMaterial({ color: '#141a17', roughness: 0.6 }), []);
  const ledMat = useMemo(() => new MeshStandardMaterial({ color: '#0b130f', emissive: LEAF, emissiveIntensity: 0, toneMapped: false }), []);
  const stripMat = useMemo(() => new MeshStandardMaterial({ color: '#0b130f', emissive: LEAF, emissiveIntensity: 0, toneMapped: false }), []);
  const dotMat = useMemo(() => new MeshStandardMaterial({ color: '#0b130f', emissive: LEAF, emissiveIntensity: 1.6, toneMapped: false }), []);
  const screenTex = useMemo(() => displayTexture(), []);
  const screenMat = useMemo(
    () => new MeshStandardMaterial({ color: '#050b08', map: screenTex, emissive: '#ffffff', emissiveMap: screenTex, emissiveIntensity: 0, roughness: 0.2, metalness: 0.2 }),
    [screenTex],
  );

  useEffect(
    () => () => {
      [shell, shellDark, trim, ledMat, stripMat, dotMat, screenMat].forEach((m) => m.dispose());
      screenTex.dispose();
    },
    [shell, shellDark, trim, ledMat, stripMat, dotMat, screenMat, screenTex],
  );

  const stackH = modules * MOD_H + (modules - 1) * MOD_GAP;
  const invY = PLINTH_H + stackH + MOD_GAP + 0.22;
  const dummy = useMemo(() => new Object3D(), []);

  useFrame(() => {
    const p = staticProgress ?? sectionProgress(readScroll().ranges, 'storage', readScroll().progress);
    if (Math.abs(p - last.current) < 0.0005) return;
    last.current = p;

    // Charge level rises with the section; emissive 0 -> 2 per spec.
    const level = clamp01(p);
    ledMat.emissiveIntensity = 2 * level;
    stripMat.emissiveIntensity = 2 * level;
    if (fill.current) {
      fill.current.scale.y = Math.max(0.001, level);
      fill.current.position.y = PLINTH_H + 0.03 + ((stackH - 0.06) * level) / 2;
    }
    if (dots.current) {
      for (let k = 0; k < modules; k++) {
        const on = level * modules > k + 0.5 ? 1 : 0.0001;
        dummy.position.set(MOD_W / 2 - 0.07, PLINTH_H + MOD_H / 2 + k * (MOD_H + MOD_GAP), MOD_D / 2 + 0.002);
        dummy.scale.setScalar(on);
        dummy.updateMatrix();
        dots.current.setMatrixAt(k, dummy.matrix);
      }
      dots.current.instanceMatrix.needsUpdate = true;
    }
    // Inverter display wakes at 0.9.
    screenMat.emissiveIntensity = 1.4 * clamp01((p - 0.9) / 0.06);
    if (light.current) light.current.intensity = 1.6 * level;
  });

  return (
    <group>
      {!compact && (
        <RoundedBox args={[1.5, 0.05, 1.0]} radius={0.02} smoothness={2} position={[0, -0.02, 0.08]}>
          <meshStandardMaterial color="#2a302d" roughness={0.9} />
        </RoundedBox>
      )}

      <RoundedBox args={[MOD_W + 0.08, PLINTH_H, MOD_D + 0.06]} radius={0.02} smoothness={2} position={[0, PLINTH_H / 2, 0]} material={trim} />

      {Array.from({ length: modules }, (_, k) => (
        <RoundedBox
          key={k}
          args={[MOD_W, MOD_H, MOD_D]}
          radius={0.035}
          smoothness={3}
          position={[0, PLINTH_H + MOD_H / 2 + k * (MOD_H + MOD_GAP), 0]}
          material={shell}
        />
      ))}

      {/* Charge channel down the front-left of the stack */}
      <mesh position={[-MOD_W / 2 + 0.07, PLINTH_H + stackH / 2, MOD_D / 2 + 0.001]} material={trim}>
        <boxGeometry args={[0.03, stackH - 0.04, 0.004]} />
      </mesh>
      <mesh ref={fill} position={[-MOD_W / 2 + 0.07, PLINTH_H + 0.03, MOD_D / 2 + 0.004]} material={ledMat}>
        <boxGeometry args={[0.016, stackH - 0.06, 0.004]} />
      </mesh>
      <instancedMesh ref={dots} args={[undefined, undefined, modules]} material={dotMat}>
        <circleGeometry args={[0.012, 12]} />
      </instancedMesh>

      {/* Inverter with its LED strip and display */}
      <RoundedBox args={[MOD_W, 0.44, 0.24]} radius={0.04} smoothness={3} position={[0, invY, -0.02]} material={shellDark} />
      <mesh position={[0, invY - 0.12, 0.1 + 0.002]} material={stripMat}>
        <boxGeometry args={[0.5, 0.012, 0.004]} />
      </mesh>
      <mesh position={[0, invY + 0.04, 0.1 + 0.002]} material={screenMat}>
        <planeGeometry args={[0.28, 0.14]} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (MOD_W / 2 + 0.002), invY, -0.02]} rotation-y={(s * Math.PI) / 2} material={trim}>
          <planeGeometry args={[0.16, 0.3]} />
        </mesh>
      ))}

      {!compact && <pointLight ref={light} position={[0, PLINTH_H + stackH / 2, 0.45]} color={LEAF} intensity={0} distance={2.6} decay={2} />}
    </group>
  );
}
