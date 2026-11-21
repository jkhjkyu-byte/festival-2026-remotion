import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig } from "remotion";

export const FestivalWebGL = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  return (
    <ThreeCanvas width={width} height={height} camera={{ position: [0, 0, 5] }}>
      <color attach="background" args={["#0a1020"]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 5]} intensity={2.5} />
      <mesh rotation={[0.3, frame / fps, -0.2]}>
        <torusGeometry args={[0.95, 0.24, 20, 6]} />
        <meshStandardMaterial color="#e9be78" metalness={0.3} roughness={0.45} />
      </mesh>
    </ThreeCanvas>
  );
};
