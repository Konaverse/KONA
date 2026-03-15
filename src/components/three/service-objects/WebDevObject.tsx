"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const DARK = "#0a0a0a";
const GREEN = "#00ff88";
const EMI = 0.18;

export default function WebDevObject() {
  const group = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    group.current.rotation.y += delta * 0.4;
    group.current.rotation.x += delta * 0.15;
  });

  const { topBarGeo, topBarEdges, btmBarGeo, btmBarEdges, centerBarGeo, centerBarEdges } = useMemo(() => {
    const topBarGeo = new THREE.BoxGeometry(0.9, 0.12, 0.12);
    const topBarEdges = new THREE.EdgesGeometry(topBarGeo);
    const btmBarGeo = new THREE.BoxGeometry(0.9, 0.12, 0.12);
    const btmBarEdges = new THREE.EdgesGeometry(btmBarGeo);
    const centerBarGeo = new THREE.BoxGeometry(0.5, 0.1, 0.1);
    const centerBarEdges = new THREE.EdgesGeometry(centerBarGeo);
    return { topBarGeo, topBarEdges, btmBarGeo, btmBarEdges, centerBarGeo, centerBarEdges };
  }, []);

  const rad35 = THREE.MathUtils.degToRad(35);

  return (
    <group ref={group}>
      {/* Left bracket < */}
      <group position={[-0.85, 0, 0]}>
        <mesh geometry={topBarGeo} rotation={[0, 0, rad35]} position={[0.2, 0.28, 0]}>
          <meshStandardMaterial color={DARK} emissive={GREEN} emissiveIntensity={EMI} />
        </mesh>
        <lineSegments geometry={topBarEdges} rotation={[0, 0, rad35]} position={[0.2, 0.28, 0]}>
          <lineBasicMaterial color={GREEN} transparent opacity={0.7} />
        </lineSegments>
        <mesh geometry={btmBarGeo} rotation={[0, 0, -rad35]} position={[0.2, -0.28, 0]}>
          <meshStandardMaterial color={DARK} emissive={GREEN} emissiveIntensity={EMI} />
        </mesh>
        <lineSegments geometry={btmBarEdges} rotation={[0, 0, -rad35]} position={[0.2, -0.28, 0]}>
          <lineBasicMaterial color={GREEN} transparent opacity={0.7} />
        </lineSegments>
      </group>

      {/* Right bracket > */}
      <group position={[0.85, 0, 0]}>
        <mesh geometry={topBarGeo} rotation={[0, 0, -rad35]} position={[-0.2, 0.28, 0]}>
          <meshStandardMaterial color={DARK} emissive={GREEN} emissiveIntensity={EMI} />
        </mesh>
        <lineSegments geometry={topBarEdges} rotation={[0, 0, -rad35]} position={[-0.2, 0.28, 0]}>
          <lineBasicMaterial color={GREEN} transparent opacity={0.7} />
        </lineSegments>
        <mesh geometry={btmBarGeo} rotation={[0, 0, rad35]} position={[-0.2, -0.28, 0]}>
          <meshStandardMaterial color={DARK} emissive={GREEN} emissiveIntensity={EMI} />
        </mesh>
        <lineSegments geometry={btmBarEdges} rotation={[0, 0, rad35]} position={[-0.2, -0.28, 0]}>
          <lineBasicMaterial color={GREEN} transparent opacity={0.7} />
        </lineSegments>
      </group>

      {/* Center bar */}
      <mesh geometry={centerBarGeo} position={[0, 0, 0]}>
        <meshStandardMaterial color={DARK} emissive={GREEN} emissiveIntensity={EMI} />
      </mesh>
      <lineSegments geometry={centerBarEdges} position={[0, 0, 0]}>
        <lineBasicMaterial color={GREEN} transparent opacity={0.7} />
      </lineSegments>
    </group>
  );
}
