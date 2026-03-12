"use client";

import {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useCallback,
} from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Base model (skinned) + animation-only files
const BASE_MODEL = "/models/architect/Walking.fbx";
const ANIM_FILES = [
  "Breathing Idle",
  "Hard Head Nod",
  "Look Around",
  "Looking Behind",
  "Running",
  "Sit To Stand",
  "Sitting",
  "Sitting Idle",
  "Stand To Sit",
  "Standing Up",
  "Stop Walking",
  "Walking Left Turn",
];

// Entrance timing
const PHASE1_END = 1.0;   // Darkness ends
const PHASE2_END = 2.5;   // Crack fully formed, doors start opening
const DOORS_OPEN = 5.0;   // Doors fully off-screen
const PHASE3_END = 5.5;   // Model walk complete
const PHASE4_END = 7.0;   // Settle complete

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export interface ArchitectSceneRef {
  playAnimation: (name: string, fadeDuration?: number) => void;
  getAnimationNames: () => string[];
  camera: THREE.PerspectiveCamera | null;
  scene: THREE.Scene | null;
  mixer: THREE.AnimationMixer | null;
}

interface ArchitectSceneProps {
  onEntranceComplete?: () => void;
  mouseRef?: React.RefObject<{ x: number; y: number } | null>;
}

