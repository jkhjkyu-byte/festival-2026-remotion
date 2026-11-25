import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { festivalCopy } from "../data/production";
import { QuizGift, quizPopFrame } from "../three/QuizGift";

const porcelain = "#F5F4F1";
const ice = "#C4D4E1";
const easeOut = {
  easing: Easing.bezier(0.23, 1, 0.36, 1),
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const textArea: CSSProperties = {
  position: "absolute",
  inset: "12% 8%",
  color: porcelain,
};

const textShadow = "0 0.32cqh 1.4cqh #05070CDD";

const Reveal = ({
  name,
  from,
  to,
  children,
  style,
}: {
  readonly name: string;
  readonly from: number;
  readonly to: number;
  readonly children: ReactNode;
  readonly style?: CSSProperties;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <Interactive.Div
      name={name}
      style={{
        ...style,
        clipPath: `inset(0 0 ${interpolate(
          frame,
          [from * fps, to * fps],
          [100, 0],
          easeOut,
        )}% 0)`,
        translate: interpolate(
          frame,
          [from * fps, to * fps],
          ["0px 2.8cqh", "0px 0cqh"],
          easeOut,
        ),
        paddingBlock: "0.35cqh",
      }}
    >
      {children}
    </Interactive.Div>
  );
};

const Horizon = ({
  from,
  to,
}: {
  readonly from: number;
  readonly to: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      aria-hidden="true"
      style={{
        width: "11cqw",
        height: "0.16cqh",
        background:
          "linear-gradient(90deg, #CFDDEA, #99B3CA50 78%, transparent)",
        transformOrigin: "left center",
        scale: interpolate(frame, [from * fps, to * fps], [0, 1], easeOut),
      }}
    />
  );
};

const FilmTitle = ({
  start,
  ending,
  light = false,
}: {
  readonly start: number;
  readonly ending?: boolean;
  readonly light?: boolean;
}) => (
  <div
    style={{
      display: "grid",
      justifyItems: "center",
      textAlign: "center",
      alignContent: "center",
      gap: "2.7cqh",
      minWidth: 0,
    }}
  >
    <Reveal name="행사명" from={start} to={start + 0.85}>
      <h1
        lang="ko"
        style={{
          margin: 0,
          fontSize: ending ? "13.2cqh" : "15.4cqh",
          fontWeight: 830,
          letterSpacing: "-0.057em",
          lineHeight: 1.13,
          whiteSpace: "nowrap",
          color: light ? "#111a2b" : porcelain,
          textShadow: light ? "none" : textShadow,
        }}
      >
        {festivalCopy.title}
      </h1>
    </Reveal>
    <Horizon from={start + 0.27} to={start + 1.05} />
    <Reveal name="행사 슬로건" from={start + 0.49} to={start + 1.21}>
      <p
        lang="ko"
        style={{
          margin: 0,
          color: light ? "#37465a" : ice,
          fontSize: "5.15cqh",
          fontWeight: 610,
          letterSpacing: "0.01em",
          lineHeight: 1.3,
          textShadow: light ? "none" : textShadow,
        }}
      >
        {festivalCopy.slogan}
      </p>
    </Reveal>
  </div>
);

export const OpeningTitle = ({ from = 1.24 }: { from?: number }) => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse 43% 44% at 50% 48%, #0009, #0006 54%, transparent 100%)",
    }}
  >
    <div style={{ ...textArea, display: "grid", alignItems: "center" }}>
      <FilmTitle start={from} />
    </div>
  </AbsoluteFill>
);

type EventItem =
  (typeof festivalCopy.schedule)[keyof typeof festivalCopy.schedule];

const ScheduleDetails = ({
  event,
  from,
  lead,
}: {
  readonly event: EventItem;
  readonly from: number;
  readonly lead?: boolean;
}) => (
  <Reveal name={event.name} from={from} to={from + 0.68}>
    <div
      lang="ko"
      style={{
        display: "grid",
        alignContent: "center",
        rowGap: lead ? "1.65cqh" : "0.6cqh",
        textShadow,
      }}
    >
      <h3
        style={{
          margin: 0,
          lineHeight: 1.16,
          color: porcelain,
          fontWeight: 675,
          fontSize: lead ? "5.55cqh" : "4.15cqh",
          wordBreak: "keep-all",
        }}
      >
        {event.name}
      </h3>
      <div
        style={{
          color: porcelain,
          fontWeight: 795,
          fontSize: lead ? "8.1cqh" : "5.3cqh",
          letterSpacing: "-0.035em",
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1.15,
          whiteSpace: "nowrap",
        }}
      >
        {event.date}
      </div>
      <div
        style={{
          color: ice,
          fontWeight: 555,
          fontSize: lead ? "4.45cqh" : "3.65cqh",
          lineHeight: 1.24,
        }}
      >
        {event.place}
      </div>
    </div>
  </Reveal>
);

