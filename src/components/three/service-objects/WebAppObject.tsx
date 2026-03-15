"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const DARK = "#0a0a0a";
const GREEN = "#00ff88";
const EMI = 0.18;

const DOT_X = [-0.95, -0.75, -0.55];
const ROW_Y = [0.28, 0.06, -0.16];

export default function WebAppObject() {
  const group = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    group.current.rotation.y += delta * 0.4;
    group.current.rotation.x += delta * 0.15;
  });

  const { panelGeo, panelEdges, headerGeo, headerEdges, dotGeo, dotEdges, rowGeo, rowEdges } = useMemo(() => {
    const panelGeo = new THREE.BoxGeometry(2.4, 1.8, 0.08);
    const panelEdges = new THREE.EdgesGeometry(panelGeo);
    const headerGeo = new THREE.BoxGeometry(2.4, 0.28, 0.10);
    const headerEdges = new THREE.EdgesGeometry(headerGeo);
    const dotGeo = new THREE.SphereGeometry(0.07, 8, 8);
    const dotEdges = new THREE.EdgesGeometry(dotGeo);
    const rowGeo = new THREE.BoxGeometry(1.6, 0.08, 0.10);
    const rowEdges = new THREE.EdgesGeometry(rowGeo);
    return { panelGeo, panelEdges, headerGeo, headerEdges, dotGeo, dotEdges, rowGeo, rowEdges };
  }, []);

  return (
    <group ref={group}>
      {/* Panel */}
      <mesh geometry={panelGeo}>
        <meshStandardMaterial color={DARK} emissive={GREEN} emissiveIntensity={EMI} />
      </mesh>
      <lineSegments geometry={panelEdges}>
        <lineBasicMaterial color={GREEN} transparent opacity={0.7} />
      </lineSegments>

      {/* Header bar */}
      <mesh geometry={headerGeo} position={[0, 0.76, 0.01]}>
        <meshStandardMaterial color={DARK} emissive={GREEN} emissiveIntensity={EMI * 1.5} />
      </mesh>
      <lineSegments geometry={headerEdges} position={[0, 0.76, 0.01]}>
        <lineBasicMaterial color={GREEN} transparent opacity={0.7} />
      </lineSegments>

      {/* Dots */}
      {DOT_X.map((x, i) => (
        <group key={i}>
          <mesh geometry={dotGeo} position={[x, 0.76, 0.05]}>
            <meshStandardMaterial color={DARK} emissive={GREEN} emissiveIntensity={EMI * 2} />
          </mesh>
          <lineSegments geometry={dotEdges} position={[x, 0.76, 0.05]}>
            <lineBasicMaterial color={GREEN} transparent opacity={0.7} />
          </lineSegments>
        </group>
      ))}

      {/* Content rows */}
      {ROW_Y.map((y, i) => (
        <group key={i}>
          <mesh geometry={rowGeo} position={[0, y, 0.05]}>
            <meshStandardMaterial color={DARK} emissive={GREEN} emissiveIntensity={EMI} />
          </mesh>
          <lineSegments geometry={rowEdges} position={[0, y, 0.05]}>
            <lineBasicMaterial color={GREEN} transparent opacity={0.7} />
          </lineSegments>
        </group>
      ))}
    </group>
  );
}
