'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/**
 * Glossy sphere cluster for the v2 hero. Spheres are pulled toward a shared
 * center, resolve overlaps against each other, and are shoved aside by the
 * pointer, so the cluster squishes and re-settles as the cursor moves through.
 * The sim is pre-run before the first frame; under reduced motion only that
 * settled frame is rendered. Rendering pauses while the hero is off-screen.
 */

type Tone = 'accent' | 'ink' | 'light';

const SPEC: [number, Tone][] = [
  [1.05, 'accent'], [0.8, 'light'], [0.62, 'ink'], [0.9, 'light'], [0.5, 'accent'], [0.72, 'ink'],
  [0.42, 'light'], [0.58, 'accent'], [0.36, 'ink'], [0.66, 'light'], [0.46, 'accent'], [0.32, 'light'],
];

interface Body {
  r: number;
  tone: Tone;
  p: THREE.Vector3;
  v: THREE.Vector3;
}

const POINTER_R = 0.95;
const tmp = new THREE.Vector3();
const n = new THREE.Vector3();

function seeded(i: number) {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function step(bodies: Body[], center: THREE.Vector3, pointer: THREE.Vector3 | null, k: number, dt: number) {
  const damp = Math.exp(-3 * dt);
  for (const b of bodies) {
    tmp.copy(center).sub(b.p);
    b.v.addScaledVector(tmp, 2.6 * dt);
    b.v.z -= b.p.z * 3 * dt;
    b.v.multiplyScalar(damp);
    b.p.addScaledVector(b.v, dt);
  }

  for (let pass = 0; pass < 2; pass++) {
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const a = bodies[i];
        const c = bodies[j];
        n.copy(c.p).sub(a.p);
        const dist = n.length();
        const min = (a.r + c.r) * k;
        if (dist >= min || dist < 1e-5) continue;
        n.divideScalar(dist);
        const push = (min - dist) * 0.5;
        a.p.addScaledVector(n, -push);
        c.p.addScaledVector(n, push);
        const rel = tmp.copy(c.v).sub(a.v).dot(n);
        if (rel < 0) {
          a.v.addScaledVector(n, rel * 0.5);
          c.v.addScaledVector(n, -rel * 0.5);
        }
      }
    }
  }

  if (!pointer) return;
  for (const b of bodies) {
    n.copy(b.p).sub(pointer);
    n.z *= 0.35;
    const dist = n.length();
    const min = (b.r + POINTER_R) * k;
    if (dist >= min || dist < 1e-5) continue;
    n.divideScalar(dist);
    b.p.addScaledVector(n, (min - dist) * 0.3);
    b.v.addScaledVector(n, (min - dist) * 9);
  }
}

function Environment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

function Cluster({ pointerNdc, animate }: { pointerNdc: React.MutableRefObject<THREE.Vector2 | null>; animate: boolean }) {
  const { viewport, camera, invalidate } = useThree();
  const meshes = useRef<(THREE.Mesh | null)[]>([]);

  const portrait = viewport.width < viewport.height;
  const k = (portrait ? 0.42 : 0.6) * (viewport.height / 5.67);
  const center = useMemo(
    () => (portrait ? new THREE.Vector3(0, viewport.height * 0.2, 0) : new THREE.Vector3(viewport.width * 0.2, viewport.height * 0.06, 0)),
    [portrait, viewport.width, viewport.height],
  );

  const palette = useMemo(() => {
    const css = getComputedStyle(document.documentElement);
    const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const make = (color: string) =>
      new THREE.MeshPhysicalMaterial({ color, roughness: 0.16, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.08 });
    return {
      accent: make(css.getPropertyValue('--accent').trim() || '#1f33f5'),
      ink: make(dark ? '#2b2e3a' : '#15161d'),
      light: make('#f4f5fb'),
    };
  }, []);

  const geometry = useMemo(() => new THREE.SphereGeometry(1, 64, 48), []);

  const bodies = useMemo<Body[]>(() => {
    const list = SPEC.map(([r, tone], i) => ({
      r,
      tone,
      p: new THREE.Vector3(
        center.x + (seeded(i) - 0.5) * 6 * k,
        center.y + (seeded(i + 40) - 0.5) * 6 * k,
        (seeded(i + 80) - 0.5) * 2 * k,
      ),
      v: new THREE.Vector3(),
    }));
    for (let s = 0; s < 260; s++) step(list, center, null, k, 1 / 60);
    return list;
  }, [center, k]);

  useEffect(
    () => () => {
      geometry.dispose();
      Object.values(palette).forEach((m) => m.dispose());
    },
    [geometry, palette],
  );

  useEffect(() => {
    bodies.forEach((b, i) => meshes.current[i]?.position.copy(b.p));
    invalidate();
  }, [bodies, invalidate]);

  const world = useMemo(() => new THREE.Vector3(), []);
  const drifting = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    if (!animate) return;
    const dt = Math.min(delta, 1 / 30);

    let pointer: THREE.Vector3 | null = null;
    if (pointerNdc.current) {
      world.set(pointerNdc.current.x, pointerNdc.current.y, 0.5).unproject(camera).sub(camera.position).normalize();
      const t = -camera.position.z / world.z;
      pointer = world.multiplyScalar(t).add(camera.position);
    }

    const time = state.clock.elapsedTime;
    drifting.set(center.x + Math.sin(time * 0.35) * 0.12, center.y + Math.sin(time * 0.5) * 0.14, 0);
    step(bodies, drifting, pointer, k, dt);
    bodies.forEach((b, i) => meshes.current[i]?.position.copy(b.p));
  });

  return (
    <group>
      {bodies.map((b, i) => (
        <mesh
          key={i}
          ref={(m) => {
            meshes.current[i] = m;
          }}
          geometry={geometry}
          material={palette[b.tone]}
          scale={b.r * k}
          position={b.p}
        />
      ))}
    </group>
  );
}

export default function HeroScene() {
  const wrap = useRef<HTMLDivElement>(null);
  const pointerNdc = useRef<THREE.Vector2 | null>(null);
  const [inView, setInView] = useState(true);
  const [ready, setReady] = useState(false);
  const [animate] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting));
    io.observe(el);

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      if (e.clientY > r.bottom || e.clientY < r.top) {
        pointerNdc.current = null;
        return;
      }
      const v = pointerNdc.current ?? new THREE.Vector2();
      v.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      pointerNdc.current = v;
    };
    const onLeave = () => {
      pointerNdc.current = null;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={wrap}
      style={{ position: 'absolute', inset: 0, opacity: ready ? 1 : 0, transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
      aria-hidden="true"
    >
      <Canvas
        flat
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 9], fov: 35 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        frameloop={animate ? (inView ? 'always' : 'never') : 'demand'}
        onCreated={() => setReady(true)}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 6, 5]} intensity={1.6} />
        <directionalLight position={[-5, -2, 3]} intensity={0.4} />
        <Environment />
        <Cluster pointerNdc={pointerNdc} animate={animate} />
      </Canvas>
    </div>
  );
}
