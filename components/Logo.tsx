"use client";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { motion } from "framer-motion-3d";

export const Logo = ({ radiusRing = 4, radiusInner = 3 }) => {
  const textureLogo = useTexture("/famfam.png", (texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.set(4, 1);
  });
  const textureMatisse = useTexture("/matisse.png");
  const textureWorld = useTexture("/world.png");

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    textureLogo.offset.x = t * 0.15;
  });

  return (
    <group>
      <motion.group
        initial={{ rotateY: Math.PI / 2 }}
        animate={{
          rotateY: Math.PI * 2 + Math.PI / 2,
          transition: {
            duration: 4,
            repeat: Infinity,
            ease: "linear",
            delay: 1,
          },
        }}
      >
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
      </motion.group>
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
