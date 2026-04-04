"use client";

import { useEffect, useRef, useMemo, useState, useCallback, Suspense } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { motion, useTransform, MotionValue } from "framer-motion";
import ProjectScenes from "./ProjectScenes";

// Architect pose per service (index 0-4)
const SERVICE_ANIMS = ["nod", "armGesture", "looking", "idle", "lookingBehind"] as const;

const BASE_MODEL = "/models/architect/Walking.fbx";
const IDLE_ANIM = "/models/architect/Breathing Idle.fbx";
const THOUGHTFUL_NOD_ANIM = "/models/architect/Thoughtful Head Nod.fbx";
const LOOKING_ANIM = "/models/architect/Looking.fbx";
const ARM_GESTURE_ANIM = "/models/architect/Arm Gesture.fbx";
const LOOKING_BEHIND_ANIM = "/models/architect/Looking Behind.fbx";
const TALKING_ANIM = "/models/architect/Talking.fbx";

// ─── Shared State Types ───────────────────────────────────────
export interface HoveredCardState {
  id: string;
  x: number;
  y: number;
}

// ─── Camera setup ─────────────────────────────────────────────
function CameraRig({ isMobile }: { isMobile?: boolean }) {
  const { camera } = useThree();
  useEffect(() => {
    if (isMobile) {
      camera.position.set(0, 1.651, 1.225);
      camera.lookAt(0, 1.513, -0.015);
    } else {
      camera.position.set(0.083, 1.651, 1.225);
      camera.lookAt(-0.071, 1.513, -0.015);
    }
  }, [camera, isMobile]);
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
    float strobe = step(0.15, random(vec2(uTime * 45.0, vUv.x * 5.0)));
    float dist = abs(vUv.y - 0.5) * 2.0;
    float glow = exp(-dist * 3.5);
    float core = exp(-dist * 18.0);
    vec3 finalColor = mix(uColor, vec3(1.0), core * 0.8);
    float edgeFade = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x);
    gl_FragColor = vec4(finalColor, vOpacity * (glow + core) * strobe * edgeFade);
  }
