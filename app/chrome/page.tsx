"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { LogoProfile } from "@/components/LogoProfile";

export default function Home() {
  return (
    <main className="absolute inset-0">
      <div
        className="absolute inset-0 animate-diagonal"
        style={{
          background: "url('/clouds.png') repeat",
        }}
      />
      <Canvas
        camera={{
          position: [0, 0, 12],
          fov: 100,
          near: 0.1,
          far: 1000,
        }}
      >
        <OrbitControls enablePan={false} dampingFactor={0.01} rotateSpeed={5} />
        <ambientLight intensity={2.0} />
        <LogoProfile
          fisheyeIntensity={0.2}
          fisheyeKnee={0.8}
          noiseIntensity={30}
          saturateIntensity={1.2}
          resolution={500}
          chrome
        />
      </Canvas>
    </main>
  );
}
