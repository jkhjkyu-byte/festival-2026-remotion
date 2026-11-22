import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { useLayoutEffect, useMemo } from "react";
import {
  AbsoluteFill,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Color, DoubleSide, Float32BufferAttribute, Shape } from "three";

type Mode = "opening" | "schedule" | "cw" | "ms" | "quiz" | "ending";

export type CeremonySpaceProps = {
  readonly mode: Mode;
  readonly gold?: boolean;
};

const surfaceWidth = 1056;
const surfaceHeight = 288;
const fullTurn = Math.PI * 2;
const sides = [-1, 1] as const;
const levels = [0, 1, 2, 3, 4] as const;
const lightBands = [0, 1, 2] as const;

const finProfile = new Shape()
  .moveTo(-0.43, -0.5)
  .lineTo(0.36, -0.5)
  .lineTo(0.5, -0.41)
  .lineTo(0.5, 0.38)
  .lineTo(0.28, 0.5)
  .lineTo(-0.36, 0.5)
  .lineTo(-0.5, 0.38)
  .lineTo(-0.5, -0.38)
  .closePath();
const finExtrusion = {
  depth: 1,
  bevelEnabled: true,
  bevelSegments: 1,
  bevelThickness: 0.06,
  bevelSize: 0.045,
};

const dustPositions = Float32Array.from({ length: 114 }, (_, index) => {
  const mark = random(`ceremony-fleck:${index}`);
  switch (index % 3) {
    case 0:
      return mark * 46 - 23;
    case 1:
      return mark * 10 - 0.8;
    default:
      return -mark * 29 - 9;
  }
});

const bluePalette = {
  darkness: "#0B1124",
  ground: "#17233D",
  alloy: "#587399",
  inset: "#23354F",
  emission: "#448ED7",
  key: "#BEDDFB",
  fill: "#88BDFF",
  beam: "#507ACC",
};

const warmPalette = {
  darkness: "#170E10",
  ground: "#2A1B18",
  alloy: "#AA7847",
  inset: "#543627",
  emission: "#E9A959",
  key: "#FFF0D6",
  fill: "#FFC181",
  beam: "#DE8438",
};

const cyanPalette = {
  ...bluePalette,
  emission: "#35BCDA",
  beam: "#528CF2",
  fill: "#87E8F3",
};

type Palette = typeof bluePalette;

const useStagePhase = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (fullTurn * frame) / durationInFrames;
};

const CameraMove = ({ mode }: { readonly mode: Mode }) => {
  const { camera } = useThree();
  const phase = useStagePhase();
  const push = 0.5 - Math.cos(phase) / 2;

  useLayoutEffect(() => {
    const dolly = mode === "opening" ? 1.2 : mode === "ending" ? -1.3 : 0.86;
    const orbit = mode === "ms" ? 1.68 : 1.08;
    camera.position.set(
      Math.sin(phase) * orbit,
      2.7 + push * 0.43,
      12.8 - push * dolly,
    );
    camera.lookAt(0, 1.5, -16);
  }, [camera, mode, phase, push]);

  return null;
};

const shaftVertex = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
  }
