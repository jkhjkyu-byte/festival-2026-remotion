import type { CSSProperties } from "react";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  getAwardTiming,
  getInstituteAwards,
  type AwardRecipient,
  type InstituteCode,
} from "../data/production";

const pending: AwardRecipient = {
  category: "[시상 분야]",
  name: "[수상자 이름]",
  affiliation: "[소속 / 팀명]",
};

const fade = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.bezier(0.22, 1, 0.36, 1),
} as const;

const headline: CSSProperties = {
  color: "#F3F8FF",
  fontWeight: 800,
  lineHeight: 1.12,
  letterSpacing: "-0.045em",
  wordBreak: "keep-all",
  overflowWrap: "anywhere",
};

const kicker: CSSProperties = {
  color: "#85DEFF",
  fontWeight: 700,
  lineHeight: 1.2,
  letterSpacing: "0.12em",
};

const centered: CSSProperties = {
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
};

const reveal = (frame: number, start: number, length: number) =>
  interpolate(frame, [start, start + Math.max(1, length)], [0, 1], fade);

const InstituteIntro = ({ institute }: { institute: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ ...centered, padding: "0 8cqw" }}>
      <Interactive.Div
        name="수상자 소개 제목"
        style={{
          ...kicker,
          fontSize: "4.1cqh",
          opacity: interpolate(frame, [0, 0.65 * fps], [0, 1], fade),
          marginBottom: "2.7cqh",
        }}
      >
        AWARD WINNERS
      </Interactive.Div>
      <Interactive.Div
        name="연구소 이름"
        style={{
          ...headline,
          fontSize: "11.4cqh",
          opacity: interpolate(frame, [0.16 * fps, 0.85 * fps], [0, 1], fade),
          translate: interpolate(
            frame,
            [0.16 * fps, 0.85 * fps],
            ["0px 2.8cqh", "0px 0cqh"],
            fade,
          ),
        }}
      >
        {institute}
      </Interactive.Div>
      <div
        aria-hidden="true"
        style={{
          width: "70cqw",
          height: "0.26cqh",
          marginTop: "4cqh",
          background:
            "linear-gradient(90deg, transparent, #6DDFFF, transparent)",
          scale: `${reveal(frame, 0.12 * fps, 0.95 * fps)} 1`,
        }}
      />
    </AbsoluteFill>
  );
};

