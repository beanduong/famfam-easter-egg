"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Logo } from "@/components/Logo";
import Image from "next/image";

export default function Home() {
  return (
    <main className="absolute inset-0">
      <Image
        src="/cloud.png"
        fill
        sizes="100vw"
        alt="clouds"
        className="object-cover"
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNMWPTiPwAGPwLrhTF0EgAAAABJRU5ErkJggg==
        "
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
        <Logo
          fisheyeIntensity={0.2}
          fisheyeKnee={0.8}
          noiseIntensity={30}
          saturateIntensity={1.2}
          resolution={500}
          chrome={true}
        />
      </Canvas>
    </main>
  );
}
