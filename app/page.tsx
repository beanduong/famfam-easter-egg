/* eslint-disable @next/next/no-img-element */

"use client";

import { Canvas, extend } from "@react-three/fiber";
import { Logo } from "@/components/Logo";
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { OrthographicCamera } from "@react-three/drei";
import { CameraController } from "@/components/CameraController";

export default function Home() {
  const ringSpeed = 0.02;
  const circleSpeed = 0.06;

  const refMain = useRef<HTMLDivElement>(null);
  const refHome = useRef<HTMLImageElement>(null);

  const { scrollY } = useScroll({
    container: refMain,
  });
  const [scrollPercentage, setScrollPercentage] = useState<number>(1);
  const [shouldScroll, setShouldScroll] = useState<boolean>(true);

  const [isFixed, setIsFixed] = useState<boolean>(true);

  useMemo(() => extend(THREE), []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const percentage = (latest / (window.innerHeight * 0.7)) * -1 + 1;
    setScrollPercentage(percentage);
    if (refHome.current) {
      if (refHome.current.getBoundingClientRect().top < -10) {
        setShouldScroll(false);
      } else {
        setShouldScroll(true);
      }
    }
  });

  return (
    <main
      ref={refMain}
      className="h-screen w-screen relative snap-mandatory snap-y overflow-y-scroll scroll-smooth"
    >
      <div className="fixed top-0 inset-x-0 h-[70vh] -z-10">
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
      <section
        className={`w-full h-[70vh] ${
          shouldScroll ? "snap-start snap-always" : ""
        }`}
      />
      <section
        className={`w-full h-fit z-20 ${
          shouldScroll ? "snap-start snap-always" : ""
        }`}
      >
        <img ref={refHome} src="/start.png" alt="start" className="w-full" />
      </section>
      <div
        className="fixed bottom-0 inset-x-0 z-50"
        onClick={() => {
          setIsFixed((prev) => !prev);
        }}
      >
        <img src="/navigation.png" alt="navigation" />
      </div>
    </main>
  );
}
