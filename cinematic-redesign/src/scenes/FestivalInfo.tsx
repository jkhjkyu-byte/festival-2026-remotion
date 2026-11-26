import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { awardData, festivalCopy } from "../data/production";

const white = "#F1F7FF";
const ice = "#94D9FF";
const easeOut = {
  easing: Easing.bezier(0.22, 1, 0.36, 1),
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const center: CSSProperties = {
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
};

const header: CSSProperties = {
  margin: 0,
  color: white,
  fontSize: "9.2cqh",
  fontWeight: 760,
  lineHeight: 1.05,
  letterSpacing: "0.08em",
  textAlign: "center",
  textShadow: "0 0 2.8cqh #287EFF57",
};

const textWell: CSSProperties = {
  position: "absolute",
  inset: "10% 7.5% 11%",
  color: white,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const panel: CSSProperties = {
  minWidth: 0,
  background:
    "linear-gradient(137deg, #16355EE8 0%, #0B1F3DF5 37%, #070E20F8 95%)",
  boxShadow: "inset 0 1px 0 #8DDAFF44, 0 1cqh 3cqh #0007",
  clipPath:
    "polygon(0 0, calc(100% - 2.1cqh) 0, 100% 2.1cqh, 100% 100%, 2.1cqh 100%, 0 calc(100% - 2.1cqh))",
};

const ProgressReveal = ({
  from,
  to,
  name,
  children,
  style,
}: {
  readonly from: number;
  readonly to: number;
  readonly name?: string;
  readonly children: ReactNode;
  readonly style?: CSSProperties;
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <Interactive.Div
      name={name}
      style={{
        ...style,
        opacity: interpolate(
          frame,
          [from * durationInFrames, to * durationInFrames],
          [0, 1],
          easeOut,
        ),
        translate: interpolate(
          frame,
          [from * durationInFrames, to * durationInFrames],
          ["0px 1.6cqh", "0px 0cqh"],
          easeOut,
        ),
      }}
    >
      {children}
    </Interactive.Div>
  );
};

const FestivalTitle = () => (
  <div style={{ textAlign: "center", color: white }}>
    <h1
      style={{
        margin: 0,
        whiteSpace: "nowrap",
        fontSize: "14cqh",
        lineHeight: 1,
        letterSpacing: "-0.038em",
        fontWeight: 850,
        textShadow:
          "0 0.22cqh 0 #528DB6, 0 0.43cqh 0 #133B68, 0 1cqh 1.65cqh #000C, 0 0 4cqh #1F83FF80",
      }}
    >
      {festivalCopy.title}
    </h1>
    <p
      lang="ko"
      style={{
        color: ice,
        fontSize: "5cqh",
        fontWeight: 650,
        letterSpacing: "0.09em",
        lineHeight: 1.3,
        margin: "4.2cqh 0 0",
        textShadow: "0 0 2.4cqh #1F83FFC4",
      }}
    >
      {festivalCopy.slogan}
    </p>
  </div>
);

export const OpeningScene = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const reveal = 8 / 12;

  return (
    <AbsoluteFill style={center}>
      <Interactive.Div
        name="오프닝 타이틀 예고"
        aria-hidden="true"
        style={{
          position: "absolute",
          color: ice,
          fontSize: "3.8cqh",
          fontWeight: 650,
          letterSpacing: "0.38em",
          opacity: interpolate(
            frame,
            [
              durationInFrames / 3,
              durationInFrames * 0.44,
              durationInFrames * (reveal - 0.05),
              durationInFrames * reveal,
            ],
            [0, 0.86, 0.86, 0],
            easeOut,
          ),
          textShadow: "0 0 1.5cqh #53BFFF",
        }}
      >
        2026
      </Interactive.Div>
      <ProgressReveal name="행사명" from={reveal} to={reveal + 0.095}>
        <FestivalTitle />
      </ProgressReveal>
      <Interactive.Div
        aria-hidden="true"
        name="수평 전환선"
        style={{
          position: "absolute",
          insetInline: "6.5%",
          top: "69%",
          height: "0.22cqh",
          background:
            "linear-gradient(90deg, transparent, #5FBFFF8C 25%, #DFF7FF 50%, #5FBFFF8C 75%, transparent)",
          boxShadow: "0 0 2cqh 0.25cqh #39A9FF82",
          scale: interpolate(
            frame,
            [durationInFrames * (reveal - 0.035), durationInFrames * 0.95],
            [0.08, 1],
            easeOut,
          ),
          opacity: interpolate(
            frame,
            [
              durationInFrames * (reveal - 0.035),
              durationInFrames * (reveal + 0.02),
              durationInFrames * 0.93,
              durationInFrames,
            ],
            [0, 0.85, 0.36, 0.82],
            easeOut,
          ),
        }}
      />
    </AbsoluteFill>
  );
};

const Timeline = ({
  index,
  children,
}: {
  readonly index: number;
  readonly children: ReactNode;
}) => (
  <div
    style={{
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "5.55cqh",
      flex: 1,
      justifyContent: "center",
    }}
  >
    <div
      aria-hidden="true"
      style={{
        position: "relative",
        height: "1.3cqh",
        marginInline: "8%",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        justifyItems: "center",
        alignItems: "center",
      }}
    >
      <span
        style={{
          position: "absolute",
          insetInline: 0,
          top: "50%",
          borderTop: "0.15cqh solid #6BC9FF86",
          boxShadow: "0 0 1.25cqh #25A5FF80",
        }}
      />
      {[0, 1, 2].map((node) => {
        const lit =
          index === 3 ||
          (index === 1 && node === 0) ||
          (index === 2 && node > 0);
        return (
          <span
            key={node}
            style={{
              width: "1.3cqh",
              aspectRatio: "1",
              rotate: "45deg",
              border: "0.19cqh solid #91D6FF",
              background: lit ? "#D3F4FF" : "#0B2146",
              boxShadow: lit ? "0 0 1.6cqh #41BCFF" : undefined,
            }}
          />
        );
      })}
    </div>
    {children}
  </div>
);

const ScheduleCard = ({
  event,
  lead,
}: {
  readonly event: { name: string; date: string; place: string };
  readonly lead: boolean;
}) => (
  <div
    lang="ko"
    style={{
      ...panel,
      padding: "4.15cqh 2.1cqw",
      textAlign: "center",
      borderTop: "0.22cqh solid #70C9F8",
      display: "grid",
      alignContent: "center",
      justifyItems: "center",
      gap: "2cqh",
      minHeight: "30cqh",
      boxSizing: "border-box",
    }}
  >
    <span
      style={{
        fontSize: lead ? "6.4cqh" : "5.4cqh",
        fontWeight: 750,
        lineHeight: 1.2,
        textWrap: "balance",
        wordBreak: "keep-all",
      }}
    >
      {event.name}
    </span>
    <span
      style={{
        fontSize: lead ? "6.6cqh" : "5.8cqh",
        color: ice,
        fontWeight: 795,
        lineHeight: 1.1,
        fontVariantNumeric: "tabular-nums",
        whiteSpace: "nowrap",
      }}
    >
      {event.date}
    </span>
    <span style={{ fontSize: "4.2cqh", lineHeight: 1.2 }}>{event.place}</span>
  </div>
);

export const ScheduleScene = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = frame / durationInFrames;
  const poster = 4 / 18;
  const institutes = 10 / 18;
  const overview = 16 / 18;
  const eventPhase =
    progress < poster
      ? 0
      : progress < institutes
        ? 1
        : progress < overview
          ? 2
          : 3;

  return (
    <div style={{ ...textWell, justifyContent: "space-between" }}>
      <ProgressReveal name="일정 제목" from={0} to={0.11}>
        <h2 style={header}>FESTIVAL SCHEDULE</h2>
      </ProgressReveal>
      <Timeline index={eventPhase}>
        <div style={{ minHeight: "30cqh" }}>
          {eventPhase === 1 && (
            <ProgressReveal
              name="포스터 전시 일정"
              from={poster}
              to={poster + 0.045}
              style={{ maxWidth: "54cqw", marginInline: "auto" }}
            >
              <ScheduleCard event={festivalCopy.schedule.poster} lead />
            </ProgressReveal>
          )}
          {eventPhase === 2 && (
            <ProgressReveal
              name="연구소 시상 일정"
              from={institutes}
              to={institutes + 0.045}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "2.6cqw",
              }}
            >
              <ScheduleCard event={festivalCopy.schedule.CW} lead />
              <ScheduleCard event={festivalCopy.schedule.MS} lead />
            </ProgressReveal>
          )}
          {eventPhase === 3 && (
            <ProgressReveal
              name="전체 일정"
              from={overview}
              to={overview + 0.035}
              style={{
                display: "grid",
                gridTemplateColumns: "1.14fr 1fr 1fr",
                gap: "1.4cqw",
              }}
            >
              <ScheduleCard event={festivalCopy.schedule.poster} lead={false} />
              <ScheduleCard event={festivalCopy.schedule.CW} lead={false} />
              <ScheduleCard event={festivalCopy.schedule.MS} lead={false} />
            </ProgressReveal>
          )}
        </div>
      </Timeline>
    </div>
  );
};

