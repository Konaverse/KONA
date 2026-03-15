"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const DARK = "#0a0a0a";
const GREEN = "#00ff88";
const EMI = 0.18;

export default function VideographyObject() {
  const group = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    group.current.rotation.y += delta * 0.4;
    group.current.rotation.x += delta * 0.15;
  });

  const { bodyGeo, bodyEdges, lensGeo, lensEdges, ringGeo, ringEdges } = useMemo(() => {
    const bodyGeo = new THREE.BoxGeometry(2.2, 1.4, 1.0);
    const bodyEdges = new THREE.EdgesGeometry(bodyGeo);
    const lensGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.8, 16);
    const lensEdges = new THREE.EdgesGeometry(lensGeo);
    const ringGeo = new THREE.TorusGeometry(0.55, 0.06, 8, 24);
    const ringEdges = new THREE.EdgesGeometry(ringGeo);
    return { bodyGeo, bodyEdges, lensGeo, lensEdges, ringGeo, ringEdges };
  }, []);

  const lensRot: [number, number, number] = [Math.PI / 2, 0, 0];

  return (
    <group ref={group}>
      {/* Body */}
      <mesh geometry={bodyGeo}>
        <meshStandardMaterial color={DARK} emissive={GREEN} emissiveIntensity={EMI} />
      </mesh>
      <lineSegments geometry={bodyEdges}>
        <lineBasicMaterial color={GREEN} transparent opacity={0.7} />
      </lineSegments>

      {/* Lens */}
      <mesh geometry={lensGeo} rotation={lensRot} position={[0, 0, 0.9]}>
        <meshStandardMaterial color={DARK} emissive={GREEN} emissiveIntensity={EMI} />
      </mesh>
      <lineSegments geometry={lensEdges} rotation={lensRot} position={[0, 0, 0.9]}>
        <lineBasicMaterial color={GREEN} transparent opacity={0.7} />
      </lineSegments>

      {/* Aperture ring */}
      <mesh geometry={ringGeo} rotation={lensRot} position={[0, 0, 0.9]}>
        <meshStandardMaterial color={DARK} emissive={GREEN} emissiveIntensity={EMI} />
      </mesh>
      <lineSegments geometry={ringEdges} rotation={lensRot} position={[0, 0, 0.9]}>
        <lineBasicMaterial color={GREEN} transparent opacity={0.7} />
      </lineSegments>
    </group>
  );
}
