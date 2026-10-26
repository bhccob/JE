'use client';

import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useTranslations } from 'next-intl';
import {
  CanvasTexture,
  ExtrudeGeometry,
  Group,
  InstancedBufferAttribute,
  InstancedMesh,
  Matrix4,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  Shape,
  SRGBColorSpace,
} from 'three';
import { readScroll, sectionProgress, useScrollStore } from '@/lib/scrollStore';
import { clsx } from '@/lib/clsx';

const W = 1.9;
const H = 1.15;
const FRAME = 0.045;
const DEPTH = 0.042;
const GAP = 0.012;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

function cellTexture() {
  const s = 256;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const g = c.getContext('2d')!;
  // All-black module: the dark backsheet shows through the chamfered corners of the mono cells.
  g.fillStyle = '#0d1114';
  g.fillRect(0, 0, s, s);
  const k = 26;
  g.beginPath();
  g.moveTo(k, 0);
  g.lineTo(s - k, 0);
  g.lineTo(s, k);
  g.lineTo(s, s - k);
  g.lineTo(s - k, s);
  g.lineTo(k, s);
  g.lineTo(0, s - k);
  g.lineTo(0, k);
  g.closePath();
  const grad = g.createLinearGradient(0, 0, s, s);
  grad.addColorStop(0, '#13285a');
  grad.addColorStop(1, '#0a1838');
  g.fillStyle = grad;
  g.fill();
  g.save();
  g.clip();
  g.strokeStyle = 'rgba(170,190,225,0.16)';
  g.lineWidth = 1;
  for (let y = 4; y < s; y += 6) {
    g.beginPath();
    g.moveTo(0, y);
    g.lineTo(s, y);
    g.stroke();
  }
  g.fillStyle = '#b9c3cf';
  for (const x of [0.17, 0.39, 0.61, 0.83]) g.fillRect(x * s - 1.5, 0, 3, s);
  g.fillStyle = 'rgba(10,20,40,0.9)';
  g.fillRect(0, s / 2 - 1, s, 2); // half-cut line
  g.restore();
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/** Adds a per-instance aFade attribute that scales alpha, so cells can fade in one by one. */
function withInstanceFade(mat: MeshPhysicalMaterial) {
  mat.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aFade;\nvarying float vFade;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvFade = aFade;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying float vFade;')
      .replace('#include <alphamap_fragment>', '#include <alphamap_fragment>\ndiffuseColor.a *= vFade;');
  };
  mat.customProgramCacheKey = () => 'cell-fade';
  return mat;
}

export const PANEL_HOTSPOTS = [
  { id: 'wattage', pos: [-0.5, 0.28, 0.04] },
  { id: 'efficiency', pos: [0.42, -0.08, 0.04] },
  { id: 'warranty', pos: [0.92, -0.55, 0.03] },
] as const;

interface Props {
  isMobile?: boolean;
  /** Fixed assembly progress (carousel, quick look). Omit to follow the Capture section. */
  staticProgress?: number;
  hotspots?: boolean;
  variant?: 'bifacial';
  stand?: boolean;
}

