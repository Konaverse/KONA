"use client";

import { Suspense, useRef, useMemo } from "react";
import { createPortal, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import {
  ACT_1_START,
  ACT_2_START,
  ACT_3_START,
  SECTION_FADE_OUT_0,
} from "@/components/sections/projects-timing";
import { VIDEO_PROJECTS, SOCIAL_PROJECTS } from "@/data/projects";

// ── Constants ───────────────────────────────────────────────────────────────────
const DEG2RAD = Math.PI / 180;
const CAM_Z = 8;
const HALF_FOV_RAD = 25 * DEG2RAD; // half of 50deg FOV

// ── Shared helpers ──────────────────────────────────────────────────────────────

function computeActOpacity(
  p: number,
  in0: number,
  in1: number,
  out0: number,
  out1: number
): number {
  if (p < in0 || p > out1) return 0;
  if (p < in1) return (p - in0) / (in1 - in0);
  if (p > out0) return 1 - (p - out0) / (out1 - out0);
  return 1;
}

function interpolateKF(
  inputs: number[],
  outputs: number[],
  p: number
): number {
  if (p <= inputs[0]) return outputs[0];
  if (p >= inputs[inputs.length - 1]) return outputs[outputs.length - 1];
  for (let i = 0; i < inputs.length - 1; i++) {
    if (p <= inputs[i + 1]) {
      const frac = (p - inputs[i]) / (inputs[i + 1] - inputs[i]);
      return outputs[i] + frac * (outputs[i + 1] - outputs[i]);
    }
  }
  return outputs[outputs.length - 1];
}

function getActivePanel(
  inputs: number[],
  panelCount: number,
  p: number
): number {
  for (let i = panelCount - 1; i > 0; i--) {
    const mid = (inputs[i * 2 - 1] + inputs[i * 2]) / 2;
    if (p >= mid) return i;
  }
  return 0;
}

function buildAngleKeyframes(
  start: number,
  count: number,
  holdFirst: number,
  holdNormal: number,
  holdLast: number,
  transDur: number,
  angleStep: number
): { inputs: number[]; outputs: number[] } {
  const inputs: number[] = [];
  const outputs: number[] = [];
  let p = start;
  for (let i = 0; i < count; i++) {
    const hold =
      i === 0 ? holdFirst : i === count - 1 ? holdLast : holdNormal;
    const angle = -i * angleStep;
    inputs.push(p);
    outputs.push(angle);
    p += hold;
    inputs.push(p);
    outputs.push(angle);
    if (i < count - 1) p += transDur;
  }
  return { inputs, outputs };
}

function buildIndexKeyframes(
  start: number,
  count: number,
  holdFirst: number,
  holdNormal: number,
  holdLast: number,
  transDur: number
): { inputs: number[]; outputs: number[] } {
  const inputs: number[] = [];
  const outputs: number[] = [];
  let p = start;
  for (let i = 0; i < count; i++) {
    const hold =
      i === 0 ? holdFirst : i === count - 1 ? holdLast : holdNormal;
    inputs.push(p);
    outputs.push(i);
    p += hold;
    inputs.push(p);
    outputs.push(i);
    if (i < count - 1) p += transDur;
  }
  return { inputs, outputs };
}

// ── Shared geometry ─────────────────────────────────────────────────────────────

function createCurvedPanelGeometry(
  radius: number,
  height: number,
  arcDeg: number,
  segments: number
): THREE.BufferGeometry {
  const halfH = height / 2;
  const halfArc = (arcDeg / 2) * DEG2RAD;
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let row = 0; row <= 1; row++) {
    const y = halfH - row * height;
    for (let col = 0; col <= segments; col++) {
      const u = col / segments;
      const angle = -halfArc + u * 2 * halfArc;
      positions.push(Math.sin(angle) * radius, y, Math.cos(angle) * radius);
      normals.push(Math.sin(angle), 0, Math.cos(angle));
      uvs.push(u, 1 - row);
    }
  }

  for (let col = 0; col < segments; col++) {
    const a = col,
      b = col + 1,
      c = col + (segments + 1),
      d = c + 1;
    indices.push(a, d, b, a, c, d);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  return geo;
}

// ── Shaders (simplified 5-tap blur instead of 49-tap) ───────────────────────────

const panelVert = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const panelFrag = `
  uniform sampler2D uTexture;
  uniform float uBlur;
  uniform float uBrightness;
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    vec4 color;
    if (uBlur > 0.001) {
      color  = texture2D(uTexture, vUv) * 0.4;
      color += texture2D(uTexture, clamp(vUv + vec2( uBlur, 0.0), 0.0, 1.0)) * 0.15;
      color += texture2D(uTexture, clamp(vUv + vec2(-uBlur, 0.0), 0.0, 1.0)) * 0.15;
      color += texture2D(uTexture, clamp(vUv + vec2(0.0,  uBlur), 0.0, 1.0)) * 0.15;
      color += texture2D(uTexture, clamp(vUv + vec2(0.0, -uBlur), 0.0, 1.0)) * 0.15;
    } else {
      color = texture2D(uTexture, vUv);
    }

    vec2 d = abs(vUv - 0.5) * 2.0;
    float r = 0.05;
    vec2 cd = max(d - (1.0 - r), 0.0);
    float mask = 1.0 - smoothstep(r * 0.7, r, length(cd));

    color.rgb *= uBrightness;
    gl_FragColor = vec4(color.rgb, uOpacity * mask);
  }
`;

const cardFrag = `
  uniform sampler2D uTexture;
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    vec4 color = texture2D(uTexture, vUv);

    vec2 d = abs(vUv - 0.5) * 2.0;
    float r = 0.07;
    vec2 cd = max(d - (1.0 - r), 0.0);
    float mask = 1.0 - smoothstep(r * 0.6, r, length(cd));

    float edge = smoothstep(0.0, 0.02, min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y)));
    float border = (1.0 - edge) * 0.3;
    color.rgb += vec3(0.0, border * 0.6, border * 0.3);

    gl_FragColor = vec4(color.rgb, uOpacity * mask);
  }
`;

// ── CylinderPanel (shared by Act 1 & Act 2) ────────────────────────────────────

function CylinderPanel({
  index,
  texture,
  activePanelRef,
  geometry,
  angleStep,
  panelCount,
  actOpacityRef,
}: {
  index: number;
  texture: THREE.Texture;
  activePanelRef: React.RefObject<number>;
  geometry: THREE.BufferGeometry;
  angleStep: number;
  panelCount: number;
  actOpacityRef: React.RefObject<number>;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const blurRef = useRef(0);
  const brightRef = useRef(1);
  const opRef = useRef(1);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uBlur: { value: 0 },
      uBrightness: { value: 1 },
      uOpacity: { value: 1 },
    }),
    [texture]
  );

  useFrame(() => {
    if (!matRef.current) return;
    const activePanel = activePanelRef.current ?? 0;
    const dist = Math.min(
      Math.abs(index - activePanel),
      panelCount - Math.abs(index - activePanel)
    );

    const tBlur = dist === 0 ? 0 : 0.008;
    const tBright = dist === 0 ? 1 : 0.35;
    const tOp = dist === 0 ? 1 : dist === 1 ? 0.55 : 0;

    blurRef.current = THREE.MathUtils.lerp(blurRef.current, tBlur, 0.08);
    brightRef.current = THREE.MathUtils.lerp(
      brightRef.current,
      tBright,
      0.08
    );
    opRef.current = THREE.MathUtils.lerp(opRef.current, tOp, 0.08);

    const finalOp = opRef.current * (actOpacityRef.current ?? 1);
    matRef.current.uniforms.uBlur.value = blurRef.current;
    matRef.current.uniforms.uBrightness.value = brightRef.current;
    matRef.current.uniforms.uOpacity.value = finalOp;
    matRef.current.visible = finalOp > 0.01;
  });

  return (
    <mesh geometry={geometry} rotation={[0, index * angleStep * DEG2RAD, 0]}>
      <shaderMaterial
        ref={matRef}
        transparent
        depthWrite
        side={THREE.FrontSide}
        vertexShader={panelVert}
        fragmentShader={panelFrag}
        uniforms={uniforms}
      />
    </mesh>
  );
}

