"use client";

import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, Environment } from "@react-three/drei";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// Materials
// ---------------------------------------------------------------------------

function buildMaterials() {
  return {
    body: new THREE.MeshStandardMaterial({
      color: 0x1a1a1e,
      metalness: 0.65,
      roughness: 0.55,
      envMapIntensity: 0.5,
    }),
    panel: new THREE.MeshStandardMaterial({
      color: 0x252528,
      metalness: 0.60,
      roughness: 0.50,
      envMapIntensity: 0.4,
    }),
    joint: new THREE.MeshStandardMaterial({
      color: 0x131316,
      metalness: 0.75,
      roughness: 0.35,
      envMapIntensity: 0.6,
    }),
    sage: new THREE.MeshStandardMaterial({
      color: 0x6b7f62,
      metalness: 0.30,
      roughness: 0.50,
      emissive: new THREE.Color(0x4a5c42),
      emissiveIntensity: 0.15,
    }),
    sand: new THREE.MeshStandardMaterial({
      color: 0xb6a492,
      metalness: 0.20,
      roughness: 0.60,
      emissive: new THREE.Color(0xb6a492),
      emissiveIntensity: 0.05,
    }),
    eyeHousing: new THREE.MeshStandardMaterial({
      color: 0x0a0a0d,
      metalness: 0.90,
      roughness: 0.20,
    }),
  };
}

type Mats = ReturnType<typeof buildMaterials>;

// ---------------------------------------------------------------------------
// Arm sub-component
// ---------------------------------------------------------------------------

interface ArmProps {
  side: "left" | "right";
  mats: Mats;
  groupRef: React.RefObject<THREE.Group | null>;
}