`;

const shaftFragment = `
  uniform vec3 tint;
  varying vec2 vUv;
  void main() {
    float edge = abs(vUv.x - .5) / mix(.5, .105, vUv.y);
    float softness = 1. - smoothstep(.16, 1., edge);
    float bloom = smoothstep(.0, .7, vUv.y) * (1. - smoothstep(.9, 1., vUv.y));
    gl_FragColor = vec4(tint, .22 * softness * bloom);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const LightShafts = ({ color }: { readonly color: string }) => {
  const uniforms = useMemo(
    () => ({ tint: { value: new Color(color) } }),
    [color],
  );

  return (
    <group>
      {sides.map((side) => (
        <mesh
          key={side}
          position={[side * 12.2, 3.45, -18]}
          rotation={[0, 0, side * -0.35]}
        >
          <planeGeometry args={[8, 13]} />
          <shaderMaterial
            vertexShader={shaftVertex}
            fragmentShader={shaftFragment}
            uniforms={uniforms}
            side={DoubleSide}
            transparent
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
};

const StageDeck = ({ palette }: { readonly palette: Palette }) => (
  <group>
    <mesh position={[0, -1.43, -15]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[92, 75]} />
      <meshPhongMaterial
        color={palette.ground}
        shininess={52}
        specular="#50515C"
      />
    </mesh>
    <mesh position={[0, -1.27, -10]} scale={[1.2, 1, 0.64]}>
      <cylinderGeometry args={[7.25, 7.8, 0.4, 52]} />
      <meshPhongMaterial
        color={palette.inset}
        shininess={60}
        specular={palette.key}
      />
    </mesh>
    <mesh
      position={[0, -1.04, -10]}
      rotation={[Math.PI / 2, 0, 0]}
      scale={[1.2, 0.64, 1]}
    >
      <torusGeometry args={[7.27, 0.027, 5, 52]} />
      <meshBasicMaterial color={palette.emission} />
    </mesh>
    {sides.map((side) => (
      <mesh
        key={side}
        position={[side * 11.4, -1.38, -12]}
        rotation={[0, side * 0.09, 0]}
      >
        <boxGeometry args={[0.1, 0.04, 45]} />
        <meshBasicMaterial
          color={palette.emission}
          transparent
          opacity={0.55}
        />
      </mesh>
    ))}
  </group>
);

const WingArchitecture = ({
  palette,
  mode,
}: {
  readonly palette: Palette;
  readonly mode: Mode;
}) => (
  <group>
    {sides.map((side) => (
      <group key={side}>
        {levels.map((index) => {
          const x = side * (10.4 + index * 2.05);
          const y = 0.82 + index * 0.33;
          const z = -5 - index * 4.2;
          const slant = mode === "ms" ? -0.27 : mode === "cw" ? 0.06 : -0.13;
          const h = 4.65 + index * 0.44;
          return (
            <group
              key={index}
              position={[x, y, z]}
              rotation={[0, side * (0.17 + index * 0.07), side * slant]}
            >
              <mesh
                position={[0, 0, -0.85]}
                scale={[0.76, h, mode === "ms" ? 2.9 : 2.05]}
              >
                <extrudeGeometry args={[finProfile, finExtrusion]} />
                <meshPhongMaterial
                  color={palette.alloy}
                  shininess={84}
                  specular={palette.key}
                />
              </mesh>
              <mesh position={[side * -0.42, 0.13, 0.8]}>
                <boxGeometry args={[0.065, h * 0.9, 0.045]} />
                <meshBasicMaterial color={palette.emission} />
              </mesh>
            </group>
          );
        })}
        <mesh
          position={[side * 24, 3.4, -12]}
          rotation={[0, side * -0.19, side * 0.03]}
        >
          <boxGeometry args={[2.3, 15, 30]} />
          <meshLambertMaterial color={palette.inset} />
        </mesh>
      </group>
    ))}
  </group>
);

const CeremonySculpture = ({
  palette,
  mode,
}: {
  readonly palette: Palette;
  readonly mode: Mode;
}) => {
  const phase = useStagePhase();
  const turn = Math.sin(phase);
  const lift = 0.5 - Math.cos(phase) / 2;

  if (mode === "quiz") {
    return (
      <group>
        {sides.map((side) => (
          <group
            key={side}
            position={[side * 11.8, 1.9 + lift * 0.81, -8.2]}
            rotation={[0.34 + turn * 0.26, phase + side * 0.6, side * 0.22]}
          >
            <mesh>
              <icosahedronGeometry args={[2.15, 0]} />
              <meshPhongMaterial
                color={palette.alloy}
                shininess={104}
                specular={palette.key}
                flatShading
              />
            </mesh>
            <mesh scale={1.018}>
              <icosahedronGeometry args={[2.15, 0]} />
              <meshBasicMaterial
                wireframe
                color={palette.emission}
                transparent
                opacity={0.65}
              />
            </mesh>
          </group>
        ))}
      </group>
    );
  }

  const schedule = mode === "schedule";
  const compoundArc = mode === "opening" || mode === "ending";
  const wideArc = mode === "cw" || compoundArc;
  const radius = wideArc ? 6.6 : 5.5;

  return (
    <group>
      {sides.map((side) => (
        <group
          key={side}
          position={[
            side * (schedule ? 15.8 : 9.4),
            schedule ? 1.5 : 1.85,
            -13.5,
          ]}
          rotation={[
            0.1 + turn * 0.12,
            side * (0.43 + lift * 0.16),
            side * -0.1,
          ]}
        >
          {lightBands.map((index) => (
            <group
              key={index}
              position={[side * index * 0.34, 0, -index * 0.64]}
              scale={[side, 1, 1]}
              rotation={[
                0,
                0,
                side * ((wideArc ? 0.37 : -0.11) + 0.05 * turn + index * 0.2),
              ]}
            >
              <mesh>
                <torusGeometry
                  args={[
                    radius + index * 0.65,
                    0.12 + index * 0.045,
                    7,
                    34,
                    schedule ? 1.12 : 1.48,
                  ]}
                />
                <meshPhongMaterial
                  color={palette.alloy}
                  shininess={86}
                  specular={palette.key}
                />
              </mesh>
              <mesh position={[0, 0, 0.07]}>
                <torusGeometry
                  args={[
                    radius + index * 0.65,
                    0.032,
                    5,
                    32,
                    schedule ? 0.66 : 0.98,
                  ]}
                />
                <meshBasicMaterial
                  color={palette.emission}
                  transparent
                  opacity={0.84 - index * 0.16}
                />
              </mesh>
            </group>
          ))}
        </group>
      ))}
    </group>
  );
};

const Flecks = ({ color }: { readonly color: string }) => (
  <points>
    <bufferGeometry>
      <primitive
        attach="attributes-position"
        object={new Float32BufferAttribute(dustPositions, 3)}
      />
    </bufferGeometry>
    <pointsMaterial
      color={color}
      size={0.074}
      transparent
      depthWrite={false}
      opacity={0.34}
    />
  </points>
);

export const CeremonySpace = ({ mode, gold = false }: CeremonySpaceProps) => {
  const { width, height } = useVideoConfig();
  const palette = gold
    ? warmPalette
    : mode === "quiz"
      ? cyanPalette
      : bluePalette;

  return (
    <AbsoluteFill
      aria-hidden="true"
      style={{ overflow: "hidden", pointerEvents: "none" }}
    >
      <ThreeCanvas
        width={surfaceWidth}
        height={surfaceHeight}
        dpr={1}
        camera={{ fov: 41, position: [0, 2.7, 12.8], near: 0.5, far: 95 }}
        gl={{ alpha: false, antialias: true, powerPreference: "low-power" }}
        style={{
          transformOrigin: "top left",
          transform: `scale(${width / surfaceWidth}, ${height / surfaceHeight})`,
        }}
      >
        <color attach="background" args={[palette.darkness]} />
        <fog attach="fog" args={[palette.darkness, 15, 57]} />
        <hemisphereLight args={[palette.key, "#10172B", 1.0]} />
        <directionalLight
          position={[3, 8, 5]}
          color={palette.key}
          intensity={2.4}
        />
        <pointLight
          position={[-13, 3, -11]}
          color={palette.fill}
          intensity={225}
          distance={18}
        />
        <pointLight
          position={[16, 2, -17]}
          color={palette.fill}
          intensity={172}
          distance={20}
        />
        <CameraMove mode={mode} />
        <StageDeck palette={palette} />
        <WingArchitecture mode={mode} palette={palette} />
        <CeremonySculpture mode={mode} palette={palette} />
        <LightShafts color={palette.beam} />
        <Flecks color={palette.fill} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