// ── Texture config helper ───────────────────────────────────────────────────────

function configureTextures(textures: THREE.Texture | THREE.Texture[]) {
  (Array.isArray(textures) ? textures : [textures]).forEach((tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearMipMapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = true;
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACT 1 — Websites Cylinder
// ═══════════════════════════════════════════════════════════════════════════════

const ACT1_IMAGES = [
  "/kona websites screenshots/glmetalworks.png",
  "/kona websites screenshots/lossantosbarbers.png",
  "/kona websites screenshots/velricon.png",
  "/kona websites screenshots/apt_macbook.png",
  "/kona websites screenshots/tdk_macbook.png",
  "/kona websites screenshots/sivory_macbook.png",
];
const ACT1_PANEL_COUNT = 6;
const ACT1_ANGLE_STEP = 60;
const ACT1_KF = buildAngleKeyframes(
  ACT_1_START, 6, 0.075, 0.035, 0.040, 0.012, 60
);

function Act1CylinderScene({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const actOpacityRef = useRef(0);
  const activePanelRef = useRef(0);

  const textures = useTexture(ACT1_IMAGES);
  useMemo(() => configureTextures(textures), [textures]);

  const geometry = useMemo(
    () => createCurvedPanelGeometry(3.5, 2.2, 60, 32),
    []
  );

  useFrame(() => {
    if (!groupRef.current) return;
    const p = progress.get();
    actOpacityRef.current = computeActOpacity(
      p,
      ACT_1_START,
      ACT_1_START + 0.04,
      ACT_2_START - 0.03,
      ACT_2_START
    );
    groupRef.current.visible = actOpacityRef.current > 0.01;
    if (!groupRef.current.visible) return;

    activePanelRef.current = getActivePanel(
      ACT1_KF.inputs,
      ACT1_PANEL_COUNT,
      p
    );
    groupRef.current.rotation.y =
      interpolateKF(ACT1_KF.inputs, ACT1_KF.outputs, p) * DEG2RAD;
  });

  const texArr = Array.isArray(textures) ? textures : [textures];

  return (
    <group ref={groupRef}>
      {texArr.map((tex, i) => (
        <CylinderPanel
          key={i}
          index={i}
          texture={tex}
          activePanelRef={activePanelRef}
          geometry={geometry}
          angleStep={ACT1_ANGLE_STEP}
          panelCount={ACT1_PANEL_COUNT}
          actOpacityRef={actOpacityRef}
        />
      ))}
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACT 2 — Videos Cylinder
// ═══════════════════════════════════════════════════════════════════════════════

const ACT2_IMAGES = VIDEO_PROJECTS.map((v) => v.thumbnail);
const ACT2_PANEL_COUNT = 3;
const ACT2_ANGLE_STEP = 120;
const ACT2_KF = buildAngleKeyframes(
  ACT_2_START, 3, 0.11, 0.07, 0.09, 0.015, 120
);

function Act2CylinderScene({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const actOpacityRef = useRef(0);
  const activePanelRef = useRef(0);

  const textures = useTexture(ACT2_IMAGES);
  useMemo(() => configureTextures(textures), [textures]);

  const geometry = useMemo(
    () => createCurvedPanelGeometry(3.5, 2.2, 120, 32),
    []
  );

  useFrame(() => {
    if (!groupRef.current) return;
    const p = progress.get();
    actOpacityRef.current = computeActOpacity(
      p,
      ACT_2_START,
      ACT_2_START + 0.04,
      ACT_3_START - 0.04,
      ACT_3_START
    );
    groupRef.current.visible = actOpacityRef.current > 0.01;
    if (!groupRef.current.visible) return;

    activePanelRef.current = getActivePanel(
      ACT2_KF.inputs,
      ACT2_PANEL_COUNT,
      p
    );
    groupRef.current.rotation.y =
      interpolateKF(ACT2_KF.inputs, ACT2_KF.outputs, p) * DEG2RAD;
  });

  const texArr = Array.isArray(textures) ? textures : [textures];

  return (
    <group ref={groupRef}>
      {texArr.map((tex, i) => (
        <CylinderPanel
          key={i}
          index={i}
          texture={tex}
          activePanelRef={activePanelRef}
          geometry={geometry}
          angleStep={ACT2_ANGLE_STEP}
          panelCount={ACT2_PANEL_COUNT}
          actOpacityRef={actOpacityRef}
        />
      ))}
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACT 3 — Social Fan Cards
// ═══════════════════════════════════════════════════════════════════════════════

const ACT3_ALL_IMAGES = SOCIAL_PROJECTS.flatMap((s) => s.feedImages);
const ACT3_PROJECT_COUNT = SOCIAL_PROJECTS.length;
const ACT3_KF = buildIndexKeyframes(
  ACT_3_START, ACT3_PROJECT_COUNT, 0.11, 0.07, 0.09, 0.015
);
const ACT3_CARD_SLOTS = [
  // Left pair
  { x: -3.2, y:  0.45, z: -0.3, rotY: 18, rotZ: 3 },   // left-up
  { x: -2.0, y: -0.35, z:  0.1, rotY: 10, rotZ: 1.5 },  // left-down
  // Right pair
  { x:  2.0, y: -0.35, z:  0.1, rotY: -10, rotZ: -1.5 }, // right-down
  { x:  3.2, y:  0.45, z: -0.3, rotY: -18, rotZ: -3 },   // right-up
];
const ACT3_CARD_WIDTH = 1.5;
const ACT3_CARD_HEIGHT = 1.9;

function FanCardAnimated({
  texture,
  slot,
  projIdx,
  opacitiesRef,
  actOpacityRef,
}: {
  texture: THREE.Texture;
  slot: (typeof ACT3_CARD_SLOTS)[number];
  projIdx: number;
  opacitiesRef: React.RefObject<number[]>;
  actOpacityRef: React.RefObject<number>;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const currentOp = useRef(projIdx === 0 ? 1 : 0);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uOpacity: { value: projIdx === 0 ? 1 : 0 },
    }),
    [texture, projIdx]
  );

  useFrame(() => {
    if (!matRef.current) return;
    const targetOp = opacitiesRef.current?.[projIdx] ?? 0;
    currentOp.current = THREE.MathUtils.lerp(
      currentOp.current,
      targetOp,
      0.1
    );
    const finalOp = currentOp.current * (actOpacityRef.current ?? 1);
    matRef.current.uniforms.uOpacity.value = finalOp;
    matRef.current.visible = finalOp > 0.01;
  });

  return (
    <mesh
      position={[slot.x, slot.y, slot.z]}
      rotation={[0, slot.rotY * DEG2RAD, slot.rotZ * DEG2RAD]}
    >
      <planeGeometry args={[ACT3_CARD_WIDTH, ACT3_CARD_HEIGHT]} />
      <shaderMaterial
        ref={matRef}
        transparent
        depthWrite
        side={THREE.FrontSide}
        vertexShader={panelVert}
        fragmentShader={cardFrag}
        uniforms={uniforms}
      />
    </mesh>
  );
}

function Act3FanScene({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const actOpacityRef = useRef(0);
  const opacitiesRef = useRef<number[]>(
    SOCIAL_PROJECTS.map((_, i) => (i === 0 ? 1 : 0))
  );

  const textures = useTexture(ACT3_ALL_IMAGES);
  useMemo(() => configureTextures(textures), [textures]);

  const texArr = Array.isArray(textures) ? textures : [textures];
  const projectTextures = useMemo(() => {
    const groups: THREE.Texture[][] = [];
    for (let i = 0; i < ACT3_PROJECT_COUNT; i++) {
      groups.push(texArr.slice(i * 4, i * 4 + 4));
    }
    return groups;
  }, [texArr]);

  useFrame(() => {
    if (!groupRef.current) return;
    const p = progress.get();
    actOpacityRef.current = computeActOpacity(
      p,
      ACT_3_START,
      ACT_3_START + 0.04,
      SECTION_FADE_OUT_0 - 0.03,
      SECTION_FADE_OUT_0
    );
    groupRef.current.visible = actOpacityRef.current > 0.01;
    if (!groupRef.current.visible) return;

    const val = interpolateKF(ACT3_KF.inputs, ACT3_KF.outputs, p);
    const currentIdx = Math.floor(val);
    const frac = val - currentIdx;

    for (let i = 0; i < ACT3_PROJECT_COUNT; i++) {
      let target = 0;
      if (Number.isInteger(val)) {
        target = i === val ? 1 : 0;
      } else if (i === currentIdx && frac < 0.5) target = 1;
      else if (i === currentIdx + 1 && frac >= 0.5) target = 1;
      else if (i === currentIdx && frac >= 0.5)
        target = 1 - (frac - 0.5) * 2;
      else if (i === currentIdx + 1 && frac < 0.5) target = frac * 2;

      opacitiesRef.current[i] = THREE.MathUtils.lerp(
        opacitiesRef.current[i],
        target,
        0.12
      );
    }
  });

  return (
    <group ref={groupRef}>
      {projectTextures.map((texGroup, projIdx) =>
        texGroup.map((tex, cardIdx) => (
          <FanCardAnimated
            key={`${projIdx}-${cardIdx}`}
            texture={tex}
            slot={ACT3_CARD_SLOTS[cardIdx]}
            projIdx={projIdx}
            opacitiesRef={opacitiesRef}
            actOpacityRef={actOpacityRef}
          />
        ))
      )}
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main — portal scene + renderer
// ═══════════════════════════════════════════════════════════════════════════════

interface ProjectScenesProps {
  progress: MotionValue<number>;
  visible: boolean;
}

export default function ProjectScenes({
  progress,
  visible,
}: ProjectScenesProps) {
  const portalScene = useMemo(() => new THREE.Scene(), []);
  const portalCam = useMemo(() => {
    const cam = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    cam.position.set(0, 0.2, CAM_Z);
    cam.lookAt(0, 0, 0);
    return cam;
  }, []);

  const act1GroupRef = useRef<THREE.Group>(null);
  const act2GroupRef = useRef<THREE.Group>(null);
  const act3GroupRef = useRef<THREE.Group>(null);

  // Position groups + update camera aspect (cheap, runs every frame when visible)
  useFrame(({ size }) => {
    if (!visible) return;
    const aspect = size.width / size.height;
    if (Math.abs(portalCam.aspect - aspect) > 0.001) {
      portalCam.aspect = aspect;
      portalCam.updateProjectionMatrix();
    }
    // Act 1 center: left 4vw + 29% = 33% from left -> NDC -0.34
    // Act 2 center: right 4vw + 29% = 67% from left -> NDC +0.34
    const halfW = CAM_Z * Math.tan(HALF_FOV_RAD) * aspect;
    if (act1GroupRef.current) act1GroupRef.current.position.x = -0.34 * halfW;
    if (act2GroupRef.current) act2GroupRef.current.position.x = 0.34 * halfW;
  });

  // Priority ≥ 1 disables R3F's automatic render, so we must render everything.
  // 1. Render main scene (architect, lights, sparks) with normal autoClear
  // 2. Render portal scene (project panels) on top, clearing only depth
  useFrame(({ gl, scene, camera }) => {
    // Always render the main scene first
    gl.render(scene, camera);

    if (!visible) return;

    // Then overlay the portal scene
    const prevAutoClear = gl.autoClear;
    const prevToneMapping = gl.toneMapping;
    gl.autoClear = false;
    gl.toneMapping = THREE.NoToneMapping;
    gl.clearDepth();
    gl.render(portalScene, portalCam);
    gl.toneMapping = prevToneMapping;
    gl.autoClear = prevAutoClear;
  }, 1);

  return createPortal(
    <Suspense fallback={null}>
      <group ref={act1GroupRef}>
        <Act1CylinderScene progress={progress} />
      </group>
      <group ref={act2GroupRef}>
        <Act2CylinderScene progress={progress} />
      </group>
      {/* Act 3 at z=1.5 to compensate for original camera being at z=6.5 vs our z=8 */}
      <group ref={act3GroupRef} position={[0, 0, 1.5]}>
        <Act3FanScene progress={progress} />
      </group>
    </Suspense>,
    portalScene
  );
}
