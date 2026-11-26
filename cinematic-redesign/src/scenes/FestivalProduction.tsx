import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { FestivalBackdrop } from "../components/FestivalBackdrop";
import {
  getAwardTiming,
  getInstituteAwards,
  getSceneTiming,
} from "../data/production";
import {
  CategoriesScene,
  EndingScene,
  OpeningScene,
  QuizScene,
  ScheduleScene,
} from "./FestivalInfo";
import { InstituteAwardsScene } from "./InstituteAwards";

const cues = getSceneTiming();
const scenes = [
  {
    key: "opening",
    name: "01 · 기술의 집결",
    Scene: OpeningScene,
    score: "opening",
  },
  {
    key: "schedule",
    name: "02 · 페스티벌 일정",
    Scene: ScheduleScene,
    score: "technology",
  },
  {
    key: "categories",
    name: "03 · 시상 분야",
    Scene: CategoriesScene,
    score: "technology",
  },
  {
    key: "cw",
    name: "04 · CW생산본부",
    Scene: () => <InstituteAwardsScene code="CW" />,
    score: "honors",
  },
  {
    key: "ms",
    name: "05 · 미사일시스템생산본부",
    Scene: () => <InstituteAwardsScene code="MS" />,
    score: "honors",
  },
  { key: "quiz", name: "06 · 특별 퀴즈", Scene: QuizScene, score: "quiz" },
  { key: "ending", name: "07 · 엔딩", Scene: EndingScene, score: "ending" },
] as const;

type SceneEntry = (typeof scenes)[number];
type Score = SceneEntry["score"] | "gold";
const clamped = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const ScoreCue = ({ score, duration }: { score: Score; duration: number }) => (
  <Audio
    src={staticFile(`assets/festival-audio/${score}.mp3`)}
    loop
    loopVolumeCurveBehavior="extend"
    volume={(frame) =>
      interpolate(
        frame,
        [0, 16, duration - 24, duration - 1],
        [0, 0.82, 0.82, 0],
        clamped,
      )
    }
  />
);

const SceneLayer = ({
  entry,
  duration,
}: {
  entry: SceneEntry;
  duration: number;
}) => {
  const frame = useCurrentFrame();
  const code = entry.key === "cw" ? "CW" : entry.key === "ms" ? "MS" : null;
  const hasGrandPrize =
    code !== null && getInstituteAwards(code).grandPrize !== null;
  const { winnersEnd, grandEnd, introEnd, rollupStart } = getAwardTiming(
    duration,
    hasGrandPrize,
  );
  const gold = hasGrandPrize
    ? interpolate(
        frame,
        [winnersEnd, winnersEnd + 78, grandEnd - 12, grandEnd],
        [0, 1, 1, 0],
        {
          ...clamped,
          easing: Easing.inOut(Easing.cubic),
        },
      )
    : 0;
  const awardReading =
    code !== null && frame >= introEnd && frame < rollupStart;
  const cutLight =
    entry.key !== "opening" && entry.key !== "ending" && frame < 19;
  const Scene = entry.Scene;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <FestivalBackdrop
        mode={entry.key}
        gold={gold}
        durationInFrames={duration}
        intensity={awardReading ? 0.7 : 1}
      />
      <Scene />
      {cutLight ? (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: interpolate(frame, [0, 18], [-40, 105], clamped) + "%",
            top: 0,
            bottom: 0,
            width: "32%",
            pointerEvents: "none",
            opacity: interpolate(frame, [0, 5, 18], [0, 0.21, 0], clamped),
            transform: "skewX(-21deg)",
            background:
              "linear-gradient(90deg, transparent, #3895ff, transparent)",
          }}
        />
      ) : null}
      {hasGrandPrize ? (
        <>
          <Sequence
            name="연구소 시상 음향"
            durationInFrames={winnersEnd}
            layout="none"
          >
            <ScoreCue score={entry.score} duration={winnersEnd} />
          </Sequence>
          <Sequence
            name="대상 음향"
            from={winnersEnd}
            durationInFrames={grandEnd - winnersEnd}
            layout="none"
          >
            <ScoreCue score="gold" duration={grandEnd - winnersEnd} />
          </Sequence>
          <Sequence
            name="수상자 집계 음향"
            from={grandEnd}
            durationInFrames={duration - grandEnd}
            layout="none"
          >
            <ScoreCue score={entry.score} duration={duration - grandEnd} />
          </Sequence>
        </>
      ) : (
        <ScoreCue score={entry.score} duration={duration} />
      )}
    </AbsoluteFill>
  );
};

export const FestivalProduction = () => (
  <AbsoluteFill
    lang="ko"
    style={{
      containerType: "size",
      backgroundColor: "#000",
      fontFamily:
        '"Noto Sans CJK KR", "Noto Sans KR", "Malgun Gothic", sans-serif',
      color: "#f6f9ff",
    }}
  >
    {scenes.map((entry, index) => (
      <Sequence key={entry.key} name={entry.name} {...cues[index]}>
        <SceneLayer entry={entry} duration={cues[index].durationInFrames} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
