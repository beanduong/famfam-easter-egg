"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";
import { useRef } from "react";

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
        <CameraController />
        <ambientLight intensity={2.0} />
        <Logo radiusRing={4} radiusInner={3.9} />
      </Canvas>

      <div className="absolute bottom-8 inset-x-0 flex justify-around">
        <ul className="flex gap-8">
          <li>
            <NavLink href="/imprint">Imprint</NavLink>
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

const CameraController = () => {
  const positionDefault = useRef(new Vector3(0, 0, 12));
  const refOrbitControls = useRef<any>(null);
  const snapping = useRef<boolean>(false);

  const handleEnd = () => {
    snapping.current = true;
  };

  useFrame(() => {
    if (refOrbitControls.current && snapping.current) {
      const currentPosition = refOrbitControls.current.object.position;
      currentPosition.lerp(positionDefault.current, 0.1);
      if (currentPosition.distanceTo(positionDefault.current) < 0.01) {
        currentPosition.copy(positionDefault.current);
        snapping.current = false;
      }
      refOrbitControls.current.update();
    }
  });

  return (
    <OrbitControls
      ref={refOrbitControls}
      onEnd={handleEnd}
      enablePan={false}
      enableZoom={false}
    />
  );
};

const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link href={href} className="relative">
    <span className="uppercase font-bold">{children}</span>
    <span className="absolute inset-x-0 -bottom-1 h-px bg-black" />
  </Link>
);
