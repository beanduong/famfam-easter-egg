"use client";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export const Logo = () => {
  const texture = useTexture("/famfam.png", (texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.set(4, 1);
  });

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    texture.offset.x = t * 0.1;
  });

  return (
    <mesh
      rotation={[
        THREE.MathUtils.degToRad(16),
        0,
        THREE.MathUtils.degToRad(-25),
      ]}
    >
      <cylinderGeometry args={[4, 4, 1, 32, 1, true]} />
      <meshStandardMaterial map={texture} side={2} transparent={true} />
    </mesh>
  );
};
