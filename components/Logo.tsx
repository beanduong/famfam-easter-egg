"use client";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export const Logo = ({ radiusRing = 4, radiusInner = 3 }) => {
  const textureLogo = useTexture("/famfam.png", (texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.set(4, 1);
  });
  const textureMatisse = useTexture("/matisse.png");
  const textureWorld = useTexture("/world.png");

  const refCircle = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    textureLogo.offset.x = t * 0.15;
    refCircle.current!.rotation.y = t * 0.8;
  });

  return (
    <group>
      <group ref={refCircle}>
        <mesh>
          <circleGeometry args={[radiusInner, 64]} />
          <meshStandardMaterial
            map={textureMatisse}
            alphaTest={0.5}
            transparent
          />
        </mesh>
        <mesh rotation={[0, Math.PI, 0]}>
          <circleGeometry args={[radiusInner, 64]} />
          <meshStandardMaterial
            map={textureWorld}
            alphaTest={0.5}
            transparent
          />
        </mesh>
      </group>
      <mesh
        rotation={[
          THREE.MathUtils.degToRad(16),
          0,
          THREE.MathUtils.degToRad(-25),
        ]}
      >
        <cylinderGeometry args={[radiusRing, radiusRing, 1, 64, 1, true]} />
        <meshStandardMaterial
          map={textureLogo}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>
    </group>
  );
};
