"use client";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";

export const Logo = () => {
  const textureLogo = useTexture("/famfam.png", (texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.set(4, 1);
  });

  const textureProfileDefault = useTexture("/profile.png");
  const [textureProfile, setTextureProfile] = useState<THREE.Texture | null>(
    textureProfileDefault
  );

  const refGroup = useRef<THREE.Group | null>(null);

  const handleMotionOrientation = (e: DeviceMotionEvent) => {
    if (refGroup.current && e.rotationRate) {
      refGroup.current!.rotation.x +=
        THREE.MathUtils.degToRad(e.rotationRate.alpha!) * 0.005;
      refGroup.current!.rotation.y +=
        THREE.MathUtils.degToRad(e.rotationRate.gamma!) * 0.005;
      refGroup.current!.rotation.z +=
        THREE.MathUtils.degToRad(e.rotationRate.beta!) * 0.005;
    }
  };

  const handleFileChange = (event: Event) => {
    if (!(event.target instanceof HTMLInputElement) || !event.target.files)
      return;

    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target || typeof e.target.result !== "string") return;
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const size = Math.min(img.width, img.height);
        canvas.width = size;
        canvas.height = size;
        ctx!.drawImage(
          img,
          (img.width - size) / 2,
          (img.height - size) / 2,
          size,
          size,
          0,
          0,
          size,
          size
        );
        const croppedImg = new Image();
        croppedImg.src = canvas.toDataURL();
        croppedImg.onload = () => {
          const newTexture = new THREE.Texture(croppedImg);
          newTexture.needsUpdate = true;
          setTextureProfile(newTexture);
        };
      };
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.capture = "user";
    fileInput.style.display = "none";

    fileInput.addEventListener("change", handleFileChange);
    document.body.appendChild(fileInput);
    fileInput.click();

    fileInput.addEventListener("change", () => {
      document.body.removeChild(fileInput);
    });
  };

  useEffect(() => {
    window.addEventListener("devicemotion", handleMotionOrientation, true);

    return () => {
      window.removeEventListener("devicemotion", handleMotionOrientation);
    };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    textureLogo.offset.x = t * 0.15;
  });

  return (
    <group ref={refGroup}>
      <mesh onClick={handleClick}>
        <circleGeometry args={[3, 32]} />
        <meshStandardMaterial map={textureProfile} side={2} />
      </mesh>
      <mesh>
        <ringGeometry args={[3, 3.05, 64, 0]} />
        <lineBasicMaterial color={"#000000"} side={2} />
      </mesh>
      <mesh
        rotation={[
          THREE.MathUtils.degToRad(16),
          0,
          THREE.MathUtils.degToRad(-25),
        ]}
      >
        <cylinderGeometry args={[4, 4, 1, 64, 1, true]} />
        <meshStandardMaterial map={textureLogo} side={2} transparent={true} />
      </mesh>
    </group>
  );
};
