import { TrackballControls } from "@react-three/drei";
import { Vector3 } from "three";
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";

export const CameraController = ({
  positionCamera = new Vector3(0, 0, 10),
  dragRotationSpeed = 0.2,
  enableZoom = true,
  snappingDelay = 2500,
  zoomSpeed = 1,
}: {
  positionCamera: Vector3;
  dragRotationSpeed: number;
  enableZoom: boolean;
  snappingDelay: number;
  zoomSpeed: number;
}) => {
  const positionDefault = useRef(positionCamera);
  const positionTarget = useRef(new Vector3(0, 0, 0));
  const { camera, gl } = useThree();
  const refControls = useRef<any>(null);
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
    if (refControls.current && snapping.current) {
      const currentPosition = camera.position;
      const currentTarget = positionTarget.current;

      currentPosition.lerp(positionDefault.current, 0.05);
      camera.up.lerp(new Vector3(0, 1, 0), 0.05);
      camera.lookAt(currentTarget);

      if (currentPosition.distanceTo(positionDefault.current) < 0.01) {
        currentPosition.copy(positionDefault.current);
        snapping.current = false;
      }

      camera.updateProjectionMatrix();
      refControls.current.update();
    }
  });

  camera.up.set(0, 1, 0);

  useEffect(() => {
    const handleTouchStart = (event: TouchEvent) => {
      event.preventDefault();
    };

    gl.domElement.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });

    return () => {
      gl.domElement.removeEventListener("touchstart", handleTouchStart);
    };
  }, [gl.domElement]);

  return (
    <TrackballControls
      ref={refControls}
      onStart={handleStart}
      onEnd={handleEnd}
      noPan={true}
      dynamicDampingFactor={0.1}
      noZoom={!enableZoom}
      rotateSpeed={dragRotationSpeed}
      zoomSpeed={zoomSpeed}
    />
  );
};
