import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

export type GalaBackdropVariant = "schedule" | "awards" | "category" | "grand";

const cameraEase = {
  easing: Easing.bezier(0.22, 1, 0.36, 1),
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const looks = {
  schedule: {
    file: "stage.jpg",
    base: "#0c0906",
    position: "center 58%",
    origin: "83% 61%",
    scale: [1.035, 1],
    pan: ["-0.2% 0%", "0% 0%"],
    grade: "brightness(1.02) saturate(1.03)",
    shade:
      "linear-gradient(90deg, #080604ba, #08060479 32%, #08060421 58%, transparent 76%), linear-gradient(0deg, #08060446, transparent 29%)",
  },
  awards: {
    file: "awards.jpg",
    base: "#0a0806",
    position: "center 66%",
    origin: "50% 69%",
    scale: [1.055, 1.018],
    pan: ["-0.9% 0%", "0% 0%"],
    grade: "brightness(0.84) saturate(0.81)",
    shade:
      "linear-gradient(90deg, #0907052b 5%, #09070596 44%, #0907058f 58%, transparent 84%), linear-gradient(0deg, #09070565, transparent 42%)",
  },
  category: {
    file: "stage.jpg",
    base: "#0e0a07",
    position: "center 48%",
    origin: "72% 42%",
    scale: [1.045, 1.075],
    pan: ["0% 0%", "1.35% 0%"],
    grade: "brightness(0.94) saturate(0.93)",
    shade:
      "linear-gradient(90deg, #0c0806a1 4%, #0c08068c 47%, #0c080638 66%, transparent 84%), linear-gradient(0deg, #0c080664, transparent 42%)",
  },
  grand: {
    file: "trophy.jpg",
    base: "#050810",
    position: "center 56%",
    origin: "84% 57%",
    scale: [1.032, 1.005],
    pan: ["0.25% 0%", "0% 0%"],
    grade: "brightness(1.02) saturate(1.02)",
    shade:
      "linear-gradient(90deg, #05070ec0, #05070e87 42%, #05070e30 63%, transparent 76%), linear-gradient(0deg, #05070e3d, transparent 27%)",
  },
} as const;

export const GalaBackdrop = ({ variant }: { variant: GalaBackdropVariant }) => {
  const frame = useCurrentFrame();
  const look = looks[variant];

  return (
    <AbsoluteFill
      aria-hidden="true"
      style={{
        backgroundColor: look.base,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <Img
        name="시상식 무대 배경"
        alt=""
        src={staticFile(`assets/gala-cut/${look.file}`)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: look.position,
          transformOrigin: look.origin,
          scale: interpolate(frame, [0, 40], look.scale, cameraEase),
          translate: interpolate(frame, [0, 40], look.pan, cameraEase),
          filter: look.grade,
        }}
      />
      <AbsoluteFill style={{ background: look.shade }} />
    </AbsoluteFill>
  );
};
