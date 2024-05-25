"use client";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";

export const Logo = () => {
  const textureLogo = useTexture("/famfam.png", (texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.set(4, 1);
  });

  const textureProfile = useTexture("/profile.png");

  const refGroup = useRef<THREE.Group | null>(null);

  const handleMotionOrientation = (e: DeviceMotionEvent) => {
    if (refGroup.current && e.rotationRate) {
      refGroup.current!.rotation.x +=
        THREE.MathUtils.degToRad(e.rotationRate.alpha!) * 0.005;
      refGroup.current!.rotation.y +=
        THREE.MathUtils.degToRad(e.rotationRate.gamma!) * 0.005;
      refGroup.current!.rotation.z +=
        THREE.MathUtils.degToRad(e.rotationRate.beta!) * 0.005;
    }
  };

  useEffect(() => {
    window.addEventListener("devicemotion", handleMotionOrientation, true);

    return () => {
      window.removeEventListener("devicemotion", handleMotionOrientation);
    };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    textureLogo.offset.x = t * 0.15;
  });

  return (
    <group ref={refGroup}>
      <mesh
        onClick={(e) => {
          console.log("test");
        }}
      >
        <circleGeometry args={[3, 32]} />
        <meshStandardMaterial map={textureProfile} side={2} />
      </mesh>
      <mesh>
        <ringGeometry args={[3, 3.05, 64, 0]} />
        <lineBasicMaterial color={"#000000"} side={2} />
      </mesh>
      <mesh
        rotation={[
          THREE.MathUtils.degToRad(16),
          0,
          THREE.MathUtils.degToRad(-25),
        ]}
      >
        <cylinderGeometry args={[4, 4, 1, 64, 1, true]} />
        <meshStandardMaterial map={textureLogo} side={2} transparent={true} />
      </mesh>
    </group>
  );
};
