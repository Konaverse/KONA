"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { motion, AnimatePresence } from "framer-motion";
import HeroHUD from "./HeroHUD";

const BASE_MODEL = "/models/architect/Walking.fbx";
const IDLE_ANIM = "/models/architect/Breathing Idle.fbx";

// ─── Shared State Types ───────────────────────────────────────
export interface HoveredCardState {
  id: string;
  x: number;
  y: number;
}

// ─── Camera setup ─────────────────────────────────────────────
function CameraRig() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0.083, 1.651, 1.225);
    camera.lookAt(-0.071, 1.513, -0.015);
  }, [camera]);
  return null;
}

// ─── Premium WebGL Spark System (Quad-based Plasma) ─────────
const boltVertexShader = `
  attribute vec3 instanceStart;
  attribute vec3 instanceEnd;
  attribute float instanceOpacity;
  attribute float instanceWidth;
  
  varying vec2 vUv;
  varying float vOpacity;

  void main() {
    vUv = uv;
    vOpacity = instanceOpacity;

    vec3 dir = instanceEnd - instanceStart;
    vec3 nDir = normalize(dir);

    // Billboarding: Ensure the beam always faces the camera
    vec3 worldStart = (modelMatrix * vec4(instanceStart, 1.0)).xyz;
    vec3 viewDir = normalize(cameraPosition - worldStart);
    vec3 up = normalize(cross(nDir, viewDir));
    
    // Stretch the quad between points and expand by width
    vec3 pos = instanceStart + dir * uv.x + up * (uv.y - 0.5) * instanceWidth;
    
    gl_Position = projectionMatrix * viewMatrix * vec4(pos, 1.0);
  }
`;

const boltFragmentShader = `
  uniform vec3 uColor;
  uniform float uTime;
  varying vec2 vUv;
  varying float vOpacity;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  void main() {
    // High-speed voltage jitter
    float strobe = step(0.15, random(vec2(uTime * 45.0, vUv.x * 5.0)));
    
    // Gaussian-like falloff across the beam width (vUv.y)
    float dist = abs(vUv.y - 0.5) * 2.0;
    float glow = exp(-dist * 3.5);
    float core = exp(-dist * 18.0);
    
    // Emerald to White-hot core transition
    vec3 finalColor = mix(uColor, vec3(1.0), core * 0.8);
    
    // Fade at segment junctions
    float edgeFade = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x);
    
    gl_FragColor = vec4(finalColor, vOpacity * (glow + core) * strobe * edgeFade);
  }
`;

