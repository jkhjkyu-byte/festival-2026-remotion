import {
  AbsoluteFill,
  Audio,
  Freeze,
  interpolate,
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
  getInstituteProgramCues,
  type AwardCue,
} from "../data/cinematic-timeline";
import { CeremonySpace, type CeremonySpaceProps } from "../three/CeremonySpace";
import { CategoryDescription, CategoryHonors } from "./CinematicAwards";
import { GalaInstituteBroll } from "./GalaInstituteBroll";
import { GalaBackdrop } from "./GalaBackdrop";
import { GalaCategoryOrbit } from "./GalaCategoryOrbit";
import { festivalAwards } from "../data/award-roster";
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
    <GalaBackdrop variant="grand" />
    <HonorProcession image="assets/gala-cut/trophy.jpg" />
    <Audio
      src={staticFile("assets/awards-order/prize-chime.wav")}
      volume={0.57}
    />
  </>
);

const OpeningHold = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      aria-hidden="true"
      style={{
        opacity: interpolate(frame, [116, 134], [0, 1], rounded),
        background:
          "radial-gradient(ellipse at 50% 44%, #111C2B 0%, #060B15 55%, #04070D 100%)",
      }}
    />
  );
};

const OpeningStage = () => (
  <>
    <Sequence durationInFrames={46} premountFor={0} name="금속 디테일">
      <CeremonyPhotography shot="macro" holdAt={45} />
    </Sequence>
    <Sequence from={46} durationInFrames={88} premountFor={0} name="무대 전경">
      <CeremonyPhotography shot="hall" holdAt={43} />
    </Sequence>
    <OpeningHold />
  </>
);

const InstituteCategories = ({ code }: Pick<AwardCue, "code">) => {
  const { durationInFrames, fps } = useVideoConfig();
  const intro = instituteIntroSeconds * fps;
  return (
    <>
      <Sequence name="본부 기술 영상" durationInFrames={intro} premountFor={0}>
        <GalaInstituteBroll code={code} />
      </Sequence>
      <Sequence
        name="시상 분야 원형 안내"
        from={intro}
        durationInFrames={durationInFrames - intro}
        premountFor={0}
      >
        <GalaCategoryOrbit code={code} />
      </Sequence>
      <Bed cue="technology" />
    </>
  );
};

const Awards = ({ code }: Pick<AwardCue, "code">) => (
  <>
    <Bed cue="honors" gain={0.53} />
    {getInstituteProgramCues(code).map((cue) => {
      const { name } = festivalAwards[code].categories[cue.categoryIndex];
      const isMileage = name === "실시제안 마일리지";
      const look =
        (cue.categoryIndex +
          (code === "MS" ? 1 : 0) +
          (cue.kind === "regular" && cue.rank === "우수" ? 1 : 0)) %
        2;
      return (
        <Sequence
          key={cue.start}
          from={cue.start}
          durationInFrames={cue.frames}
          premountFor={0}
          name={
            cue.kind === "description"
              ? `${name} 설명`
              : (cue.title ??
                `${name} ${cue.rank ?? (cue.kind === "grand" ? "대상" : "")}`.trim())
          }
        >
          {cue.kind === "grand" ? (
            <PrizeReveal />
          ) : isMileage ? (
            <Freeze frame={40} active={cue.kind === "description"}>
              <CeremonyPhotography
                shot="hall"
                mirror={cue.kind === "description" && code === "MS"}
                holdAt={cue.kind === "description" ? 40 : 1}
              />
            </Freeze>
          ) : (
            <GalaBackdrop
              variant={cue.kind === "description" ? "category" : "awards"}
              alternate={look === 1}
            />
          )}
          {cue.kind === "description" ? (
            <CategoryDescription cue={cue} />
          ) : (
            <CategoryHonors cue={cue} />
          )}
        </Sequence>
      );
    })}
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
        <GalaBackdrop variant="schedule" />
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
    name: "전시 포스터 퀴즈 안내",
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
