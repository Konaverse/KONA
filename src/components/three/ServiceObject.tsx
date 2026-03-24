"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import WebDevObject from "./service-objects/WebDevObject";
import VideographyObject from "./service-objects/VideographyObject";
import DigitalAdsObject from "./service-objects/DigitalAdsObject";
import SocialMediaObject from "./service-objects/SocialMediaObject";
import WebAppObject from "./service-objects/WebAppObject";

const OBJECTS = [WebDevObject, VideographyObject, DigitalAdsObject, SocialMediaObject, WebAppObject];

const N    = OBJECTS.length;
const SLOT = (2 * Math.PI) / N; // 72° per step
const R    = 8.5;                // wheel radius (user-tuned)

// Vertical Ferris wheel in the Y-Z plane.
// θ=0  → (0, 0, 0)              active, facing camera
// θ>0  → below + receding       incoming (scroll forward)
// θ<0  → above + receding       exiting  (scroll forward)
function wheelPos(theta: number): [number, number, number] {
  return [0, -R * Math.sin(theta), R * (Math.cos(theta) - 1)];
}

function wrapAngle(a: number): number {
  let r = a % (2 * Math.PI);
  if (r >  Math.PI) r -= 2 * Math.PI;
  if (r < -Math.PI) r += 2 * Math.PI;
  return r;
}

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

function WheelScene({ serviceIndex }: { serviceIndex: number }) {
  const wrappers  = useRef<(THREE.Group | null)[]>(Array(N).fill(null));
  const matCache  = useRef<Map<number, THREE.MeshStandardMaterial[]>>(new Map());

  // Animation state — all mutable, no re-renders needed
  const anim = useRef({
    offset:       serviceIndex * SLOT,
    startOffset:  serviceIndex * SLOT,
    targetOffset: serviceIndex * SLOT,
    t:            1,    // 1 = complete
    duration:     0.6,  // seconds
    prevIdx:      serviceIndex,
  });

  const idxRef = useRef(serviceIndex);
  idxRef.current = serviceIndex; // always current in render closure

  // Stable initial positions (computed once — prevents position prop fighting useFrame)
  const initPos = useMemo(
    () => OBJECTS.map((_, i) => wheelPos(i * SLOT - serviceIndex * SLOT)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame((state, dt) => {
    const a = anim.current;

    // ── Detect index change → start new easeOutQuart transition ──
    if (a.prevIdx !== idxRef.current) {
      const rawTarget = idxRef.current * SLOT;
      let diff = rawTarget - a.offset;
      while (diff >  Math.PI) diff -= 2 * Math.PI;
      while (diff < -Math.PI) diff += 2 * Math.PI;
      a.startOffset  = a.offset;
      a.targetOffset = a.offset + diff;
      a.t            = 0;
      a.prevIdx      = idxRef.current;
    }

    // ── Advance easeOutQuart ──
    if (a.t < 1) {
      a.t = Math.min(1, a.t + dt / a.duration);
      a.offset = a.startOffset + (a.targetOffset - a.startOffset) * easeOutQuart(a.t);
    }

    // ── Update wrappers ──
    wrappers.current.forEach((g, i) => {
      if (!g) return;

      const theta = i * SLOT - a.offset;
      const dist  = Math.abs(wrapAngle(theta));

      // Only the active object + its immediate neighbours are visible
      g.visible = dist < SLOT * 1.5;

      if (!g.visible) return;

      const [x, y, z] = wheelPos(theta);
      g.position.set(x, y, z);

      // ── Glow pulse: cache material refs on first visit ──
      if (!matCache.current.has(i)) {
        const mats: THREE.MeshStandardMaterial[] = [];
        g.traverse((obj) => {
          const mesh = obj as THREE.Mesh;
          if (!mesh.isMesh) return;
          const arr = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          arr.forEach((m) => {
            if (m instanceof THREE.MeshStandardMaterial) mats.push(m);
          });
        });
        matCache.current.set(i, mats);
      }

      const mats     = matCache.current.get(i) ?? [];
      const isActive = dist < SLOT * 0.3;

      if (isActive) {
        // Slow sinusoidal pulse between 0.18 and 0.28
        const pulse = 0.18 + 0.10 * (0.5 + 0.5 * Math.sin(state.clock.elapsedTime * 2.5));
        mats.forEach((m) => { m.emissiveIntensity = pulse; });
      } else {
        // Reset to base as the object transitions out
        mats.forEach((m) => { m.emissiveIntensity = 0.18; });
      }
    });
  });

  return (
    <>
      {OBJECTS.map((Obj, i) => (
        <group
          key={i}
          ref={(el: THREE.Group | null) => { wrappers.current[i] = el; }}
          position={initPos[i] as [number, number, number]}
        >
          <Obj />
        </group>
      ))}
    </>
  );
}

export default function ServiceObject({ serviceIndex = 0 }: { serviceIndex?: number }) {
  return (
    <Canvas
      style={{ width: "100%", height: "100%", background: "transparent" }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: false }}
      camera={{ position: [0, 0, 5], fov: 50, near: 0.1, far: 100 }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 4, 4]} intensity={1.2} />
      <WheelScene serviceIndex={serviceIndex} />
    </Canvas>
  );
}