`;

function WebGLSparkSystem({ active, isMobile }: { active: boolean; isMobile?: boolean }) {
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
    if (!meshRef.current || !active) {
      if (meshRef.current) meshRef.current.count = 0;
      return;
    }

    const spawnChance = isMobile ? 0.06 : 0.18;
    const maxArcs = isMobile ? 4 : 12;
    if (Math.random() < spawnChance && arcsRef.current.length < maxArcs) {
      const segments: any[] = [];
      const startX = (Math.random() - 0.5) * 5.5;
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
            const branchDir = dir.clone().applyAxisAngle(new THREE.Vector3(0, 0, 1), (Math.random() - 0.5) * 2.5);
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

function ArchitectModel({
  hoveredCard,
  onHeadPositionUpdate,
  activeSection,
  scrollProgress,
  serviceIndex = 0,
  projectsAct = 0,
  onSceneReady,
  isMobile,
}: {
  hoveredCard: HoveredCardState | null;
  onHeadPositionUpdate: (pos: { x: number; y: number }) => void;
  activeSection: number;
  scrollProgress: MotionValue<number>;
  serviceIndex?: number;
  projectsAct?: number;
  onSceneReady?: () => void;
  isMobile?: boolean;
}) {
  const baseModel = useLoader(FBXLoader, BASE_MODEL);
  const idleData = useLoader(FBXLoader, IDLE_ANIM);
  const nodData = useLoader(FBXLoader, THOUGHTFUL_NOD_ANIM);
  const lookingData = useLoader(FBXLoader, LOOKING_ANIM);
  const armGestureData = useLoader(FBXLoader, ARM_GESTURE_ANIM);
  const lookingBehindData = useLoader(FBXLoader, LOOKING_BEHIND_ANIM);
  const talkingData = useLoader(FBXLoader, TALKING_ANIM);

  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionsRef = useRef<{ [key: string]: THREE.AnimationAction }>({});

  const headBoneRef = useRef<THREE.Object3D | null>(null);
  const chestBoneRef = useRef<THREE.Object3D | null>(null);
  const materialsRef = useRef<THREE.Material[]>([]);
  const pointLightRef = useRef<THREE.PointLight>(null);
  const shockwaveRef = useRef(0);
  const modelGroupRef = useRef<THREE.Group>(null);

  const mouseRef = useRef(new THREE.Vector2());
  const { viewport, camera, size } = useThree();
  const lastUpdateRef = useRef({ x: 0, y: 0 });
  const trackingWeightRef = useRef(1.0);
  const frameCountRef = useRef(0);
  const sceneReadyFiredRef = useRef(false);

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
      if ((child as THREE.Bone).isBone) {
        const name = child.name.toLowerCase();
        if (name.includes("head") && !name.includes("end")) headBoneRef.current = child;
        if (name.includes("spine2") || name.includes("chest") || name.includes("spine")) chestBoneRef.current = child;
      }

      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = false;
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

  useEffect(() => {
    if (!baseModel || !idleData || !nodData || !lookingData || !armGestureData || !lookingBehindData || !talkingData) return;

    const mixer = new THREE.AnimationMixer(baseModel);
    mixerRef.current = mixer;

    const idle = mixer.clipAction(idleData.animations[0]);
    const nod = mixer.clipAction(nodData.animations[0]);
    const looking = mixer.clipAction(lookingData.animations[0]);
    const armGesture = mixer.clipAction(armGestureData.animations[0]);
    const lookingBehind = mixer.clipAction(lookingBehindData.animations[0]);
    const talking = mixer.clipAction(talkingData.animations[0]);

    actionsRef.current = { idle, nod, looking, armGesture, lookingBehind, talking };

    idle.play();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    const handleClick = () => { shockwaveRef.current = 1.0; };
    if (!isMobile) window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    return () => {
      if (!isMobile) window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
    };
  }, [baseModel, idleData, nodData, lookingData, armGestureData, lookingBehindData, talkingData, isMobile]);

  // Track current animation state
  const currentAnimRef = useRef<string>("idle");
  const serviceIndexRef = useRef(serviceIndex);
  serviceIndexRef.current = serviceIndex;
  const projectsActRef = useRef(projectsAct);
  projectsActRef.current = projectsAct;

  // Stable crossfade helper — safe to call before actions are loaded (guards internally)
  const crossfadeTo = useCallback((target: string) => {
    if (currentAnimRef.current === target) return;
    const current = actionsRef.current[currentAnimRef.current];
    const next = actionsRef.current[target];
    if (!current || !next) return;
    current.fadeOut(0.5);
    next.reset().fadeIn(0.5).play();
    currentAnimRef.current = target;
  }, []);

  // Effect: section-level transitions + hero scroll-driven poses
  // Mobile: lock to idle — no animation crossfades that could shift the model
  useEffect(() => {
    if (isMobile) {
      crossfadeTo("idle");
      return;
    }

    if (activeSection >= 6) {
      crossfadeTo("talking");
    } else if (activeSection >= 5) {
      crossfadeTo("idle");
    } else if (activeSection >= 4) {
      crossfadeTo("idle");
    } else if (activeSection >= 3) {
      crossfadeTo(SERVICE_ANIMS[serviceIndexRef.current]);
    } else if (activeSection >= 2) {
      crossfadeTo("lookingBehind");
    } else if (activeSection >= 1) {
      crossfadeTo("looking");
    }

    const unsubscribe = scrollProgress.on("change", (val) => {
      if (activeSection >= 6) {
        crossfadeTo("talking");
      } else if (activeSection >= 5) {
        crossfadeTo("idle");
      } else if (activeSection >= 4) {
        crossfadeTo("idle");
      } else if (activeSection >= 3) {
        crossfadeTo(SERVICE_ANIMS[serviceIndexRef.current]);
      } else if (activeSection >= 2) {
        crossfadeTo("lookingBehind");
      } else if (activeSection >= 1) {
        crossfadeTo("looking");
      } else if (val >= 0.40) {
        crossfadeTo("armGesture");
      } else if (val >= 0.22) {
        crossfadeTo("nod");
      } else {
        crossfadeTo("idle");
      }
    });

    return () => unsubscribe();
  }, [scrollProgress, activeSection, crossfadeTo]);

  // Effect: per-service pose change while services section is visible
  useEffect(() => {
    if (activeSection !== 3) return;
    crossfadeTo(SERVICE_ANIMS[serviceIndex]);
  }, [serviceIndex, activeSection, crossfadeTo]);

  const tempVec = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    if (!mixerRef.current) return;
    mixerRef.current.update(delta);

    // Fire scene-ready after a few frames so the model is positioned
    frameCountRef.current++;
    if (frameCountRef.current === 3 && !sceneReadyFiredRef.current) {
      sceneReadyFiredRef.current = true;
      onSceneReady?.();
    }

    // High Performance: Get value from MotionValue without state update
    const scrollVal = scrollProgress.get();

    if (modelGroupRef.current) {
      const inCta = activeSection >= 6;
      const inTestimonials = activeSection === 5;
      const inInterlude = activeSection === 4;
      const inServices = activeSection === 3;
      const inClients = activeSection === 2;
      const p = THREE.MathUtils.clamp(scrollVal / 0.5, 0, 1);

      // Services: right side of screen, body turned to face left
      // Lerp speed 0.06 — fast enough to fully settle while the curtain
      // still covers the viewport (curtain clears at ~progress 0.30).
      const inProjectsAct1 = inInterlude && projectsActRef.current === 0;
      const inProjectsAct2 = inInterlude && projectsActRef.current === 1;
      // CTA: architect on left side, pushed further back, facing right
      // Testimonials: architect on right 1/3, closer to camera, facing left
      // Mobile: architect centered, pushed back + down so he occupies bottom ~50% of viewport
      const targetX = isMobile ? 0 : inCta ? -0.65 : inTestimonials ? 0.65 : inInterlude ? (inProjectsAct1 ? 0.55 : inProjectsAct2 ? -0.55 : 0.00) : inServices ? 0.55 : inClients ? -0.55 : -0.85 - 0.15 * p;
      const targetZ = isMobile ? -0.80 : inCta ? -0.50 : inTestimonials ? 0.25 : inInterlude ? (inProjectsAct1 ? 0.05 : inProjectsAct2 ? 0.05 : -0.35) : inServices ? 0.05 : inClients ? 0.05 : -0.25;
      const targetY = isMobile ? -0.35 : 0;
      const targetRotY = isMobile ? 0 : inCta ? 0.45 : inTestimonials ? -0.55 : inInterlude ? (inProjectsAct1 ? -0.45 : inProjectsAct2 ? 0.45 : 0.00) : inServices ? -0.50 : inClients ? 0.18 : 0.45 - 0.10 * p;
      const lerpSpeed = inCta ? 0.04 : inTestimonials ? 0.04 : inInterlude ? 0.04 : inServices ? 0.06 : inClients ? 0.025 : 0.1;

      const dtFactor = 1 - Math.pow(1 - lerpSpeed, delta * 60);
      modelGroupRef.current.position.x = THREE.MathUtils.lerp(modelGroupRef.current.position.x, targetX, dtFactor);
      modelGroupRef.current.position.y = THREE.MathUtils.lerp(modelGroupRef.current.position.y, targetY, dtFactor);
      modelGroupRef.current.position.z = THREE.MathUtils.lerp(modelGroupRef.current.position.z, targetZ, dtFactor);
      modelGroupRef.current.rotation.y = THREE.MathUtils.lerp(modelGroupRef.current.rotation.y, targetRotY, dtFactor);
    }

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

      const p = THREE.MathUtils.clamp(scrollVal / 0.5, 0, 1);
      const targetWeight = THREE.MathUtils.lerp(1.0, 0.15, p);
      trackingWeightRef.current = THREE.MathUtils.lerp(trackingWeightRef.current, targetWeight, 0.05);

      let tX = 0;
      let tY = 0;

      if (hoveredCard) {
        const cNX = (hoveredCard.x / window.innerWidth) * 2 - 1;
        const cNY = -(hoveredCard.y / window.innerHeight) * 2 + 1;
        tX = cNX * (viewport.width / 2);
        tY = cNY * (viewport.height / 2);
      } else {
        tX = mouseRef.current.x * (viewport.width / 2);
        tY = mouseRef.current.y * (viewport.height / 2);
      }

      const lookBias = 0.4 * p;
      const tRY = Math.max(-1.57, Math.min(1.57, tX * 1.2 + lookBias)) * trackingWeightRef.current;
      const tRX = Math.max(-1.05, Math.min(1.05, -tY * 0.8)) * trackingWeightRef.current;

      const lerpS = hoveredCard ? 0.2 : 0.1;
      head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, tRY, lerpS);
      // Bias head downward during projects section (looking at the holographic table)
      const headTiltBias = activeSection >= 6 ? 0 : activeSection >= 5 ? -0.05 : activeSection >= 4 ? -0.15 : 0;
      head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, tRX + headTiltBias, lerpS);
    }

    if (shockwaveRef.current > 0) shockwaveRef.current -= delta * 1.5;
    const pulseIntensity = 0.015 + Math.max(0, shockwaveRef.current) * 0.05;

    materialsRef.current.forEach((m) => {
      if (m instanceof THREE.MeshStandardMaterial) m.emissiveIntensity = pulseIntensity;
    });

    if (pointLightRef.current && chestBoneRef.current) {
      chestBoneRef.current.getWorldPosition(tempVec);
      pointLightRef.current.position.copy(tempVec).setZ(tempVec.z + 0.2);
      const sw = Math.max(0, shockwaveRef.current);
      if (sw > 0) {
        pointLightRef.current.intensity = sw * 15;
        pointLightRef.current.distance = 1.0 + (1.0 - sw) * 4.0;
      } else {
        pointLightRef.current.intensity = 0;
      }
    }
  });

  return (
    <group ref={modelGroupRef}>
      <primitive object={baseModel} />
      <pointLight ref={pointLightRef} color="#00ff88" intensity={0} decay={2} distance={3} />
    </group>
  );
}

export default function SceneManager({
  activeSection,
  scrollProgress,
  hoveredCard,
  onHeadPositionUpdate,
  sparkActive,
  serviceIndex = 0,
  projectsAct = 0,
  projectsProgress,
  onSceneReady,
  isMobile,
}: {
  activeSection: number;
  scrollProgress: MotionValue<number>;
  hoveredCard: HoveredCardState | null;
  onHeadPositionUpdate: (pos: { x: number; y: number }) => void;
  sparkActive: boolean;
  serviceIndex?: number;
  projectsAct?: number;
  projectsProgress?: MotionValue<number>;
  onSceneReady?: () => void;
  isMobile?: boolean;
}) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <Canvas gl={{ antialias: false, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.8 }}
        dpr={isMobile ? 1 : [1, 1.5]}
        camera={{ fov: 50, near: 0.1, far: 100, position: [0.083, 1.651, 1.225] }}
        style={{ width: "100%", height: "100%", background: "transparent", pointerEvents: "none" }}
        onCreated={(state) => {
          state.gl.domElement.style.pointerEvents = "none";
          const parent = state.gl.domElement.parentElement;
          if (parent) parent.style.pointerEvents = "none";
        }}>
        <CameraRig isMobile={isMobile} />
        <directionalLight color="#00ff88" intensity={1.2} position={[3, 5, 2]} />
        <directionalLight color="#004422" intensity={0.4} position={[-3, 2, -1]} />
        <ambientLight intensity={0.15} />
        <WebGLSparkSystem active={sparkActive && (activeSection === 0 || activeSection === 2)} isMobile={isMobile} />
        <Suspense fallback={null}>
          <ArchitectModel
            hoveredCard={hoveredCard}
            onHeadPositionUpdate={onHeadPositionUpdate}
            activeSection={activeSection}
            scrollProgress={scrollProgress}
            serviceIndex={serviceIndex}
            projectsAct={projectsAct}
            onSceneReady={onSceneReady}
            isMobile={isMobile}
          />
        </Suspense>
        {!isMobile && projectsProgress && (
          <ProjectScenes
            progress={projectsProgress}
            visible={activeSection >= 4}
          />
        )}
      </Canvas>
    </div>
  );
}