export const ScheduleTitle = () => (
  <AbsoluteFill
    style={{
      background:
        "linear-gradient(90deg, #0B0805BC 4%, #0B08056E 41%, #0B080578 71%, #0B08051F 100%)",
    }}
  >
    <div
      style={{
        ...textArea,
        display: "grid",
        gridTemplateRows: "auto 1fr",
        gap: "6.1cqh",
        insetBlock: "12% 10%",
      }}
    >
      <Reveal from={0.2} to={0.83} name="일정 제목">
        <h2
          lang="en"
          style={{
            margin: 0,
            color: porcelain,
            fontSize: "9.4cqh",
            letterSpacing: "-0.044em",
            fontWeight: 825,
            lineHeight: 1.04,
            textShadow,
          }}
        >
          FESTIVAL SCHEDULE
        </h2>
      </Reveal>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.13fr 1fr",
          gap: "4cqw",
        }}
      >
        <div
          style={{
            display: "grid",
            alignContent: "center",
            borderTop: "0.14cqh solid #ABBFD17A",
          }}
        >
          <ScheduleDetails
            event={festivalCopy.schedule.poster}
            from={0.67}
            lead
          />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateRows: "1fr 1fr",
          }}
        >
          <div
            style={{
              display: "grid",
              alignContent: "center",
              borderTop: "0.14cqh solid #ABBFD17A",
            }}
          >
            <ScheduleDetails event={festivalCopy.schedule.MS} from={1.0} />
          </div>
          <div
            style={{
              display: "grid",
              alignContent: "center",
              borderTop: "0.14cqh solid #ABBFD17A",
            }}
          >
            <ScheduleDetails event={festivalCopy.schedule.CW} from={1.33} />
          </div>
        </div>
      </div>
    </div>
  </AbsoluteFill>
);

const QuizInvitation = () => {
  const { fps } = useVideoConfig();
  const pop = quizPopFrame / fps;

  return (
    <div
      style={{
        ...textArea,
        left: "10%",
        right: "52%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
      }}
    >
      <Reveal
        name="퀴즈 제목"
        from={0.34}
        to={1.02}
        style={{
          color: "#F5DA9B",
          fontSize: "5.45cqh",
          fontWeight: 800,
          letterSpacing: "0.15em",
        }}
      >
        <span lang="en">QUIZ EVENT</span>
      </Reveal>
      <Reveal name="전시 포스터 퀴즈 참여" from={0.66} to={1.35}>
        <p
          style={{
            margin: "1.9cqh 0 0",
            color: "#F1EDE7",
            fontSize: "5.5cqh",
            fontWeight: 590,
            letterSpacing: "-0.035em",
          }}
        >
          전시회에서 전시 포스터와 관련된 퀴즈를 풀고
        </p>
      </Reveal>
      <Reveal name="경품 안내" from={pop + 0.08} to={pop + 0.8}>
        <h2
          style={{
            margin: "0.75cqh 0 0",
            color: porcelain,
            fontSize: "9.15cqh",
            fontWeight: 820,
            letterSpacing: "-0.055em",
            lineHeight: 1.16,
            textShadow,
            whiteSpace: "nowrap",
          }}
        >
          푸짐한 경품에 도전하세요!
        </h2>
      </Reveal>
    </div>
  );
};

const QuizLighting = () => {
  const frame = useCurrentFrame();
  const bloom = interpolate(
    frame,
    [quizPopFrame, quizPopFrame + 5, quizPopFrame + 15, quizPopFrame + 63],
    [0.42, 1, 0.76, 0.53],
    easeOut,
  );

  return (
    <AbsoluteFill
      aria-hidden="true"
      style={{
        opacity: bloom,
        background: [
          "radial-gradient(ellipse 25% 13% at 72% 93%, #B7703170 0%, #A46B2934 32%, transparent 74%)",
          "radial-gradient(ellipse 16% 40% at 73% 63%, #C182384A 0%, transparent 84%)",
          "conic-gradient(from 11deg at 72% 79%, transparent 0deg, #D8A05215 8deg, #D8A05224 14deg, transparent 27deg 360deg)",
        ].join(", "),
      }}
    />
  );
};

export const QuizTitle = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse 47% 90% at 75% 66%, #3A2A1D 0%, #1B1920 39%, #0D1422 68%, #090E18 100%)",
    }}
  >
    <QuizLighting />
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: "0 3% 0 46%",
      }}
    >
      <QuizGift />
    </div>
    <QuizInvitation />
  </AbsoluteFill>
);

export const EndingTitle = ({ light = false }: { light?: boolean }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill>
      <div
        style={{
          ...textArea,
          display: "grid",
          alignItems: "center",
          justifyItems: "center",
          opacity: interpolate(
            frame,
            [durationInFrames - 1 - 1.27 * fps, durationInFrames - 1],
            [1, 0],
            easeOut,
          ),
        }}
      >
        <FilmTitle start={0.05} ending light={light} />
      </div>
    </AbsoluteFill>
  );
};
