import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { useLayoutEffect, useMemo, useRef } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  DoubleSide,
  Float32BufferAttribute,
  Object3D,
  Path,
  Shape,
  Vector3,
  type InstancedMesh,
  type Mesh,
  type ShaderMaterial,
} from "three";

export const quizPopFrame = 40;

const surfaceWidth = 748;
const surfaceHeight = 400;
const slotWidth = 0.51;
const boxWidth = 2.69;
const boxDepth = 2.45;
const boxBase = -1.13;
const boxHeight = 2.1;
const boxTop = boxBase + boxHeight;
const lidThickness = 0.29;
const ribbonWidth = 0.44;
const tau = 2 * Math.PI;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const glide = { ...clamp, easing: Easing.bezier(0.19, 0.74, 0.29, 1) };

type Vec = [number, number, number];

const roundedOutline = (path: Path, w: number, h: number, radius: number) => {
  const x = w / 2;
  const z = h / 2;
  path.moveTo(-x + radius, -z);
  path.lineTo(x - radius, -z);
  path.quadraticCurveTo(x, -z, x, -z + radius);
  path.lineTo(x, z - radius);
  path.quadraticCurveTo(x, z, x - radius, z);
  path.lineTo(-x + radius, z);
  path.quadraticCurveTo(-x, z, -x, z - radius);
  path.lineTo(-x, -z + radius);
  path.quadraticCurveTo(-x, -z, -x + radius, -z);
  path.closePath();
};

const shell = new Shape();
roundedOutline(shell, boxWidth, boxDepth, 0.11);
const well = new Path();
roundedOutline(well, boxWidth - 0.26, boxDepth - 0.26, 0.09);
shell.holes.push(well);

const cover = new Shape();
roundedOutline(cover, boxWidth + 0.12, boxDepth + 0.12, 0.13);

const extrude = {
  bevelEnabled: true,
  bevelThickness: 0.034,
  bevelSize: 0.026,
  bevelSegments: 2,
  curveSegments: 5,
};

