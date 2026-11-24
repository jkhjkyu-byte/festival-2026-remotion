import {
  AbsoluteFill,
  Audio,
  Freeze,
  interpolate,
  Loop,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { quizPopFrame } from "../three/QuizGift";
import {
  getInstituteAwardCues,
  instituteIntroSeconds,
  masterCues,
  type AwardCue,
} from "../data/cinematic-timeline";
import { CeremonySpace, type CeremonySpaceProps } from "../three/CeremonySpace";
import { CategoryHonors, CategoryIntroductions } from "./CinematicAwards";
import { InstituteBroll } from "./InstituteBroll";
import { CeremonyPhotography } from "./CeremonyPhotography";
import { HonorProcession } from "./HonorProcession";
import { Appreciation } from "./Appreciation";
import {
  EndingTitle,
  OpeningTitle,
  QuizTitle,
  ScheduleTitle,
} from "./CinematicInfo";

export const plateProfiles = [
  { mode: "opening" },
  { mode: "schedule" },
  { mode: "cw" },
  { mode: "ms" },
  { mode: "cw", gold: true },
  { mode: "ms", gold: true },
  { mode: "quiz" },
  { mode: "ending" },
] satisfies CeremonySpaceProps[];

export const plateFrames = 120;
const rounded = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
const plateName = ({ mode, gold }: CeremonySpaceProps) =>
  gold ? `${mode}-gold` : mode;

type PlateProps = CeremonySpaceProps & {
  zoom?: number;
  x?: number;
  y?: number;
};
const StagePlate = ({ zoom = 1, x = 0, y = 0, ...profile }: PlateProps) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      transform: `scale(${zoom}) translate(${x}%, ${y}%)`,
    }}
    aria-hidden="true"
  >
    <Loop durationInFrames={plateFrames} layout="none">
      <OffthreadVideo
        muted
        src={staticFile(`assets/cinematic-plates/${plateName(profile)}.mp4`)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </Loop>
  </AbsoluteFill>
);