const WinnerReveal = ({
  frame,
  duration,
  institute,
  winner,
  isPending,
}: {
  frame: number;
  duration: number;
  institute: string;
  winner: AwardRecipient;
  isPending: boolean;
}) => {
  const { fps } = useVideoConfig();
  const pace = Math.min(0.84 * fps, duration * 0.55);
  const beam = reveal(frame, pace * 0.14, pace * 0.65);

  return (
    <AbsoluteFill
      style={{
        ...centered,
        padding: "0 9cqw",
        background:
          "radial-gradient(ellipse at 50% 52%, #060B17C9 0%, #0812264A 49%, transparent 78%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "12cqh",
          color: "#ACCBE0",
          fontSize: "3.45cqh",
          fontWeight: 700,
        }}
      >
        {institute}
      </div>
      <Interactive.Div
        name="시상 분야"
        style={{
          ...kicker,
          fontSize: "4.75cqh",
          letterSpacing: "0.015em",
          opacity: interpolate(
            frame,
            [0, Math.max(1, pace * 0.36)],
            [0, 1],
            fade,
          ),
        }}
      >
        {winner.category}
      </Interactive.Div>
      <Interactive.Div
        name="일반 수상자 이름"
        style={{
          ...headline,
          fontSize: "9.4cqh",
          marginTop: "2.5cqh",
          opacity: interpolate(
            frame,
            [pace * 0.2, Math.max(pace * 0.2 + 1, pace * 0.82)],
            [0, 1],
            fade,
          ),
        }}
      >
        {winner.name}
      </Interactive.Div>
      <div
        aria-hidden="true"
        style={{
          width: "51cqw",
          height: "0.22cqh",
          marginTop: "2.8cqh",
          background:
            "linear-gradient(90deg, transparent, #87DFFF, transparent)",
          opacity: 0.34 + 0.36 * (1 - reveal(frame, pace, 0.4 * fps)),
          scale: `${beam} 1`,
        }}
      />
      <Interactive.Div
        name="수상자 소속"
        style={{
          color: "#CBDFEE",
          fontSize: "4.05cqh",
          marginTop: "2.3cqh",
          opacity: interpolate(
            frame,
            [pace * 0.43, Math.max(pace * 0.43 + 1, pace)],
            [0, 1],
            fade,
          ),
        }}
      >
        {winner.affiliation}
      </Interactive.Div>
      {isPending ? (
        <div
          style={{
            position: "absolute",
            bottom: "12cqh",
            color: "#A7C6DB",
            fontSize: "3.35cqh",
          }}
        >
          수상 정보 입력 대기
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const GrandPrize = ({
  frame,
  duration,
  prize,
}: {
  frame: number;
  duration: number;
  prize: AwardRecipient;
}) => {
  const { fps } = useVideoConfig();
  const labelAt = duration * 0.14;
  const titleAt = duration * 0.24;
  const nameAt = titleAt + Math.min(0.5 * fps, duration * 0.13);
  const motion = Math.min(0.65 * fps, duration * 0.16);

  return (
    <AbsoluteFill
      style={{
        ...centered,
        padding: "0 9cqw",
        background:
          "radial-gradient(ellipse at 50% 56%, #131009C4 0%, #13100971 48%, transparent 76%)",
      }}
    >
      <Interactive.Div
        name="Grand Prize"
        style={{
          ...kicker,
          color: "#F5D28D",
          fontSize: "4cqh",
          opacity: interpolate(
            frame,
            [labelAt, labelAt + motion],
            [0, 1],
            fade,
          ),
        }}
      >
        GRAND PRIZE
      </Interactive.Div>
      <Interactive.Div
        name="대상 제목"
        style={{
          ...headline,
          fontSize: "12.6cqh",
          color: "#FFD992",
          textShadow: "0 0 2.6cqh #EAB05255, 0 0.32cqh #9A682E",
          marginTop: "1.1cqh",
          opacity: interpolate(
            frame,
            [titleAt, titleAt + motion],
            [0, 1],
            fade,
          ),
        }}
      >
        대상
      </Interactive.Div>
      <div
        aria-hidden="true"
        style={{
          width: "68cqw",
          height: "0.24cqh",
          marginTop: "2.45cqh",
          background:
            "linear-gradient(90deg, transparent, #AA7134, #FFE4A2, #AA7134, transparent)",
          scale: `${reveal(frame, nameAt, motion)} 1`,
        }}
      />
      <Interactive.Div
        name="대상 수상자 이름"
        style={{
          ...headline,
          color: "#FFF3D5",
          fontSize: "13.2cqh",
          marginTop: "2.45cqh",
          opacity: interpolate(frame, [nameAt, nameAt + motion], [0, 1], fade),
        }}
      >
        {prize.name}
      </Interactive.Div>
      <Interactive.Div
        name="대상 수상 분야와 소속"
        style={{
          fontSize: "4.15cqh",
          color: "#F3DDB3",
          marginTop: "2.4cqh",
          opacity: interpolate(
            frame,
            [nameAt + motion * 0.45, nameAt + motion * 1.4],
            [0, 1],
            fade,
          ),
        }}
      >
        {prize.category} · {prize.affiliation}
      </Interactive.Div>
    </AbsoluteFill>
  );
};

const Rollup = ({
  frame,
  institute,
  winners,
  grandPrize,
}: {
  frame: number;
  institute: string;
  winners: readonly AwardRecipient[];
  grandPrize: AwardRecipient | null;
}) => {
  const { fps } = useVideoConfig();
  const allWinners = [
    ...(grandPrize ? [{ winner: grandPrize, isGrand: true }] : []),
    ...winners.map((winner) => ({ winner, isGrand: false })),
  ];
  const columns = Math.max(
    1,
    Math.min(4, Math.ceil(Math.sqrt(allWinners.length))),
  );
  const rows = Math.ceil(allWinners.length / columns);

  return (
    <AbsoluteFill
      style={{
        padding: "10cqh 8cqw 9cqh",
        background:
          "linear-gradient(90deg, transparent, #061020B9 25%, #061020B9 75%, transparent)",
      }}
    >
      <Interactive.Div
        name="전체 수상자 제목"
        style={{
          ...headline,
          fontSize: "5.75cqh",
          textAlign: "center",
          opacity: interpolate(frame, [0, fps * 0.42], [0, 1], fade),
        }}
      >
        {institute} 전체 수상자
      </Interactive.Div>
      {allWinners.length === 0 ? (
        <div
          style={{
            ...headline,
            alignSelf: "center",
            marginTop: "19cqh",
            padding: "5.4cqh 6cqw",
            borderTop: "0.18cqh solid #569FC2",
            background: "linear-gradient(180deg, #10253BA8, #0B192C3A)",
            fontSize: "6.25cqh",
            opacity: reveal(frame, fps * 0.11, fps * 0.46),
          }}
        >
          수상자 명단 입력 대기
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            margin: "auto",
            width: "100%",
            maxWidth: columns < 3 ? "67cqw" : undefined,
            gap: "1.75cqh 1.1cqw",
          }}
        >
          {allWinners.map(({ winner, isGrand }, index) => {
            const show = reveal(
              frame,
              fps * (0.12 + index * 0.065),
              fps * 0.45,
            );
            return (
              <div
                key={`${winner.category}:${winner.name}:${index}`}
                style={{
                  minWidth: 0,
                  padding: "1.3cqh 1.1cqw",
                  border: `0.16cqh solid ${isGrand ? "#DBB46BCC" : "#4897BB88"}`,
                  background: isGrand ? "#372815CC" : "#0B2035D9",
                  opacity: show,
                  translate: `0px ${(1 - show) * 1.8}cqh`,
                  overflowWrap: "anywhere",
                  lineHeight: 1.18,
                }}
              >
                <div
                  style={{
                    color: isGrand ? "#FFDC92" : "#90DBFB",
                    fontSize: rows > 3 ? "2.6cqh" : "3.1cqh",
                    fontWeight: 700,
                  }}
                >
                  {isGrand ? `대상 · ${winner.category}` : winner.category}
                </div>
                <div
                  style={{
                    ...headline,
                    color: isGrand ? "#FFF0D1" : headline.color,
                    marginTop: "0.38cqh",
                    fontSize: rows > 3 ? "3.65cqh" : "4.5cqh",
                  }}
                >
                  {winner.name}
                </div>
                <div
                  style={{
                    color: isGrand ? "#EFDAAE" : "#BDDEF1",
                    fontSize: rows > 3 ? "2.4cqh" : "2.9cqh",
                    marginTop: "0.26cqh",
                  }}
                >
                  {winner.affiliation}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AbsoluteFill>
  );
};

export const InstituteAwardsScene = ({ code }: { code: InstituteCode }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const { institute, categories, winners, grandPrize } =
    getInstituteAwards(code);
  const { introEnd, winnersEnd, grandEnd, rollupStart } = getAwardTiming(
    durationInFrames,
    grandPrize !== null,
  );

  if (frame < introEnd) {
    return <InstituteIntro institute={institute} />;
  }

  if (frame < winnersEnd) {
    const slots = winners.length
      ? winners
      : categories.length
        ? categories.map((category) => ({ ...pending, category }))
        : [pending];
    const duration = winnersEnd - introEnd;
    const localFrame = frame - introEnd;
    const index = Math.floor((localFrame * slots.length) / duration);
    const start = Math.ceil((index * duration) / slots.length);
    const end = Math.ceil(((index + 1) * duration) / slots.length);
    return (
      <WinnerReveal
        frame={localFrame - start}
        duration={end - start}
        institute={institute}
        winner={slots[index]}
        isPending={winners.length === 0}
      />
    );
  }

  if (grandPrize && frame < grandEnd) {
    return (
      <GrandPrize
        frame={frame - winnersEnd}
        duration={grandEnd - winnersEnd}
        prize={grandPrize}
      />
    );
  }

  return (
    <Rollup
      frame={frame - rollupStart}
      institute={institute}
      winners={winners}
      grandPrize={grandPrize}
    />
  );
};
