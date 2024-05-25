"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Logo } from "@/components/Logo";

export default function Home() {
  return (
    <main className="absolute inset-0">
      <Canvas>
        <OrbitControls />
        <ambientLight intensity={1.4} />
        <Logo />
      </Canvas>
    </main>
  );
}