function WebGLSparkSystem({ active }: { active: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const MAX_INSTANCES = 500;
  
  const startAttr = useMemo(() => new Float32Array(MAX_INSTANCES * 3), []);
  const endAttr = useMemo(() => new Float32Array(MAX_INSTANCES * 3), []);
  const opacityAttr = useMemo(() => new Float32Array(MAX_INSTANCES), []);
  const widthAttr = useMemo(() => new Float32Array(MAX_INSTANCES), []);
  
  const arcsRef = useRef<{
    life: number;
    segments: { start: THREE.Vector3; end: THREE.Vector3; width: number }[];
  }[]>([]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // 1. Arc Spawning (Recursive Branching lightning)
    if (active && Math.random() < 0.18 && arcsRef.current.length < 12) {
      const segments: any[] = [];
      const startX = (Math.random() - 0.5) * 5.5; // KONAVERSE text width
      const startY = 1.15; 
      
      const generateArc = (start: THREE.Vector3, dir: THREE.Vector3, depth: number, width: number) => {
        if (depth <= 0) return;
        let curr = start.clone();
        const steps = 4 + Math.floor(Math.random() * 3);
        
        for (let i = 0; i < steps; i++) {
          let next = curr.clone().add(dir.clone().multiplyScalar(0.12));
          next.x += (Math.random() - 0.5) * 0.18;
          next.y += (Math.random() - 0.2) * 0.18;
          next.z += (Math.random() - 0.5) * 0.08;
          
          segments.push({ start: curr.clone(), end: next.clone(), width });
          curr = next.clone();
          
          if (Math.random() < 0.25 && depth > 1) {
            const branchDir = dir.clone().applyAxisAngle(new THREE.Vector3(0,0,1), (Math.random()-0.5)*2.5);
            generateArc(curr, branchDir, depth - 1, width * 0.5);
          }
        }
      };

      generateArc(
        new THREE.Vector3(startX, startY, 0.05), 
        new THREE.Vector3((Math.random() - 0.5) * 0.4, 1, 0), 
        3, 
        0.07
      );
      arcsRef.current.push({ life: 1.0, segments });
    }

    // 2. Buffer Update
    let idx = 0;
    startAttr.fill(0); endAttr.fill(0); opacityAttr.fill(0); widthAttr.fill(0);

    for (let i = arcsRef.current.length - 1; i >= 0; i--) {
      const arc = arcsRef.current[i];
      arc.life -= delta * 2.8;
      if (arc.life <= 0) { arcsRef.current.splice(i, 1); continue; }

      arc.segments.forEach(s => {
        if (idx >= MAX_INSTANCES) return;
        startAttr.set([s.start.x, s.start.y, s.start.z], idx * 3);
        endAttr.set([s.end.x, s.end.y, s.end.z], idx * 3);
        opacityAttr[idx] = arc.life;
        widthAttr[idx] = s.width;
        idx++;
      });
    }

    const geo = meshRef.current.geometry;
    geo.attributes.instanceStart.needsUpdate = true;
    geo.attributes.instanceEnd.needsUpdate = true;
    geo.attributes.instanceOpacity.needsUpdate = true;
    geo.attributes.instanceWidth.needsUpdate = true;
    meshRef.current.count = idx;

    if (meshRef.current.material instanceof THREE.ShaderMaterial) {
      meshRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[null as any, null as any, MAX_INSTANCES]}>
      <planeGeometry args={[1, 1]}>
        <instancedBufferAttribute attach="attributes-instanceStart" args={[startAttr, 3]} />
        <instancedBufferAttribute attach="attributes-instanceEnd" args={[endAttr, 3]} />
        <instancedBufferAttribute attach="attributes-instanceOpacity" args={[opacityAttr, 1]} />
        <instancedBufferAttribute attach="attributes-instanceWidth" args={[widthAttr, 1]} />
      </planeGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={boltVertexShader}
        fragmentShader={boltFragmentShader}
        uniforms={{
          uColor: { value: new THREE.Color("#00ff88") },
          uTime: { value: 0 }
        }}
      />
    </instancedMesh>
  );
}

// ─── Inner 3D component ───────────────────────────────────────
function ArchitectModel({
  hoveredCard,
  onHeadPositionUpdate,
}: {
  hoveredCard: HoveredCardState | null;
  onHeadPositionUpdate: (pos: { x: number; y: number }) => void;
}) {
  const baseModel = useLoader(FBXLoader, BASE_MODEL);
  const idleData = useLoader(FBXLoader, IDLE_ANIM);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  
  // Refs for tracking and resonance
  const headBoneRef = useRef<THREE.Object3D | null>(null);
  const chestBoneRef = useRef<THREE.Object3D | null>(null);
  const materialsRef = useRef<THREE.Material[]>([]);
  const pointLightRef = useRef<THREE.PointLight>(null);
  const shockwaveRef = useRef(0);

  const mouseRef = useRef(new THREE.Vector2());
  const { viewport, camera, size } = useThree();
  const lastUpdateRef = useRef({ x: 0, y: 0 });

  // Initialize model properties (position, shadows, materials, bones)
  useMemo(() => {
    if (!baseModel) return;

    const box = new THREE.Box3().setFromObject(baseModel);
    const height = box.max.y - box.min.y;
    if (height > 5) {
      baseModel.scale.setScalar(1.8 / height);
      box.setFromObject(baseModel);
    }

    baseModel.position.setY(-box.min.y - 0.9);

    baseModel.traverse((child) => {
      // Find key bones
      if ((child as THREE.Bone).isBone) {
        const name = child.name.toLowerCase();
        if (name.includes("head") && !name.includes("end")) headBoneRef.current = child;
        if (name.includes("spine2") || name.includes("chest") || name.includes("spine")) chestBoneRef.current = child;
      }

      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        
        mats.forEach((mat) => {
          if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhongMaterial) {
            const m = mat as THREE.MeshStandardMaterial;
            m.emissive = new THREE.Color(0x00ff88);
            m.emissiveIntensity = 0.015;
            m.needsUpdate = true;
            if (!materialsRef.current.includes(m)) materialsRef.current.push(m);
          }
        });
      }
    });
  }, [baseModel]);

  // Setup animation & events
  useEffect(() => {
    if (!baseModel || !idleData) return;
    
    const mixer = new THREE.AnimationMixer(baseModel);
    mixerRef.current = mixer;

    if (idleData.animations.length > 0) {
      const action = mixer.clipAction(idleData.animations[0]);
      action.play();
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleClick = () => {
      shockwaveRef.current = 1.0;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    return () => {
      mixer.stopAllAction();
      mixer.uncacheRoot(baseModel);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
    };
  }, [baseModel, idleData]);

  const tempVec = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    if (!mixerRef.current) return;
    mixerRef.current.update(delta);

    // 1. Head Tracking
    if (headBoneRef.current) {
      const head = headBoneRef.current;
      head.getWorldPosition(tempVec);
      tempVec.setY(tempVec.y + 0.1);
      tempVec.project(camera);
      
      const screenX = (tempVec.x * 0.5 + 0.5) * size.width;
      const screenY = (-(tempVec.y * 0.5) + 0.5) * size.height;

      if (Math.abs(screenX - lastUpdateRef.current.x) > 2 || Math.abs(screenY - lastUpdateRef.current.y) > 2) {
        lastUpdateRef.current = { x: screenX, y: screenY };
        onHeadPositionUpdate({ x: screenX, y: screenY });
      }

      let targetX = 0;
      let targetY = 0;

      if (hoveredCard) {
        const cardNdcX = (hoveredCard.x / window.innerWidth) * 2 - 1;
        const cardNdcY = -(hoveredCard.y / window.innerHeight) * 2 + 1;
        targetX = cardNdcX * (viewport.width / 2);
        targetY = cardNdcY * (viewport.height / 2);
      } else {
        targetX = mouseRef.current.x * (viewport.width / 2);
        targetY = mouseRef.current.y * (viewport.height / 2);
      }

      const tRY = Math.max(-1.57, Math.min(1.57, targetX * 1.2));
      const tRX = Math.max(-1.05, Math.min(1.05, -targetY * 0.8));

      const lerpS = hoveredCard ? 0.2 : 0.12;
      head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, tRY, lerpS);
      head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, tRX, lerpS);
    }

    // 2. Emissive Resonance & Shockwave
    if (shockwaveRef.current > 0) {
      shockwaveRef.current -= delta * 1.5;
    }
    const sw = Math.max(0, shockwaveRef.current);
    const pulseIntensity = 0.015 + sw * 0.05;

    if (materialsRef.current.length > 0) {
      materialsRef.current.forEach((mat) => {
        if (mat instanceof THREE.MeshStandardMaterial) {
          mat.emissiveIntensity = pulseIntensity;
        }
      });
    }

    // 3. Physical light ripple
    if (pointLightRef.current && chestBoneRef.current) {
      chestBoneRef.current.getWorldPosition(tempVec);
      pointLightRef.current.position.copy(tempVec);
      pointLightRef.current.position.setZ(pointLightRef.current.position.z + 0.2);
      
      if (sw > 0) {
        pointLightRef.current.intensity = sw * 15;
        pointLightRef.current.distance = 1.0 + (1.0 - sw) * 4.0;
      } else {
        pointLightRef.current.intensity = 0;
      }
    }
  });

  return (
    <>
      <primitive object={baseModel} />
      <pointLight ref={pointLightRef} color="#00ff88" intensity={0} decay={2} distance={3} />
    </>
  );
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
      if (elapsed >= 1 && elapsed < 2.5) {
        const t = (elapsed - 1) / 1.5;
        const style = { height: `${Math.min(t * 2, 1) * 100}%`, width: `${1 + t * 11}px`, opacity: "1", boxShadow: `0 0 ${10 + t * 40}px rgba(0,255,136,${0.3 + t * 0.7}), 0 0 ${(10 + t * 40) * 2.5}px rgba(0,255,136,${(0.3 + t * 0.7) * 0.3})` };
        if (leftGlowRef.current) Object.assign(leftGlowRef.current.style, style);
        if (rightGlowRef.current) Object.assign(rightGlowRef.current.style, style);
      }
      if (elapsed >= 2.5 && elapsed < 4.5) {
        const t = (elapsed - 2.5) / 2;
        const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        if (leftDoorRef.current) leftDoorRef.current.style.transform = `translateX(-${eased * 100}%)`;
        if (rightDoorRef.current) rightDoorRef.current.style.transform = `translateX(${eased * 100}%)`;
        const glowStyle = { opacity: `${1 - eased}`, boxShadow: `0 0 ${50 * (1-eased)}px rgba(0,255,136,${1-eased}), 0 0 ${50 * (1-eased) * 2.5}px rgba(0,255,136,${(1-eased) * 0.3})` };
        if (leftGlowRef.current) Object.assign(leftGlowRef.current.style, glowStyle);
        if (rightGlowRef.current) Object.assign(rightGlowRef.current.style, glowStyle);
      }
      if (elapsed >= 4.5 && !doneRef.current) { doneRef.current = true; onComplete(); return; }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [onComplete]);

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none", overflow: "hidden" }}>
      <div ref={leftDoorRef} style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "50%", background: "#000000", willChange: "transform" }}>
        <div ref={leftGlowRef} style={{ position: "absolute", top: "50%", right: 0, transform: "translateY(-50%)", width: 0, height: 0, background: "#00ff88", borderRadius: 2, opacity: 0 }} />
      </div>
      <div ref={rightDoorRef} style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "50%", background: "#000000", willChange: "transform" }}>
        <div ref={rightGlowRef} style={{ position: "absolute", top: "50%", left: 0, transform: "translateY(-50%)", width: 0, height: 0, background: "#00ff88", borderRadius: 2, opacity: 0 }} />
      </div>
    </div>
  );
}

