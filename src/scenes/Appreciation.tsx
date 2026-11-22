import {
  AbsoluteFill,
  Easing,
  Img,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const easeOut = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.bezier(0.22, 1, 0.36, 1),
} as const;

const clamped = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const Appreciation = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const seconds = frame / fps;
  const shadow = interpolate(
    seconds,
    [0, 1.05, 2.5, 4.1],
    [0.65, 0.13, 0.22, 0.9],
    clamped,
  );
  const imageScale = interpolate(
    seconds,
    [0, 2, 4.25, 8],
    [1.29, 1.21, 1.075, 1.035],
    clamped,
  );
  const drift = interpolate(seconds, [0, 2.4, 8], [-2.3, -0.55, 0.45], clamped);
  const fadeAt = (durationInFrames - 1) / fps;

  return (
    <AbsoluteFill style={{ background: "#17100E", overflow: "hidden" }}>
      <Img
        alt=""
        src={staticFile("assets/ceremony-cut/craft.jpg")}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 54%",
          transformOrigin: "76% 55%",
          scale: imageScale,
          translate: `${drift}cqw 0px`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, #100C0BF0 5%, #100C0BD9 34%, #100C0B75 56%, #100C0B00 82%), linear-gradient(0deg, #100C0BC2 0%, #100C0B00 39%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 76% 49%, transparent 13%, #100A0B48 58%, #100A0BE5 100%)",
          opacity: shadow,
        }}
      />
      <div
        lang="ko"
        style={{
          position: "absolute",
          inset: "15% 40% 15% 8%",
          display: "grid",
          placeContent: "center start",
          gap: "3.1cqh",
          color: "#FFF6E9",
          textShadow: "0 0.25cqh 1.4cqh #110A08",
          opacity: interpolate(seconds, [7.48, fadeAt], [1, 0.77], clamped),
        }}
      >
        <Interactive.Div
          name="현장의 공로"
          style={{
            opacity: interpolate(seconds, [1.78, 2.75], [0, 1], easeOut),
            translate: interpolate(
              seconds,
              [1.78, 2.75],
              ["0px 1.6cqh", "0px 0cqh"],
              easeOut,
            ),
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#E7BE8D",
              fontSize: "5.4cqh",
              fontWeight: 620,
              lineHeight: 1.18,
              wordBreak: "keep-all",
            }}
          >
            기술을 현실로 만든 모든 손길에
          </p>
        </Interactive.Div>
        <Interactive.Div
          name="한 해의 노고에 전하는 감사 인사"
          style={{
            clipPath: `inset(0 0 ${interpolate(
              seconds,
              [2.87, 3.86],
              [100, 0],
              easeOut,
            )}% 0)`,
            translate: interpolate(
              seconds,
              [2.87, 3.86],
              ["0px 2.4cqh", "0px 0cqh"],
              easeOut,
            ),
            paddingBlock: "0.6cqh",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "9.1cqh",
              fontWeight: 800,
              lineHeight: 1.13,
              letterSpacing: "-0.052em",
              wordBreak: "keep-all",
            }}
          >
            한 해 동안 고생 많으셨습니다.
          </h2>
        </Interactive.Div>
      </div>
    </AbsoluteFill>
  );
};