const CategoryGrid = ({
  categories,
  revealFrom,
  revealStep,
  split,
}: {
  readonly categories: readonly string[];
  readonly revealFrom: number;
  readonly revealStep: number;
  readonly split: boolean;
}) => (
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: split ? "1.45cqh 0.72cqw" : "2cqh 1cqw",
    }}
  >
    {categories.map((category, index) => (
      <ProgressReveal
        key={category}
        name={category}
        from={revealFrom + revealStep * index}
        to={revealFrom + revealStep * index + 0.045}
        style={{
          ...panel,
          minHeight: split ? "8.9cqh" : "13.2cqh",
          flex: split ? "0 1 30.7%" : "0 1 23.5%",
          borderTop: "0.18cqh solid #53BCFFB3",
          display: "grid",
          placeItems: "center",
          textAlign: "center",
          boxSizing: "border-box",
          padding: split ? "1.25cqh 0.55cqw" : "1.7cqh 1cqw",
          fontSize: split ? "3.65cqh" : "5.05cqh",
          fontWeight: 730,
          lineHeight: 1.15,
          textWrap: "balance",
          wordBreak: "keep-all",
        }}
      >
        {category}
      </ProgressReveal>
    ))}
  </div>
);

export const CategoriesScene = () => {
  const { CW, MS } = awardData;
  const shared =
    CW.categories.length === MS.categories.length &&
    CW.categories.every((category, index) => category === MS.categories[index]);
  const revealFrom = 5 / 24;
  const lastCardAt = 0.72;
  const count = Math.max(CW.categories.length, MS.categories.length);
  const revealStep = (lastCardAt - revealFrom) / Math.max(1, count - 1);

  return (
    <div
      lang="ko"
      style={{
        ...textWell,
        display: "grid",
        gridTemplateRows: "auto 1fr 6.1cqh",
        alignItems: "center",
      }}
    >
      <ProgressReveal name="시상 분야 제목" from={0} to={0.11}>
        <h2 lang="en" style={header}>
          AWARD CATEGORIES
        </h2>
      </ProgressReveal>
      {shared ? (
        <CategoryGrid
          categories={CW.categories}
          revealFrom={revealFrom}
          revealStep={revealStep}
          split={false}
        />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2.3cqw",
          }}
        >
          {[CW, MS].map(({ institute, categories }) => (
            <section key={institute} style={{ minWidth: 0 }}>
              <ProgressReveal
                name={institute}
                from={revealFrom - 0.04}
                to={revealFrom + 0.025}
                style={{
                  textAlign: "center",
                  color: ice,
                  fontSize: "4.6cqh",
                  fontWeight: 750,
                  marginBottom: "2.3cqh",
                }}
              >
                {institute}
              </ProgressReveal>
              <CategoryGrid
                categories={categories}
                revealFrom={revealFrom}
                revealStep={revealStep}
                split
              />
            </section>
          ))}
        </div>
      )}
      <ProgressReveal
        name="혁신을 실현한 주인공들"
        from={19 / 24}
        to={20.5 / 24}
        style={{
          color: ice,
          fontWeight: 680,
          textAlign: "center",
          fontSize: "5cqh",
          letterSpacing: "0.035em",
        }}
      >
        혁신을 실현한 주인공들
      </ProgressReveal>
    </div>
  );
};

