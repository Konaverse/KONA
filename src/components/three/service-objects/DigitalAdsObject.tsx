"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const DARK = "#0a0a0a";
const GREEN = "#00ff88";
const EMI = 0.18;

export default function DigitalAdsObject() {
  const group = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    group.current.rotation.y += delta * 0.4;
    group.current.rotation.x += delta * 0.15;
  });

  const { coneGeo, coneEdges, bellGeo, bellEdges, handleGeo, handleEdges } = useMemo(() => {
    const coneGeo = new THREE.ConeGeometry(0.62, 1.4, 16);
    const coneEdges = new THREE.EdgesGeometry(coneGeo);
    const bellGeo = new THREE.TorusGeometry(0.62, 0.08, 8, 24);
    const bellEdges = new THREE.EdgesGeometry(bellGeo);
    const handleGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.7, 8);
    const handleEdges = new THREE.EdgesGeometry(handleGeo);
    return { coneGeo, coneEdges, bellGeo, bellEdges, handleGeo, handleEdges };
  }, []);

  // Cone: wide end at front (+z), tip at back (-z). ConeGeometry points up by default, so rotate 90° X.
  // Then rotate cone so tip faces backward: rotate Z 90° so it points along Z, then flip.
  const coneRot: [number, number, number] = [0, 0, -Math.PI / 2]; // tip at -x, bell at +x
  const tiltZ = THREE.MathUtils.degToRad(15);
  const handleRot: [number, number, number] = [0, 0, THREE.MathUtils.degToRad(30)];

  return (
    <group ref={group} rotation={[0, 0, tiltZ]}>
      {/* Cone body: tip at left (-x), bell at right (+x) */}
      <mesh geometry={coneGeo} rotation={coneRot} position={[0, 0, 0]}>
        <meshStandardMaterial color={DARK} emissive={GREEN} emissiveIntensity={EMI} />
      </mesh>
      <lineSegments geometry={coneEdges} rotation={coneRot} position={[0, 0, 0]}>
        <lineBasicMaterial color={GREEN} transparent opacity={0.7} />
      </lineSegments>

      {/* Bell at wide end */}
      <mesh geometry={bellGeo} position={[0.7, 0, 0]}>
        <meshStandardMaterial color={DARK} emissive={GREEN} emissiveIntensity={EMI} />
      </mesh>
      <lineSegments geometry={bellEdges} position={[0.7, 0, 0]}>
        <lineBasicMaterial color={GREEN} transparent opacity={0.7} />
      </lineSegments>

      {/* Handle below cone */}
      <mesh geometry={handleGeo} rotation={handleRot} position={[0, -0.8, 0]}>
        <meshStandardMaterial color={DARK} emissive={GREEN} emissiveIntensity={EMI} />
      </mesh>
      <lineSegments geometry={handleEdges} rotation={handleRot} position={[0, -0.8, 0]}>
        <lineBasicMaterial color={GREEN} transparent opacity={0.7} />
      </lineSegments>
    </group>
  );
}
