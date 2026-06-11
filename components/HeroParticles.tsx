'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';

/**
 * Teal dot-wave field rendered behind the hero copy. A flat grid of GPU
 * points displaced by layered sine waves plus a pointer-follow ripple.
 * Mounted only via HeroFx, which gates on reduced-motion / coarse pointer /
 * small screens; rendering pauses when the hero scrolls out of view.
 */

const COLS = 130;
const ROWS = 56;
const WIDTH = 38; // world units, x
const DEPTH = 22; // world units, z (0 near camera → -DEPTH far)

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uPx;
  varying float vFade;

  void main() {
    vec3 p = position;
    float t = uTime * 0.55;

    float y = sin(p.x * 0.32 + t) * 0.42
            + sin(p.z * 0.50 - t * 1.25) * 0.34
            + sin((p.x + p.z) * 0.21 + t * 0.8) * 0.28;

    float d = distance(p.xz, uPointer);
    y += exp(-d * d * 0.10) * sin(t * 3.2 - d * 1.4) * 1.1;

    p.y = y;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (1.7 + y) * uPx * (120.0 / -mv.z);

    float depthFade = smoothstep(-22.0, -4.0, p.z);
    float crestFade = smoothstep(-1.1, 1.5, y);
    vFade = depthFade * (0.25 + 0.75 * crestFade);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vFade;

  void main() {
    float r = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.12, r) * vFade;
    if (a < 0.02) discard;
    gl_FragColor = vec4(mix(uColorA, uColorB, vFade), a * 0.8);
  }
`;

function WaveField() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const pointerTarget = useRef(new THREE.Vector2(0, -DEPTH * 0.5));

  const positions = useMemo(() => {
    const arr = new Float32Array(COLS * ROWS * 3);
    let i = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        arr[i++] = (c / (COLS - 1) - 0.5) * WIDTH;
        arr[i++] = 0;
        arr[i++] = -(r / (ROWS - 1)) * DEPTH;
      }
    }
    return arr;
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, -DEPTH * 0.5) },
      uPx: { value: Math.min(window.devicePixelRatio, 1.5) },
      uColorA: { value: new THREE.Color('#0f5e56') },
      uColorB: { value: new THREE.Color('#2dd4bf') },
    }),
    []
  );

  // Pointer tracked on the whole hero section (canvas is pointer-events:none).
  useEffect(() => {
    const hero = document.querySelector('.cine');
    if (!hero) return;
    const onMove = (e: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;
      pointerTarget.current.set((nx - 0.5) * WIDTH, -(1 - ny) * DEPTH * 0.7 - 1.5);
    };
    hero.addEventListener('pointermove', onMove as EventListener, { passive: true });
    return () => hero.removeEventListener('pointermove', onMove as EventListener);
  }, []);

  useFrame((state) => {
    const mat = matRef.current;
    if (!mat) return;
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uPointer.value.lerp(pointerTarget.current, 0.06);
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function HeroParticles() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(true);

  // Pause the render loop when the hero is off-screen or the tab is hidden.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let inView = true;
    const sync = () => setRunning(inView && !document.hidden);
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    io.observe(el);
    document.addEventListener('visibilitychange', sync);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  return (
    <div ref={wrapRef} className="cine__fx" aria-hidden="true">
      <Canvas
        frameloop={running ? 'always' : 'never'}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
        camera={{ position: [0, 2.4, 5.5], fov: 55, near: 0.1, far: 60 }}
        onCreated={({ camera }) => camera.lookAt(0, -0.5, -10)}
      >
        <WaveField />
      </Canvas>
    </div>
  );
}
