import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

const drift = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.bezier(0.22, 1, 0.36, 1),
} as const;

type Props = {
  shot: "macro" | "hall" | "trophy" | "finale";
  mirror?: boolean;
  warm?: boolean;
  holdAt?: number;
};

export const CeremonyPhotography = ({
  shot,
  mirror = false,
  warm = false,
  holdAt = 28,
}: Props) => {
  const frame = useCurrentFrame();
  const move = interpolate(frame, [0, holdAt], [0, 1], drift);
  const macro = shot === "macro";
  const scale = macro
    ? interpolate(move, [0, 1], [1.39, 1.12])
    : interpolate(move, [0, 1], [1.13, 1.045]);
  const x = (1 - move) * (macro ? -6 : 2.1);

  return (
    <AbsoluteFill
      aria-hidden="true"
      style={{
        backgroundColor: "#070a12",
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <Img
        alt=""
        src={staticFile(`assets/ceremony-cut/${shot}.jpg`)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 54%",
          transformOrigin: mirror ? "50% 54%" : "72% 54%",
          transform: `translateX(${mirror ? -x : x}%) scale(${mirror ? -scale : scale}, ${scale})`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            shot === "finale"
              ? "radial-gradient(ellipse at 50% 48%,#f4efe7bd,#f4efe72e 66%,transparent)"
              : macro
                ? "linear-gradient(12deg,#080b15a0,transparent 66%),linear-gradient(90deg,#05091560,transparent 50%)"
                : mirror
                  ? "linear-gradient(270deg,#080c17c5,#080c1760 51%,transparent 80%)"
                  : "linear-gradient(90deg,#080c17c5,#080c1760 51%,transparent 80%)",
        }}
      />
      {warm && (
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at 76% 52%,#e3a6572d,transparent 55%),linear-gradient(180deg,#1c120922,transparent)",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
