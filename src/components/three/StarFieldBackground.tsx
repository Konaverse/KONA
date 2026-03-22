"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ── Starfield — instanced points with gentle drift ──────────────────────────
const STAR_COUNT = 1200;

function Stars() {
  const meshRef = useRef<THREE.Points>(null);

  const { positions, sizes, phases } = useMemo(() => {
    const pos = new Float32Array(STAR_COUNT * 3);
    const sz = new Float32Array(STAR_COUNT);
    const ph = new Float32Array(STAR_COUNT);

    for (let i = 0; i < STAR_COUNT; i++) {
      // Distribute in a large sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 8 + Math.random() * 40;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      sz[i] = 0.5 + Math.random() * 2.5;
      ph[i] = Math.random() * Math.PI * 2;
    }

    return { positions: pos, sizes: sz, phases: ph };
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute("aSize", new THREE.Float32BufferAttribute(sizes, 1));
    geo.setAttribute("aPhase", new THREE.Float32BufferAttribute(phases, 1));
    return geo;
  }, [positions, sizes, phases]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color("#00ff88") },
        },
        vertexShader: `
          attribute float aSize;
          attribute float aPhase;
          varying float vAlpha;

          uniform float uTime;

          void main() {
            vAlpha = 0.3 + 0.7 * (0.5 + 0.5 * sin(uTime * 0.4 + aPhase));
            vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = aSize * (80.0 / -mvPos.z);
            gl_Position = projectionMatrix * mvPos;
          }
        `,
        fragmentShader: `
          uniform vec3 uColor;
          varying float vAlpha;

          void main() {
            float d = length(gl_PointCoord - 0.5) * 2.0;
            float core = exp(-d * 6.0);
            float glow = exp(-d * 2.0) * 0.3;
            float alpha = (core + glow) * vAlpha;
            vec3 col = mix(uColor, vec3(1.0), core * 0.6);
            gl_FragColor = vec4(col, alpha);
          }
        `,
      }),
    []
  );

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.008;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.003) * 0.02;
    }
  });

  return <points ref={meshRef} geometry={geometry} material={material} />;
}

// ── Nebula wisps — a few large, soft, slowly drifting planes ────────────────
const WISP_COUNT = 5;

function NebulaWisps() {
  const groupRef = useRef<THREE.Group>(null);

  const wisps = useMemo(() => {
    return Array.from({ length: WISP_COUNT }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 12,
        -6 - Math.random() * 10,
      ] as [number, number, number],
      rotation: Math.random() * Math.PI,
      scale: 3 + Math.random() * 5,
      speed: 0.02 + Math.random() * 0.03,
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      const w = wisps[i];
      const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      mat.opacity = 0.015 + 0.01 * Math.sin(t * w.speed * 3 + w.phase);
      child.rotation.z = w.rotation + t * w.speed;
    });
  });

  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1), []);

  return (
    <group ref={groupRef}>
      {wisps.map((w, i) => (
        <mesh key={i} position={w.position} scale={w.scale} geometry={geometry}>
          <meshBasicMaterial
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            color="#00ff88"
            opacity={0.015}
          />
        </mesh>
      ))}
    </group>
  );
}

// ── Main export ─────────────────────────────────────────────────────────────
export default function StarFieldBackground() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 40%, #060f0a 0%, #020804 50%, #010302 100%)",
      }}
    >
      <Canvas
        style={{ width: "100%", height: "100%" }}
        camera={{ fov: 60, near: 0.1, far: 200, position: [0, 0, 0] }}
        gl={{ antialias: false, alpha: false }}
      >
        <Stars />
        <NebulaWisps />
      </Canvas>
    </div>
  );
}
