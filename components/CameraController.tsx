import { OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";

export const CameraController = ({
  positionCamera = new Vector3(0, 0, 10),
  dragRotationSpeed = 0.2,
  enableZoom = true,
  snappingDelay = 2500,
}: {
  positionCamera: Vector3;
  dragRotationSpeed: number;
  enableZoom: boolean;
  snappingDelay: number;
}) => {
  const positionDefault = useRef(positionCamera);
  const positionTarget = useRef(new Vector3(0, 0, 0));
  const { camera } = useThree();
  const refOrbitControls = useRef<any>(null);
  const snapping = useRef<boolean>(false);

  const snappingTimer = useRef<any>(null);

  const handleStart = () => {
    snapping.current = false;
    clearTimeout(snappingTimer.current);
  };

  const handleEnd = () => {
    snappingTimer.current = setTimeout(() => {
      snapping.current = true;
    }, snappingDelay);
  };

  useFrame(() => {
    if (refOrbitControls.current && snapping.current) {
      const currentPosition = camera.position;

      currentPosition.lerp(positionDefault.current, 0.05);

      if (currentPosition.distanceTo(positionDefault.current) < 0.01) {
        currentPosition.copy(positionDefault.current);
        snapping.current = false;
      }

      camera.lookAt(positionTarget.current);
      refOrbitControls.current.update();
    }
  });

  return (
    <OrbitControls
      ref={refOrbitControls}
      onStart={handleStart}
      onEnd={handleEnd}
      enablePan={false}
      enableZoom={enableZoom}
      rotateSpeed={dragRotationSpeed}
    />
  );
};
