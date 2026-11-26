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
import { festivalAwards } from "../data/award-roster";

type Code = "CW" | "MS";

type Shot = {
  readonly file: string;
  readonly focal: string;
  readonly from: number;
  readonly to: number;
  readonly pan: number;
  readonly grade: string;
};

const profiles = {
  CW: {
    subtitle: "CW PRODUCTION DIVISION",
    accent: "#B7DBF5",
    flare: "#FFE2BB",
    shots: [
      {
        file: "gala-cut/radar.jpg",
        focal: "73% 39%",
        from: 1.02,
        to: 1.046,
        pan: -0.76,
        grade: "saturate(.87) contrast(1.035)",
      },
      {
        file: "gala-cut/ciws.jpg",
        focal: "75% 54%",
        from: 1.061,
        to: 1.02,
        pan: -0.38,
        grade: "saturate(.88) contrast(1.07)",
      },
    ],
  },
  MS: {
    subtitle: "MISSILE SYSTEM PRODUCTION DIVISION",
    accent: "#BFDFFA",
    flare: "#DAECFF",
    shots: [
      {
        file: "gala-cut/launch.jpg",
        focal: "74% 55%",
        from: 1.031,
        to: 1.102,
        pan: -1.6,
        grade: "saturate(.91) contrast(1.055)",
      },
      {
        file: "gala-cut/aerospace.jpg",
        focal: "74% 51%",
        from: 1.06,
        to: 1.023,
        pan: -0.45,
        grade: "saturate(.85) contrast(1.065)",
      },
    ],
  },
} as const satisfies Record<
  Code,
  {
    readonly subtitle: string;
    readonly accent: string;
    readonly flare: string;
    readonly shots: readonly [Shot, Shot];
  }
>;

const limits = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dissolve = {
  ...limits,
  easing: Easing.bezier(0.37, 0.04, 0.26, 0.99),
};
const rise = { ...limits, easing: Easing.bezier(0.19, 0.73, 0.24, 1) };

const FilmPlate = ({
  shot,
  progress,
  opacity,
}: {
  readonly shot: Shot;
  readonly progress: number;
  readonly opacity: number;
}) => (
  <Img
    src={staticFile(`assets/${shot.file}`)}
    alt=""
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: shot.focal,
      transformOrigin: shot.focal,
      scale: interpolate(progress, [0, 1], [shot.from, shot.to], limits),
      translate: `${interpolate(progress, [0, 1], [0, shot.pan], limits)}% 0`,
      opacity,
      filter: shot.grade,
    }}
  />
);

export const GalaInstituteBroll = ({ code }: { readonly code: Code }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const profile = profiles[code];
  const [first, second] = profile.shots;
  const cut = Math.round(durationInFrames / 2);
  const cross = Math.max(2, Math.round(fps * 0.19));
  const mix = interpolate(frame, [cut - cross, cut + cross], [0, 1], dissolve);
  const light = interpolate(
    frame,
    [cut - cross - 2, cut + 1, cut + cross + 3],
    [0, 0.68, 0],
    dissolve,
  );

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#090f17" }}>
      <FilmPlate
        shot={first}
        progress={interpolate(frame, [0, cut + cross], [0, 1], limits)}
        opacity={1}
      />
      <FilmPlate
        shot={second}
        progress={interpolate(
          frame,
          [cut - cross, durationInFrames - 1],
          [0, 1],
          limits,
        )}
        opacity={mix}
      />
      <AbsoluteFill
        aria-hidden="true"
        style={{
          background: `radial-gradient(ellipse 31% 44% at 74% 51%, ${profile.flare}55, transparent 81%)`,
          opacity: light,
          translate: `${interpolate(
            frame,
            [cut - cross - 2, cut + cross + 3],
            [-4, 5],
            limits,
          )}% -1%`,
        }}
      />
      <AbsoluteFill
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(90deg,#070E1BEE 0%,#0A1322D1 26%,#0A132275 49%,#10192520 70%,#070D1824 100%), linear-gradient(0deg,#0C111B62 0%,transparent 28%,transparent 77%,#0A0F164A 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "flex-start",
          paddingLeft: "9cqw",
        }}
      >
        <div
          style={{
            width: "53cqw",
            opacity: interpolate(frame, [fps * 0.16, fps * 0.82], [0, 1], rise),
            translate: interpolate(
              frame,
              [fps * 0.16, fps * 0.82],
              ["-1.2cqw 0px", "0cqw 0px"],
              rise,
            ),
            textShadow: "0 0.5cqh 2.8cqh #05070DEC",
          }}
        >
          <Interactive.Div
            name="연구소 영문 표기"
            style={{
              color: profile.accent,
              fontSize: "3.95cqh",
              fontWeight: 730,
              letterSpacing: ".13em",
              lineHeight: 1.25,
            }}
          >
            {profile.subtitle}
          </Interactive.Div>
          <div
            aria-hidden="true"
            style={{
              width: "8.2cqw",
              height: "0.24cqh",
              margin: "2.7cqh 0 3.35cqh",
              background: `linear-gradient(90deg,${profile.accent},transparent)`,
              transformOrigin: "left",
              scale: `${interpolate(frame, [fps * 0.29, fps * 0.95], [0, 1], rise)} 1`,
            }}
          />
          <Interactive.H1
            name="연구소명"
            style={{
              margin: 0,
              color: "#F8FAFD",
              fontSize: "11.35cqh",
              fontWeight: 850,
              letterSpacing: "-.055em",
              lineHeight: 1.16,
              whiteSpace: "nowrap",
            }}
          >
            {festivalAwards[code].name}
          </Interactive.H1>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
