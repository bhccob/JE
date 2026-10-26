'use client';

import { lazy, Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { ACESFilmicToneMapping } from 'three';
import { useScrollStore } from '@/lib/scrollStore';
import { WORLD } from '@/lib/world';
import { CameraRig } from './CameraRig';
import { Atmosphere } from './Atmosphere';
import { EnvironmentRig } from './EnvironmentRig';
import { ModelSlot } from './ModelSlot';
import { SolarPanel } from './models/SolarPanel';
import { EnergyParticle } from './EnergyParticle';
import { SceneShadows } from './SceneShadows';

// Set pieces used only further down the page load on approach (see SectionShell's 300px observer).
const BatteryStack = lazy(() => import('./models/BatteryStack'));
const LedBulb = lazy(() => import('./models/LedBulb'));
const ProductCarousel = lazy(() => import('./models/ProductCarousel'));
const DevControls = process.env.NODE_ENV === 'development' ? lazy(() => import('./DevControls')) : null;

function Ready({ onReady }: { onReady?: () => void }) {
  const gl = useThree((s) => s.gl);
  const get = useThree((s) => s.get);
  useEffect(() => {
    onReady?.();
    if (process.env.NODE_ENV === 'development') (window as unknown as { __r3f?: unknown }).__r3f = get;
  }, [gl, get, onReady]);
  return null;
}

function Contents({ isMobile, onReady }: { isMobile: boolean; onReady?: () => void }) {
  const near = useScrollStore((s) => s.near);
  return (
    <>
      <CameraRig isMobile={isMobile} />
      <Atmosphere isMobile={isMobile} />
      <EnvironmentRig />

      <ModelSlot position={WORLD.panel}>
        <SolarPanel isMobile={isMobile} />
      </ModelSlot>

      {near.storage && (
        <Suspense fallback={null}>
          <ModelSlot position={WORLD.battery} rotation-y={0.32}>
            <BatteryStack />
          </ModelSlot>
        </Suspense>
      )}
      {near.light && (
        <Suspense fallback={null}>
          <ModelSlot position={WORLD.bulb}>
            <LedBulb />
          </ModelSlot>
        </Suspense>
      )}
      {near.collection && (
        <Suspense fallback={null}>
          <ProductCarousel isMobile={isMobile} />
        </Suspense>
      )}

      <EnergyParticle />
      {!isMobile && <SceneShadows />}
      {DevControls && (
        <Suspense fallback={null}>
          <DevControls />
        </Suspense>
      )}
      <Ready onReady={onReady} />
    </>
  );
}

export default function Scene({ isMobile, onReady }: { isMobile: boolean; onReady?: () => void }) {
  return (
    <Canvas
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      gl={{ antialias: true, powerPreference: 'high-performance', toneMapping: ACESFilmicToneMapping }}
      camera={{ position: [0, 1.35, 15], fov: 38, near: 0.1, far: 900 }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <Suspense fallback={null}>
        <Contents isMobile={isMobile} onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