const quizCubes = [
  [100, 88, 1.15],
  [62, 64, 0.72],
  [142, 49, 0.62],
  [150, 118, 0.79],
  [55, 128, 0.7],
  [102, 145, 0.52],
] as const;

const QuizGraphic = ({
  cubesFrom,
  giftFrom,
}: {
  readonly cubesFrom: number;
  readonly giftFrom: number;
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = frame / durationInFrames;
  const gift = progress >= giftFrom;
  const cubes = progress >= cubesFrom && !gift;
  const phaseStart = gift ? giftFrom : cubes ? cubesFrom : 0;

  return (
    <div
      aria-hidden="true"
      style={{
        width: "60cqh",
        height: "60cqh",
        display: "grid",
        placeItems: "center",
        position: "relative",
        justifySelf: "center",
      }}
    >
      <Interactive.Div
        name="퀴즈 홀로그램 링"
        style={{
          position: "absolute",
          inset: "13%",
          border: "0.25cqh dashed #56CBFF95",
          borderRadius: "50%",
          boxShadow: "0 0 4cqh #3F94FF5E, inset 0 0 4cqh #3F94FF4F",
          rotate: interpolate(
            frame,
            [0, durationInFrames],
            ["-16deg", "24deg"],
            easeOut,
          ),
        }}
      />
      <ProgressReveal
        key={phaseStart}
        name={gift ? "선물 아이콘" : cubes ? "데이터 큐브" : "물음표"}
        from={phaseStart}
        to={phaseStart + 0.085}
        style={{
          display: "grid",
          placeItems: "center",
          width: "100%",
          height: "100%",
          fontSize: "37cqh",
          lineHeight: 0.95,
          fontWeight: 850,
          color: "#DBF6FF",
          textShadow: "0 0.7cqh 0 #2470BD, 0 0 6cqh #39B8FF",
        }}
      >
        {gift ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 120 120"
            fill="none"
            style={{
              width: "51%",
              filter: "drop-shadow(0 0 1.4cqh #52BBFF90)",
            }}
          >
            <path
              d="M15 63h90v43H15zM9 47h102v16H9z"
              stroke="#92D9FF"
              fill="#144D82"
              strokeWidth="2.5"
            />
            <path
              d="M54 47h12v59H54zm5 0C35 46 24 39 26 28c2-12 19-15 33 19zm2 0c24-1 35-8 33-19-2-12-19-15-33 19z"
              stroke="#DBF6FF"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          </svg>
        ) : cubes ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 200 200"
            style={{
              width: "82%",
              filter: "drop-shadow(0 0 1.2cqh #48BAFF90)",
            }}
          >
            {quizCubes.map(([x, y, size], index) => {
              const spread = interpolate(
                frame,
                [
                  cubesFrom * durationInFrames,
                  (cubesFrom + 0.14 + index * 0.007) * durationInFrames,
                ],
                [0.12, 1],
                easeOut,
              );
              const drift = Math.sin((progress - cubesFrom) * 26 + index) * 3;
              return (
                <g
                  key={x}
                  transform={`translate(${100 + (x - 100) * spread} ${100 + (y - 100) * spread + drift}) scale(${size})`}
                  stroke="#9EE3FF"
                  strokeWidth="1.05"
                  strokeLinejoin="round"
                >
                  <path d="M0 -18 22 -7 0 5 -22 -7Z" fill="#4AABFD" />
                  <path d="M0 5 22 -7v22L0 27Z" fill="#123A74" />
                  <path d="M0 5 -22 -7v22L0 27Z" fill="#1E71C5" />
                </g>
              );
            })}
          </svg>
        ) : (
          "?"
        )}
      </ProgressReveal>
    </div>
  );
};