const ArchitectScene = forwardRef<ArchitectSceneRef, ArchitectSceneProps>(
  ({ onEntranceComplete, mouseRef: mouseRefProp }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const leftDoorRef = useRef<HTMLDivElement>(null);
    const rightDoorRef = useRef<HTMLDivElement>(null);
    const leftGlowRef = useRef<HTMLDivElement>(null);
    const rightGlowRef = useRef<HTMLDivElement>(null);
    const mixerRef = useRef<THREE.AnimationMixer | null>(null);
    const actionsRef = useRef<Record<string, THREE.AnimationAction>>({});
    const currentActionRef = useRef<THREE.AnimationAction | null>(null);
    const frameIdRef = useRef<number>(0);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const onEntranceCompleteRef = useRef(onEntranceComplete);
    onEntranceCompleteRef.current = onEntranceComplete;

    const [loading, setLoading] = useState(true);
    const [loadProgress, setLoadProgress] = useState("");
    const [doorsVisible, setDoorsVisible] = useState(true);

    const playAnimation = useCallback(
      (name: string, fadeDuration = 0.4) => {
        const actions = actionsRef.current;
        const newAction = actions[name];
        if (!newAction) {
          console.warn(`[ArchitectScene] Animation "${name}" not found`);
          return;
        }

        const current = currentActionRef.current;

        // If already playing this animation, skip
        if (current === newAction && newAction.isRunning()) return;

        // Crossfade: fade out all running actions
        Object.values(actions).forEach((action) => {
          if (action !== newAction && action.isRunning()) {
            action.fadeOut(fadeDuration);
          }
        });

        // Reset playhead without reset() — .reset() snaps weight to 1 instantly
        // causing a visible position pop. Setting .time = 0 moves the playhead
        // without affecting weight, so fadeIn handles the blend smoothly.
        newAction.time = 0;
        newAction
          .setEffectiveTimeScale(1)
          .setEffectiveWeight(1)
          .fadeIn(fadeDuration)
          .play();
        currentActionRef.current = newAction;
      },
      []
    );

    const getAnimationNames = useCallback(() => {
      return Object.keys(actionsRef.current);
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        playAnimation,
        getAnimationNames,
        get camera() { return cameraRef.current; },
        get scene() { return sceneRef.current; },
        get mixer() { return mixerRef.current; },
      }),
      [playAnimation, getAnimationNames]
    );

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      let disposed = false;

      // --- Renderer ---
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.8;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);

      // --- Scene (starts black, no fog) ---
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);
      scene.fog = new THREE.FogExp2(0x000000, 0);
      sceneRef.current = scene;

      // --- Camera ---
      const camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        100
      );
      cameraRef.current = camera;
      const baseCamPos = new THREE.Vector3(0.8, 1.5, 2);
      camera.position.copy(baseCamPos);
      camera.lookAt(-0.8, 2, 0);

      // --- Orbit Controls (disabled during entrance) ---
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(-0.8, 2.5, -0.5);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.enabled = false;
      controls.update();

      // --- Lighting (all start at 0 intensity) ---
      const keyLight = new THREE.DirectionalLight(0x00ff88, 0);
      keyLight.position.set(3, 5, 2);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(2048, 2048);
      keyLight.shadow.camera.near = 0.1;
      keyLight.shadow.camera.far = 20;
      keyLight.shadow.camera.left = -5;
      keyLight.shadow.camera.right = 5;
      keyLight.shadow.camera.top = 5;
      keyLight.shadow.camera.bottom = -5;
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0x004422, 0);
      fillLight.position.set(-3, 2, -1);
      scene.add(fillLight);

      const rimLight = new THREE.DirectionalLight(0x00ff88, 0);
      rimLight.position.set(-1, 3, -4);
      scene.add(rimLight);

      const ambientLight = new THREE.AmbientLight(0x000000, 0);
      scene.add(ambientLight);

      const energyLight = new THREE.PointLight(0x00ff88, 0, 8);
      energyLight.position.set(0, 1.2, 0.5);
      scene.add(energyLight);

      const lightTargets = {
        key: 1.2,
        fill: 0.4,
        rim: 0.6,
        ambient: 0.3,
        energy: 0.8,
      };

      // --- Ground ---
      const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(40, 40),
        new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.95 })
      );
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = 0;
      ground.receiveShadow = true;
      scene.add(ground);

      // --- Particles (start invisible) ---
      // Wide volume covering entire camera frustum, staggered y for constant flow
      const particleCount = 1500;
      const particlePositions = new Float32Array(particleCount * 3);
      const PARTICLE_SPREAD_X = 16;  // wide enough to fill viewport edge-to-edge
      const PARTICLE_CENTER_X = -0.8;
      const PARTICLE_SPREAD_Z = 10;
      const PARTICLE_CEILING = 6;
      for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3] = PARTICLE_CENTER_X + (Math.random() - 0.5) * PARTICLE_SPREAD_X;
        particlePositions[i * 3 + 1] = Math.random() * PARTICLE_CEILING;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * PARTICLE_SPREAD_Z;
      }
      const particleGeom = new THREE.BufferGeometry();
      particleGeom.setAttribute(
        "position",
        new THREE.BufferAttribute(particlePositions, 3)
      );
      const particleMat = new THREE.PointsMaterial({
        color: 0x00ff88,
        size: 0.04,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const particles = new THREE.Points(particleGeom, particleMat);
      scene.add(particles);

      // --- Clock ---
      const clock = new THREE.Clock();

      // --- Entrance state ---
      let entranceElapsed = 0;
      let entranceStarted = false;
      let entranceComplete = false;
      let entranceCalledBack = false;
      let modelRef: THREE.Group | null = null;
      let walkingStarted = false;
      let settleStarted = false;
      let doorsHidden = false;

      const bgBlack = new THREE.Color(0x000000);
      const bgTarget = new THREE.Color(0x000000);
      const bgCurrent = new THREE.Color(0x000000);

      // --- Cursor reactivity (post-entrance) ---
      const _mouseNDC = new THREE.Vector2();
      const _raycaster = new THREE.Raycaster();
      const _intersectPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      const _mouseWorld = new THREE.Vector3();
      const _architectPos = new THREE.Vector3();
      let smoothEnergyBoost = 0;
      let smoothEmissive = 0.01;
      const modelMats: (THREE.MeshStandardMaterial | THREE.MeshPhongMaterial)[] = [];

      // --- Render Loop ---
      const animate = () => {
        frameIdRef.current = requestAnimationFrame(animate);
        const delta = clock.getDelta();

        if (mixerRef.current) mixerRef.current.update(delta);

        // ==========================================
        // ENTRANCE CHOREOGRAPHY
        // ==========================================
        if (entranceStarted && !entranceComplete) {
          entranceElapsed += delta;

          // --- Phase 1: Darkness (0 - 1s) ---
          // Scene stays black, nothing visible.

          // --- Phase 2: The Crack (1s - 2.5s) ---
          // The "crack" is the combined inner glow edges of the two door panels.
          // They grow in height and intensity, appearing as a single line of light.
          if (entranceElapsed >= PHASE1_END && entranceElapsed < PHASE2_END) {
            const phaseT =
              (entranceElapsed - PHASE1_END) / (PHASE2_END - PHASE1_END);
            const leftGlow = leftGlowRef.current;
            const rightGlow = rightGlowRef.current;

            // Grow height from 0 to 100%, glow intensifies
            const heightPct = Math.min(phaseT * 2, 1) * 100;
            const glowWidth = 1 + phaseT * 11; // 1px → 12px
            const glowSpread = 10 + phaseT * 40;
            const glowAlpha = 0.3 + phaseT * 0.7;

            if (leftGlow) {
              leftGlow.style.height = `${heightPct}%`;
              leftGlow.style.width = `${glowWidth}px`;
              leftGlow.style.opacity = "1";
              leftGlow.style.boxShadow = `0 0 ${glowSpread}px rgba(0, 255, 136, ${glowAlpha}), 0 0 ${glowSpread * 2.5}px rgba(0, 255, 136, ${glowAlpha * 0.3})`;
            }
            if (rightGlow) {
              rightGlow.style.height = `${heightPct}%`;
              rightGlow.style.width = `${glowWidth}px`;
              rightGlow.style.opacity = "1";
              rightGlow.style.boxShadow = `0 0 ${glowSpread}px rgba(0, 255, 136, ${glowAlpha}), 0 0 ${glowSpread * 2.5}px rgba(0, 255, 136, ${glowAlpha * 0.3})`;
            }

            // Camera jitter (first 0.5s of this phase)
            if (phaseT < 0.33) {
              camera.position.set(
                baseCamPos.x + (Math.random() - 0.5) * 0.02,
                baseCamPos.y + (Math.random() - 0.5) * 0.02,
                baseCamPos.z + (Math.random() - 0.5) * 0.02
              );
            } else {
              camera.position.copy(baseCamPos);
            }
          }

          // --- Phase 3: The Emergence (2.5s - 5.5s) ---
          if (entranceElapsed >= PHASE2_END) {
            const leftDoor = leftDoorRef.current;
            const rightDoor = rightDoorRef.current;

            // Environment fade-in over first 1.5s of this phase
            const envRaw =
              (entranceElapsed - PHASE2_END) / (PHASE3_END - PHASE2_END);
            const envT = Math.min(envRaw / 0.5, 1);

            bgCurrent.lerpColors(bgBlack, bgTarget, envT);
            scene.background = bgCurrent;
            (scene.fog as THREE.FogExp2).density = 0.15 * envT;

            keyLight.intensity = lightTargets.key * envT;
            fillLight.intensity = lightTargets.fill * envT;
            rimLight.intensity = lightTargets.rim * envT;
            ambientLight.intensity = lightTargets.ambient * envT;
            particleMat.opacity = 0.6 * envT;

            // Door opening: panels slide apart, inner glow fades
            if (!doorsHidden) {
              if (entranceElapsed < DOORS_OPEN) {
                const doorT = easeInOutCubic(
                  (entranceElapsed - PHASE2_END) / (DOORS_OPEN - PHASE2_END)
                );
                const glowIntensity = 1 - doorT;
                const leftGlow = leftGlowRef.current;
                const rightGlow = rightGlowRef.current;

                // Slide doors apart using translateX (GPU-composited, no layout reflow)
                if (leftDoor) {
                  leftDoor.style.transform = `translateX(-${doorT * 100}%)`;
                }
                if (rightDoor) {
                  rightDoor.style.transform = `translateX(${doorT * 100}%)`;
                }

                // Fade the inner glow edges as doors separate
                const fadedSpread = 50 * glowIntensity;
                const fadedAlpha = glowIntensity;
                if (leftGlow) {
                  leftGlow.style.opacity = `${glowIntensity}`;
                  leftGlow.style.boxShadow = `0 0 ${fadedSpread}px rgba(0, 255, 136, ${fadedAlpha}), 0 0 ${fadedSpread * 2.5}px rgba(0, 255, 136, ${fadedAlpha * 0.3})`;
                }
                if (rightGlow) {
                  rightGlow.style.opacity = `${glowIntensity}`;
                  rightGlow.style.boxShadow = `0 0 ${fadedSpread}px rgba(0, 255, 136, ${fadedAlpha}), 0 0 ${fadedSpread * 2.5}px rgba(0, 255, 136, ${fadedAlpha * 0.3})`;
                }
              } else {
                // Remove will-change before unmounting to free compositor layers
                if (leftDoorRef.current) leftDoorRef.current.style.willChange = "auto";
                if (rightDoorRef.current) rightDoorRef.current.style.willChange = "auto";
                doorsHidden = true;
                setDoorsVisible(false);
              }
            }

            // Model walks forward
            if (modelRef && !walkingStarted) {
              walkingStarted = true;
              modelRef.visible = true;
              modelRef.position.z = -3;
              modelRef.position.x = 0;
              const walkAction = actionsRef.current["Walking"];
              if (walkAction) {
                walkAction.reset().play();
                currentActionRef.current = walkAction;
              }
            }

            if (modelRef && walkingStarted && entranceElapsed < PHASE3_END) {
              const walkProgress = Math.min(
                (entranceElapsed - PHASE2_END) / (PHASE3_END - PHASE2_END),
                1
              );
              const walkT = easeOutCubic(walkProgress);
              modelRef.position.z = THREE.MathUtils.lerp(-3, 0, walkT);
              modelRef.position.x = THREE.MathUtils.lerp(0, 0.5, walkT);
            }
          }

          // --- Phase 4: The Settle (5.5s - 7s) ---
          if (entranceElapsed >= PHASE3_END) {
            if (!settleStarted) {
              settleStarted = true;

              if (modelRef) {
                modelRef.position.z = 0;
                modelRef.position.x = 0.5;
              }

              // Ensure environment is fully on
              scene.background = bgTarget.clone();
              (scene.fog as THREE.FogExp2).density = 0.15;
              keyLight.intensity = lightTargets.key;
              fillLight.intensity = lightTargets.fill;
              rimLight.intensity = lightTargets.rim;
              ambientLight.intensity = lightTargets.ambient;
              particleMat.opacity = 0.6;

              // Crossfade Walking → Breathing_Idle
              const idleAction = actionsRef.current["Breathing_Idle"];
              if (idleAction) {
                const walkAction = actionsRef.current["Walking"];
                if (walkAction && walkAction.isRunning()) {
                  walkAction.fadeOut(0.8);
                }
                idleAction.reset().fadeIn(0.8).play();
                currentActionRef.current = idleAction;
              }
            }
          }

          // --- Entrance finished ---
          if (entranceElapsed >= PHASE4_END) {
            entranceComplete = true;
            controls.enabled = false;

            if (!entranceCalledBack) {
              entranceCalledBack = true;
              onEntranceCompleteRef.current?.();
            }
          }
        }

        // ==========================================
        // CONTINUOUS UPDATES
        // ==========================================

        const elapsed = clock.elapsedTime;

        // --- Cursor reactivity (only post-entrance) ---
        const mouse = entranceComplete ? mouseRefProp?.current : null;
        let hasWorldPos = false;

        if (mouse) {
          // Project architect chest to screen space for proximity
          _architectPos.set(
            modelRef ? modelRef.position.x : 0.5,
            1.2,
            modelRef ? modelRef.position.z : 0
          );
          _architectPos.project(camera);

          const dx = mouse.x - _architectPos.x;
          const dy = mouse.y - _architectPos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const proximity = Math.max(0, 1 - dist / 1.5);

          // Smooth cursor-reactive energy boost
          const targetBoost = proximity * 0.5;
          smoothEnergyBoost += (targetBoost - smoothEnergyBoost) * Math.min(delta * 3, 1);

          // Smooth emissive modulation
          const targetEmissive = 0.01 + proximity * 0.035;
          smoothEmissive += (targetEmissive - smoothEmissive) * Math.min(delta * 3, 1);
          for (let m = 0; m < modelMats.length; m++) {
            modelMats[m].emissiveIntensity = smoothEmissive;
          }

          // Mouse → world position for particle nudge
          _mouseNDC.set(mouse.x, mouse.y);
          _raycaster.setFromCamera(_mouseNDC, camera);
          hasWorldPos = _raycaster.ray.intersectPlane(_intersectPlane, _mouseWorld) !== null;
        }

        // Energy light: base pulse + cursor boost
        if (entranceComplete) {
          const basePulse = 0.6 + Math.sin(elapsed * 2) * 0.25;
          energyLight.intensity = basePulse + smoothEnergyBoost;
        }

        // Ambient fog breathing — larger swing so distant particles visibly fade in/out
        if (entranceComplete) {
          (scene.fog as THREE.FogExp2).density = 0.15 + Math.sin(elapsed * 0.7) * 0.035;
        }

        // Particle drift + cursor nudge
        const pos = particles.geometry.attributes
          .position as THREE.BufferAttribute;
        const arr = pos.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          // Upward drift — randomize x/z on reset for constant even coverage
          arr[i * 3 + 1] += delta * 0.3;
          if (arr[i * 3 + 1] > PARTICLE_CEILING) {
            arr[i * 3] = PARTICLE_CENTER_X + (Math.random() - 0.5) * PARTICLE_SPREAD_X;
            arr[i * 3 + 1] = 0;
            arr[i * 3 + 2] = (Math.random() - 0.5) * PARTICLE_SPREAD_Z;
          }

          // Cursor nudge — XY-only distance so z-spread particles still react
          if (hasWorldPos) {
            const ddx = arr[i * 3] - _mouseWorld.x;
            const ddy = arr[i * 3 + 1] - _mouseWorld.y;
            const d = Math.sqrt(ddx * ddx + ddy * ddy);
            if (d > 0.01 && d < 3) {
              const force = (1 - d / 3) * 1.5 * delta;
              arr[i * 3] += (ddx / d) * force;
              arr[i * 3 + 1] += (ddy / d) * force;
            }
          }
        }
        pos.needsUpdate = true;

        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      // --- Resize ---
      const onResize = () => {
        if (!container) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);

      // --- Load Model & Animations ---
      const loader = new FBXLoader();

      const loadFBX = (url: string): Promise<THREE.Group> =>
        new Promise((resolve, reject) => {
          loader.load(url, resolve, undefined, reject);
        });

      (async () => {
        try {
          setLoadProgress("Loading base model...");
          const baseModel = await loadFBX(BASE_MODEL);
          if (disposed) return;

          // Scale Mixamo model
          const box = new THREE.Box3().setFromObject(baseModel);
          const modelHeight = box.max.y - box.min.y;
          if (modelHeight > 5) {
            const scale = 1.8 / modelHeight;
            baseModel.scale.setScalar(scale);
            box.setFromObject(baseModel);
          }

          baseModel.position.y = -box.min.y;
          baseModel.visible = false;
          modelRef = baseModel;

          // Enable shadows & enhance materials
          baseModel.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.castShadow = true;
              mesh.receiveShadow = true;
              const mat = mesh.material;
              const materials = Array.isArray(mat) ? mat : [mat];
              materials.forEach((m) => {
                if ((m as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
                  const stdMat = m as THREE.MeshStandardMaterial;
                  stdMat.emissive = new THREE.Color(0x00ff88);
                  stdMat.emissiveIntensity = 0.01;
                  modelMats.push(stdMat);
                } else if ((m as THREE.MeshPhongMaterial).isMeshPhongMaterial) {
                  const phongMat = m as THREE.MeshPhongMaterial;
                  phongMat.emissive = new THREE.Color(0x00ff88);
                  phongMat.emissiveIntensity = 0.01;
                  modelMats.push(phongMat);
                }
                m.needsUpdate = true;
              });
            }
          });

          scene.add(baseModel);

          const mixer = new THREE.AnimationMixer(baseModel);
          mixerRef.current = mixer;

          const actions: Record<string, THREE.AnimationAction> = {};

          if (baseModel.animations.length > 0) {
            const walkClip = baseModel.animations[0];
            walkClip.name = "Walking";
            actions["Walking"] = mixer.clipAction(walkClip);
          }

          for (let i = 0; i < ANIM_FILES.length; i++) {
            const animName = ANIM_FILES[i];
            setLoadProgress(
              `Loading ${animName}... (${i + 1}/${ANIM_FILES.length})`
            );

            try {
              const animFbx = await loadFBX(
                `/models/architect/${animName}.fbx`
              );
              if (disposed) return;

              if (animFbx.animations.length > 0) {
                const clip = animFbx.animations[0];
                const key = animName.replace(/ /g, "_");
                clip.name = key;
                actions[key] = mixer.clipAction(clip);
              }
            } catch (err) {
              console.warn(
                `[ArchitectScene] Failed to load animation: ${animName}`,
                err
              );
            }
          }

          if (disposed) return;

          actionsRef.current = actions;
          console.log(
            "[ArchitectScene] All animations loaded:",
            Object.keys(actions)
          );

          // Done loading → start entrance
          setLoading(false);
          entranceStarted = true;
        } catch (err) {
          console.error("[ArchitectScene] Failed to load model:", err);
          setLoadProgress("Failed to load model");
        }
      })();

      // --- Cleanup ---
      return () => {
        disposed = true;
        window.removeEventListener("resize", onResize);
        cancelAnimationFrame(frameIdRef.current);
        controls.dispose();

        if (mixerRef.current) {
          mixerRef.current.stopAllAction();
          mixerRef.current = null;
        }
        sceneRef.current = null;
        cameraRef.current = null;
        actionsRef.current = {};
        currentActionRef.current = null;

        scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.geometry.dispose();
            const mats = Array.isArray(mesh.material)
              ? mesh.material
              : [mesh.material];
            mats.forEach((m) => m.dispose());
          }
        });

        renderer.dispose();
        if (container && renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
      };
    }, []);

    return (
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        {/* Loading overlay */}
        {loading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "#000000",
              zIndex: 20,
              fontFamily: "monospace",
              color: "#00ff88",
            }}
          >
            <div style={{ fontSize: 18, marginBottom: 12 }}>
              Loading The Architect...
            </div>
            <div style={{ fontSize: 12, color: "#668877" }}>
              {loadProgress}
            </div>
          </div>
        )}

        {/* Door overlay — two black panels + center crack line */}
        {doorsVisible && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 15,
              pointerEvents: "none",
              overflow: "hidden",
            }}
          >
            {/* Left door panel */}
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
              {/* Inner glow edge (right side of left panel) */}
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
            {/* Right door panel */}
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
              {/* Inner glow edge (left side of right panel) */}
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
        )}
      </div>
    );
  }
);

ArchitectScene.displayName = "ArchitectScene";

export default ArchitectScene;