const makeRibbon = (
  points: Vec[],
  width: number,
  twist: number,
  steps: number,
) => {
  const curve = new CatmullRomCurve3(
    points.map(([x, y, z]) => new Vector3(x, y, z)),
  );
  const positions: number[] = [];
  const triangles: number[] = [];

  for (let index = 0; index <= steps; index++) {
    const t = index / steps;
    const point = curve.getPoint(t);
    const degrees = twist * Math.sin(t * Math.PI);
    const half = width * (0.35 + 0.15 * Math.sin(t * Math.PI));
    for (const side of [-1, 1]) {
      positions.push(
        point.x,
        point.y + Math.sin(degrees) * half * side,
        point.z + Math.cos(degrees) * half * side,
      );
    }
    if (index < steps) {
      const vertex = index * 2;
      triangles.push(
        vertex,
        vertex + 1,
        vertex + 2,
        vertex + 1,
        vertex + 3,
        vertex + 2,
      );
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setIndex(triangles);
  geometry.computeVertexNormals();
  return geometry;
};

const bowLoops = ([-1, 1] as const).map((side) =>
  makeRibbon(
    [
      [0, 0, 0.06],
      [side * 0.51, 0.48, -0.04],
      [side * 1.05, 0.73, -0.09],
      [side * 1.29, 0.56, -0.17],
      [side * 1.12, 0.31, -0.2],
      [side * 0.56, 0.15, -0.09],
      [0, 0.025, 0.06],
    ],
    0.67,
    side * 0.78,
    30,
  ),
);

const bowEnds = ([-1, 1] as const).map((side) =>
  makeRibbon(
    [
      [0, 0.08, 0.13],
      [side * 0.43, 0.19, 0.76],
      [side * 0.66, 0.05, 1.08],
      [side * 0.91, -0.21, 1.22],
      [side * 1.07, -0.29, 1.26],
    ],
    0.34,
    side * 0.43,
    20,
  ),
);

const curl = makeRibbon(
  [
    [-0.17, 0.07, 0],
    [-0.06, 0.12, 0],
    [0.08, 0.05, 0],
    [0.13, -0.045, 0],
    [0.07, -0.1, 0],
    [0, -0.03, 0],
  ],
  0.058,
  0.23,
  14,
);

const satinGold = "#C08935";
const lightGold = "#FFF0C8";
const coal = "#28262A";

const Gold = ({ warm = false }: { readonly warm?: boolean }) => (
  <meshPhongMaterial
    color={warm ? "#AA6C24" : satinGold}
    specular={lightGold}
    shininess={72}
    side={DoubleSide}
  />
);

const Black = () => (
  <meshPhongMaterial color={coal} specular="#5D4C3E" shininess={49} />
);

const Bands = ({
  y,
  height,
  margin = 0,
}: {
  readonly y: number;
  readonly height: number;
  readonly margin?: number;
}) => (
  <group>
    {[-1, 1].map((side) => (
      <group key={side}>
        <mesh position={[0, y, side * (boxDepth / 2 + margin + 0.02)]}>
          <boxGeometry args={[ribbonWidth, height, 0.034]} />
          <Gold />
        </mesh>
        <mesh position={[side * (boxWidth / 2 + margin + 0.02), y, 0]}>
          <boxGeometry args={[0.034, height, ribbonWidth]} />
          <Gold warm />
        </mesh>
      </group>
    ))}
  </group>
);

const Base = () => (
  <group>
    <mesh position={[0, boxBase, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <extrudeGeometry args={[shell, { ...extrude, depth: boxHeight }]} />
      <Black />
    </mesh>
    <mesh position={[0, boxBase + 0.08, 0]}>
      <boxGeometry args={[boxWidth - 0.11, 0.2, boxDepth - 0.1]} />
      <meshPhongMaterial color="#0A090B" specular="#493222" shininess={43} />
    </mesh>
    <Bands y={boxBase + boxHeight / 2} height={boxHeight + 0.02} />
  </group>
);

const Lid = () => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <extrudeGeometry args={[cover, { ...extrude, depth: lidThickness }]} />
      <Black />
    </mesh>
    <Bands y={lidThickness / 2} height={lidThickness + 0.03} margin={0.06} />
    <mesh position={[0, lidThickness + 0.036, 0]}>
      <boxGeometry args={[ribbonWidth, 0.02, boxDepth + 0.16]} />
      <Gold />
    </mesh>
    <mesh position={[0, lidThickness + 0.045, 0]}>
      <boxGeometry args={[boxWidth + 0.16, 0.02, ribbonWidth]} />
      <Gold warm />
    </mesh>
    <group position={[0, lidThickness + 0.07, 0]}>
      {bowLoops.map((geometry, index) => (
        <mesh key={index} geometry={geometry}>
          <Gold warm={index === 0} />
        </mesh>
      ))}
      {bowEnds.map((geometry, index) => (
        <mesh key={index} geometry={geometry}>
          <Gold />
        </mesh>
      ))}
      <mesh
        scale={[0.24, 0.145, 0.26]}
        position={[0, 0.095, 0.02]}
        rotation={[0, 0.15, 0.2]}
      >
        <sphereGeometry args={[1, 14, 8]} />
        <Gold />
      </mesh>
    </group>
  </group>
);

const confetti = Array.from({ length: 53 }, (_, index) => {
  const sample = (property: string) => random(`gift:${index}:${property}`);
  const angle = sample("angle") * tau;
  const rate = 0.61 + sample("rate") * 2.25;
  return {
    angle,
    horizontal: Math.cos(angle) * rate,
    depth: Math.sin(angle) * rate,
    elevation: 1.9 + 3.2 * sample("elevation"),
    delay: sample("delay") * 0.13,
    size: 0.48 + sample("size") * 0.96,
    twist: sample("twist") * tau,
    length: 0.95 + sample("length") * 0.7,
  };
});

const Confetti = ({ time }: { readonly time: number }) => {
  const cards = useRef<InstancedMesh>(null);
  const ribbons = useRef<InstancedMesh>(null);
  const tmp = useMemo(() => new Object3D(), []);

  useLayoutEffect(() => {
    if (!cards.current || !ribbons.current) return;
    for (const [index, piece] of confetti.entries()) {
      const t = Math.max(0, time - piece.delay);
      const spread = 1 - Math.exp(-2.2 * t);
      const flying = interpolate(
        t,
        [0, 0.12, piece.length - 0.32, piece.length],
        [0, 1, 0.85, 0],
        clamp,
      );
      const size = t > 0 ? piece.size * flying : 0;
      const y = boxTop + piece.elevation * t - 3.08 * t ** 2;
      tmp.position.set(
        piece.horizontal * spread * 1.24 + 0.1 * Math.sin(t * 7 + piece.angle),
        y,
        piece.depth * spread + 0.18 * Math.sin(t * 5 + piece.angle),
      );
      tmp.rotation.set(
        piece.twist + t * 5.8,
        piece.angle + t * 3.9,
        piece.twist * 0.31 + t * 4.45,
      );
      tmp.scale.set(size, size, size);
      tmp.updateMatrix();
      if (index < 42) cards.current.setMatrixAt(index, tmp.matrix);
      else ribbons.current.setMatrixAt(index - 42, tmp.matrix);
    }
    cards.current.instanceMatrix.needsUpdate = true;
    ribbons.current.instanceMatrix.needsUpdate = true;
  }, [time, tmp]);

  return (
    <group visible={time > 0 && time < 1.66}>
      <instancedMesh
        ref={cards}
        args={[undefined, undefined, 42]}
        frustumCulled={false}
      >
        <planeGeometry args={[0.125, 0.062]} />
        <Gold />
      </instancedMesh>
      <instancedMesh
        ref={ribbons}
        args={[curl, undefined, 11]}
        frustumCulled={false}
      >
        <Gold warm />
      </instancedMesh>
    </group>
  );
};

const glowVertex = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const glowFragment = `
  varying vec2 vUv;
  uniform vec3 amber;
  uniform vec3 champagne;
  uniform float flare;
  uniform float settled;
  void main() {
    vec2 p = vUv - 0.5;
    float d = length(p);
    float a = atan(p.y, p.x);
    float core = exp(-d * 21.0);
    float halo = pow(max(0.0, 1.0 - d * 2.05), 3.7);
    float spikes = pow(max(0.0, cos(a * 5.0 + 0.22)), 17.0);
    float rays = spikes * exp(-d * 7.1) * smoothstep(0.0, 0.03, d);
    float opacity = (core * .82 + halo * .5 + rays * .36) * flare + halo * settled;
    gl_FragColor = vec4(mix(amber, champagne, core), min(0.96, opacity));
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const Aperture = ({ time }: { readonly time: number }) => {
  const mesh = useRef<Mesh>(null);
  const shader = useRef<ShaderMaterial>(null);
  const { camera } = useThree();
  const uniforms = useMemo(
    () => ({
      amber: { value: new Color("#FFBC55") },
      champagne: { value: new Color("#FFF3D5") },
      flare: { value: 0 },
      settled: { value: 0 },
    }),
    [],
  );
  const flare = interpolate(
    time,
    [0, 0.125, 0.37, 0.95],
    [0, 1, 0.58, 0],
    clamp,
  );
  const shine = interpolate(time, [0, 0.3, 1.15], [0, 0.27, 0.15], clamp);

  useLayoutEffect(() => {
    if (shader.current) {
      shader.current.uniforms.flare.value = flare;
      shader.current.uniforms.settled.value = shine;
    }
    mesh.current?.quaternion.copy(camera.quaternion);
  }, [camera, flare, shine]);

  return (
    <group visible={time > 0}>
      <mesh ref={mesh} position={[-0.13, boxTop + 0.28, 0.31]}>
        <planeGeometry args={[5.8, 5.8]} />
        <shaderMaterial
          ref={shader}
          uniforms={uniforms}
          vertexShader={glowVertex}
          fragmentShader={glowFragment}
          transparent
          depthTest={false}
          depthWrite={false}
        />
      </mesh>
      <pointLight
        position={[0, boxTop + 0.26, 0.24]}
        color="#FFDCA3"
        intensity={flare * 38 + shine * 78}
        distance={5.5}
      />
    </group>
  );
};

const Lens = () => {
  const { camera } = useThree();
  useLayoutEffect(() => {
    camera.lookAt(0, 1.33, 0);
  }, [camera]);
  return null;
};

const GiftScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps - quizPopFrame / 30;
  const before = interpolate(time, [-0.48, -0.12, 0], [0, 1, 0], clamp);
  const impact = time > 0 ? Math.exp(-6.7 * time) * Math.sin(time * 16) : 0;
  const lift = interpolate(
    time,
    [0, 0.36, 0.74, 1.27],
    [0, 1.63, 1.43, 1.51],
    glide,
  );
  const offset = interpolate(time, [0, 0.4, 1.13], [0, 0.65, 0.57], glide);
  const pitch = interpolate(time, [0, 0.34, 0.93], [0, -0.46, -0.31], glide);
  const roll = interpolate(
    time,
    [0, 0.3, 0.9, 1.35],
    [0, -0.43, -0.32, -0.35],
    glide,
  );
  const opening = interpolate(time, [0, 0.47], [0, 0.38], glide);

  return (
    <>
      <Lens />
      <hemisphereLight args={["#FFF5E5", "#3F3541", 1.22]} />
      <ambientLight color="#E1C4AA" intensity={0.32} />
      <directionalLight
        position={[-2, 6, 6]}
        color="#FFF0DA"
        intensity={2.62}
      />
      <directionalLight position={[4, 2, 0]} color="#FFD493" intensity={1.5} />
      <pointLight
        position={[-2.6, 2.9, -3.5]}
        color="#D08B3F"
        intensity={48}
        distance={9}
      />
      <group rotation={[0, -0.13 - before * 0.045 + impact * 0.026, 0]}>
        <group position={[0, -before * 0.045 + impact * 0.065, 0]}>
          <Base />
        </group>
        <group
          position={[offset, boxTop + lift - before * 0.065, -offset * 0.37]}
          rotation={[pitch, opening, roll + before * 0.025]}
        >
          <Lid />
        </group>
        <Confetti time={time} />
        <Aperture time={time} />
      </group>
    </>
  );
};

export const QuizGift = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill
      aria-hidden="true"
      style={{ pointerEvents: "none", overflow: "hidden" }}
    >
      <ThreeCanvas
        width={surfaceWidth}
        height={surfaceHeight}
        dpr={1}
        camera={{ fov: 39, position: [3.8, 2.94, 8.7], near: 0.1, far: 34 }}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        style={{
          transformOrigin: "top left",
          transform: `scale(${(slotWidth * width) / surfaceWidth}, ${height / surfaceHeight})`,
        }}
      >
        <GiftScene />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
