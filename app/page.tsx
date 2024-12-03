/* eslint-disable @next/next/no-img-element */

"use client";

import { Canvas, extend } from "@react-three/fiber";
import { Logo } from "@/components/Logo";
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { OrthographicCamera } from "@react-three/drei";
import { CameraController } from "@/components/CameraController";
import { useWindowSize } from "@uidotdev/usehooks";

export default function Home() {
  const ringSpeed = 0.02;
  const circleSpeed = 0.06;

  const refMain = useRef<HTMLDivElement>(null);
  const refHome = useRef<HTMLImageElement>(null);

  const { height: windowHeight } = useWindowSize();
  const [height, setHeight] = useState<number | null>(0);

  const { scrollY } = useScroll();
  const [scrollPercentage, setScrollPercentage] = useState<number>(1);
  const [isFixed, setIsFixed] = useState<boolean>(false);

  useMemo(() => extend(THREE), []);

  useEffect(() => {
    if (windowHeight) setHeight(windowHeight);
  }, [windowHeight]);

  useEffect(() => {
    console.log(height);
  }, [height]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (height) {
      const percentage = (latest / (height * 0.75)) * -1 + 1;
      setScrollPercentage(percentage);
    }
  });

  return (
    <main ref={refMain} className="min-h-screen w-screen relative">
      <div
        className="fixed top-0 inset-x-0 -z-10"
        style={{
          height: height ? height * 0.75 : 0,
        }}
      >
        <Canvas>
          <OrthographicCamera makeDefault position={[0, 0, 100]} zoom={40} />
          <CameraController
            positionCamera={new THREE.Vector3(0, 0, 10)}
            dragRotationSpeed={1}
            enableZoom={false}
            snappingDelay={2500}
            zoomSpeed={1}
          />
          <ambientLight intensity={2.0} />
          <Logo
            scrollPercentage={scrollPercentage}
            isFixed={isFixed}
            radiusRing={4}
            radiusInner={3.9}
            ringSpeed={ringSpeed}
            circleSpeed={circleSpeed}
          />
        </Canvas>
      </div>
      <div
        className="bg-transparent pb-16 z-20 w-full"
        style={{
          marginTop: height ? height * 0.75 : 0,
        }}
      >
        <img ref={refHome} src="/start.png" alt="start" />
      </div>
      <div
        className="fixed bottom-0 inset-x-0 bg-red z-50"
        onClick={() => {
          setIsFixed((prev) => !prev);
        }}
      >
        <img src="/navigation.png" alt="navigation" />
      </div>
    </main>
  );
}
