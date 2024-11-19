"use client";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { motion as motion3d } from "framer-motion-3d";
import { useSpring, useTransform, cubicBezier } from "motion/react";

export const Logo = ({
  radiusRing = 4,
  radiusInner = 3,
  ringSpeed = 1,
  circleSpeed = 1,
  scrollPercentage,
  isFixed = false,
}: {
  radiusRing?: number;
  radiusInner?: number;
  ringSpeed?: number;
  circleSpeed?: number;
  scrollPercentage?: any;
  isFixed?: boolean;
}) => {
  const textureLogo = useTexture("/famfam.png", (texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.set(4, 1);
  });
  const textureMatisse = useTexture("/matisse.png");
  const textureWorld = useTexture("/world.png");

  const refCircle = useRef<THREE.Group>(null);

  const motionScrollPercentage = useSpring(scrollPercentage, {
    mass: 0.5,
    stiffness: 50,
    damping: 10,
  });
  // const motionScrollPercentage = useMotionValue(scrollPercentage);
  const y = useTransform(motionScrollPercentage, [0, 1], [9.5, 0]);
  const scale = useTransform(motionScrollPercentage, [0, 1], [0.2, 1], {
    ease: cubicBezier(0.55, 0.06, 0.68, 0.19),
  });

  useEffect(() => {
    motionScrollPercentage.set(scrollPercentage);
  }, [scrollPercentage, motionScrollPercentage]);

  useFrame(() => {
    textureLogo.offset.x += ringSpeed * 0.1;
    refCircle.current!.rotation.y += circleSpeed * 0.1;
  });

  return (
    <motion3d.group position-y={isFixed ? 3 : y} scale={isFixed ? 1 : scale}>
      <group ref={refCircle} rotation={[0, Math.PI / 2, 0]}>
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
    </motion3d.group>
  );
};
