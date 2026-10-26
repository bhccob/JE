'use client';

import { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import { Color, MeshStandardMaterial } from 'three';
import type { Product } from '@/lib/products';
import { SolarPanel } from './SolarPanel';
import BatteryStack from './BatteryStack';
import LedBulb from './LedBulb';

/** Every product, normalised to roughly a 1-unit footprint standing on y = 0. */
export function ProductModel({ product }: { product: Product }) {
  switch (product.kind) {
    case 'panel':
      return (
        <group position={[0, 0.5, 0]} rotation={[-0.42, 0, 0]} scale={0.54}>
          <SolarPanel staticProgress={1} stand={false} hotspots={false} variant={product.variant === 'bifacial' ? 'bifacial' : undefined} />
        </group>
      );
    case 'battery':
      return (
        <group scale={product.variant === 'large' ? 0.5 : 0.66}>
          <BatteryStack staticProgress={1} modules={product.variant === 'large' ? 4 : 2} compact />
        </group>
      );
    case 'bulb':
      return (
        <group position={[0, 0.56, 0]} rotation-z={Math.PI} scale={1.1}>
          <LedBulb staticKelvin={2900} staticIntensity={1.8} />
        </group>
      );
    case 'inverter':
      return <Inverter commercial={product.variant === 'commercial'} />;
    case 'ledPanel':
      return <CeilingPanel />;
    case 'streetLight':
      return <StreetLight solar={product.variant === 'solar'} />;
    case 'rail':
      return <RailKit />;
    case 'connector':
      return <ConnectorKit />;
  }
}

function useMat(color: string, roughness = 0.5, metalness = 0, emissive?: string, emissiveIntensity = 0) {
  return useMemo(
    () =>
      new MeshStandardMaterial({
        color,
        roughness,
        metalness,
        ...(emissive ? { emissive: new Color(emissive), emissiveIntensity, toneMapped: false } : {}),
      }),
    [color, roughness, metalness, emissive, emissiveIntensity],
  );
}

function Inverter({ commercial }: { commercial: boolean }) {
  const body = useMat(commercial ? '#c9cfcc' : '#eef2ef', 0.45, 0.05);
  const dark = useMat('#151b18', 0.6);
  const led = useMat('#0b130f', 0.4, 0, '#63d79b', 2);
  const w = commercial ? 0.7 : 0.6;
  const h = commercial ? 0.86 : 0.72;
  return (
    <group position={[0, h / 2 + 0.04, 0]}>
      <RoundedBox args={[w, h, 0.22]} radius={0.04} smoothness={3} material={body} />
      <mesh position={[0, h * 0.18, 0.111]} material={dark}>
        <planeGeometry args={[w * 0.42, h * 0.14]} />
      </mesh>
      <mesh position={[0, h * 0.02, 0.112]} material={led}>
        <boxGeometry args={[w * 0.4, 0.012, 0.004]} />
      </mesh>
      <mesh position={[0, -h / 2 - 0.02, 0]} material={dark}>
        <boxGeometry args={[w * 0.8, 0.04, 0.16]} />
      </mesh>
      {commercial && (
        <mesh position={[0, 0, -0.14]} material={dark}>
          <boxGeometry args={[w * 0.9, h * 0.9, 0.06]} />
        </mesh>
      )}
    </group>
  );
}

function CeilingPanel() {
  const frame = useMat('#e9ecee', 0.35, 0.2);
  const face = useMat('#ffffff', 0.9, 0, '#fff4e6', 1.3);
  return (
    <group position={[0, 0.52, 0]} rotation={[-0.25, 0, 0]}>
      <RoundedBox args={[0.92, 0.92, 0.045]} radius={0.015} smoothness={2} material={frame} />
      <mesh position={[0, 0, 0.024]} material={face}>
        <planeGeometry args={[0.84, 0.84]} />
      </mesh>
    </group>
  );
}

function StreetLight({ solar }: { solar: boolean }) {
  const pole = useMat('#3b4440', 0.5, 0.6);
  const head = useMat('#2a302d', 0.4, 0.5);
  const lamp = useMat('#ffffff', 0.5, 0, '#fff0d8', 2.2);
  const cells = useMat('#13285a', 0.3, 0.4);
  return (
    <group>
      <mesh position={[0, 0.66, 0]} material={pole}>
        <cylinderGeometry args={[0.022, 0.032, 1.32, 12]} />
      </mesh>
      <mesh position={[0.17, 1.28, 0]} rotation-z={-1.35} material={pole}>
        <cylinderGeometry args={[0.016, 0.016, 0.36, 8]} />
      </mesh>
      <group position={[0.38, 1.3, 0]} rotation-z={0.1}>
        <RoundedBox args={[0.36, 0.05, 0.15]} radius={0.02} smoothness={2} material={head} />
        <mesh position={[0, -0.027, 0]} rotation-x={Math.PI / 2} material={lamp}>
          <planeGeometry args={[0.28, 0.1]} />
        </mesh>
      </group>
      {solar && (
        <group position={[-0.05, 1.46, 0]} rotation={[0, 0, 0.5]}>
          <mesh material={pole}>
            <boxGeometry args={[0.46, 0.02, 0.3]} />
          </mesh>
          <mesh position={[0, 0.012, 0]} rotation-x={-Math.PI / 2} material={cells}>
            <planeGeometry args={[0.42, 0.26]} />
          </mesh>
        </group>
      )}
      <mesh position={[0, 0.02, 0]} material={head}>
        <cylinderGeometry args={[0.09, 0.11, 0.04, 16]} />
      </mesh>
    </group>
  );
}

function RailKit() {
  const alu = useMat('#cfd6da', 0.3, 1);
  const clamp = useMat('#2a302d', 0.45, 0.4);
  return (
    <group position={[0, 0.18, 0]} rotation={[0, 0.5, 0.18]}>
      {[-0.16, 0.16].map((z) => (
        <mesh key={z} position={[0, 0, z]} material={alu}>
          <boxGeometry args={[1.15, 0.05, 0.045]} />
        </mesh>
      ))}
      {[-0.42, 0.42].map((x) =>
        [-0.16, 0.16].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0.04, z]} material={clamp}>
            <boxGeometry args={[0.05, 0.035, 0.07]} />
          </mesh>
        )),
      )}
    </group>
  );
}

function ConnectorKit() {
  const black = useMat('#16191a', 0.5, 0.1);
  const red = useMat('#b8322a', 0.45, 0.1);
  const tip = useMat('#c9ccd1', 0.25, 1);
  return (
    <group position={[0, 0.24, 0]}>
      <mesh rotation-x={Math.PI / 2} material={black}>
        <torusGeometry args={[0.26, 0.035, 12, 48]} />
      </mesh>
      <mesh position={[0, 0.075, 0]} rotation-x={Math.PI / 2} material={red}>
        <torusGeometry args={[0.24, 0.035, 12, 48]} />
      </mesh>
      <group position={[0.05, 0.28, 0.1]} rotation-z={1.2}>
        <mesh material={black}>
          <cylinderGeometry args={[0.04, 0.04, 0.22, 14]} />
        </mesh>
        <mesh position={[0, 0.14, 0]} material={tip}>
          <cylinderGeometry args={[0.018, 0.018, 0.08, 10]} />
        </mesh>
      </group>
    </group>
  );
}
