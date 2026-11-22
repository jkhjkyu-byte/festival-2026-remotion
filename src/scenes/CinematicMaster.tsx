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
import {
  getInstituteAwardCues,
  masterCues,
  type AwardCue,
} from "../data/cinematic-timeline";
import { CeremonySpace, type CeremonySpaceProps } from "../three/CeremonySpace";
import { CategoryHonors, CategoryIntroductions } from "./CinematicAwards";
import { InstituteBroll } from "./InstituteBroll";
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
      <StagePlate mode={code === "CW" ? "cw" : "ms"} gold zoom={1.15} />
    </AbsoluteFill>
  );
};

const OpeningStage = () => {
  const frame = useCurrentFrame();
  // Opening moves from a metallic detail to a wide stage, followed by a settled title.
  const close = frame < 84;
  const zoom = close
    ? interpolate(frame, [0, 83], [1.58, 1.25], rounded)
    : 1.04;
  return (
    <AbsoluteFill style={{ backgroundColor: "#060a16" }}>
      <StagePlate
        mode="opening"
        zoom={zoom}
        x={close ? 12 : 0}
        y={close ? -2 : 0}
      />
      {close && (
        <AbsoluteFill
          style={{
            background: "linear-gradient(110deg,#050917b0,transparent 64%)",
          }}
        />
      )}
    </AbsoluteFill>
  );
};

const InstituteCategories = ({ code }: Pick<AwardCue, "code">) => {
  const { durationInFrames, fps } = useVideoConfig();
  const intro = Math.round(3.8 * fps);
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
        <StagePlate
          mode={code === "CW" ? "cw" : "ms"}
          zoom={1.27}
          x={code === "CW" ? 7 : -7}
        />
        <CategoryIntroductions code={code} />
      </Sequence>
      <Bed cue="technology" />
    </>
  );
};

const Awards = ({ code }: Pick<AwardCue, "code">) => {
  const frame = useCurrentFrame();
  const cues = getInstituteAwardCues(code);
  const mileage = cues.find(({ kind }) => kind === "credits");
  return (
    <>
      <Freeze
        frame={(mileage?.start ?? 0) + 30}
        active={!!mileage && frame >= mileage.start}
      >
        <StagePlate mode={code === "CW" ? "cw" : "ms"} />
      </Freeze>
      <Bed cue="honors" gain={0.53} />
      {cues.map((cue) => (
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
};

const scenes = [
  {
    name: "오프닝",
    Scene: () => (
      <>
        <OpeningStage />
        <OpeningTitle />
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
    name: "참석자 퀴즈 안내",
    Scene: () => (
      <>
        <QuizTitle />
        <Bed cue="quiz" />
        <Sequence
          from={76}
          durationInFrames={35}
          layout="none"
          name="선물 리본 효과음"
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
