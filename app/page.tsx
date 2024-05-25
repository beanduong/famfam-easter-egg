"use client";

import { Canvas } from "@react-three/fiber";
import { DeviceOrientationControls, OrbitControls } from "@react-three/drei";
import { Logo } from "@/components/Logo";
import { useEffect, useRef } from "react";

export default function Home() {
  const refDebug = useRef<HTMLSpanElement | null>(null);

  const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
    console.log(e);
    refDebug.current!.innerText = e.alpha + " " + e.beta + " " + e.gamma;
  };

  useEffect(() => {
    window.addEventListener("deviceorientation", handleDeviceOrientation, true);

    return () => {
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
    };
  }, []);

  return (
    <main className="absolute inset-0">
      <div className="absolute inset-0">
        <span ref={refDebug}>Test</span>
      </div>
      <Canvas
        camera={{
          position: [0, 0, 10],
          fov: 75,
          near: 0.1,
          far: 1000,
        }}
      >
        <OrbitControls />
        {/* <DeviceOrientationControls
          onChange={(e) => {
            refDebug.current!.innerText = JSON.stringify(e);
          }}
        /> */}
        <ambientLight intensity={2.0} />
        <Logo />
      </Canvas>
    </main>
  );
}