export function SolarPanel({ isMobile = false, staticProgress, hotspots = staticProgress === undefined, variant, stand = true }: Props) {
  const cols = isMobile ? 3 : 6;
  const rows = isMobile ? 3 : 4;
  const count = cols * rows;
  const cellW = (W - 2 * FRAME - GAP * (cols + 1)) / cols;
  const cellH = (H - 2 * FRAME - GAP * (rows + 1)) / rows;

  const frameRef = useRef<Group>(null);
  const cells = useRef<InstancedMesh>(null);
  const glassRef = useRef<Group>(null);
  const last = useRef(-1);
  const showHotspots = useRef(false);
  const hotspotGroup = useRef<Group>(null);

  const frameGeo = useMemo(() => {
    const outer = new Shape();
    outer.moveTo(-W / 2, -H / 2);
    outer.lineTo(W / 2, -H / 2);
    outer.lineTo(W / 2, H / 2);
    outer.lineTo(-W / 2, H / 2);
    outer.closePath();
    const hole = new Shape();
    const iw = W / 2 - FRAME;
    const ih = H / 2 - FRAME;
    hole.moveTo(-iw, -ih);
    hole.lineTo(-iw, ih);
    hole.lineTo(iw, ih);
    hole.lineTo(iw, -ih);
    hole.closePath();
    outer.holes.push(hole);
    const g = new ExtrudeGeometry(outer, { depth: DEPTH, bevelEnabled: true, bevelThickness: 0.005, bevelSize: 0.005, bevelSegments: 2, curveSegments: 1 });
    g.translate(0, 0, -DEPTH / 2);
    return g;
  }, []);

  const metal = useMemo(() => new MeshStandardMaterial({ color: '#d6dde1', metalness: 0.85, roughness: 0.32, transparent: true }), []);
  const backsheet = useMemo(
    () => new MeshStandardMaterial({ color: variant === 'bifacial' ? '#1c2a3a' : '#101418', roughness: 0.7, transparent: true }),
    [variant],
  );
  const cellMat = useMemo(
    () =>
      withInstanceFade(
        new MeshPhysicalMaterial({
          map: cellTexture(),
          metalness: 0.3,
          roughness: 0.34,
          clearcoat: 1,
          clearcoatRoughness: 0.1,
          iridescence: 0.4,
          iridescenceIOR: 1.35,
          transparent: true,
        }),
      ),
    [],
  );
  const glassMat = useMemo(
    () =>
      new MeshPhysicalMaterial({
        // Not white: three keeps (1 - transmission) of the diffuse, and white turns into a lit veil over the dark cells.
        color: '#8fa3b5',
        transmission: 0,
        roughness: 0.15,
        ior: 1.5,
        thickness: 0.01,
        metalness: 0,
        specularIntensity: 0.45,
        envMapIntensity: 0.5,
        transparent: true,
        opacity: 0,
      }),
    [],
  );

  useEffect(
    () => () => {
      frameGeo.dispose();
      metal.dispose();
      backsheet.dispose();
      cellMat.map?.dispose();
      cellMat.dispose();
      glassMat.dispose();
    },
    [frameGeo, metal, backsheet, cellMat, glassMat],
  );

  const layout = useMemo(() => {
    const out: { x: number; y: number; d: number }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        out.push({
          x: -W / 2 + FRAME + GAP + cellW / 2 + c * (cellW + GAP),
          y: -H / 2 + FRAME + GAP + cellH / 2 + r * (cellH + GAP),
          // Diagonal sweep from the bottom-left corner.
          d: (c + r) / Math.max(1, cols + rows - 2),
        });
      }
    }
    return out;
  }, [cols, rows, cellW, cellH]);

  useLayoutEffect(() => {
    const mesh = cells.current;
    if (!mesh) return;
    mesh.geometry.setAttribute('aFade', new InstancedBufferAttribute(new Float32Array(count), 1));
    last.current = -1;
  }, [count]);

  const dummy = useMemo(() => new Object3D(), []);
  const m4 = useMemo(() => new Matrix4(), []);

  useFrame(() => {
    const p = staticProgress ?? sectionProgress(readScroll().ranges, 'capture', readScroll().progress);
    if (Math.abs(p - last.current) < 0.0005) return;
    last.current = p;

    // Frame: 0.0 - 0.2
    const f = easeOut(clamp01(p / 0.2));
    if (frameRef.current) {
      frameRef.current.visible = f > 0.001;
      frameRef.current.position.y = -0.4 * (1 - f);
      frameRef.current.scale.setScalar(0.92 + 0.08 * f);
    }
    metal.opacity = f;
    backsheet.opacity = f;
    const frameSolid = f >= 0.999;
    if (metal.transparent === frameSolid) {
      metal.transparent = !frameSolid;
      backsheet.transparent = !frameSolid;
      metal.needsUpdate = backsheet.needsUpdate = true;
    }

    // Cells: 0.2 - 0.7, staggered
    const mesh = cells.current;
    if (mesh) {
      const fade = mesh.geometry.getAttribute('aFade') as InstancedBufferAttribute | undefined;
      let allIn = true;
      layout.forEach((cell, k) => {
        const e = easeOut(clamp01((p - 0.2 - cell.d * 0.3) / 0.2));
        if (e < 1) allIn = false;
        dummy.position.set(cell.x, cell.y, 0.006 + (1 - e) * 0.38);
        dummy.rotation.set((1 - e) * -0.7, 0, (1 - e) * 0.2);
        dummy.scale.setScalar(0.5 + 0.5 * e);
        dummy.updateMatrix();
        mesh.setMatrixAt(k, m4.copy(dummy.matrix));
        if (fade) fade.setX(k, e);
      });
      mesh.instanceMatrix.needsUpdate = true;
      if (fade) fade.needsUpdate = true;
      // Opaque once settled, so the transmissive glass can see them in its pass.
      if (cellMat.transparent === allIn) {
        cellMat.transparent = !allIn;
        cellMat.needsUpdate = true;
      }
    }

    // Glass: 0.7 - 1.0, transmission ramps 0 -> 0.9
    const g = clamp01((p - 0.7) / 0.3);
    glassMat.transmission = 0.9 * g;
    glassMat.opacity = g;
    if (glassRef.current) glassRef.current.visible = g > 0.001;

    const show = p > 0.82;
    if (show !== showHotspots.current) {
      showHotspots.current = show;
      if (hotspotGroup.current) hotspotGroup.current.visible = show;
      if (hotspots) useScrollStore.setState({ hotspotsReady: show });
    }
  });

  return (
    <group>
      {stand && (
        <group>
          {[-0.7, 0.7].map((x) => (
            <mesh key={x} position={[x, 0.36, -0.12]} material={metal}>
              <boxGeometry args={[0.05, 0.72, 0.05]} />
            </mesh>
          ))}
          <mesh position={[0, 0.06, -0.12]} material={metal}>
            <boxGeometry args={[1.6, 0.04, 0.05]} />
          </mesh>
        </group>
      )}
      <group position={[0, stand ? 0.95 : 0, 0]} rotation={stand ? [-0.36, -0.32, 0] : [0, 0, 0]}>
        <group ref={frameRef}>
          <mesh geometry={frameGeo} material={metal} />
          <mesh position={[0, 0, -0.012]} material={backsheet}>
            <boxGeometry args={[W - 2 * FRAME + 0.01, H - 2 * FRAME + 0.01, 0.01]} />
          </mesh>
          <mesh position={[0.55, 0.3, -0.03]} material={backsheet}>
            <boxGeometry args={[0.16, 0.1, 0.03]} />
          </mesh>
        </group>
        <instancedMesh ref={cells} args={[undefined, undefined, count]} material={cellMat} frustumCulled={false}>
          <planeGeometry args={[cellW, cellH]} />
        </instancedMesh>
        <group ref={glassRef} visible={false}>
          <mesh position={[0, 0, 0.016]} material={glassMat}>
            <planeGeometry args={[W - 2 * FRAME + 0.006, H - 2 * FRAME + 0.006]} />
          </mesh>
        </group>
        {hotspots && (
          <group ref={hotspotGroup} visible={false}>
            {PANEL_HOTSPOTS.map((h) => (
              <Hotspot key={h.id} id={h.id} position={[...h.pos]} />
            ))}
          </group>
        )}
      </group>
    </group>
  );
}

