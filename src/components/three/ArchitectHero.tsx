"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import HeroHUD from "./HeroHUD";

const BASE_MODEL = "/models/architect/Walking.fbx";
const IDLE_ANIM = "/models/architect/Breathing Idle.fbx";

// ─── Camera setup ─────────────────────────────────────────────
function CameraRig() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0.083, 1.651, 1.225);
    camera.lookAt(-0.071, 1.513, -0.015);
  }, [camera]);
  return null;
}

// ─── Inner 3D component ───────────────────────────────────────
function ArchitectModel() {
  const baseModel = useLoader(FBXLoader, BASE_MODEL);
  const idleData = useLoader(FBXLoader, IDLE_ANIM);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const readyRef = useRef(false);

  // Scale & enhance materials once on first render
  if (!readyRef.current) {
    readyRef.current = true;

    const box = new THREE.Box3().setFromObject(baseModel);
    const height = box.max.y - box.min.y;
    if (height > 5) {
      const s = 1.8 / height;
      baseModel.scale.setScalar(s);
      box.setFromObject(baseModel);
    }

    // Position model: shifted down so upper body fills viewport
    baseModel.position.y = -box.min.y - 0.9;

    baseModel.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        const mats = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];
        mats.forEach((mat) => {
          if (
            (mat as THREE.MeshStandardMaterial).isMeshStandardMaterial ||
            (mat as THREE.MeshPhongMaterial).isMeshPhongMaterial
          ) {
            (mat as THREE.MeshStandardMaterial).emissive = new THREE.Color(
              0x00ff88
            );
            (mat as THREE.MeshStandardMaterial).emissiveIntensity = 0.015;
            mat.needsUpdate = true;
          }
        });
      }
    });
  }

  // Setup animation
  useEffect(() => {
    const mixer = new THREE.AnimationMixer(baseModel);
    mixerRef.current = mixer;

    if (idleData.animations.length > 0) {
      const clip = idleData.animations[0];
      const action = mixer.clipAction(clip);
      action.play();
    }

    return () => {
      mixer.stopAllAction();
      mixer.uncacheRoot(baseModel);
    };
  }, [baseModel, idleData]);

  useFrame((_, delta) => {
    mixerRef.current?.update(delta);
  });

  return <primitive object={baseModel} />;
}

// ─── Door overlay ─────────────────────────────────────────────
function DoorOverlay({ onComplete }: { onComplete: () => void }) {
  const leftGlowRef = useRef<HTMLDivElement>(null);
  const rightGlowRef = useRef<HTMLDivElement>(null);
  const leftDoorRef = useRef<HTMLDivElement>(null);
  const rightDoorRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<number | null>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    let rafId: number;

    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = (now - startRef.current) / 1000;

      const leftGlow = leftGlowRef.current;
      const rightGlow = rightGlowRef.current;
      const leftDoor = leftDoorRef.current;
      const rightDoor = rightDoorRef.current;

      // Phase 1: 0–1s — darkness, nothing happens

      // Phase 2: 1–2.5s — green crack grows
      if (elapsed >= 1 && elapsed < 2.5) {
        const t = (elapsed - 1) / 1.5;
        const heightPct = Math.min(t * 2, 1) * 100;
        const glowWidth = 1 + t * 11;
        const spread = 10 + t * 40;
        const alpha = 0.3 + t * 0.7;

        const style = {
          height: `${heightPct}%`,
          width: `${glowWidth}px`,
          opacity: "1",
          boxShadow: `0 0 ${spread}px rgba(0,255,136,${alpha}), 0 0 ${spread * 2.5}px rgba(0,255,136,${alpha * 0.3})`,
        };

        if (leftGlow) Object.assign(leftGlow.style, style);
        if (rightGlow) Object.assign(rightGlow.style, style);
      }

      // Phase 3: 2.5–4.5s — doors slide apart, glow fades
      if (elapsed >= 2.5 && elapsed < 4.5) {
        const t = (elapsed - 2.5) / 2;
        const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        const glowFade = 1 - eased;

        if (leftDoor) leftDoor.style.transform = `translateX(-${eased * 100}%)`;
        if (rightDoor) rightDoor.style.transform = `translateX(${eased * 100}%)`;

        const fadedSpread = 50 * glowFade;
        const fadedAlpha = glowFade;
        const glowStyle = {
          opacity: `${glowFade}`,
          boxShadow: `0 0 ${fadedSpread}px rgba(0,255,136,${fadedAlpha}), 0 0 ${fadedSpread * 2.5}px rgba(0,255,136,${fadedAlpha * 0.3})`,
        };
        if (leftGlow) Object.assign(leftGlow.style, glowStyle);
        if (rightGlow) Object.assign(rightGlow.style, glowStyle);
      }

      // Phase 4: 4.5s+ — remove doors
      if (elapsed >= 4.5 && !doneRef.current) {
        doneRef.current = true;
        onComplete();
        return;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [onComplete]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Left panel */}
      <div
        ref={leftDoorRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: "50%",
          background: "#000000",
          willChange: "transform",
        }}
      >
        <div
          ref={leftGlowRef}
          style={{
            position: "absolute",
            top: "50%",
            right: 0,
            transform: "translateY(-50%)",
            width: 0,
            height: 0,
            background: "#00ff88",
            borderRadius: 2,
            opacity: 0,
          }}
        />
      </div>
      {/* Right panel */}
      <div
        ref={rightDoorRef}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "50%",
          background: "#000000",
          willChange: "transform",
        }}
      >
        <div
          ref={rightGlowRef}
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            transform: "translateY(-50%)",
            width: 0,
            height: 0,
            background: "#00ff88",
            borderRadius: 2,
            opacity: 0,
          }}
        />
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────
export default function ArchitectHero({
  onEntranceComplete,
}: {
  onEntranceComplete?: () => void;
}) {
  const [doorsVisible, setDoorsVisible] = useState(true);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        background: "transparent",
        overflow: "hidden",
      }}
    >
      {/* KONAVERSE title — behind the architect, hidden until doors open */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          paddingTop: "12vh",
          pointerEvents: "none",
          opacity: doorsVisible ? 0 : 1,
          transition: "opacity 1.2s ease-out",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-monument), sans-serif",
            fontWeight: 800,
            fontSize: "11vw",
            lineHeight: 1,
            background: "linear-gradient(to bottom, rgba(255,255,255,0.15), rgba(0,0,0,0))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            userSelect: "none",
          }}
        >
          KONAVERSE
        </span>
      </div>

      {doorsVisible && (
        <DoorOverlay onComplete={() => { setDoorsVisible(false); onEntranceComplete?.(); }} />
      )}

      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.8,
        }}
        camera={{ fov: 50, near: 0.1, far: 100, position: [0.083, 1.651, 1.225] }}
        shadows
        style={{ position: "relative", zIndex: 2, background: "transparent" }}
      >
        <CameraRig />

        {/* Key light — green-tinted */}
        <directionalLight
          color="#00ff88"
          intensity={1.2}
          position={[3, 5, 2]}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        {/* Fill light — opposite side, dim */}
        <directionalLight
          color="#004422"
          intensity={0.4}
          position={[-3, 2, -1]}
        />

        {/* Ambient — very low */}
        <ambientLight intensity={0.15} />

        <ArchitectModel />
      </Canvas>

      {/* HUD overlay — tagline, stats, capability cards */}
      <HeroHUD visible={!doorsVisible} />
    </div>
  );
}
