"use client";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";

export const Logo = ({
  fisheyeIntensity = 1.2,
  fisheyeKnee = 0.5,
  noiseIntensity = 30,
  resolution = 128,
  saturateIntensity = 1.2,
}) => {
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
        THREE.MathUtils.degToRad(e.rotationRate.beta!) * 0.005;
      refGroup.current!.rotation.z +=
        THREE.MathUtils.degToRad(e.rotationRate.gamma!) * 0.005;
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
        // Crop and resize image to specified resolution
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const size = Math.min(img.width, img.height);
        canvas.width = resolution;
        canvas.height = resolution;
        ctx!.drawImage(
          img,
          (img.width - size) / 2,
          (img.height - size) / 2,
          size,
          size,
          0,
          0,
          resolution,
          resolution
        );

        // Apply fisheye effect with fine-tuning
        const imageData = ctx!.getImageData(0, 0, resolution, resolution);
        const data = imageData.data;
        const fisheyeData = ctx!.createImageData(resolution, resolution);
        const fisheyeDataArr = fisheyeData.data;

        const centerX = resolution / 2;
        const centerY = resolution / 2;
        const radius = resolution / 2;

        for (let y = 0; y < resolution; y++) {
          for (let x = 0; x < resolution; x++) {
            const dx = x - centerX;
            const dy = y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < radius) {
              const theta = Math.atan2(dy, dx);
              const r = distance / radius;
              const newR =
                Math.pow(r, fisheyeKnee) * Math.pow(r, fisheyeIntensity);
              const newX = centerX + newR * radius * Math.cos(theta);
              const newY = centerY + newR * radius * Math.sin(theta);
              const srcIndex =
                (Math.floor(newY) * resolution + Math.floor(newX)) * 4;
              const destIndex = (y * resolution + x) * 4;
              fisheyeDataArr[destIndex] = data[srcIndex];
              fisheyeDataArr[destIndex + 1] = data[srcIndex + 1];
              fisheyeDataArr[destIndex + 2] = data[srcIndex + 2];
              fisheyeDataArr[destIndex + 3] = data[srcIndex + 3];
            }
          }
        }

        ctx!.putImageData(fisheyeData, 0, 0);

        // Increase saturation and apply noise
        const imageDataAfterFisheye = ctx!.getImageData(
          0,
          0,
          resolution,
          resolution
        );
        const dataAfterFisheye = imageDataAfterFisheye.data;

        for (let i = 0; i < dataAfterFisheye.length; i += 4) {
          // Increase saturation
          const r = dataAfterFisheye[i];
          const g = dataAfterFisheye[i + 1];
          const b = dataAfterFisheye[i + 2];

          dataAfterFisheye[i] = Math.min(255, r * saturateIntensity); // Red channel
          dataAfterFisheye[i + 1] = Math.min(255, g * saturateIntensity); // Green channel
          dataAfterFisheye[i + 2] = Math.min(255, b * saturateIntensity); // Blue channel

          // Apply noise
          const noise = (Math.random() - 0.5) * noiseIntensity;
          dataAfterFisheye[i] = Math.min(
            255,
            Math.max(0, dataAfterFisheye[i] + noise)
          );
          dataAfterFisheye[i + 1] = Math.min(
            255,
            Math.max(0, dataAfterFisheye[i + 1] + noise)
          );
          dataAfterFisheye[i + 2] = Math.min(
            255,
            Math.max(0, dataAfterFisheye[i + 2] + noise)
          );
        }

        ctx!.putImageData(imageDataAfterFisheye, 0, 0);

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
    const requestPermission = async () => {
      if (typeof (DeviceMotionEvent as any).requestPermission === "function") {
        try {
          const permission = await (
            DeviceMotionEvent as any
          ).requestPermission();
          if (permission === "granted") {
            window.addEventListener("devicemotion", handleMotionOrientation);
          }
        } catch (error) {
          console.error("Permission request denied", error);
        }
      } else {
        window.addEventListener("devicemotion", handleMotionOrientation);
      }
    };

    requestPermission();
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
        <circleGeometry args={[3, 64]} />
        <meshStandardMaterial map={textureProfile} side={2} />
      </mesh>
      <mesh>
        <ringGeometry args={[3, 3.05, 128, 0]} />
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
