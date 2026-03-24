"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ── Color palette per act ─────────────────────────────────────────────────────
const ACT_COLORS = [
  new THREE.Color("#00ff88"), // Act 0: Websites — brand green
  new THREE.Color("#00ccaa"), // Act 1: Videos — cyan
  new THREE.Color("#4466ff"), // Act 2: Social — blue-indigo
] as const;

// ── Camera ────────────────────────────────────────────────────────────────────
function CameraSetup() {
  const { camera } = useThree();
  useMemo(() => {
    camera.position.set(0, 2, 7);
    (camera as THREE.PerspectiveCamera).fov = 68;
    camera.lookAt(0, -0.5, 0);
    camera.updateProjectionMatrix();
  }, [camera]);
  return null;
}

// ── Table surface — glowing grid plane ────────────────────────────────────────
const tableVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const tableFragmentShader = `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uIntensity;
  varying vec2 vUv;

  void main() {
    // Grid pattern
    vec2 grid = abs(fract(vUv * 20.0 - 0.5) - 0.5) / fwidth(vUv * 20.0);
    float line = min(grid.x, grid.y);
    float gridAlpha = 1.0 - min(line, 1.0);

    // Sub-grid (finer)
    vec2 subGrid = abs(fract(vUv * 80.0 - 0.5) - 0.5) / fwidth(vUv * 80.0);
    float subLine = min(subGrid.x, subGrid.y);
    float subAlpha = (1.0 - min(subLine, 1.0)) * 0.15;

    // Radial fade from center
    float dist = length(vUv - 0.5) * 2.0;
    float radial = 1.0 - smoothstep(0.3, 1.0, dist);

    // Pulse
    float pulse = 0.85 + 0.15 * sin(uTime * 1.5);

    float alpha = (gridAlpha * 0.4 + subAlpha) * radial * pulse * uIntensity;

    gl_FragColor = vec4(uColor, alpha);
  }
`;

function TableSurface({ activeAct }: { activeAct: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const colorRef = useRef(ACT_COLORS[0].clone());

  const uniforms = useMemo(() => ({
    uColor: { value: ACT_COLORS[0].clone() },
    uTime: { value: 0 },
    uIntensity: { value: 0.8 },
  }), []);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;

    // Lerp color toward target
    const target = ACT_COLORS[activeAct] ?? ACT_COLORS[0];
    colorRef.current.lerp(target, 0.04);
    uniforms.uColor.value.copy(colorRef.current);

    // Always on at full intensity (mount/unmount handles visibility)
    uniforms.uIntensity.value = THREE.MathUtils.lerp(uniforms.uIntensity.value, 0.85, 0.06);
  });

  const geometry = useMemo(() => new THREE.PlaneGeometry(16, 16), []);

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} geometry={geometry}>
      <shaderMaterial
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        vertexShader={tableVertexShader}
        fragmentShader={tableFragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

// ── Volumetric glow above table ───────────────────────────────────────────────
function VolumetricGlow({ activeAct }: { activeAct: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const colorRef = useRef(ACT_COLORS[0].clone());

  useFrame((state) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;

    const target = ACT_COLORS[activeAct] ?? ACT_COLORS[0];
    colorRef.current.lerp(target, 0.04);
    mat.color.copy(colorRef.current);

    const pulse = 0.03 + 0.015 * Math.sin(state.clock.elapsedTime * 0.8);
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, pulse, 0.05);
  });

  const geometry = useMemo(() => new THREE.PlaneGeometry(6, 4), []);

  return (
    <mesh ref={meshRef} position={[0, 1.5, 0]} geometry={geometry}>
      <meshBasicMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        color={ACT_COLORS[0]}
        opacity={0}
      />
    </mesh>
  );
}

// ── Ember particles — instanced quads drifting upward ─────────────────────────
const EMBER_COUNT = 150;

function EmberParticles({ activeAct }: { activeAct: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const colorRef = useRef(ACT_COLORS[0].clone());

  const particles = useMemo(() => {
    const data = [];
    for (let i = 0; i < EMBER_COUNT; i++) {
      data.push({
        x: (Math.random() - 0.5) * 12,
        y: Math.random() * 3 - 0.5,
        z: (Math.random() - 0.5) * 12,
        speed: 0.15 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2,
        drift: (Math.random() - 0.5) * 0.3,
      });
    }
    return data;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geometry = useMemo(() => new THREE.PlaneGeometry(0.04, 0.04), []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const target = ACT_COLORS[activeAct] ?? ACT_COLORS[0];
    colorRef.current.lerp(target, 0.04);

    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.color.copy(colorRef.current);
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0.7, 0.05);

    const t = state.clock.elapsedTime;

    for (let i = 0; i < EMBER_COUNT; i++) {
      const part = particles[i];
      let y = part.y + t * part.speed;
      // Wrap around when above ceiling
      y = ((y + 0.5) % 3.5) - 0.5;

      const x = part.x + Math.sin(t * 0.4 + part.phase) * part.drift;
      const z = part.z + Math.cos(t * 0.3 + part.phase) * part.drift;

      // Fade near top
      const fadeTop = 1 - Math.max(0, (y - 1.5) / 1.5);
      // Fade near bottom
      const fadeBot = Math.min(1, (y + 0.5) / 0.5);

      dummy.position.set(x, y, z);
      dummy.scale.setScalar(fadeTop * fadeBot);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, undefined, EMBER_COUNT]}>
      <meshBasicMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        color={ACT_COLORS[0]}
        opacity={0}
      />
    </instancedMesh>
  );
}

// ── Edge scanlines — pulsing lines on table edges ─────────────────────────────
function EdgeScanlines({ activeAct }: { activeAct: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const colorRef = useRef(ACT_COLORS[0].clone());

  const lines = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const verts: number[] = [];
    // Front edge
    verts.push(-8, -0.49, 8, 8, -0.49, 8);
    // Back edge
    verts.push(-8, -0.49, -8, 8, -0.49, -8);
    // Left edge
    verts.push(-8, -0.49, -8, -8, -0.49, 8);
    // Right edge
    verts.push(8, -0.49, -8, 8, -0.49, 8);
    geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const mat = (groupRef.current.children[0] as THREE.LineSegments).material as THREE.LineBasicMaterial;

    const target = ACT_COLORS[activeAct] ?? ACT_COLORS[0];
    colorRef.current.lerp(target, 0.04);
    mat.color.copy(colorRef.current);

    const pulse = 0.08 + 0.06 * Math.sin(state.clock.elapsedTime * 2);
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, pulse, 0.05);
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={lines}>
        <lineBasicMaterial transparent opacity={0} depthWrite={false} color={ACT_COLORS[0]} />
      </lineSegments>
    </group>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
interface HolographicTableBackgroundProps {
  activeAct: number;
}

export default function HolographicTableBackground({ activeAct }: HolographicTableBackgroundProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        background: "#020804",
      }}
    >
      <Canvas
        style={{ width: "100%", height: "100%" }}
        dpr={1}
        camera={{ fov: 68, near: 0.1, far: 200 }}
        gl={{ antialias: false, alpha: false }}
      >
        <CameraSetup />
        <TableSurface activeAct={activeAct} />
        <VolumetricGlow activeAct={activeAct} />
        <EmberParticles activeAct={activeAct} />
        <EdgeScanlines activeAct={activeAct} />
      </Canvas>
    </div>
  );
}
