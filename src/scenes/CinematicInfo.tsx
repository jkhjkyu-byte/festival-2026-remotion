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
      <FilmTitle start={1.24} />
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
            <ScheduleDetails event={festivalCopy.schedule.CW} from={2.4} />
          </div>
          <div
            style={{
              display: "grid",
              alignContent: "center",
              borderTop: "0.14cqh solid #ABBFD17A",
            }}
          >
            <ScheduleDetails event={festivalCopy.schedule.MS} from={3.1} />
          </div>
        </div>
      </div>
    </div>
  </AbsoluteFill>
);

const ribbonTrails = [
  {
    path: "M408 259C468 202 512 246 545 171S617 105 683 125",
    color: "#E8A942",
    delay: 0,
    width: 10,
  },
  {
    path: "M402 254C366 176 290 208 289 142S248 69 193 96",
    color: "#F8DA93",
    delay: 0.045,
    width: 8,
  },
  {
    path: "M420 260C453 233 463 192 453 142S500 67 518 46",
    color: "#FFF0C1",
    delay: 0.1,
    width: 5,
  },
  {
    path: "M396 259C363 205 388 154 355 121S307 100 305 58",
    color: "#CB7335",
    delay: 0.12,
    width: 6,
  },
  {
    path: "M429 266C476 226 548 281 596 216S682 212 706 170",
    color: "#F2C165",
    delay: 0.17,
    width: 4,
  },
  {
    path: "M396 262C345 221 259 250 229 194S160 180 133 148",
    color: "#D39961",
    delay: 0.2,
    width: 5,
  },
] as const;

type BoxPoint = readonly [x: number, y: number, depth: number];

const projectPoint = ([x, y, depth]: BoxPoint) =>
  [
    434 + x * 0.94 - depth * 0.4,
    365 + x * 0.15 - y * 0.87 + depth * 0.29,
  ] as const;

const polygon = (...vertices: BoxPoint[]) =>
  vertices.map((vertex) => projectPoint(vertex).join(",")).join(" ");

