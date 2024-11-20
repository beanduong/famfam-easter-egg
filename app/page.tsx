/* eslint-disable @next/next/no-img-element */

"use client";

import { Canvas, extend } from "@react-three/fiber";
import { Logo } from "@/components/Logo";
import * as THREE from "three";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { OrthographicCamera } from "@react-three/drei";
import { CameraController } from "@/components/CameraController";
import useMeasure from "react-use-measure";
import { useFullScreenHandle, FullScreen } from "react-full-screen";

export default function Home() {
  const ringSpeed = 0.02;
  const circleSpeed = 0.06;

  const refMobile = useRef<HTMLDivElement>(null);
  const [refViewport, viewportBounds] = useMeasure();

  const { scrollY } = useScroll({
    container: refMobile,
  });
  const [scrollPercentage, setScrollPercentage] = useState<number>(0);
  const [isFixed, setIsFixed] = useState<boolean>(false);

  const fullScreenHandle = useFullScreenHandle();

  useMemo(() => extend(THREE), []);

  useLayoutEffect(() => {
    refMobile.current?.scrollTo(0, viewportBounds.height * 0.75);
  }, [viewportBounds.height]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const percentage = (latest / (viewportBounds.height * 0.75)) * -1 + 1;
    setScrollPercentage(percentage);
  });

  return (
    <FullScreen handle={fullScreenHandle}>
      <main className="absolute inset-0 flex justify-center items-center bg-neutral-200">
        <div
          ref={refViewport}
          className={`relative flex flex-col w-full h-full bg-white overflow-hidden`}
        >
          <div
            className="absolute top-0 inset-x-0 z-50"
            onClick={fullScreenHandle.enter}
          >
            <img src="/status-bar.png" alt="status bar" />
          </div>
          <div
            className="absolute inset-x-0 top-0 z-10"
            style={{
              height: viewportBounds.height * 0.75,
            }}
          >
            <Canvas>
              <OrthographicCamera
                makeDefault
                position={[0, 0, 100]}
                zoom={40}
              />
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
            ref={refMobile}
            className="bg-transparent pointer-events-none overflow-auto pb-16 z-10"
            data-hide-scrollbar
          >
            <div
              className="pointer-events-none"
              style={{
                height: viewportBounds.height * 0.75,
              }}
            />
            <img className="pointer-events-auto" src="/start.png" alt="start" />
          </div>
          <div
            className="absolute bottom-0 inset-x-0 bg-red z-50"
            onClick={() => {
              setIsFixed((prev) => !prev);
            }}
          >
            <img src="/navigation.png" alt="navigation" />
          </div>
        </div>
        <style
          dangerouslySetInnerHTML={{
            __html: `[data-hide-scrollbar]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-hide-scrollbar]::-webkit-scrollbar{display:none}`,
          }}
        />
      </main>
    </FullScreen>
  );
}
