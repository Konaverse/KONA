"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const DARK = "#0a0a0a";
const GREEN = "#00ff88";
const EMI = 0.18;

const NODES: [number, number, number][] = [
  [0, 0.9, 0],
  [0.9, 0, 0],
  [0, -0.9, 0],
  [-0.9, 0, 0],
];

const Y_UP = new THREE.Vector3(0, 1, 0);

export default function SocialMediaObject() {
  const group = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    group.current.rotation.y += delta * 0.4;
    group.current.rotation.x += delta * 0.15;
  });

  const { centerGeo, centerEdges, nodeGeo, nodeEdges, edges } = useMemo(() => {
    const centerGeo = new THREE.SphereGeometry(0.18, 10, 10);
    const centerEdges = new THREE.EdgesGeometry(centerGeo);
    const nodeGeo = new THREE.SphereGeometry(0.12, 10, 10);
    const nodeEdges = new THREE.EdgesGeometry(nodeGeo);

    const edges = NODES.map((pos) => {
      const nodeVec = new THREE.Vector3(...pos);
      const length = nodeVec.length();
      const mid = nodeVec.clone().multiplyScalar(0.5);
      const dir = nodeVec.clone().normalize();
      const q = new THREE.Quaternion().setFromUnitVectors(Y_UP, dir);
      const edgeGeo = new THREE.CylinderGeometry(0.03, 0.03, length, 6);
      const edgeEdges = new THREE.EdgesGeometry(edgeGeo);
      return { edgeGeo, edgeEdges, mid, q };
    });

    return { centerGeo, centerEdges, nodeGeo, nodeEdges, edges };
  }, []);

  return (
    <group ref={group}>
      {/* Center node */}
      <mesh geometry={centerGeo}>
        <meshStandardMaterial color={DARK} emissive={GREEN} emissiveIntensity={EMI} />
      </mesh>
      <lineSegments geometry={centerEdges}>
        <lineBasicMaterial color={GREEN} transparent opacity={0.7} />
      </lineSegments>

      {/* Outer nodes + edges */}
      {NODES.map((pos, i) => (
        <group key={i}>
          <mesh geometry={nodeGeo} position={pos}>
            <meshStandardMaterial color={DARK} emissive={GREEN} emissiveIntensity={EMI} />
          </mesh>
          <lineSegments geometry={nodeEdges} position={pos}>
            <lineBasicMaterial color={GREEN} transparent opacity={0.7} />
          </lineSegments>
          <mesh
            geometry={edges[i].edgeGeo}
            position={edges[i].mid.toArray() as [number, number, number]}
            quaternion={edges[i].q.toArray() as [number, number, number, number]}
          >
            <meshStandardMaterial color={DARK} emissive={GREEN} emissiveIntensity={EMI} />
          </mesh>
          <lineSegments
            geometry={edges[i].edgeEdges}
            position={edges[i].mid.toArray() as [number, number, number]}
            quaternion={edges[i].q.toArray() as [number, number, number, number]}
          >
            <lineBasicMaterial color={GREEN} transparent opacity={0.7} />
          </lineSegments>
        </group>
      ))}
    </group>
  );
}
