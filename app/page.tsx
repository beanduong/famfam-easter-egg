/* eslint-disable @next/next/no-img-element */

"use client";

import { extend } from "@react-three/fiber";
import { Logo } from "@/components/Logo";
import * as THREE from "three";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { MotionCanvas } from "framer-motion-3d";
import { OrthographicCamera } from "@react-three/drei";
import { is } from "@react-three/fiber/dist/declarations/src/core/utils";

export default function Home() {
  const ringSpeed = 0.02;
  const circleSpeed = 0.06;

  const mobileSize = { width: 375, height: 812 };
  const canvasHeight = 812;

  const refScrollArea = useRef<HTMLDivElement>(null);
  const refMobile = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll({
    container: refMobile,
  });
  const [scrollPercentage, setScrollPercentage] = useState<number>(0);
  const [isFixed, setIsFixed] = useState<boolean>(false);

  useMemo(() => extend(THREE), []);

  useLayoutEffect(() => {
    refMobile.current?.scrollTo(0, canvasHeight);
  }, [canvasHeight]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const percentage = ((latest - canvasHeight) * -1) / canvasHeight;
    setScrollPercentage(percentage);
  });

  return (
    <main className="absolute inset-0 flex justify-center items-center bg-neutral-200">
      <div className="absolute inset-x-0 top-2 flex justify-center">
        <div className="flex gap-4">
          <button
            className={!isFixed ? "underline" : ""}
            onClick={() => {
              setIsFixed(true);
            }}
          >
            fixed
          </button>
          <button
            className={isFixed ? "underline" : ""}
            onClick={() => {
              setIsFixed(false);
            }}
          >
            scroll
          </button>
        </div>
      </div>
      <div
        className={`relative flex flex-col w-full h-full max-w-[${mobileSize.width}px] max-h-[${mobileSize.height}px] bg-white rounded-md overflow-hidden`}
      >
        <div className="absolute top-0 inset-x-0 z-50">
          <img src="/status-bar.png" alt="status bar" />
        </div>
        <div className="absolute inset-0 pointer-events-none z-10">
          <MotionCanvas>
            <OrthographicCamera makeDefault position={[0, 0, 100]} zoom={40} />
            <ambientLight intensity={2.0} />
            <Logo
              scrollPercentage={scrollPercentage}
              isFixed={isFixed}
              radiusRing={4}
              radiusInner={3.9}
              ringSpeed={ringSpeed}
              circleSpeed={circleSpeed}
            />
          </MotionCanvas>
        </div>
        <div
          ref={refMobile}
          className="bg-transparent overflow-auto pb-16 z-10"
          data-hide-scrollbar
        >
          <div
            className="bg-transparent"
            ref={refScrollArea}
            style={{
              height: canvasHeight,
            }}
          />
          <img src="/start.png" alt="start" />
        </div>
        <div className="absolute bottom-0 inset-x-0 bg-red z-50">
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
