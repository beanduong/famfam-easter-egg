"use client";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { motion } from "framer-motion-3d";
import { useRef } from "react";

export const Logo = ({
  radiusRing = 4,
  radiusInner = 3,
  ringSpeed = 1,
  circleSpeed = 1,
}) => {
  const textureLogo = useTexture("/famfam.png", (texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.set(4, 1);
  });
  const textureMatisse = useTexture("/matisse.png");
  const textureWorld = useTexture("/world.png");

  const refCircle = useRef<THREE.Group>(null);

  useFrame(() => {
    textureLogo.offset.x += ringSpeed * 0.1;
    refCircle.current!.rotation.y += circleSpeed * 0.1;
  });

  return (
    <group>
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
      <motion.mesh
        initial={{ scale: 4 }}
        animate={{
          scale: 1,
          transition: { duration: 2, ease: [0, 0.65, 0, 1] },
        }}
        rotation={[
          THREE.MathUtils.degToRad(16),
          0,
          THREE.MathUtils.degToRad(-25),
        ]}
      >
        <cylinderGeometry args={[radiusRing, radiusRing, 1, 64, 1, true]} />
        <motion.meshStandardMaterial
          map={textureLogo}
          side={THREE.DoubleSide}
          transparent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 2, delay: 0.5 } }}
        />
      </motion.mesh>
    </group>
  );
};
