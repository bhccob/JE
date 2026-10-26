'use client';

import { Suspense, type ReactNode } from 'react';
import { useGLTF } from '@react-three/drei';
import type { GroupProps } from '@react-three/fiber';

/**
 * GLB swap point. Pass `src="/models/solar-panel.glb"` (file in /public/models) to replace the
 * procedural fallback with a real asset. Until then the children (procedural geometry) render.
 */
export function ModelSlot({ src, children, ...group }: { src?: string; children: ReactNode } & GroupProps) {
  if (!src) return <group {...group}>{children}</group>;
  return (
    <group {...group}>
      <Suspense fallback={children}>
        <Gltf src={src} />
      </Suspense>
    </group>
  );
}

function Gltf({ src }: { src: string }) {
  const { scene } = useGLTF(src);
  return <primitive object={scene} />;
}