export default function ArchitectHero({ onEntranceComplete }: { onEntranceComplete?: () => void }) {
  const [doorsVisible, setDoorsVisible] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<HoveredCardState | null>(null);
  const [headPosition, setHeadPosition] = useState({ x: 0, y: 0 });

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", background: "transparent", overflow: "hidden" }}>
      {doorsVisible && <DoorOverlay onComplete={() => { setDoorsVisible(false); onEntranceComplete?.(); }} />}
      <Canvas gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.8 }}
              camera={{ fov: 50, near: 0.1, far: 100, position: [0.083, 1.651, 1.225] }} shadows
              style={{ position: "relative", zIndex: 2, background: "transparent" }}>
        <CameraRig />
        <directionalLight color="#00ff88" intensity={1.2} position={[3, 5, 2]} castShadow />
        <directionalLight color="#004422" intensity={0.4} position={[-3, 2, -1]} />
        <ambientLight intensity={0.15} />
        <WebGLSparkSystem active={!doorsVisible} />
        <ArchitectModel hoveredCard={hoveredCard} onHeadPositionUpdate={setHeadPosition} />
      </Canvas>
      <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none" }}>
        <AnimatePresence>
          {hoveredCard && headPosition.x !== 0 && (
            <motion.svg initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ width: "100%", height: "100%" }}>
              <motion.line x1={headPosition.x} y1={headPosition.y} x2={hoveredCard.x} y2={hoveredCard.y} stroke="#00ff88" strokeWidth={1} strokeOpacity={0.6} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, ease: "easeOut" }} />
              <motion.line x1={headPosition.x} y1={headPosition.y} x2={hoveredCard.x} y2={hoveredCard.y} stroke="#00ff88" strokeWidth={3} strokeOpacity={0.3} style={{ filter: "blur(2px)" }} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, ease: "easeOut" }} />
              <motion.circle r={2} fill="#ffffff" style={{ filter: "blur(1px)" }} animate={{ cx: [headPosition.x, hoveredCard.x], cy: [headPosition.y, hoveredCard.y], opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} />
            </motion.svg>
          )}
        </AnimatePresence>
      </div>
      <HeroHUD visible={!doorsVisible} onHoverCard={(id, rect) => {
        if (id && rect) { setHoveredCard({ id, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }); }
        else { setHoveredCard(null); }
      }} />
    </div>
  );
}
