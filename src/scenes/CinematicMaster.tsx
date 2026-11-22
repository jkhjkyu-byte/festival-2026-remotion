import {
  AbsoluteFill,
  Audio,
  interpolate,
  Loop,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  getInstituteAwardCues,
  masterCues,
  type AwardCue,
} from "../data/cinematic-timeline";
import { CeremonySpace, type CeremonySpaceProps } from "../three/CeremonySpace";
import { CategoryHonors, CategoryIntroductions } from "./CinematicAwards";
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

const StagePlate = (profile: CeremonySpaceProps) => (
  <AbsoluteFill style={{ pointerEvents: "none" }} aria-hidden="true">
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

const GoldLayer = ({ code, frames }: Pick<AwardCue, "code" | "frames">) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, 15, frames - 9, frames - 1],
    [0, 1, 1, 0],
    rounded,
  );
  return (
    <AbsoluteFill style={{ opacity }}>
      <StagePlate mode={code === "CW" ? "cw" : "ms"} gold />
    </AbsoluteFill>
  );
};

const Awards = ({ code }: Pick<AwardCue, "code">) => (
  <>
    <StagePlate mode={code === "CW" ? "cw" : "ms"} />
    <Bed cue="honors" gain={0.53} />
    {getInstituteAwardCues(code).map((cue) => (
      <Sequence
        key={cue.start}
        from={cue.start}
        durationInFrames={cue.frames}
        premountFor={0}
        name={`${cue.kind} · ${cue.categoryIndex + 1}`}
      >
        {cue.kind === "grand" && (
          <>
            <GoldLayer code={code} frames={cue.frames} />
            <Bed cue="gold" gain={0.67} />
          </>
        )}
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
        <StagePlate mode="opening" />
        <OpeningTitle />
        <Bed cue="opening" />
      </>
    ),
  },
  {
    name: "일정 소개",
    Scene: () => (
      <>
        <StagePlate mode="schedule" />
        <ScheduleTitle />
        <Bed cue="technology" />
      </>
    ),
  },
  {
    name: "CW 시상 분야",
    Scene: () => (
      <>
        <StagePlate mode="cw" />
        <CategoryIntroductions code="CW" />
        <Bed cue="technology" />
      </>
    ),
  },
  { name: "CW 수상자", Scene: () => <Awards code="CW" /> },
  {
    name: "MS 시상 분야",
    Scene: () => (
      <>
        <StagePlate mode="ms" />
        <CategoryIntroductions code="MS" />
        <Bed cue="technology" />
      </>
    ),
  },
  { name: "MS 수상자", Scene: () => <Awards code="MS" /> },
  {
    name: "참석자 퀴즈 안내",
    Scene: () => (
      <>
        <StagePlate mode="quiz" />
        <QuizTitle />
        <Bed cue="quiz" />
      </>
    ),
  },
  {
    name: "엔딩",
    Scene: () => (
      <>
        <StagePlate mode="ending" />
        <EndingTitle />
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
    <CeremonySpace mode="opening" />
    <OpeningTitle />
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
      <CeremonySpace mode="cw" gold />
      <CategoryHonors cue={{ ...grand, frames: 150 }} />
      <Bed cue="gold" />
    </AbsoluteFill>
  );
};
