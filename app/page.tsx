"use client";

import { Canvas } from "@react-three/fiber";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { CameraController } from "@/components/CameraController";
import { Vector3 } from "three";
import { useControls } from "leva";

export default function Home() {
  const positionCamera = new Vector3(0, 0, 10);
  const { ringSpeed, circleSpeed, dragRotationSpeed, enableZoom } = useControls(
    {
      ringSpeed: {
        value: 0.05,
        min: 0.0,
        max: 0.25,
        step: 0.01,
      },
      circleSpeed: {
        value: 0.5,
        min: 0.0,
        max: 2.0,
        step: 0.01,
      },
      dragRotationSpeed: {
        value: 0.2,
        min: 0.0,
        max: 0.5,
        step: 0.01,
      },
      enableZoom: false,
    }
  );
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
          position: positionCamera,
          fov: 100,
          near: 0.1,
          far: 1000,
        }}
      >
        <CameraController
          positionCamera={positionCamera}
          dragRotationSpeed={dragRotationSpeed}
          enableZoom={enableZoom}
        />
        <ambientLight intensity={2.0} />
        <Logo
          radiusRing={4}
          radiusInner={3.9}
          ringSpeed={ringSpeed}
          circleSpeed={circleSpeed}
        />
      </Canvas>

      <div className="absolute bottom-4 md:bottom-8 inset-x-4 md:inset-x-8 flex justify-center">
        <ul className="flex gap-1 md:gap-8 md:flex-row flex-col items-center">
          <li>
            <NavLink href="/legal-notice">Legal Notice</NavLink>
          </li>
          <li>
            <NavLink href="/privacy-policy">Privacy Policy</NavLink>
          </li>
          <li>
            <NavLink href="/terms-of-service">Terms of Service</NavLink>
          </li>
          <li>
            <NavLink href="mailto:hello@famfam.app">Contact</NavLink>
          </li>
        </ul>
      </div>
    </main>
  );
}

const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link href={href} className="relative" scroll={false}>
    <span className="uppercase font-bold md:text-xs text-[0.6rem]">
      {children}
    </span>
    <span className="absolute inset-x-0 bottom-0 h-px bg-black" />
  </Link>
);
