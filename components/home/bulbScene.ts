// The live 3D bulb's scene (round 2), loaded only when Bulb3D comes near the screen, so three.js never weighs on the
// first load. A G95 filament bulb built in code: a clear glass globe turned on a lathe, six LED filaments on a glass
// stem, an E27 brass base. The filaments glow in the slider's colour temperature (kelvinBus).

import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { kelvinToRgb } from '@/lib/kelvin';
import { kelvin } from './kelvinBus';

interface Hooks {
  /** The first frame is on screen. */
  onReady: () => void;
  /** The visitor turned the bulb for the first time. */
  onTouch: () => void;
  /** The WebGL context is gone; the picture should show again. */
  onLost: () => void;
}

/**
 * Clear glass on a light page: no colour of its own, only a fresnel edge (strongest where the surface turns away) and
 * two studio-window highlights, painted as white with their own alpha so the transparent canvas composites them
 * properly over the page. The highlights sit in camera space, so they hold still while the bulb turns, as on a globe.
 */
function glassMaterial(strength: number, side: THREE.Side) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side,
    uniforms: { tint: { value: new THREE.Color(0.36, 0.32, 0.26) }, strength: { value: strength } },
    vertexShader: `
      varying vec3 vN;
      varying vec3 vV;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal);
        vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform vec3 tint;
      uniform float strength;
      varying vec3 vN;
      varying vec3 vV;
      void main() {
        vec3 n = normalize(vN);
        if (!gl_FrontFacing) n = -n;
        float edge = 1.0 - abs(dot(n, vV));
        vec3 r = reflect(-vV, n);
        float key = pow(max(dot(r, normalize(vec3(-0.5, 0.55, 0.67))), 0.0), 60.0) * 0.9;
        float soft = pow(max(dot(r, normalize(vec3(0.62, 0.3, 0.72))), 0.0), 16.0) * 0.2;
        float s = clamp(key + soft, 0.0, 1.0);
        float a = pow(edge, 2.4) * 0.5 + 0.02;
        vec3 col = mix(tint, vec3(1.0), s / max(a + s, 0.001));
        gl_FragColor = vec4(col, clamp((a + s) * strength, 0.0, 1.0));
        #include <colorspace_fragment>
      }`,
  });
}

/** Radial falloff, white in the middle: the filaments' halo and the shadow under the base. */
function softDot(inner: string, outer: string) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, inner);
  r.addColorStop(1, outer);
  g.fillStyle = r;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Builds the bulb inside `host` and runs it; returns the teardown. Throws when WebGL is unavailable. */
