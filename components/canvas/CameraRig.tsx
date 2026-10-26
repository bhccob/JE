'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils, PerspectiveCamera, Vector3 } from 'three';
import { keyframesFor, type CameraKeyframe, type SectionId } from '@/lib/cameraKeyframes';
import { readScroll } from '@/lib/scrollStore';
import { blendAt } from '@/lib/blend';
import { useCollectionStore } from '@/lib/collectionStore';

const HOLD_DOLLY = 0.07; // move 7% closer to the target across a long hold

/**
 * Camera is never animated by GSAP. Each frame: find the two nearest keyframes for the current
 * scroll progress, lerp position/target/fov by the blend t, then critically damp toward that
 * pose (exp decay, frame-rate independent) so scrub lag and fast flicks both feel continuous.
 */
export function CameraRig({ isMobile, reduced = false }: { isMobile: boolean; reduced?: boolean }) {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const frames = useMemo(() => {
    const map = new Map<SectionId, CameraKeyframe>();
    keyframesFor(isMobile).forEach((k) => map.set(k.id, k));
    return map;
  }, [isMobile]);

  const pos = useRef(new Vector3(...frames.get('hero')!.position));
  const tgt = useRef(new Vector3(...frames.get('hero')!.target));
  const fov = useRef(frames.get('hero')!.fov);
  const pointer = useRef({ x: 0, y: 0 });
  const tmp = useMemo(() => ({ a: new Vector3(), b: new Vector3(), p: new Vector3(), t: new Vector3() }), []);

  useEffect(() => {
    if (isMobile) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [isMobile]);

  useFrame((_, dt) => {
    const { progress, ranges } = readScroll();
    const b = blendAt(ranges, progress);
    const A = frames.get(b.from)!;
    const B = frames.get(b.to)!;

    tmp.p.lerpVectors(tmp.a.set(...A.position), tmp.b.set(...B.position), b.t);
    tmp.t.lerpVectors(tmp.a.set(...A.target), tmp.b.set(...B.target), b.t);
    const wantFov = MathUtils.lerp(A.fov, B.fov, b.t);

    if (b.from === b.to && b.hold > 0) tmp.p.lerp(tmp.t, HOLD_DOLLY * b.hold);

    // Quick look focus mode freezes the rig so the product sits still in front of the camera.
    if (useCollectionStore.getState().quicklook) return;

    // Tiny pointer parallax (desktop only) so resting frames still feel alive.
    tmp.p.x += pointer.current.x * 0.12;
    tmp.p.y -= pointer.current.y * 0.06;

    const k = reduced ? 1 : 1 - Math.exp(-dt * 5);
    pos.current.lerp(tmp.p, k);
    tgt.current.lerp(tmp.t, k);
    fov.current = MathUtils.lerp(fov.current, wantFov, k);

    camera.position.copy(pos.current);
    camera.lookAt(tgt.current);
    if (Math.abs(camera.fov - fov.current) > 0.01) {
      camera.fov = fov.current;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