export const PlateReel = () => (
  <AbsoluteFill>
    {plateProfiles.map((profile, i) => (
      <Sequence
        key={plateName(profile)}
        from={i * plateFrames}
        durationInFrames={plateFrames}
        premountFor={0}
      >
        <CeremonySpace {...profile} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

const surface = {
  containerType: "size",
  backgroundColor: "#080b10",
  fontFamily: '"Noto Sans CJK KR", "Noto Sans KR", sans-serif',
  color: "#f3f1ed",
  overflow: "hidden",
} as const;

const Bed = ({ cue, gain = 0.76 }: { cue: string; gain?: number }) => {
  const { durationInFrames: duration } = useVideoConfig();
  return (
    <Audio
      src={staticFile(`assets/festival-audio/${cue}.mp3`)}
      loop
      loopVolumeCurveBehavior="extend"
      volume={(frame) =>
        interpolate(
          frame,
          [0, 10, duration - 16, duration - 1],
          [0, gain, gain, 0],
          rounded,
        )
      }
    />
  );
};

const PrizeReveal = () => (
  <>
    <CeremonyPhotography shot="trophy" warm />
    <HonorProcession image="assets/ceremony-cut/trophy.jpg" />
    <Audio
      src={staticFile("assets/awards-order/prize-chime.wav")}
      volume={0.57}
    />
  </>
);

const OpeningStage = () => (
  <>
    <Sequence durationInFrames={46} premountFor={0} name="금속 디테일">
      <CeremonyPhotography shot="macro" holdAt={45} />
    </Sequence>
    <Sequence from={46} durationInFrames={88} premountFor={0} name="무대 전경">
      <CeremonyPhotography shot="hall" holdAt={43} />
    </Sequence>
    <Sequence from={134} premountFor={0} name="축제 타이틀 홀드">
      <Freeze frame={54}>
        <StagePlate mode="opening" zoom={1.05} />
      </Freeze>
    </Sequence>
  </>
);

const InstituteCategories = ({ code }: Pick<AwardCue, "code">) => {
  const { durationInFrames, fps } = useVideoConfig();
  const intro = instituteIntroSeconds * fps;
  return (
    <>
      <Sequence
        name="연구소 기술 영상"
        durationInFrames={intro}
        premountFor={0}
      >
        <InstituteBroll code={code} />
      </Sequence>
      <Sequence
        name="시상 분야 설명"
        from={intro}
        durationInFrames={durationInFrames - intro}
        premountFor={0}
      >
        <CeremonyPhotography shot="hall" mirror={code === "MS"} holdAt={40} />
        <CategoryIntroductions code={code} />
      </Sequence>
      <Bed cue="technology" />
    </>
  );
};

const RegularStage = ({ cue }: { cue: AwardCue }) => {
  const frame = useCurrentFrame();
  if (cue.kind === "credits")
    return <CeremonyPhotography shot="hall" holdAt={1} />;
  const profile = cue.code === "CW" ? "cw" : "ms";
  const detail = (cue.categoryIndex + (cue.code === "MS" ? 1 : 0)) % 3;
  if (detail !== 1)
    return <CeremonyPhotography shot="hall" mirror={detail === 2} />;
  return (
    <Freeze frame={29} active={frame >= 29}>
      <StagePlate mode={profile} zoom={1.23} x={cue.code === "CW" ? 6 : -6} />
    </Freeze>
  );
};

const Awards = ({ code }: Pick<AwardCue, "code">) => (
  <>
    <Bed cue="honors" gain={0.53} />
    {getInstituteAwardCues(code).map((cue) => (
      <Sequence
        key={cue.start}
        from={cue.start}
        durationInFrames={cue.frames}
        premountFor={0}
        name={`${cue.kind === "credits" ? "마일리지 명단" : cue.kind} · ${cue.categoryIndex + 1}`}
      >
        {cue.kind === "grand" ? <PrizeReveal /> : <RegularStage cue={cue} />}
        <CategoryHonors cue={cue} />
      </Sequence>
    ))}
  </>
);

const scenes = [
  {
    name: "오프닝",
    Scene: () => (
      <>
        <OpeningStage />
        <OpeningTitle from={1.5} />
        <Bed cue="opening" />
      </>
    ),
  },
  {
    name: "일정 소개",
    Scene: () => (
      <>
        <StagePlate mode="schedule" zoom={1.24} x={-5} y={3} />
        <ScheduleTitle />
        <Bed cue="technology" />
      </>
    ),
  },
  {
    name: "CW 시상 분야",
    Scene: () => <InstituteCategories code="CW" />,
  },
  { name: "CW 수상자", Scene: () => <Awards code="CW" /> },
  {
    name: "MS 시상 분야",
    Scene: () => <InstituteCategories code="MS" />,
  },
  { name: "MS 수상자", Scene: () => <Awards code="MS" /> },
  {
    name: "한 해의 성과와 감사",
    Scene: () => (
      <>
        <Appreciation />
        <Bed cue="ending" gain={0.47} />
      </>
    ),
  },
  {
    name: "참석자 퀴즈 안내",
    Scene: () => (
      <>
        <QuizTitle />
        <Bed cue="quiz" />
        <Sequence
          from={quizPopFrame}
          durationInFrames={36}
          layout="none"
          name="선물상자 개봉 효과음"
        >
          <Audio
            src={staticFile("assets/reference-cut/gift-pop.wav")}
            volume={0.48}
          />
        </Sequence>
      </>
    ),
  },
  {
    name: "엔딩",
    Scene: () => (
      <>
        <CeremonyPhotography shot="finale" holdAt={55} />
        <EndingTitle light />
        <Bed cue="ending" />
      </>
    ),
  },
];

const StageTransition = () => {
  const frame = useCurrentFrame();
  if (frame >= 16) return null;
  const travel = interpolate(frame, [0, 16], [-40, 46], rounded);
  const opacity = interpolate(frame, [0, 16], [0.56, 0], rounded);
  return (
    <AbsoluteFill
      aria-hidden="true"
      style={{
        opacity,
        pointerEvents: "none",
        transform: `translateX(${travel}%)`,
        background:
          "linear-gradient(105deg, #070b11 12%, #11182a 29%, transparent 63%)",
      }}
    />
  );
};

const BlackBookend = ({ closing = false }: { closing?: boolean }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const distance = closing ? durationInFrames - 1 - frame : frame;
  return (
    <AbsoluteFill
      aria-hidden="true"
      style={{
        backgroundColor: "#000",
        opacity: interpolate(distance, [0, closing ? 26 : 30], [1, 0], rounded),
        pointerEvents: "none",
      }}
    />
  );
};

export const CinematicMaster = () => (
  <AbsoluteFill lang="ko" style={surface}>
    {scenes.map(({ name, Scene }, i) => (
      <Sequence key={name} name={name} {...masterCues[i]} premountFor={0}>
        <Scene />
        {i === 0 ? (
          <BlackBookend />
        ) : i === scenes.length - 1 ? (
          <BlackBookend closing />
        ) : (
          <StageTransition />
        )}
      </Sequence>
    ))}
  </AbsoluteFill>
);

export const OpeningProof = () => (
  <AbsoluteFill lang="ko" style={surface}>
    <OpeningStage />
    <OpeningTitle from={1.85} />
    <Bed cue="opening" />
    <BlackBookend />
  </AbsoluteFill>
);

export const AwardProof = () => {
  const grand = getInstituteAwardCues("CW").find(
    ({ kind }) => kind === "grand",
  );
  if (!grand) throw new Error("Opening proof needs a workbook grand prize.");
  return (
    <AbsoluteFill lang="ko" style={surface}>
      <PrizeReveal />
      <CategoryHonors cue={{ ...grand, frames: 150 }} />
    </AbsoluteFill>
  );
};