export function createBulb(host: HTMLElement, { onReady, onTouch, onLost }: Hooks): () => void {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const canvas = renderer.domElement;
  canvas.className = 'bulb3d__canvas';
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const env = pmrem.fromScene(room, 0.04).texture;
  room.dispose();
  scene.environment = env;

  const camera = new THREE.PerspectiveCamera(24, 1, 0.1, 60);
  camera.position.set(0, 0.8, 9.4);
  // Framed a little low, so the bulb sits high with room for the hint under it.
  camera.lookAt(0, -0.95, 0);

  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(-4, 6, 5);
  scene.add(key, new THREE.HemisphereLight(0xfff8ee, 0xd8ccb6, 0.5));

  const bulb = new THREE.Group();
  bulb.rotation.y = -0.5;
  scene.add(bulb);

  // The globe: a sphere of radius 1 that narrows through the neck into the collar.
  const globe: THREE.Vector2[] = [];
  const meet = -0.97;
  for (let i = 0; i <= 48; i++) {
    const a = Math.PI / 2 + (i / 48) * (meet - Math.PI / 2);
    globe.push(new THREE.Vector2(Math.max(0.0001, Math.cos(a)), Math.sin(a)));
  }
  const neck = new THREE.QuadraticBezierCurve(
    new THREE.Vector2(Math.cos(meet), Math.sin(meet)),
    new THREE.Vector2(0.3, -1.08),
    new THREE.Vector2(0.3, -1.42),
  );
  globe.push(...neck.getPoints(16).slice(1));
  const glassGeo = new THREE.LatheGeometry(globe, 96);
  const glassBack = new THREE.Mesh(glassGeo, glassMaterial(0.45, THREE.BackSide));
  const glassFront = new THREE.Mesh(glassGeo, glassMaterial(1, THREE.FrontSide));
  glassBack.renderOrder = 1;
  glassFront.renderOrder = 3;
  bulb.add(glassBack, glassFront);

  // The base: a brass collar, the E27 thread, the black insulator and the contact.
  const brass = new THREE.MeshStandardMaterial({ color: 0xc9a35b, metalness: 1, roughness: 0.3 });
  const thread: THREE.Vector2[] = [new THREE.Vector2(0.3, -1.4), new THREE.Vector2(0.312, -1.42), new THREE.Vector2(0.312, -1.52)];
  for (let i = 0; i <= 80; i++) {
    const y = -1.52 - (i / 80) * 0.56;
    thread.push(new THREE.Vector2(0.282 + 0.02 * Math.sin((i / 80) * Math.PI * 2 * 5.5), y));
  }
  thread.push(new THREE.Vector2(0.24, -2.1), new THREE.Vector2(0.0001, -2.1));
  bulb.add(new THREE.Mesh(new THREE.LatheGeometry(thread, 72), brass));
  const insulator = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.13, 0.1, 48),
    new THREE.MeshStandardMaterial({ color: 0x161616, roughness: 0.25 }),
  );
  insulator.position.y = -2.15;
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.075, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), brass);
  tip.position.y = -2.19;
  bulb.add(insulator, tip);

  // Inside: the glass stem, the support wire, two leads and six filaments in a cage.
  const stem = new THREE.Mesh(
    new THREE.LatheGeometry(
      [new THREE.Vector2(0.22, -1.38), new THREE.Vector2(0.1, -1.18), new THREE.Vector2(0.06, -0.9), new THREE.Vector2(0.05, -0.72), new THREE.Vector2(0.0001, -0.7)],
      32,
    ),
    glassMaterial(0.7, THREE.DoubleSide),
  );
  stem.renderOrder = 2;
  const wire = new THREE.MeshStandardMaterial({ color: 0xb9b9b9, metalness: 0.9, roughness: 0.35 });
  const rod = (from: THREE.Vector3, to: THREE.Vector3, r = 0.006) => {
    const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.LineCurve3(from, to), 1, r, 8), wire);
    bulb.add(m);
  };
  rod(new THREE.Vector3(0, -0.72, 0), new THREE.Vector3(0, 0.36, 0));
  rod(new THREE.Vector3(0.03, -0.75, 0), new THREE.Vector3(0.16, -0.6, 0));
  rod(new THREE.Vector3(-0.03, -0.75, 0), new THREE.Vector3(-0.16, -0.6, 0));
  bulb.add(stem);

  const filament = new THREE.MeshBasicMaterial({ toneMapped: false });
  const lit = new THREE.Color();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const low = new THREE.Vector3(Math.cos(a) * 0.17, -0.6, Math.sin(a) * 0.17);
    const high = new THREE.Vector3(Math.cos(a) * 0.1, 0.36, Math.sin(a) * 0.1);
    const mid = low.clone().lerp(high, 0.5).add(new THREE.Vector3(Math.cos(a) * 0.035, 0, Math.sin(a) * 0.035));
    bulb.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(low, mid, high), 24, 0.021, 8), filament));
    rod(new THREE.Vector3(0, 0.36, 0), high, 0.004);
  }

  // The light: a small halo around the filaments (the stage's own glow does the rest), a point light inside for the
  // brass, and a soft shadow under the base.
  const halo = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: softDot('rgba(255,255,255,1)', 'rgba(255,255,255,0)'), depthWrite: false, transparent: true, opacity: 0.32 }),
  );
  halo.scale.set(0.9, 1.5, 1);
  halo.position.y = -0.12;
  halo.renderOrder = 2;
  bulb.add(halo);
  const glow = new THREE.PointLight(0xffffff, 1.8, 5, 1.5);
  glow.position.y = -0.1;
  bulb.add(glow);
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.6, 1.6),
    new THREE.MeshBasicMaterial({ map: softDot('rgba(60,45,25,0.42)', 'rgba(60,45,25,0)'), transparent: true, depthWrite: false }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -2.25;
  scene.add(shadow);

  const tint = (k: number) => {
    const [r, g, b] = kelvinToRgb(k);
    lit.setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace);
    // Bright but still the colour of the temperature (unlit by the scene, so the slider's colour shows as it is).
    filament.color.copy(lit).lerp(new THREE.Color(1, 1, 1), 0.22);
    halo.material.color.copy(lit);
    // A cool white haze would wash the white filaments out on the light page, so the halo thins as it cools.
    halo.material.opacity = 0.34 - 0.2 * THREE.MathUtils.clamp((k - 3000) / 3500, 0, 1);
    glow.color.copy(lit);
  };
  tint(kelvin.get());

  // Draw only when it is worth it: on screen, at a real size (not the 1px copy wide screens keep for assistive tech),
  // while it is the product the stage shows, and not under a menu, panel or dialog (they stop Lenis, which marks the
  // page). Within that, frames run only while something moves; a still bulb is drawn once and left.
  let frame = 0;
  let last = 0;
  let ready = false;
  let lost = false;
  let width = 0;
  let tiny = true;
  let onScreen = false;
  let held = false;
  const stage = host.closest<HTMLElement>('.stage');
  const item = host.closest('.stage__item');
  const items = stage ? [...stage.querySelectorAll('.stage__item')] : [];
  let showing = !stage;
  // Drag to turn, with a little inertia; left alone, it turns slowly by itself (not with reduced motion). A mouse can
  // also tip it a little, and it rights itself when let go; on touch, a vertical drag stays the page's scroll.
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let spin = 0;
  let touched = false;

  const visible = () => onScreen && showing && !tiny && !held && !lost;
  const moving = () => dragging || !reduce.matches || Math.abs(spin) > 0.0002 || Math.abs(bulb.rotation.x) > 0.0005;
  // The canvas takes the pointer only once it has drawn, and only while it is the bulb on show.
  const pointer = () => {
    canvas.style.pointerEvents = ready && showing && !tiny && !lost ? 'auto' : 'none';
  };

  const offKelvin = kelvin.on((k) => {
    tint(k);
    wake();
  });

  const size = () => {
    const w = host.clientWidth;
    const h = host.clientHeight;
    tiny = w < 40 || h < 40;
    pointer();
    if (tiny) return;
    width = w;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    wake();
  };
  const resized = new ResizeObserver(size);
  resized.observe(host);

  const seen = new IntersectionObserver((entries) => {
    onScreen = entries[entries.length - 1].isIntersecting;
    wake();
  });
  seen.observe(host);

  const onStage = () => {
    showing = items.indexOf(item as Element) === Number(stage?.dataset.active);
    pointer();
    wake();
  };
  const shown = new MutationObserver(onStage);
  if (stage) {
    shown.observe(stage, { attributes: true, attributeFilter: ['data-active'] });
    showing = items.indexOf(item as Element) === Number(stage.dataset.active);
  }

  const root = document.documentElement;
  const holds = new MutationObserver(() => {
    held = root.classList.contains('lenis-stopped');
    wake();
  });
  holds.observe(root, { attributes: true, attributeFilter: ['class'] });
  held = root.classList.contains('lenis-stopped');

  // A phone can drop the WebGL context under memory pressure: stop, and let the picture come back.
  const contextLost = (e: Event) => {
    e.preventDefault();
    lost = true;
    cancelAnimationFrame(frame);
    frame = 0;
    pointer();
    onLost();
  };
  canvas.addEventListener('webglcontextlost', contextLost);

  const down = (e: PointerEvent) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    spin = 0;
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {
      // A pointer the browser no longer tracks; the drag still works while it stays over the canvas.
    }
    if (!touched) {
      touched = true;
      onTouch();
    }
    wake();
  };
  const move = (e: PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    const turn = (dx / Math.max(width, 1)) * Math.PI * 1.6;
    bulb.rotation.y += turn;
    spin = turn;
    if (e.pointerType === 'mouse') {
      bulb.rotation.x = THREE.MathUtils.clamp(bulb.rotation.x + ((e.clientY - lastY) / Math.max(width, 1)) * 1.4, -0.35, 0.35);
    }
    lastY = e.clientY;
  };
  const up = () => {
    dragging = false;
    if (reduce.matches) spin = 0;
  };
  canvas.addEventListener('pointerdown', down);
  canvas.addEventListener('pointermove', move);
  canvas.addEventListener('pointerup', up);
  canvas.addEventListener('pointercancel', up);

  const tick = (now: number) => {
    frame = 0;
    if (!visible()) return;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
    last = now;
    if (!dragging) {
      bulb.rotation.x *= reduce.matches ? 0 : Math.pow(0.88, dt * 60);
      if (Math.abs(spin) > 0.0002) {
        bulb.rotation.y += spin * dt * 60;
        spin *= Math.pow(0.9, dt * 60);
      } else if (!reduce.matches) {
        bulb.rotation.y += 0.22 * dt;
      }
    }
    renderer.render(scene, camera);
    if (!ready) {
      ready = true;
      pointer();
      onReady();
    }
    if (moving()) frame = requestAnimationFrame(tick);
  };
  // Draws the next frame, and keeps drawing while anything moves.
  function wake() {
    if (frame || !visible()) return;
    last = 0;
    frame = requestAnimationFrame(tick);
  }

  return () => {
    cancelAnimationFrame(frame);
    offKelvin();
    resized.disconnect();
    seen.disconnect();
    shown.disconnect();
    holds.disconnect();
    canvas.removeEventListener('webglcontextlost', contextLost);
    canvas.removeEventListener('pointerdown', down);
    canvas.removeEventListener('pointermove', move);
    canvas.removeEventListener('pointerup', up);
    canvas.removeEventListener('pointercancel', up);
    scene.traverse((o) => {
      if (o instanceof THREE.Mesh || o instanceof THREE.Sprite) {
        o.geometry.dispose();
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach((m: THREE.Material & { map?: THREE.Texture | null }) => {
          m.map?.dispose();
          m.dispose();
        });
      }
    });
    env.dispose();
    pmrem.dispose();
    renderer.dispose();
    canvas.remove();
  };
}