function RobotArm({ side, mats, groupRef }: ArmProps) {
  const sign = side === "left" ? -1 : 1;

  return (
    <group ref={groupRef} position={[sign * 1.45, -0.62, 0]}>
      {/* Upper arm */}
      <mesh material={mats.body} position={[0, -0.42, 0]}>
        <boxGeometry args={[0.18, 0.65, 0.18]} />
      </mesh>
      {/* Elbow */}
      <mesh material={mats.joint} position={[0, -0.78, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
      </mesh>
      {/* Forearm */}
      <mesh material={mats.body} position={[0, -1.1, 0]}>
        <boxGeometry args={[0.16, 0.55, 0.16]} />
      </mesh>
      {/* Wrist ring */}
      <mesh material={mats.sage} position={[0, -1.38, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.1, 0.015, 8, 16]} />
      </mesh>
      {/* Hand */}
      <mesh material={mats.panel} position={[0, -1.52, 0]}>
        <boxGeometry args={[0.22, 0.18, 0.12]} />
      </mesh>
      {/* 3 fingers centred on hand */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} material={mats.joint} position={[-0.07 + i * 0.07, -1.67, 0]}>
          <boxGeometry args={[0.045, 0.12, 0.045]} />
        </mesh>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Robot scene — runs inside Canvas
// ---------------------------------------------------------------------------

interface RobotSceneProps {
  mouseRef: React.RefObject<{ x: number; y: number }>;
  isTouchDevice: boolean;
  activeNodeRef: React.RefObject<"left" | "right" | null>;
}

function RobotScene({ mouseRef, isTouchDevice, activeNodeRef }: RobotSceneProps) {
  const { scene } = useThree();

  // Group / mesh refs
  const robotRef = useRef<THREE.Group | null>(null);
  const headGroupRef = useRef<THREE.Group | null>(null);
  const leftArmRef = useRef<THREE.Group | null>(null);
  const rightArmRef = useRef<THREE.Group | null>(null);
  const torsoRef = useRef<THREE.Mesh | null>(null);
  const leftShoulderRef = useRef<THREE.Mesh | null>(null);
  const rightShoulderRef = useRef<THREE.Mesh | null>(null);

  // Animated glow refs
  const leftEyeRef = useRef<THREE.Mesh | null>(null);
  const rightEyeRef = useRef<THREE.Mesh | null>(null);
  const leftEyeLightRef = useRef<THREE.PointLight | null>(null);
  const rightEyeLightRef = useRef<THREE.PointLight | null>(null);
  const mouthBarRefs = useRef<(THREE.Mesh | null)[]>(Array(5).fill(null));
  const leftTipRef = useRef<THREE.Mesh | null>(null);
  const rightTipRef = useRef<THREE.Mesh | null>(null);
  const chestDotRef = useRef<THREE.Mesh | null>(null);

  // Stateful animation values (refs avoid re-renders)
  const rotRef = useRef({ x: 0, y: 0 });
  const eyeIntRef = useRef(0.3);
  const introRef = useRef({ started: false, startTime: 0, done: false });
  const robotXRef = useRef(0); // horizontal slide for activeNode

  // Materials — lazy init, stable reference
  const matsRef = useRef<Mats | null>(null);
  if (!matsRef.current) matsRef.current = buildMaterials();
  const mats = matsRef.current;

  // Scene fog
  useEffect(() => {
    scene.fog = new THREE.FogExp2(0x0d0f0c, 0.06);
    return () => { scene.fog = null; };
  }, [scene]);

  // Dispose materials on unmount
  useEffect(() => {
    return () => {
      if (matsRef.current) {
        Object.values(matsRef.current).forEach((m) => (m as THREE.Material).dispose());
      }
    };
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const mouse = mouseRef.current ?? { x: 0, y: 0 };

    // ── Intro rise ──────────────────────────────────────────────────────────
    if (!introRef.current.done) {
      if (!introRef.current.started) {
        introRef.current.started = true;
        introRef.current.startTime = time;
      }
      const elapsed = time - introRef.current.startTime - 0.6; // 0.6 s delay
      if (elapsed > 0 && robotRef.current) {
        const rawP = Math.min(elapsed / 2.5, 1);
        const eased = 1 - Math.pow(1 - rawP, 5);            // quintic ease-out
        robotRef.current.position.y = -5 + eased * 4.5;    // -5 → -0.5
        if (rawP >= 1) introRef.current.done = true;
      }
    }

    // ── Robot horizontal slide (activeNode) ─────────────────────────────────
    const active = activeNodeRef.current;
    const targetRobotX = active === "left" ? 1.5 : active === "right" ? -1.5 : 0;
    robotXRef.current += (targetRobotX - robotXRef.current) * 0.04;
    if (robotRef.current) robotRef.current.position.x = robotXRef.current;

    // ── Head cursor tracking (overridden when activeNode is set) ─────────────
    const headTargetY = active === "left" ? -0.65
      : active === "right" ? 0.65
        : isTouchDevice ? Math.sin(time * 0.3) * 0.3
          : mouse.x * 0.75;
    const headTargetX = active ? 0
      : isTouchDevice ? Math.sin(time * 0.2) * 0.15
        : mouse.y * 0.35;

    const rot = rotRef.current;
    rot.y += (headTargetY - rot.y) * 0.06;
    rot.x += (headTargetX - rot.x) * 0.06;

    if (headGroupRef.current) {
      headGroupRef.current.rotation.y = rot.y;
      headGroupRef.current.rotation.x = rot.x;
      headGroupRef.current.rotation.z = -rot.y * 0.18;
      headGroupRef.current.position.y = -0.05 + Math.sin(time * 0.8) * 0.006;
    }

    // ── Subtle body follow ───────────────────────────────────────────────────
    if (torsoRef.current) torsoRef.current.rotation.y = rot.y * 0.05;
    if (leftShoulderRef.current) leftShoulderRef.current.rotation.y = rot.y * -0.08;
    if (rightShoulderRef.current) rightShoulderRef.current.rotation.y = rot.y * -0.08;

    // ── Breathing ───────────────────────────────────────────────────────────
    if (robotRef.current) {
      robotRef.current.scale.y = 1 + Math.sin(time * 1.0) * 0.004;
    }

    // ── Arm idle sway ────────────────────────────────────────────────────────
    if (leftArmRef.current) leftArmRef.current.rotation.x = Math.sin(time * 0.6) * 0.015;
    if (rightArmRef.current) rightArmRef.current.rotation.x = Math.sin(time * 0.6 + 0.4) * 0.015;

    // ── Eye glow — reacts to cursor distance from centre ────────────────────
    const dist = Math.sqrt(mouse.x ** 2 + mouse.y ** 2);
    const targetEyeInt = 0.3 + (1 - Math.min(dist, 1)) * 0.5;
    eyeIntRef.current += (targetEyeInt - eyeIntRef.current) * 0.04;
    const pulse = Math.sin(time * 1.8) * 0.06 + 0.94;
    const fi = eyeIntRef.current * pulse;
    const eyeC = new THREE.Color(0.42 * fi, 0.5 * fi, 0.38 * fi);

    if (leftEyeRef.current) (leftEyeRef.current.material as THREE.MeshBasicMaterial).color.copy(eyeC);
    if (rightEyeRef.current) (rightEyeRef.current.material as THREE.MeshBasicMaterial).color.copy(eyeC);
    if (leftEyeLightRef.current) leftEyeLightRef.current.intensity = fi * 0.25;
    if (rightEyeLightRef.current) rightEyeLightRef.current.intensity = fi * 0.25;

    // ── Mouth bars — ambient visualiser ─────────────────────────────────────
    mouthBarRefs.current.forEach((bar, i) => {
      if (!bar) return;
      const s = 0.3 + Math.sin(time * 2.5 + i * 0.7) * 0.15 + Math.sin(time * 4.2 + i * 0.91) * 0.1;
      const sv = Math.max(0.1, s);
      bar.scale.y = sv;
      const mi = 0.3 + sv * 0.5;
      (bar.material as THREE.MeshBasicMaterial).color.setRGB(0.42 * mi, 0.5 * mi, 0.38 * mi);
    });

    // ── Antenna tips pulse ───────────────────────────────────────────────────
    if (leftTipRef.current) {
      const a = Math.sin(time * 1.2) * 0.2 + 0.8;
      (leftTipRef.current.material as THREE.MeshBasicMaterial).color.setRGB(0.42 * a, 0.5 * a, 0.38 * a);
    }
    if (rightTipRef.current) {
      const a = Math.sin(time * 1.5 + 1) * 0.15 + 0.85;
      (rightTipRef.current.material as THREE.MeshBasicMaterial).color.setRGB(0.71 * a, 0.64 * a, 0.57 * a);
    }

    // ── Chest dot slow pulse ─────────────────────────────────────────────────
    if (chestDotRef.current) {
      const a = Math.sin(time * 1.0) * 0.15 + 0.85;
      (chestDotRef.current.material as THREE.MeshBasicMaterial).color.setRGB(0.42 * a, 0.5 * a, 0.38 * a);
    }
  });

  return (
    <>
      {/* ── Lighting ─────────────────────────────────────────────────────── */}
      <ambientLight color={0x1a1915} intensity={0.4} />
      <directionalLight color={0xfff5e8} intensity={1.0} position={[3, 5, 3]} castShadow />
      <directionalLight color={0x3d4a38} intensity={0.25} position={[-4, 1, 2]} />
      <directionalLight color={0x6b7f62} intensity={0.5} position={[0, 2, -4]} />
      <pointLight color={0x6b7f62} intensity={0.15} distance={6} position={[0, -3.5, 1.5]} />

      {/* Environment map for metallic reflections */}
      <Environment preset="studio" />

      {/* ── Robot root ───────────────────────────────────────────────────── */}
      <group ref={robotRef} position={[0, -5, 0]}>

        {/* Torso */}
        <mesh ref={torsoRef} material={mats.body} position={[0, -1.15, 0]}>
          <boxGeometry args={[1.7, 1.3, 0.85]} />
        </mesh>

        {/* Chest panel */}
        <mesh material={mats.panel} position={[0, -1.05, 0.44]}>
          <boxGeometry args={[1.1, 0.7, 0.04]} />
        </mesh>

        {/* Chest line */}
        <mesh material={mats.sage} position={[0, -0.85, 0.47]}>
          <boxGeometry args={[0.65, 0.02, 0.01]} />
        </mesh>

        {/* Chest dot — slow pulse */}
        <mesh ref={chestDotRef} position={[0, -1.1, 0.47]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.02, 16]} />
          <meshBasicMaterial color={0x6b7f62} />
        </mesh>

        {/* Lower torso */}
        <mesh material={mats.body} position={[0, -2.0, 0]}>
          <boxGeometry args={[1.35, 0.4, 0.75]} />
        </mesh>

        {/* Waist line */}
        <mesh material={mats.sand} position={[0, -1.82, 0]}>
          <boxGeometry args={[1.4, 0.015, 0.78]} />
        </mesh>

        {/* Shoulder pads */}
        <mesh ref={leftShoulderRef} material={mats.panel} position={[-1.2, -0.62, 0]}>
          <boxGeometry args={[0.42, 0.28, 0.42]} />
        </mesh>
        <mesh ref={rightShoulderRef} material={mats.panel} position={[1.2, -0.62, 0]}>
          <boxGeometry args={[0.42, 0.28, 0.42]} />
        </mesh>

        {/* Shoulder joints */}
        <mesh material={mats.joint} position={[-1.45, -0.62, 0]}>
          <sphereGeometry args={[0.15, 12, 12]} />
        </mesh>
        <mesh material={mats.joint} position={[1.45, -0.62, 0]}>
          <sphereGeometry args={[0.15, 12, 12]} />
        </mesh>

        {/* Arms */}
        <RobotArm side="left" mats={mats} groupRef={leftArmRef} />
        <RobotArm side="right" mats={mats} groupRef={rightArmRef} />

        {/* Neck */}
        <mesh material={mats.joint} position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.15, 0.2, 0.3, 8]} />
        </mesh>

        {/* Neck ring */}
        <mesh material={mats.sage} position={[0, -0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.18, 0.015, 8, 20]} />
        </mesh>

        {/* ── Head group — rotates for cursor tracking ─────────────────── */}
        <group ref={headGroupRef} position={[0, -0.05, 0]}>

          {/* Head box */}
          <mesh material={mats.body} position={[0, 0.32, 0]}>
            <boxGeometry args={[1.0, 0.78, 0.72]} />
          </mesh>

          {/* Face plate */}
          <mesh material={mats.panel} position={[0, 0.3, 0.375]}>
            <boxGeometry args={[0.85, 0.6, 0.03]} />
          </mesh>

          {/* Top plate */}
          <mesh material={mats.panel} position={[0, 0.72, 0]}>
            <boxGeometry args={[0.82, 0.03, 0.58]} />
          </mesh>

          {/* Brow line */}
          <mesh material={mats.sage} position={[0, 0.55, 0.39]}>
            <boxGeometry args={[0.6, 0.015, 0.01]} />
          </mesh>

          {/* Eye housings */}
          <mesh material={mats.eyeHousing} position={[-0.2, 0.4, 0.37]}>
            <boxGeometry args={[0.18, 0.14, 0.06]} />
          </mesh>
          <mesh material={mats.eyeHousing} position={[0.2, 0.4, 0.37]}>
            <boxGeometry args={[0.18, 0.14, 0.06]} />
          </mesh>

          {/* Eyes */}
          <mesh ref={leftEyeRef} position={[-0.2, 0.4, 0.41]}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshBasicMaterial color={0x6b7f62} />
          </mesh>
          <mesh ref={rightEyeRef} position={[0.2, 0.4, 0.41]}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshBasicMaterial color={0x6b7f62} />
          </mesh>

          {/* Eye point lights */}
          <pointLight ref={leftEyeLightRef} color={0x6b7f62} intensity={0.2} distance={1.5} position={[-0.2, 0.4, 0.5]} />
          <pointLight ref={rightEyeLightRef} color={0x6b7f62} intensity={0.2} distance={1.5} position={[0.2, 0.4, 0.5]} />

          {/* Mouth housing */}
          <mesh material={mats.eyeHousing} position={[0, 0.14, 0.38]}>
            <boxGeometry args={[0.38, 0.08, 0.04]} />
          </mesh>

          {/* Mouth bars — visualiser */}
          {[0, 1, 2, 3, 4].map((i) => (
            <mesh
              key={i}
              ref={(el) => { mouthBarRefs.current[i] = el; }}
              position={[-0.12 + i * 0.06, 0.14, 0.41]}
            >
              <boxGeometry args={[0.02, 0.05, 0.02]} />
              <meshBasicMaterial color={0x6b7f62} />
            </mesh>
          ))}

          {/* Left antenna */}
          <mesh material={mats.joint} position={[-0.32, 0.95, 0]} rotation={[0, 0, 0.1]}>
            <cylinderGeometry args={[0.015, 0.02, 0.4, 6]} />
          </mesh>
          <mesh ref={leftTipRef} position={[-0.36, 1.17, 0]}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshBasicMaterial color={0x6b7f62} />
          </mesh>
          <pointLight color={0x6b7f62} intensity={0.1} distance={1} position={[-0.36, 1.19, 0]} />

          {/* Right antenna */}
          <mesh material={mats.joint} position={[0.32, 0.88, 0]} rotation={[0, 0, -0.1]}>
            <cylinderGeometry args={[0.015, 0.02, 0.3, 6]} />
          </mesh>
          <mesh ref={rightTipRef} position={[0.35, 1.05, 0]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color={0xb6a492} />
          </mesh>
          <pointLight color={0xb6a492} intensity={0.08} distance={0.8} position={[0.35, 1.07, 0]} />

          {/* Side vents — 3 per side */}
          {([-1, 1] as const).map((side) =>
            [0, 1, 2].map((j) => (
              <mesh
                key={`vent-${side}-${j}`}
                material={mats.joint}
                position={[side * 0.51, 0.42 - j * 0.08, 0]}
              >
                <boxGeometry args={[0.025, 0.04, 0.18]} />
              </mesh>
            ))
          )}
        </group>
      </group>
    </>
  );
}

// ---------------------------------------------------------------------------
// Canvas wrapper — exported default
// ---------------------------------------------------------------------------

export default function RobotHero() {
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const activeNodeRef = useRef<"left" | "right" | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        height: "85%",
        zIndex: 1,
        pointerEvents: "none",
      }}
    >
      <Canvas
        gl={{
          alpha: true,
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.9,
        }}
        camera={{ fov: 30, position: [0, 0.6, 7.5], near: 0.1, far: 100 }}
        onCreated={({ camera, gl }) => {
          gl.setClearColor(0x000000, 0);
          camera.lookAt(0, -0.1, 0);
        }}
        shadows
        style={{ background: "transparent", pointerEvents: "none" }}
      >
        <Suspense fallback={null}>
          <AdaptiveDpr pixelated />
          <RobotScene mouseRef={mouseRef} isTouchDevice={isTouchDevice} activeNodeRef={activeNodeRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
