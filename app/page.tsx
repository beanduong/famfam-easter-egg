"use client";

import { Canvas } from "@react-three/fiber";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { CameraController } from "@/components/CameraController";

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

      <div className="absolute bottom-4 md:bottom-8 inset-x-4 md:inset-x-8 flex md:justify-center">
        <ul className="flex gap-2 md:gap-8 md:flex-row flex-col">
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
  <Link href={href} className="relative">
    <span className="uppercase font-bold text-xs">{children}</span>
    <span className="absolute inset-x-0 bottom-0 h-px bg-black" />
  </Link>
);
