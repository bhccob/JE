'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, InstancedMesh, MathUtils, MeshStandardMaterial, Object3D, PerspectiveCamera, Vector3 } from 'three';
import { products } from '@/lib/products';
import { useCollectionStore } from '@/lib/collectionStore';
import { WORLD } from '@/lib/world';
import { ProductModel } from './ProductModel';

const N = products.length;
const STEP = (Math.PI * 2) / N;
const VISIBLE_SPAN = 2.2; // items either side of the focused one that stay drawn

/**
 * The shelf: products on a ring that the DOM drag surface in Collection.tsx turns via the
 * collection store. The ring eases toward the store's target; drag velocity spins each model.
 */
export default function ProductCarousel({ isMobile }: { isMobile: boolean }) {
  const ring = useRef<Group>(null);
  const items = useRef<(Group | null)[]>([]);
  const spinners = useRef<(Group | null)[]>([]);
  const pedestals = useRef<InstancedMesh>(null);
  const current = useRef(0);
  const spin = useRef(0);
  const dummy = useMemo(() => new Object3D(), []);
  const pedestalMat = useMemo(() => new MeshStandardMaterial({ color: '#0c1410', roughness: 0.55, metalness: 0.2 }), []);
  const quicklook = useCollectionStore((s) => s.quicklook);
  const radius = WORLD.ringRadius;

  useFrame(({ clock }, dt) => {
    const state = useCollectionStore.getState();
    current.current = MathUtils.damp(current.current, state.target, 6, dt);
    // Consume drag spin from the store, then let it decay.
    if (state.spin !== 0) {
      spin.current += state.spin;
      useCollectionStore.setState({ spin: 0 });
    }
    spin.current = MathUtils.damp(spin.current, 0, 1.6, dt);

    const time = clock.elapsedTime;
    for (let i = 0; i < N; i++) {
      // Signed distance from the focused slot, wrapped to (-N/2, N/2].
      let d = i - current.current;
      d = ((((d + N / 2) % N) + N) % N) - N / 2;
      const a = d * STEP;
      const g = items.current[i];
      const visible = Math.abs(d) < VISIBLE_SPAN;
      if (g) {
        g.visible = visible;
        g.position.set(Math.sin(a) * radius, 0, Math.cos(a) * radius);
        const focus = 1 - Math.min(1, Math.abs(d));
        g.scale.setScalar((isMobile ? 1 : 1.12) * (0.78 + 0.32 * focus));
      }
      const s = spinners.current[i];
      if (s) s.rotation.y = time * 0.25 + i * 0.7 + spin.current * (1 + (i % 3) * 0.15);

      if (pedestals.current) {
        dummy.position.set(Math.sin(a) * radius, 0.02, Math.cos(a) * radius);
        dummy.scale.setScalar(visible ? 1 : 0.0001);
        dummy.updateMatrix();
        pedestals.current.setMatrixAt(i, dummy.matrix);
      }
    }
    if (pedestals.current) pedestals.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <group ref={ring} position={WORLD.carousel} visible={!quicklook}>
        <instancedMesh ref={pedestals} args={[undefined, undefined, N]} material={pedestalMat}>
          <cylinderGeometry args={[0.5, 0.54, 0.03, 48]} />
        </instancedMesh>
        {products.map((p, i) => (
          <group
            key={p.id}
            ref={(el) => {
              items.current[i] = el;
            }}
          >
            <group
              position={[0, 0.04, 0]}
              ref={(el) => {
                spinners.current[i] = el;
              }}
            >
              <ProductModel product={p} />
            </group>
          </group>
        ))}
      </group>
      {quicklook && <QuickLookStage id={quicklook} isMobile={isMobile} />}
    </>
  );
}

/**
 * Quick look focus mode. The product floats in front of the (frozen) camera, offset into the
 * part of the screen the dialog leaves free: left of the 420px panel on desktop, above the
 * bottom sheet on mobile. Drag on the dialog orbits it via the collection store.
 */
function QuickLookStage({ id, isMobile }: { id: string; isMobile: boolean }) {
  const product = products.find((p) => p.id === id);
  const holder = useRef<Group>(null);
  const model = useRef<Group>(null);
  const v = useMemo(() => ({ fwd: new Vector3(), right: new Vector3(), up: new Vector3(), at: new Vector3() }), []);
  const yaw = useRef(-0.5);
  const pitch = useRef(0.15);
  const zoom = useRef(0.6);

  useFrame(({ camera, size }, dt) => {
    const cam = camera as PerspectiveCamera;
    const st = useCollectionStore.getState();
    const dist = 3;
    cam.getWorldDirection(v.fwd);
    v.right.crossVectors(v.fwd, cam.up).normalize();
    v.up.crossVectors(v.right, v.fwd).normalize();
    const halfH = Math.tan(MathUtils.degToRad(cam.fov / 2)) * dist;
    const halfW = halfH * (size.width / size.height);
    // NDC centre of the free viewer area.
    const ndcX = isMobile ? 0 : (size.width - 452) / 2 / size.width * 2 - 1;
    const ndcY = isMobile ? 0.48 : 0;
    v.at.copy(cam.position).addScaledVector(v.fwd, dist).addScaledVector(v.right, ndcX * halfW).addScaledVector(v.up, ndcY * halfH);

    yaw.current = MathUtils.damp(yaw.current, st.qlYaw, 8, dt);
    pitch.current = MathUtils.damp(pitch.current, st.qlPitch, 8, dt);
    zoom.current = MathUtils.damp(zoom.current, st.qlZoom, 6, dt);

    if (holder.current) {
      holder.current.position.copy(v.at);
      holder.current.quaternion.copy(cam.quaternion);
    }
    if (model.current) {
      model.current.rotation.set(pitch.current, yaw.current, 0);
      model.current.scale.setScalar((isMobile ? 0.8 : 1.05) * zoom.current);
    }
  });

  if (!product) return null;
  return (
    <group ref={holder}>
      <group ref={model}>
        <group position={[0, -0.45, 0]}>
          <ProductModel product={product} />
        </group>
      </group>
    </group>
  );
}
