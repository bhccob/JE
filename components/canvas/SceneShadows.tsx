'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { Group, Vector3 } from 'three';
import type { SectionId } from '@/lib/cameraKeyframes';
import { readScroll } from '@/lib/scrollStore';
import { blendAt } from '@/lib/blend';
import { WORLD } from '@/lib/world';

const SPOTS: Partial<Record<SectionId, [number, number, number]>> = {
  capture: [WORLD.panel[0], 0.003, WORLD.panel[2]],
  storage: [WORLD.battery[0], 0.003, WORLD.battery[2]],
  light: [WORLD.bulb[0], 0.003, WORLD.bulb[2]],
  collection: [WORLD.carousel[0], 0.003, WORLD.carousel[2] + WORLD.ringRadius],
};

/**
 * One ContactShadows that travels with the story instead of one per set piece: a single
 * depth pass per frame keeps the draw-call budget, and only the piece in view needs a shadow.
 * Desktop only (Scene skips it on mobile).
 */
export function SceneShadows() {
  const ref = useRef<Group>(null);
  const want = useMemo(() => new Vector3(), []);

  useFrame(() => {
    const { progress, ranges } = readScroll();
    const b = blendAt(ranges, progress);
    const id = b.t > 0.5 ? b.to : b.from;
    const spot = SPOTS[id];
    if (!ref.current) return;
    ref.current.visible = !!spot;
    if (spot) {
      want.set(...spot);
      // Jump once the camera has mostly arrived; the shadow is soft enough that this never reads as a pop.
      if (ref.current.position.distanceTo(want) > 4) ref.current.position.copy(want);
      else ref.current.position.lerp(want, 0.2);
    }
  });

  return (
    <group ref={ref}>
      <ContactShadows scale={5} blur={2.6} far={2.4} opacity={0.6} resolution={512} color="#000000" />
    </group>
  );
}
