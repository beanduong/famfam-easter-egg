"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Logo } from "@/components/Logo";

export default function Home() {
  return (
    <main className="absolute inset-0">
      <Canvas
        camera={{
          position: [0, 0, 10],
          fov: 75,
          near: 0.1,
          far: 1000,
        }}
      >
        <OrbitControls />
        <ambientLight intensity={2.0} />
        <Logo />
      </Canvas>
    </main>
  );
}
