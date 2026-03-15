"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Room constants — shared by every face
const W  = 26;
const H  =  8;
const D  = 26;
const HW = W / 2;
const HH = H / 2;
const HD = D / 2;

// ── Camera ────────────────────────────────────────────────────
function CameraSetup() {
  const { camera } = useThree();
  useMemo(() => {
    camera.position.set(0, 0, 7);
    (camera as THREE.PerspectiveCamera).fov = 68;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera]);
  return null;
}

// ── Generic grid line helper ──────────────────────────────────
function GridLines({ verts, opacity = 0.15 }: { verts: number[]; opacity?: number }) {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
    return geo;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#00ff88" transparent opacity={opacity} depthWrite={false} />
    </lineSegments>
  );
}

// ── Room faces ────────────────────────────────────────────────
function Floor() {
  const verts = useMemo(() => {
    const v: number[] = [];
    for (let i = 0; i <= W; i++) { const x = -HW + i; v.push(x, -HH, -HD, x, -HH, HD); }
    for (let j = 0; j <= D; j++) { const z = -HD + j; v.push(-HW, -HH, z, HW, -HH, z); }
    return v;
  }, []);
  return <GridLines verts={verts} opacity={0.18} />;
}

function Ceiling() {
  const verts = useMemo(() => {
    const v: number[] = [];
    for (let i = 0; i <= W; i++) { const x = -HW + i; v.push(x, HH, -HD, x, HH, HD); }
    for (let j = 0; j <= D; j++) { const z = -HD + j; v.push(-HW, HH, z, HW, HH, z); }
    return v;
  }, []);
  return <GridLines verts={verts} opacity={0.12} />;
}

function LeftWall() {
  const verts = useMemo(() => {
    const v: number[] = [];
    for (let i = 0; i <= H; i++) { const y = -HH + i; v.push(-HW, y, -HD, -HW, y, HD); }
    for (let j = 0; j <= D; j++) { const z = -HD + j; v.push(-HW, -HH, z, -HW, HH, z); }
    return v;
  }, []);
  return <GridLines verts={verts} opacity={0.13} />;
}

function RightWall() {
  const verts = useMemo(() => {
    const v: number[] = [];
    for (let i = 0; i <= H; i++) { const y = -HH + i; v.push(HW, y, -HD, HW, y, HD); }
    for (let j = 0; j <= D; j++) { const z = -HD + j; v.push(HW, -HH, z, HW, HH, z); }
    return v;
  }, []);
  return <GridLines verts={verts} opacity={0.13} />;
}

// ── Flash overlay — additive green pulse on service change ────
function FlashOverlay({ serviceIndex }: { serviceIndex: number }) {
  const mesh    = useRef<THREE.Mesh>(null);
  const flash   = useRef(0);
  const prevIdx = useRef(serviceIndex);
  const idxRef  = useRef(serviceIndex);
  idxRef.current = serviceIndex;

  useFrame((_, dt) => {
    if (prevIdx.current !== idxRef.current) {
      flash.current  = 1.0;
      prevIdx.current = idxRef.current;
    }
    flash.current = Math.max(0, flash.current - dt * 3.5);
    if (mesh.current) {
      (mesh.current.material as THREE.MeshBasicMaterial).opacity = flash.current * 0.12;
    }
  });

  return (
    <mesh ref={mesh} position={[0, 0, 0]} renderOrder={999}>
      <planeGeometry args={[200, 200]} />
      <meshBasicMaterial
        color="#00ff88"
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

// ── Main export ───────────────────────────────────────────────
export default function ServicesBackground({ serviceIndex = 0 }: { serviceIndex?: number }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        background: "#030a06",
      }}
    >
      <Canvas
        style={{ width: "100%", height: "100%" }}
        camera={{ fov: 68, near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: false }}
      >
        <CameraSetup />
        <Floor />
        <Ceiling />
        <LeftWall />
        <RightWall />
        <FlashOverlay serviceIndex={serviceIndex} />
      </Canvas>
    </div>
  );
}