function Hotspot({ id, position }: { id: (typeof PANEL_HOTSPOTS)[number]['id']; position: [number, number, number] }) {
  const t = useTranslations('capture');
  const active = useScrollStore((s) => s.hotspot === id);
  const ready = useScrollStore((s) => s.hotspotsReady);
  const setHotspot = useScrollStore((s) => s.setHotspot);
  return (
    <Html position={position} zIndexRange={[20, 0]} style={{ pointerEvents: ready ? 'auto' : 'none' }}>
      <div
        className={clsx('relative -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500 ease-[var(--ease-out-expo)]', ready ? 'opacity-100' : 'opacity-0')}
        onMouseEnter={() => setHotspot(id)}
        onMouseLeave={() => setHotspot(null)}
        onClick={() => setHotspot(active ? null : id)}
      >
        <span className="hotspot-dot relative grid size-7 cursor-pointer place-items-center rounded-full">
          <span className="absolute inset-0 rounded-full border border-bone/50" />
          <span className="size-2.5 rounded-full bg-bone shadow-[0_0_12px_rgba(234,241,235,0.9)]" />
        </span>
        <div
          className={clsx(
            'absolute left-9 top-1/2 w-56 -translate-y-1/2 rounded-[14px] border border-white/12 bg-night-900/85 p-3.5 backdrop-blur-md transition-[opacity,transform] duration-300 ease-[var(--ease-out-expo)]',
            active ? 'translate-x-0 opacity-100' : 'pointer-events-none -translate-x-2 opacity-0',
          )}
        >
          <p className="text-[0.75rem] text-mist">{t(`hotspots.${id}.label`)}</p>
          <p className="num mt-0.5 text-[1.375rem] leading-tight text-bone">{t(`hotspots.${id}.value`)}</p>
          <p className="mt-1.5 text-[0.8125rem] leading-snug text-mist">{t(`hotspots.${id}.detail`)}</p>
        </div>
      </div>
    </Html>
  );
}
