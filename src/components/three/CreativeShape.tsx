"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CreativeShapeProps {
    isActive: boolean;
    onPointerOver?: () => void;
    onPointerOut?: () => void;
}

export function CreativeShape({ isActive, onPointerOver, onPointerOut }: CreativeShapeProps) {
    const groupRef = useRef<THREE.Group>(null);
    const torusKnotRef = useRef<THREE.Mesh>(null);
    const wireframeRef = useRef<THREE.LineSegments>(null);
    const orbitRingRef = useRef<THREE.Mesh>(null);
    const posXRef = useRef(3.2);

    // Memoize the wireframe EdgesGeometry
    const wireframeGeo = useMemo(() => {
        const knot = new THREE.TorusKnotGeometry(0.75, 0.08, 64, 8, 2, 3);
        const edges = new THREE.EdgesGeometry(knot);
        knot.dispose();
        return edges;
    }, []);

    useFrame((state) => {
        const time = state.clock.elapsedTime;

        // ── Smooth horizontal slide ──────────────────────────────────────────
        const targetX = isActive ? 2.6 : 3.2;
        posXRef.current += (targetX - posXRef.current) * 0.035;

        if (groupRef.current) {
            groupRef.current.position.x = posXRef.current;
            groupRef.current.position.y = 0.0 + Math.sin(time * 0.5 + 1) * 0.15;
        }

        // ── Perpetual rotations ──────────────────────────────────────────────
        if (torusKnotRef.current) {
            torusKnotRef.current.rotation.x = time * 0.12;
            torusKnotRef.current.rotation.y = time * 0.18;
            torusKnotRef.current.rotation.z = time * 0.08;
        }

        if (wireframeRef.current) {
            wireframeRef.current.rotation.x = -time * 0.08;
            wireframeRef.current.rotation.y = time * 0.12;
        }

        if (orbitRingRef.current) {
            orbitRingRef.current.rotation.x = time * 0.2 + 0.5;
            orbitRingRef.current.rotation.y = time * 0.15;
            orbitRingRef.current.rotation.z = time * 0.1;
        }
    });

    return (
        <group ref={groupRef} position={[3.2, 0.0, -1]} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
            {/* Point light — warm sand glow emanating from the shape */}
            <pointLight color={0xb6a492} intensity={1.0} distance={5} decay={2} />

            {/* Torus knot — dark metallic organic form */}
            <mesh ref={torusKnotRef}>
                <torusKnotGeometry args={[0.6, 0.18, 100, 16, 2, 3]} />
                <meshStandardMaterial
                    color={0x1e1e24}
                    metalness={0.65}
                    roughness={0.35}
                    envMapIntensity={0.7}
                    emissive={0x1a1816}
                    emissiveIntensity={0.1}
                />
            </mesh>

            {/* Wireframe torus knot overlay — warm sand edges */}
            <lineSegments ref={wireframeRef} geometry={wireframeGeo}>
                <lineBasicMaterial color="#b6a492" transparent opacity={0.3} />
            </lineSegments>

            {/* Orbiting ring — warm sand accent */}
            <mesh ref={orbitRingRef}>
                <torusGeometry args={[1.0, 0.02, 8, 48]} />
                <meshStandardMaterial
                    color="#b6a492"
                    metalness={0.2}
                    roughness={0.5}
                    emissive="#b6a492"
                    emissiveIntensity={0.15}
                    transparent
                    opacity={0.5}
                />
            </mesh>

            {/* Second orbiting ring — slightly larger, dimmer, perpendicular */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[1.15, 0.012, 8, 48]} />
                <meshBasicMaterial color="#b6a492" transparent opacity={0.12} />
            </mesh>

            {/* Orbiting data nodes — 3 small spheres tracing a path */}
            {[0, 1, 2].map((i) => {
                const angle = (i / 3) * Math.PI * 2;
                const r = 1.1;
                return (
                    <mesh
                        key={i}
                        position={[
                            Math.cos(angle) * r,
                            Math.sin(angle) * r * 0.4,
                            Math.sin(angle) * r,
                        ]}
                    >
                        <sphereGeometry args={[0.04, 8, 8]} />
                        <meshBasicMaterial color="#b6a492" transparent opacity={0.7} />
                    </mesh>
                );
            })}
        </group>
    );
}
