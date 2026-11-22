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
}: {
  readonly start: number;
  readonly ending?: boolean;
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
          color: porcelain,
          textShadow,
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
          color: ice,
          fontSize: "5.15cqh",
          fontWeight: 610,
          letterSpacing: "0.01em",
          lineHeight: 1.3,
          textShadow,
        }}
      >
        {festivalCopy.slogan}
      </p>
    </Reveal>
  </div>
);

export const OpeningTitle = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse 43% 44% at 50% 48%, #0009, #0006 54%, transparent 100%)",
    }}
  >
    <div style={{ ...textArea, display: "grid", alignItems: "center" }}>
      <FilmTitle start={1.43} />
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
        "linear-gradient(90deg, #080B13C4 4%, #080B1380 41%, #080B138C 71%, #080B1326 100%)",
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
      <Reveal from={0.2} to={1.07} name="일정 제목">
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
            from={1.0}
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
            <ScheduleDetails event={festivalCopy.schedule.CW} from={2.05} />
          </div>
          <div
            style={{
              display: "grid",
              alignContent: "center",
              borderTop: "0.14cqh solid #ABBFD17A",
            }}
          >
            <ScheduleDetails event={festivalCopy.schedule.MS} from={2.38} />
          </div>
        </div>
      </div>
    </div>
  </AbsoluteFill>
);

export const QuizTitle = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse 37% 42% at 50% 49%, #070911DC, #0709118F 62%, transparent 100%)",
    }}
  >
    <div
      style={{
        ...textArea,
        display: "grid",
        gap: "3.45cqh",
        alignContent: "center",
        justifyItems: "center",
        textAlign: "center",
      }}
    >
      <Reveal name="퀴즈 제목" from={0.23} to={1.18}>
        <h2
          lang="en"
          style={{
            margin: 0,
            color: porcelain,
            fontSize: "13.7cqh",
            fontWeight: 840,
            letterSpacing: "-0.062em",
            lineHeight: 1.08,
            textShadow,
            whiteSpace: "nowrap",
          }}
        >
          {festivalCopy.quiz.title}
        </h2>
      </Reveal>
      <Horizon from={0.62} to={1.41} />
      <Reveal name="퀴즈 참여 방법" from={1.16} to={2.0}>
        <p
          lang="ko"
          style={{
            margin: 0,
            maxWidth: "45cqw",
            color: ice,
            wordBreak: "keep-all",
            textWrap: "balance",
            fontSize: "5.82cqh",
            fontWeight: 650,
            lineHeight: 1.3,
            textShadow,
          }}
        >
          {festivalCopy.quiz.invitation}
        </p>
      </Reveal>
    </div>
  </AbsoluteFill>
);

export const EndingTitle = () => {
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
            [2.73 * fps, durationInFrames - 1],
            [1, 0],
            easeOut,
          ),
        }}
      >
        <FilmTitle start={0.05} ending />
      </div>
    </AbsoluteFill>
  );
};
