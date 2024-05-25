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
  const [orientation, setOrientation] = useState<Orientation | null>(null);

  const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
    if (e.alpha && e.beta && e.gamma) {
      if (refInitialOrientation.current === null) {
        console.log("set");
        refInitialOrientation.current = {
          alpha: e.alpha,
          beta: e.beta,
          gamma: e.gamma,
        };
      }
      setOrientation({
        alpha: e.alpha,
        beta: e.beta,
        gamma: e.gamma,
      });
    }
  };

  useEffect(() => {
    window.addEventListener("deviceorientation", handleDeviceOrientation, true);

    return () => {
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
    };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    texture.offset.x = t * 0.15;

    if (refGroup.current && refInitialOrientation.current && orientation) {
      const alpha = refInitialOrientation.current.alpha - orientation.alpha;
      const beta = refInitialOrientation.current.beta - orientation.beta;
      const gamma = refInitialOrientation.current.gamma - orientation.gamma;

      refGroup.current.rotation.x = THREE.MathUtils.degToRad(-beta * 0.2);
      refGroup.current.rotation.y = THREE.MathUtils.degToRad(gamma * 0.2);
      refGroup.current.rotation.z = THREE.MathUtils.degToRad(alpha * 0.2);
    }
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
