"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

const BASE_MODEL = "/models/architect/Walking.fbx";
const IDLE_ANIM = "/models/architect/Breathing Idle.fbx";
const THOUGHTFUL_NOD_ANIM = "/models/architect/Thoughtful Head Nod.fbx";

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
    float strobe = step(0.15, random(vec2(uTime * 45.0, vUv.x * 5.0)));
    float dist = abs(vUv.y - 0.5) * 2.0;
    float glow = exp(-dist * 3.5);
    float core = exp(-dist * 18.0);
    vec3 finalColor = mix(uColor, vec3(1.0), core * 0.8);
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

    if (active && Math.random() < 0.18 && arcsRef.current.length < 12) {
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
  activeSection
}: {
  hoveredCard: HoveredCardState | null;
  onHeadPositionUpdate: (pos: { x: number; y: number }) => void;
  activeSection: number;
}) {
  const baseModel = useLoader(FBXLoader, BASE_MODEL);
  const idleData = useLoader(FBXLoader, IDLE_ANIM);
  const nodData = useLoader(FBXLoader, THOUGHTFUL_NOD_ANIM);
  
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

  useEffect(() => {
    if (!baseModel || !idleData || !nodData) return;
    
    const mixer = new THREE.AnimationMixer(baseModel);
    mixerRef.current = mixer;

    const idle = mixer.clipAction(idleData.animations[0]);
    const nod = mixer.clipAction(nodData.animations[0]);

    actionsRef.current = { idle, nod };

    idle.play();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", () => { shockwaveRef.current = 1.0; });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [baseModel, idleData, nodData]);

  useEffect(() => {
    const { idle, nod } = actionsRef.current;
    if (!idle || !nod) return;

    if (activeSection > 0) {
      idle.fadeOut(0.5);
      nod.reset().fadeIn(0.5).play();
    } else {
      nod.fadeOut(0.5);
      idle.reset().fadeIn(0.5).play();
    }
  }, [activeSection]);

  const tempVec = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    if (!mixerRef.current) return;
    mixerRef.current.update(delta);

    if (modelGroupRef.current) {
      const isAltSection = activeSection > 0;
      const targetZ = isAltSection ? -0.3 : 0; // Closer to camera
      const targetX = isAltSection ? -0.95 : 0; // Further left
      const targetY = 0;
      const targetRotY = isAltSection ? 0.6 : 0; // Rotate body to face right
      
      const lerpFactor = 1 - Math.pow(0.05, delta);
      modelGroupRef.current.position.z = THREE.MathUtils.lerp(modelGroupRef.current.position.z, targetZ, lerpFactor);
      modelGroupRef.current.position.x = THREE.MathUtils.lerp(modelGroupRef.current.position.x, targetX, lerpFactor);
      modelGroupRef.current.position.y = THREE.MathUtils.lerp(modelGroupRef.current.position.y, targetY, lerpFactor);
      modelGroupRef.current.rotation.y = THREE.MathUtils.lerp(modelGroupRef.current.rotation.y, targetRotY, lerpFactor);
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

      const isAlt = activeSection > 0;
      const targetWeight = isAlt ? 0.15 : 1.0;
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

      // Add a bias to look right when in Section 2
      const lookBias = isAlt ? 0.4 : 0;
      const tRY = Math.max(-1.57, Math.min(1.57, tX * 1.2 + lookBias)) * trackingWeightRef.current;
      const tRX = Math.max(-1.05, Math.min(1.05, -tY * 0.8)) * trackingWeightRef.current;

      const lerpS = hoveredCard ? 0.2 : 0.1;
      head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, tRY, lerpS);
      head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, tRX, lerpS);
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
  hoveredCard,
  onHeadPositionUpdate,
  sparkActive
}: {
  activeSection: number;
  hoveredCard: HoveredCardState | null;
  onHeadPositionUpdate: (pos: { x: number; y: number }) => void;
  sparkActive: boolean;
}) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <Canvas gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.8 }}
              camera={{ fov: 50, near: 0.1, far: 100, position: [0.083, 1.651, 1.225] }} shadows
              style={{ width: "100%", height: "100%", background: "transparent" }}>
        <CameraRig />
        <directionalLight color="#00ff88" intensity={1.2} position={[3, 5, 2]} castShadow />
        <directionalLight color="#004422" intensity={0.4} position={[-3, 2, -1]} />
        <ambientLight intensity={0.15} />
        <WebGLSparkSystem active={sparkActive && activeSection === 0} />
        <ArchitectModel hoveredCard={hoveredCard} onHeadPositionUpdate={onHeadPositionUpdate} activeSection={activeSection} />
      </Canvas>
    </div>
  );
}
