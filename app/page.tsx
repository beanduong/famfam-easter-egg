/* eslint-disable @next/next/no-img-element */

"use client";

import { extend } from "@react-three/fiber";
import { Logo } from "@/components/Logo";
import { CameraController } from "@/components/CameraController";
import * as THREE from "three";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useMotionValue, useMotionValueEvent, useScroll } from "motion/react";
import { MotionCanvas, motion as motion3d } from "framer-motion-3d";
import { OrthographicCamera } from "@react-three/drei";

export default function Home() {
  const positionCamera = new THREE.Vector3(0, 0, 150);
  const ringSpeed = 0.02;
  const circleSpeed = 0.06;
  const dragRotationSpeed = 4;
  const zoomSpeed = 2;
  const enableZoom = false;
  const snappingDelay = 2000;

  const mobileSize = { width: 375, height: 812 };

  const refCanvasContainer = useRef<HTMLDivElement>(null);
  const refMobile = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll({
    container: refMobile,
  });
  const [scrollPercentage, setScrollPercentage] = useState<number>(0);

  useMemo(() => extend(THREE), []);

  useLayoutEffect(() => {
    refMobile.current?.scrollTo(0, mobileSize.height);
  }, [mobileSize.height]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const percentage = ((latest - mobileSize.height) * -1) / mobileSize.height;
    setScrollPercentage(percentage);
  });

  return (
    <main className="absolute inset-0 flex justify-center items-center bg-neutral-200">
      <div
        className={`relative flex flex-col w-full h-full max-w-[${mobileSize.width}px] max-h-[${mobileSize.height}px] bg-white rounded-md overflow-hidden`}
      >
        <div className="absolute top-0 inset-x-0 z-10">
          <img src="/status-bar.png" alt="status bar" />
        </div>
        <div ref={refMobile} className="overflow-scroll" data-hide-scrollbar>
          <div
            className="flex flex-col justify-end"
            ref={refCanvasContainer}
            style={{
              height: mobileSize.height,
            }}
          >
            <MotionCanvas
              camera={{
                position: positionCamera,
                fov: 8,
                near: 0.1,
                far: 1000,
              }}
            >
              {/* <CameraController
                positionCamera={positionCamera}
                dragRotationSpeed={dragRotationSpeed}
                enableZoom={enableZoom}
                snappingDelay={snappingDelay}
                zoomSpeed={zoomSpeed}
              /> */}
              <OrthographicCamera
                makeDefault
                position={[0, 0, 100]}
                zoom={40}
              />
              {/* <axesHelper args={[15]} /> */}
              <ambientLight intensity={2.0} />
              <Logo
                scrollPercentage={scrollPercentage}
                radiusRing={4}
                radiusInner={3.9}
                ringSpeed={ringSpeed}
                circleSpeed={circleSpeed}
              />
            </MotionCanvas>
          </div>
          <img className="" src="/start.png" alt="start" />
        </div>
        <div className="absolute bottom-0 inset-x-0 bg-red z-10">
          <img src="/navigation.png" alt="navigation" />
        </div>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `[data-hide-scrollbar]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-hide-scrollbar]::-webkit-scrollbar{display:none}`,
        }}
      />
    </main>
  );
}