export const QuizScene = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = frame / durationInFrames;
  const invitation = 5 / 20;
  const notice = 12 / 20;
  const final = 18 / 20;
  const isInvitation = progress >= invitation && progress < notice;
  const isNotice = progress >= notice && progress < final;
  const phaseStart =
    progress >= final
      ? final
      : isNotice
        ? notice
        : isInvitation
          ? invitation
          : 0;

  return (
    <div
      style={{
        ...textWell,
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.55fr) minmax(0, 1fr)",
        gap: "3cqw",
        alignItems: "center",
      }}
    >
      <ProgressReveal
        key={phaseStart}
        name="퀴즈 안내"
        from={phaseStart}
        to={phaseStart + 0.07}
      >
        <h2 style={{ ...header, textAlign: "left", fontSize: "10.4cqh" }}>
          {isInvitation ? "QUIZ TIME" : festivalCopy.quiz.title}
        </h2>
        {isInvitation && (
          <p
            style={{
              color: white,
              fontSize: "6.5cqh",
              margin: "4cqh 0 0",
              fontWeight: 760,
            }}
          >
            {festivalCopy.quiz.invitation}
          </p>
        )}
        {isNotice && (
          <>
            <p
              style={{
                color: white,
                fontSize: "6.1cqh",
                margin: "4cqh 0 0",
                fontWeight: 760,
              }}
            >
              {festivalCopy.quiz.notice}
            </p>
            <p
              style={{
                color: ice,
                fontSize: "4.6cqh",
                margin: "1.9cqh 0 0",
                fontWeight: 610,
              }}
            >
              {festivalCopy.quiz.challenge}
            </p>
          </>
        )}
      </ProgressReveal>
      <QuizGraphic cubesFrom={invitation} giftFrom={notice} />
    </div>
  );
};

export const EndingScene = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={center}>
      <Interactive.Div
        name="엔딩 타이틀"
        style={{
          opacity: interpolate(
            frame,
            [
              0,
              durationInFrames * 0.3,
              durationInFrames * 0.77,
              durationInFrames - 1,
            ],
            [0, 1, 1, 0],
            easeOut,
          ),
        }}
      >
        <FestivalTitle />
      </Interactive.Div>
      <AbsoluteFill
        style={{
          background: "#000",
          opacity: interpolate(
            frame,
            [durationInFrames * 0.81, durationInFrames - 1],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          ),
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
