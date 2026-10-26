'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useControls } from 'leva';

/**
 * Development-only (Scene imports this behind NODE_ENV === 'development'; the <Leva> panel itself
 * is mounted by Stage3D and stays hidden unless the URL has ?leva). Reports live draw calls
 * for the main pass against the < 40 budget.
 */
export default function DevControls() {
  const gl = useThree((s) => s.gl);
  const [, set] = useControls('Scene', () => ({ drawCalls: { value: 0, disabled: true } }));
  const frame = useRef(0);

  useFrame(() => {
    if (++frame.current % 30 === 0) set({ drawCalls: gl.info.render.calls });
  });

  return null;
}