const GiftVisual = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = frame / fps;
  const opened = interpolate(
    seconds,
    [2.25, 2.56, 3.36, 3.94],
    [0, 0.045, 1.03, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.36, 0, 0.26, 1),
    },
  );
  const caseGlow = interpolate(
    seconds,
    [2.08, 2.48, 3.09, 4.85, 9.9],
    [0, 0.18, 0.95, 0.51, 0.36],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const angle = opened * (Math.PI * 0.62);
  const lidPoint = (x: number, thickness: number, depth: number): BoxPoint => [
    x,
    125 + Math.sin(angle) * depth + Math.cos(angle) * thickness,
    Math.cos(angle) * depth - Math.sin(angle) * thickness,
  ];
  const bowOrigin = projectPoint(lidPoint(0, 18, 82));
  const entered = interpolate(seconds, [0.12, 1.55], [0, 1], easeOut);
  const hold = interpolate(seconds, [4, 9.8], [0, 1], easeOut);

  return (
    <svg
      viewBox="0 0 830 510"
      aria-hidden="true"
      style={{
        position: "absolute",
        right: "5.5%",
        top: 0,
        width: "47%",
        height: "100%",
        overflow: "visible",
        opacity: entered,
        translate: `${(1 - entered) * 2.8 - hold * 0.6}cqw ${(1 - entered) * 3.2}cqh`,
        scale: 0.93 + entered * 0.07 + hold * 0.023,
      }}
    >
      <defs>
        <linearGradient id="quiz-front" x1="0" x2="1" y1="0" y2=".75">
          <stop stopColor="#754439" />
          <stop offset=".34" stopColor="#4A2727" />
          <stop offset="1" stopColor="#21131D" />
        </linearGradient>
        <linearGradient id="quiz-side" x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#5A312B" />
          <stop offset="1" stopColor="#20131A" />
        </linearGradient>
        <linearGradient id="quiz-lid" x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#BB7D62" />
          <stop offset=".51" stopColor="#6F3E36" />
          <stop offset="1" stopColor="#352027" />
        </linearGradient>
        <linearGradient id="quiz-gold" x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#97531F" />
          <stop offset=".26" stopColor="#F5CC73" />
          <stop offset=".51" stopColor="#FFE8A5" />
          <stop offset=".74" stopColor="#C58642" />
          <stop offset="1" stopColor="#9E5527" />
        </linearGradient>
        <radialGradient id="quiz-glow">
          <stop stopColor="#FFF3B6" stopOpacity=".95" />
          <stop offset=".31" stopColor="#FFCD69" stopOpacity=".63" />
          <stop offset=".64" stopColor="#BA572F" stopOpacity=".22" />
          <stop offset="1" stopColor="#A33F21" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="quiz-shadow">
          <stop stopColor="#0A060B" stopOpacity=".96" />
          <stop offset="1" stopColor="#0A060B" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="399" cy="414" rx="244" ry="62" fill="url(#quiz-shadow)" />
      <ellipse
        cx="402"
        cy="407"
        rx="274"
        ry="43"
        fill="url(#quiz-glow)"
        opacity={caseGlow * 0.48}
      />
      <ellipse
        cx="407"
        cy="237"
        rx="305"
        ry="216"
        fill="url(#quiz-glow)"
        opacity={caseGlow * 0.67}
      />
      <polygon
        points={polygon(
          [-139, 124, 0],
          [139, 124, 0],
          [139, 124, 170],
          [-139, 124, 170],
        )}
        fill="#1A1020"
      />
      <polygon
        points={polygon(
          [-127, 126, 12],
          [128, 126, 12],
          [128, 126, 159],
          [-127, 126, 159],
        )}
        fill="#F3B958"
        opacity={caseGlow * 0.91}
      />
      <polygon
        points={polygon(
          [-139, 124, 170],
          [139, 124, 170],
          [139, 0, 170],
          [-139, 0, 170],
        )}
        fill="url(#quiz-front)"
        stroke="#D7996470"
        strokeWidth="1.4"
      />
      <polygon
        points={polygon(
          [139, 124, 170],
          [139, 124, 0],
          [139, 0, 0],
          [139, 0, 170],
        )}
        fill="url(#quiz-side)"
        stroke="#BC825359"
        strokeWidth="1.4"
      />
      <polygon
        points={polygon(
          [-25, 124, 171],
          [25, 124, 171],
          [25, 0, 171],
          [-25, 0, 171],
        )}
        fill="url(#quiz-gold)"
      />
      <polygon
        points={polygon(
          [-137, 124, 170],
          [137, 124, 170],
          [137, 121, 170],
          [-137, 121, 170],
        )}
        fill="#FDD17B"
        opacity={caseGlow}
      />
      <g strokeLinejoin="round" strokeWidth="1.2">
        <polygon
          points={polygon(
            lidPoint(-145, 18, -5),
            lidPoint(145, 18, -5),
            lidPoint(145, 18, 175),
            lidPoint(-145, 18, 175),
          )}
          fill="url(#quiz-lid)"
          stroke="#DEA879B0"
        />
        <polygon
          points={polygon(
            lidPoint(-26, 18.3, -5),
            lidPoint(26, 18.3, -5),
            lidPoint(26, 18.3, 175),
            lidPoint(-26, 18.3, 175),
          )}
          fill="url(#quiz-gold)"
        />
        <polygon
          points={polygon(
            lidPoint(-145, 18, 175),
            lidPoint(145, 18, 175),
            lidPoint(145, 0, 175),
            lidPoint(-145, 0, 175),
          )}
          fill="url(#quiz-front)"
          stroke="#CD935A"
        />
        <polygon
          points={polygon(
            lidPoint(145, 18, -5),
            lidPoint(145, 18, 175),
            lidPoint(145, 0, 175),
            lidPoint(145, 0, -5),
          )}
          fill="url(#quiz-side)"
          stroke="#C48459"
        />
        <polygon
          points={polygon(
            lidPoint(-26, 18, 175.25),
            lidPoint(26, 18, 175.25),
            lidPoint(26, 0, 175.25),
            lidPoint(-26, 0, 175.25),
          )}
          fill="url(#quiz-gold)"
        />
      </g>
      <g
        transform={`translate(${bowOrigin[0]} ${bowOrigin[1]}) rotate(${-7 + opened * 21})`}
        stroke="url(#quiz-gold)"
        strokeWidth="6"
        fill="#6E352680"
        strokeLinejoin="round"
      >
        <path d="M0 0C-20-36-66-44-61-14C-58 7-22 7 0 0C23-32 64-40 61-12C56 7 24 7 0 0Z" />
        <path d="M-3 1C-15 11-29 18-39 27M3 1C18 8 27 17 32 25" fill="none" />
        <path d="M-7-4H7V4H-7Z" fill="#F8D786" strokeWidth="1.7" />
      </g>
      {ribbonTrails.map(({ path, color, delay, width }) => {
        const start = 2.7 + delay;
        const draw = interpolate(
          seconds,
          [start, start + 1.48],
          [1, 0],
          easeOut,
        );
        const fade = interpolate(
          seconds,
          [start, start + 0.22, 4.5 + delay, 6.45 + delay],
          [0, 1, 0.9, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        );
        return (
          <path
            key={path}
            d={path}
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={draw}
            fill="none"
            stroke={color}
            strokeWidth={width}
            opacity={fade}
            strokeLinecap="round"
          />
        );
      })}
      {Array.from({ length: 23 }, (_, index) => {
        const spread = interpolate(
          seconds,
          [2.76 + index * 0.019, 4.65 + index * 0.028],
          [0, 1],
          easeOut,
        );
        const fade = interpolate(
          seconds,
          [2.76 + index * 0.019, 3.35 + index * 0.019, 5.25 + index * 0.031],
          [0, 0.88, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        );
        const direction = Math.PI * (1.05 + ((index * 37) % 97) / 107);
        const distance = 72 + ((index * 59) % 214);
        const x = 396 + Math.cos(direction) * distance * spread;
        const y =
          255 + Math.sin(direction) * distance * spread + 37 * spread * spread;
        const size = 1.2 + (index % 4) * 0.72;
        return (
          <rect
            key={index}
            x={x}
            y={y}
            width={size * 2.5}
            height={size}
            transform={`rotate(${index * 34 + seconds * 36} ${x} ${y})`}
            fill={index % 3 === 0 ? "#F3AD61" : "#FFE3A3"}
            opacity={fade}
          />
        );
      })}
    </svg>
  );
};

export const QuizTitle = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse 47% 80% at 72% 58%, #76391FA8 0%, #421D29C8 43%, #140D18EC 79%, #0B0811F5 100%)",
    }}
  >
    <GiftVisual />
    <div
      style={{
        ...textArea,
        right: "53%",
        display: "grid",
        gap: "2.75cqh",
        alignContent: "center",
        justifyItems: "start",
        textAlign: "left",
      }}
    >
      <Reveal name="퀴즈 제목" from={1.18} to={1.99}>
        <h2
          lang="en"
          style={{
            margin: 0,
            color: porcelain,
            fontSize: "15.4cqh",
            fontWeight: 840,
            letterSpacing: "-0.065em",
            lineHeight: 1.08,
            textShadow,
            whiteSpace: "nowrap",
          }}
        >
          QUIZ EVENT
        </h2>
      </Reveal>
      <Reveal name="퀴즈 참여 장소" from={3.42} to={4.16}>
        <p
          lang="ko"
          style={{
            margin: 0,
            color: "#F3CB90",
            fontSize: "5.5cqh",
            fontWeight: 650,
            lineHeight: 1.3,
            textShadow,
          }}
        >
          시상식 현장
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
