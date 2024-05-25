"use client";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";

type Orientation = {
  alpha: number;
  beta: number;
  gamma: number;
};

export const Logo = () => {
  const texture = useTexture("/famfam.png", (texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.set(4, 1);
  });

  const refGroup = useRef<THREE.Group | null>(null);

  const refInitialOrientation = useRef<Orientation | null>(null);
  // const [orientation, setOrientation] = useState<Orientation | null>(null);

  const handleMotionOrientation = (e: DeviceMotionEvent) => {
    if (refGroup.current && e.rotationRate) {
      console.log(refGroup.current!.rotation);
      refGroup.current!.rotation.x += THREE.MathUtils.degToRad(
        e.rotationRate.beta!
      );
      refGroup.current!.rotation.y += THREE.MathUtils.degToRad(
        e.rotationRate.gamma!
      );
      refGroup.current!.rotation.z += THREE.MathUtils.degToRad(
        e.rotationRate.alpha!
      );
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
    texture.offset.x = t * 0.15;
  });

  return (
    <group ref={refGroup}>
      <mesh
        rotation={[
          THREE.MathUtils.degToRad(16),
          0,
          THREE.MathUtils.degToRad(-25),
        ]}
      >
        <cylinderGeometry args={[4, 4, 1, 64, 1, true]} />
        <meshStandardMaterial map={texture} side={2} transparent={true} />
      </mesh>
    </group>
  );
};
