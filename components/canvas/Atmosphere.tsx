'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  AdditiveBlending,
  AmbientLight,
  BackSide,
  Color,
  DirectionalLight,
  FogExp2,
  Mesh,
  ShaderMaterial,
  Sprite,
  SpriteMaterial,
  UniformsLib,
  UniformsUtils,
  Vector3,
} from 'three';
import { sectionLighting } from '@/lib/lighting';
import { readScroll } from '@/lib/scrollStore';
import { blendAt } from '@/lib/blend';
import { WORLD } from '@/lib/world';
import { glowTexture } from './glow';

const skyVertex = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vDir = wp.xyz - cameraPosition;
    gl_Position = projectionMatrix * viewMatrix * wp;
    gl_Position.z = gl_Position.w; // pin to the far plane
  }
`;

const skyFragment = /* glsl */ `
  uniform vec3 uTop;
  uniform vec3 uHorizon;
  uniform vec3 uGround;
  uniform vec3 uSunDir;
  uniform vec3 uSunColor;
  uniform float uSunGlow;
  varying vec3 vDir;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
  // Uniforms arrive linear; blend in a perceptual (gamma) space so the bright horizon stays a band.
  vec3 toGamma(vec3 c) { return pow(c, vec3(1.0 / 2.2)); }
  vec3 toLinear(vec3 c) { return pow(c, vec3(2.2)); }
  void main() {
    vec3 d = normalize(vDir);
    float h = d.y;
    vec3 col = h > 0.0
      ? toLinear(mix(toGamma(uHorizon), toGamma(uTop), pow(smoothstep(0.0, 0.3, h), 0.55)))
      : toLinear(mix(toGamma(uHorizon), toGamma(uGround), smoothstep(0.0, 0.04, -h)));
    float s = max(dot(d, normalize(uSunDir)), 0.0);
    col += uSunColor * (pow(s, 48.0) * 0.16 + pow(s, 260.0) * 0.6 + pow(s, 2400.0) * 2.0) * uSunGlow;
    col += (hash(gl_FragCoord.xy) - 0.5) / 255.0; // dither away gradient banding
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

// The ground doubles as sea: rippled normals reflect the sun into a glint path, and fresnel picks up the horizon.
const waterVertex = /* glsl */ `
  varying vec3 vWorld;
  #include <fog_pars_vertex>
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorld = wp.xyz;
    vec4 mvPosition = viewMatrix * wp;
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`;

const waterFragment = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uHorizon;
  uniform vec3 uSunDir;
  uniform vec3 uSunColor;
  uniform float uSunGlow;
  uniform float uTime;
  varying vec3 vWorld;
  #include <fog_pars_fragment>
  void main() {
    vec3 V = normalize(vWorld - cameraPosition);
    vec2 p = vWorld.xz;
    float w1 = sin(p.x * 0.9 + uTime * 0.55) * cos(p.y * 1.3 - uTime * 0.4);
    float w2 = sin(p.x * 2.6 - p.y * 1.9 + uTime * 1.1);
    float w3 = sin(p.x * 7.1 + p.y * 5.3 - uTime * 1.7);
    vec3 N = normalize(vec3(w1 * 0.03 + w2 * 0.018 + w3 * 0.008, 1.0, w2 * 0.026 - w1 * 0.018 + w3 * 0.006));
    vec3 R = reflect(V, N);
    float fres = pow(1.0 - max(dot(-V, N), 0.0), 5.0);
    vec3 col = pow(mix(pow(uBase, vec3(0.4545)), pow(uHorizon, vec3(0.4545)) * 0.55, fres * 0.7), vec3(2.2));
    float s = max(dot(R, normalize(uSunDir)), 0.0);
    col += uSunColor * (pow(s, 700.0) * 3.2 + pow(s, 140.0) * 0.08) * uSunGlow;
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
    #include <fog_fragment>
  }
`;

const ids = ['hero', 'source', 'capture', 'storage', 'light', 'collection', 'loyalty', 'impact', 'commitment', 'footer'] as const;

/** Sky, sun, ground, fog, ambient and key light, all interpolated with the camera's blend. */
export function Atmosphere({ isMobile }: { isMobile: boolean }) {
  const scene = useThree((s) => s.scene);
  const sunDir = useMemo(() => new Vector3(...WORLD.sun).normalize(), []);

  const presets = useMemo(
    () =>
      Object.fromEntries(
        ids.map((id) => {
          const l = sectionLighting[id];
          return [id, { ...l, cKey: new Color(l.key), cTop: new Color(l.skyTop), cHorizon: new Color(l.skyHorizon), cGround: new Color(l.ground) }];
        }),
      ),
    [],
  );

  const sky = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: skyVertex,
        fragmentShader: skyFragment,
        side: BackSide,
        depthWrite: false,
        fog: false,
        toneMapped: false,
        uniforms: {
          uTop: { value: new Color() },
          uHorizon: { value: new Color() },
          uGround: { value: new Color() },
          uSunDir: { value: sunDir },
          uSunColor: { value: new Color('#ff9f55') },
          uSunGlow: { value: 1 },
        },
      }),
    [sunDir],
  );

  const fog = useMemo(() => new FogExp2('#0a130f', 0.01), []);
  const groundMat = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: waterVertex,
        fragmentShader: waterFragment,
        fog: true,
        uniforms: UniformsUtils.merge([
          UniformsLib.fog,
          {
            uBase: { value: new Color() },
            uHorizon: { value: new Color() },
            uSunDir: { value: sunDir },
            uSunColor: { value: new Color('#ffc890') },
            uSunGlow: { value: 1 },
            uTime: { value: 0 },
          },
        ]),
      }),
    [sunDir],
  );
  const ambient = useRef<AmbientLight>(null);
  const key = useRef<DirectionalLight>(null);
  const skyMesh = useRef<Mesh>(null);
  const sunHalo = useRef<Sprite>(null);
  const sunCore = useRef<Mesh>(null);
  const c = useMemo(() => ({ top: new Color(), hor: new Color(), gnd: new Color(), key: new Color() }), []);

  useEffect(() => {
    scene.fog = fog;
    return () => {
      scene.fog = null;
    };
  }, [scene, fog]);

  useFrame(({ camera, clock }) => {
    const { progress, ranges } = readScroll();
    const b = blendAt(ranges, progress);
    const A = presets[b.from];
    const B = presets[b.to];
    const t = b.t;

    c.top.lerpColors(A.cTop, B.cTop, t);
    c.hor.lerpColors(A.cHorizon, B.cHorizon, t);
    c.gnd.lerpColors(A.cGround, B.cGround, t);
    c.key.lerpColors(A.cKey, B.cKey, t);
    const glow = A.sunGlow + (B.sunGlow - A.sunGlow) * t;

    // Sky halo and water glint aim at the sun from wherever the camera is now.
    sunDir.set(...WORLD.sun).sub(camera.position).normalize();
    sky.uniforms.uTop.value.copy(c.top);
    sky.uniforms.uHorizon.value.copy(c.hor);
    sky.uniforms.uGround.value.copy(c.gnd);
    sky.uniforms.uSunGlow.value = glow;
    skyMesh.current?.position.copy(camera.position);

    fog.color.copy(c.gnd).lerp(c.hor, 0.12);
    fog.density = A.fogDensity + (B.fogDensity - A.fogDensity) * t;
    groundMat.uniforms.uBase.value.copy(c.gnd);
    groundMat.uniforms.uHorizon.value.copy(c.hor);
    groundMat.uniforms.uSunGlow.value = glow;
    groundMat.uniforms.uTime.value = clock.elapsedTime;

    if (ambient.current) ambient.current.intensity = A.ambient + (B.ambient - A.ambient) * t;
    if (key.current) {
      key.current.color.copy(c.key);
      key.current.intensity = A.keyIntensity + (B.keyIntensity - A.keyIntensity) * t;
    }
    const sunVisible = glow > 0.02;
    if (sunHalo.current) {
      sunHalo.current.visible = sunVisible;
      (sunHalo.current.material as SpriteMaterial).opacity = Math.min(1, glow) * 0.55;
    }
    // Below half strength the disc reads as a grey moon, so only the halo fades out.
    if (sunCore.current) sunCore.current.visible = glow > 0.5;
  });

  const glowMap = glowTexture();

  return (
    <>
      <mesh ref={skyMesh} material={sky} renderOrder={-10} frustumCulled={false}>
        <sphereGeometry args={[400, 48, 24]} />
      </mesh>

      <group position={WORLD.sun}>
        <mesh ref={sunCore}>
          <sphereGeometry args={[5.2, 32, 16]} />
          <meshBasicMaterial color={new Color('#fff1d6').multiplyScalar(2.2)} toneMapped={false} fog={false} />
        </mesh>
        <sprite ref={sunHalo} scale={[48, 48, 1]}>
          <spriteMaterial map={glowMap} color="#ffb36b" blending={AdditiveBlending} depthWrite={false} transparent fog={false} toneMapped={false} />
        </sprite>
      </group>

      <mesh rotation-x={-Math.PI / 2} position={[20, 0, -40]} material={groundMat}>
        <planeGeometry args={[900, 900]} />
      </mesh>

      {/* Hooiberg and the low ridge line on the horizon */}
      <group>
        <mesh position={[-34, 0, -120]} scale={[1, 1, 0.8]}>
          <coneGeometry args={[16, 13, 24, 1, true]} />
          <meshBasicMaterial color="#0a1612" />
        </mesh>
        <mesh position={[-62, 0, -135]} scale={[2.4, 0.38, 1]}>
          <sphereGeometry args={[14, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshBasicMaterial color="#0b1813" />
        </mesh>
        <mesh position={[8, 0, -140]} scale={[3.2, 0.2, 1]}>
          <sphereGeometry args={[14, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshBasicMaterial color="#0b1813" />
        </mesh>
      </group>

      <ambientLight ref={ambient} intensity={0.2} />
      <directionalLight
        ref={key}
        position={[8, 12, 6]}
        intensity={2}
        castShadow={false}
      />
      <hemisphereLight args={['#3a5a4a', '#0a0f0c', isMobile ? 0.25 : 0.35]} />
    </>
  );
}
