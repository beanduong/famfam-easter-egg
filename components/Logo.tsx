"use client";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState, useCallback } from "react";

export const Logo = ({}) => {
  // Load textures
  const textureLogo = useTexture("/famfam.png", (texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.set(4, 1);
  });
  const textureMatisse = useTexture("/matisse.png");
  const textureWorld = useTexture("/world.png");

  const refGroup = useRef<THREE.Group>(null);

  // Handle motion orientation using a callback to avoid redeclaration
  const handleMotionOrientation = useCallback((e: DeviceMotionEvent) => {
    if (refGroup.current && e.rotationRate) {
      refGroup.current.rotation.x +=
        THREE.MathUtils.degToRad(e.rotationRate.alpha!) * 0.005;
      refGroup.current.rotation.y +=
        THREE.MathUtils.degToRad(e.rotationRate.beta!) * 0.005;
      refGroup.current.rotation.z +=
        THREE.MathUtils.degToRad(e.rotationRate.gamma!) * 0.005;
    }
  }, []);

  useEffect(() => {
    const requestPermission = async () => {
      if (typeof (DeviceMotionEvent as any).requestPermission === "function") {
        try {
          const permission = await (
            DeviceMotionEvent as any
          ).requestPermission();
          if (permission === "granted") {
            window.addEventListener("devicemotion", handleMotionOrientation);
          }
        } catch (error) {
          console.error("Permission request denied", error);
        }
      } else {
        window.addEventListener("devicemotion", handleMotionOrientation);
      }
    };

    requestPermission();

    return () => {
      window.removeEventListener("devicemotion", handleMotionOrientation);
    };
  }, [handleMotionOrientation]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    textureLogo.offset.x = t * 0.15;
  });

  return (
    <group ref={refGroup}>
      <mesh>
        <circleGeometry args={[3, 64]} />
        <meshStandardMaterial
          attach="material"
          map={textureMatisse}
          alphaTest={0.5}
          transparent
        />
      </mesh>
      <mesh rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[3, 64]} />
        <meshStandardMaterial
          attach="material"
          map={textureWorld}
          alphaTest={0.5}
          transparent
        />
      </mesh>
      <mesh
        rotation={[
          THREE.MathUtils.degToRad(16),
          0,
          THREE.MathUtils.degToRad(-25),
        ]}
      >
        <cylinderGeometry args={[4, 4, 1, 64, 1, true]} />
        <meshStandardMaterial
          map={textureLogo}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>
    </group>
  );
};
