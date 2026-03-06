"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface StrategicShapeProps {
    isActive: boolean;
    onPointerOver?: () => void;
    onPointerOut?: () => void;
}

export function StrategicShape({ isActive, onPointerOver, onPointerOut }: StrategicShapeProps) {
    const groupRef = useRef<THREE.Group>(null);
    const mainCubeRef = useRef<THREE.Mesh>(null);
    const wireframeRef = useRef<THREE.LineSegments>(null);
    const wireframe2Ref = useRef<THREE.LineSegments>(null);
    const innerCubeRef = useRef<THREE.Mesh>(null);
    const orbitGroupRef = useRef<THREE.Group>(null);
    const scanRingRef = useRef<THREE.Mesh>(null);
    const posXRef = useRef(-3.2);

    // Memoize geometries
    const wireframeGeo = useMemo(() => {
        const box = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        const edges = new THREE.EdgesGeometry(box);
        box.dispose();
        return edges;
    }, []);

    const wireframe2Geo = useMemo(() => {
        const box = new THREE.BoxGeometry(1.9, 1.9, 1.9);
        const edges = new THREE.EdgesGeometry(box);
        box.dispose();
        return edges;
    }, []);

    useFrame((state) => {
        const time = state.clock.elapsedTime;

        // ── Smooth horizontal slide ──────────────────────────────────────────
        const targetX = isActive ? -2.6 : -3.2;
        posXRef.current += (targetX - posXRef.current) * 0.035;

        if (groupRef.current) {
            groupRef.current.position.x = posXRef.current;
            groupRef.current.position.y = 0.0 + Math.sin(time * 0.6) * 0.15;
        }

        // ── Perpetual rotations ──────────────────────────────────────────────
        if (mainCubeRef.current) {
            mainCubeRef.current.rotation.x = time * 0.15;
            mainCubeRef.current.rotation.y = time * 0.2;
        }

        if (wireframeRef.current) {
            wireframeRef.current.rotation.x = -time * 0.1;
            wireframeRef.current.rotation.y = time * 0.15;
        }

        if (wireframe2Ref.current) {
            wireframe2Ref.current.rotation.x = time * 0.06;
            wireframe2Ref.current.rotation.y = -time * 0.08;
            wireframe2Ref.current.rotation.z = time * 0.04;
        }

        if (innerCubeRef.current) {
            innerCubeRef.current.rotation.x = -time * 0.3;
            innerCubeRef.current.rotation.y = time * 0.25;
            innerCubeRef.current.rotation.z = time * 0.1;
        }

        // ── Orbit ring rotation ──────────────────────────────────────────────
        if (orbitGroupRef.current) {
            orbitGroupRef.current.rotation.y = time * 0.4;
            orbitGroupRef.current.rotation.x = time * 0.15;
        }

        // ── Scanning ring pulse ──────────────────────────────────────────────
        if (scanRingRef.current) {
            const pulse = Math.sin(time * 1.2) * 0.08 + 0.92;
            scanRingRef.current.scale.set(pulse, pulse, pulse);
            scanRingRef.current.rotation.z = time * 0.3;
            const mat = scanRingRef.current.material as THREE.MeshBasicMaterial;
            mat.opacity = 0.15 + Math.sin(time * 1.8) * 0.1;
        }
    });

    return (
        <group ref={groupRef} position={[-3.2, 0.0, -1]} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
            {/* Point light — sage glow emanating from the shape */}
            <pointLight color={0x6b7f62} intensity={1.2} distance={5} decay={2} />

            {/* Main cube — slightly brighter with sage emissive for visibility */}
            <mesh ref={mainCubeRef}>
                <boxGeometry args={[1.2, 1.2, 1.2]} />
                <meshStandardMaterial
                    color={0x2a2a32}
                    metalness={0.7}
                    roughness={0.35}
                    envMapIntensity={0.8}
                    emissive={0x1a2518}
                    emissiveIntensity={0.15}
                />
            </mesh>

            {/* Inner wireframe — sage green, higher opacity */}
            <lineSegments ref={wireframeRef} geometry={wireframeGeo}>
                <lineBasicMaterial color="#8aa07e" transparent opacity={0.55} />
            </lineSegments>

            {/* Outer wireframe — second layer, dimmer, for depth */}
            <lineSegments ref={wireframe2Ref} geometry={wireframe2Geo}>
                <lineBasicMaterial color="#6b7f62" transparent opacity={0.2} />
            </lineSegments>

            {/* Inner cube — glowing tech core */}
            <mesh ref={innerCubeRef}>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial
                    color="#8aa07e"
                    metalness={0.3}
                    roughness={0.4}
                    emissive="#6b7f62"
                    emissiveIntensity={0.6}
                    transparent
                    opacity={0.7}
                />
            </mesh>

            {/* Scanning ring — horizontal halo */}
            <mesh ref={scanRingRef} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[1.0, 1.05, 64]} />
                <meshBasicMaterial
                    color="#6b7f62"
                    transparent
                    opacity={0.2}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Orbiting data nodes — 4 small cubes tracing a circular path */}
            <group ref={orbitGroupRef}>
                {[0, 1, 2, 3].map((i) => {
                    const angle = (i / 4) * Math.PI * 2;
                    const r = 1.3;
                    return (
                        <mesh
                            key={i}
                            position={[
                                Math.cos(angle) * r,
                                0,
                                Math.sin(angle) * r,
                            ]}
                        >
                            <boxGeometry args={[0.07, 0.07, 0.07]} />
                            <meshBasicMaterial color="#6b7f62" transparent opacity={0.8} />
                        </mesh>
                    );
                })}
            </group>

            {/* Corner bracket accents — 4 L-shaped line markers floating at corners */}
            {[
                [-1, 1, 1],
                [1, 1, 1],
                [-1, -1, 1],
                [1, -1, 1],
            ].map(([sx, sy, sz], i) => (
                <group key={`bracket-${i}`} position={[sx * 0.85, sy * 0.85, sz * 0.25]}>
                    <mesh>
                        <boxGeometry args={[0.18, 0.015, 0.015]} />
                        <meshBasicMaterial color="#6b7f62" transparent opacity={0.4} />
                    </mesh>
                    <mesh position={[sx * -0.085, sy * -0.085, 0]}>
                        <boxGeometry args={[0.015, 0.18, 0.015]} />
                        <meshBasicMaterial color="#6b7f62" transparent opacity={0.4} />
                    </mesh>
                </group>
            ))}
        </group>
    );
}
