"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Logo } from "@/components/Logo";

export default function Home() {
  return (
    <main
      className="absolute inset-0 bg-cover bg-center"
      style={{
        backgroundImage: "url('/cloud.png')",
      }}
    >
      <Canvas
        camera={{
          position: [0, 0, 12],
          fov: 100,
          near: 0.1,
          far: 1000,
        }}
      >
        <OrbitControls enablePan={false} dampingFactor={0.01} />
        <ambientLight intensity={2.0} />
        <Logo />
      </Canvas>
    </main>
  );
}
