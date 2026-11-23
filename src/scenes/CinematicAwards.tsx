import type { CSSProperties } from "react";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { festivalAwards } from "../data/award-roster";
import { formatMentorMenteeNames } from "../data/award-display";
import type { AwardCue } from "../data/cinematic-timeline";

type InstituteCode = AwardCue["code"];
type Recipient = AwardCue["recipients"][number];

const pearl = "#EDEFEA";
const silver = "#A5B5C2";
const champagne = "#EDCC91";
const easing = {
  easing: Easing.bezier(0.22, 1, 0.36, 1),
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const text: CSSProperties = {
  color: pearl,
  fontWeight: 750,
  letterSpacing: "-0.04em",
  lineHeight: 1.18,
  overflowWrap: "anywhere",
  wordBreak: "keep-all",
};

const label: CSSProperties = {
  color: silver,
  fontWeight: 650,
  lineHeight: 1.2,
  letterSpacing: "0.04em",
};

const leftShade =
  "linear-gradient(90deg, #030714F0 0%, #030714D3 32%, #03071466 57%, transparent 80%)";
const centerShade =
  "radial-gradient(ellipse at 50% 55%, #060B17EA 3%, #060B17AA 48%, transparent 82%)";

const settle = (frame: number, start: number, length: number) =>
  interpolate(frame, [start, start + Math.max(1, length)], [0, 1], easing);

const namesFor = (recipient: Recipient) =>
  recipient.names.length > 0 ? recipient.names.join(" · ") : recipient.team;

export const CategoryIntroductions = ({ code }: { code: InstituteCode }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const { name, categories } = festivalAwards[code];
  const index = Math.max(
    0,
    Math.min(
      categories.length - 1,
      Math.floor((frame * categories.length) / durationInFrames),
    ),
  );
  const phase =
    frame - Math.ceil((index * durationInFrames) / categories.length);
  const category = categories[index];
  const alignRight =
    (Math.floor(index / 2) + (code === "MS" ? 1 : 0)) % 2 === 1;

  return (
    <AbsoluteFill
      style={{
        background: alignRight
          ? "linear-gradient(270deg,#060a17ee 0%,#0a172bce 38%,#10253652 72%,transparent)"
          : leftShade,
        padding: alignRight ? "14cqh 8cqw 13cqh 0" : "14cqh 0 13cqh 9cqw",
        alignItems: alignRight ? "flex-end" : "flex-start",
        justifyContent: "center",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "9cqh",
          ...(alignRight ? { left: "10cqw" } : { right: "13cqw" }),
          color: "#c2def015",
          fontWeight: 850,
          fontSize: "49cqh",
          lineHeight: 1,
          letterSpacing: "-.085em",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>
      <div
        style={{
          ...label,
          width: "48cqw",
          fontSize: "4.6cqh",
          marginBottom: "7cqh",
        }}
      >
        {name} 시상 분야
      </div>
      <div style={{ width: "48cqw", minHeight: "32cqh" }}>
        <Interactive.Div
          name="소개 분야명"
          style={{
            ...text,
            fontSize: "10cqh",
            opacity: interpolate(phase, [0, fps * 0.35], [0.2, 1], easing),
            translate: interpolate(
              phase,
              [0, fps * 0.48],
              ["-1.15cqw 0px", "0cqw 0px"],
              easing,
            ),
          }}
        >
          {category.name}
        </Interactive.Div>
        <div
          aria-hidden="true"
          style={{
            width: "10cqw",
            height: "0.2cqh",
            margin: "3.15cqh 0 3.25cqh",
            transformOrigin: "left",
            scale: `${settle(phase, 0, fps * 0.46)} 1`,
            background: "linear-gradient(90deg, #74A5FF, #74A5FF20)",
          }}
        />
        <Interactive.Div
          name="소개 분야 설명"
          style={{
            ...text,
            color: "#D9E2EC",
            fontSize: "4.85cqh",
            fontWeight: 530,
            lineHeight: 1.43,
            opacity: interpolate(
              phase,
              [fps * 0.08, fps * 0.44],
              [0.17, 1],
              easing,
            ),
          }}
        >
          {category.description}
        </Interactive.Div>
      </div>
    </AbsoluteFill>
  );
};

const RegularAwards = ({ cue }: { cue: AwardCue }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { name, categories } = festivalAwards[cue.code];
  const category = categories[cue.categoryIndex];
  const single = cue.recipients.length === 1;
  const columns = cue.recipients.length > 4 ? 2 : 1;

  return (
    <AbsoluteFill
      style={{
        background: single ? leftShade : centerShade,
        padding: single ? "0 43cqw 0 10cqw" : "0 9cqw",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          marginBottom: single ? "7cqh" : "5cqh",
          textAlign: single ? "left" : "center",
        }}
      >
        <div style={{ ...label, fontSize: "3.65cqh", marginBottom: "1.25cqh" }}>
          {name}
        </div>
        <Interactive.Div
          name="수상 분야명"
          style={{ ...text, fontSize: single ? "7.25cqh" : "7.85cqh" }}
        >
          {category.name}
        </Interactive.Div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${Math.ceil(cue.recipients.length / columns)}, auto)`,
          gridAutoFlow: "column",
          columnGap: "4cqw",
          rowGap: columns === 2 ? "2.7cqh" : "3.6cqh",
          width: "100%",
          maxWidth: single ? undefined : columns === 2 ? "83cqw" : "64cqw",
          alignSelf: single ? "flex-start" : "center",
        }}
      >
        {cue.recipients.map((recipient, index) => {
          const progress = settle(
            frame,
            fps * (0.02 + index * 0.078),
            fps * 0.27,
          );
          return (
            <div
              key={`${recipient.rank}:${recipient.team}:${index}`}
              style={{
                display: "grid",
                gridTemplateColumns: single ? "1fr" : "7.6cqw minmax(0, 1fr)",
                alignItems: "baseline",
                gap: single ? "1.2cqh" : "0.75cqw",
                opacity: progress,
                translate: `0px ${1.45 * (1 - progress)}cqh`,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  ...label,
                  color: "#C2D6E8",
                  fontSize: single ? "5.2cqh" : "3.65cqh",
                  letterSpacing: "-0.035em",
                  overflowWrap: "anywhere",
                  wordBreak: "keep-all",
                }}
              >
                {recipient.rank}
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    ...text,
                    fontSize: single ? "10.1cqh" : "5.25cqh",
                    lineHeight: 1.12,
                  }}
                >
                  {formatMentorMenteeNames(recipient.names) ??
                    namesFor(recipient)}
                </div>
                {recipient.names.length > 0 ? (
                  <div
                    style={{
                      ...text,
                      color: "#C1CCD5",
                      fontWeight: 500,
                      fontSize: single ? "4.35cqh" : "3.5cqh",
                      marginTop: "0.65cqh",
                    }}
                  >
                    {recipient.team}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const GrandHonors = ({ cue }: { cue: AwardCue }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { name, categories } = festivalAwards[cue.code];
  const { name: category } = categories[cue.categoryIndex];
  const titleAt = Math.min(fps * 0.22, cue.frames * 0.09);
  const namesAt = Math.min(fps * 0.53, cue.frames * 0.17);
  const multiple = cue.recipients.length > 1;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "10cqh 8cqw",
        background:
          "radial-gradient(ellipse at 50% 54%, #130D06D9 0%, #130D0690 47%, transparent 78%)",
      }}
    >
      <Interactive.Div
        name="Grand Prize"
        style={{
          ...label,
          color: champagne,
          fontSize: "3.65cqh",
          letterSpacing: "0.21em",
          opacity: interpolate(
            frame,
            [0, titleAt + fps * 0.12],
            [0, 1],
            easing,
          ),
        }}
      >
        GRAND PRIZE
      </Interactive.Div>
      <Interactive.Div
        name="대상 발표"
        style={{
          ...text,
          color: champagne,
          fontSize: "15cqh",
          fontWeight: 850,
          opacity: interpolate(
            frame,
            [titleAt, titleAt + fps * 0.36],
            [0, 1],
            easing,
          ),
          textShadow: "0 0 3.4cqh #CF8E4280",
        }}
      >
        대상
      </Interactive.Div>
      <div
        style={{
          ...label,
          color: "#E5D0A9",
          fontSize: "4.55cqh",
          opacity: settle(frame, titleAt + fps * 0.08, fps * 0.37),
        }}
      >
        {name} · {category}
      </div>
      <div
        aria-hidden="true"
        style={{
          width: "48cqw",
          height: "0.22cqh",
          margin: "4.35cqh auto 3.85cqh",
          background:
            "linear-gradient(90deg, transparent 0%, #B88745 24%, #FFE6B9 50%, #B88745 76%, transparent 100%)",
          scale: `${settle(frame, namesAt - fps * 0.14, fps * 0.58)} 1`,
        }}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: multiple ? "repeat(2, minmax(0, 1fr))" : "1fr",
          gap: "3.1cqw",
          opacity: settle(frame, namesAt, fps * 0.31),
          width: "100%",
        }}
      >
        {cue.recipients.map((recipient, index) => (
          <div key={`${recipient.team}:${index}`} style={{ minWidth: 0 }}>
            <div
              style={{
                ...text,
                color: "#FFF2D9",
                fontSize: multiple ? "9.2cqh" : "13.4cqh",
              }}
            >
              {namesFor(recipient)}
            </div>
            {recipient.names.length > 0 ? (
              <div
                style={{
                  ...text,
                  color: "#EADACC",
                  fontWeight: 520,
                  fontSize: "4.45cqh",
                  marginTop: "1.55cqh",
                }}
              >
                {recipient.team}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const MileageRoster = ({ cue }: { cue: AwardCue }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { name, categories } = festivalAwards[cue.code];
  const category = categories[cue.categoryIndex];
  const columns = cue.recipients.length > 5 ? 2 : 1;

  return (
    <AbsoluteFill
      style={{
        padding: "9cqh 11cqw",
        justifyContent: "center",
        background: centerShade,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ ...label, fontSize: "3.65cqh" }}>{name}</div>
        <div style={{ ...text, fontSize: "8.6cqh", marginTop: "1.2cqh" }}>
          {category.name}
        </div>
      </div>
      <div
        aria-label="실시제안 마일리지 수상자"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gridAutoFlow: "column",
          gridTemplateRows: `repeat(${Math.ceil(cue.recipients.length / columns)}, auto)`,
          gap: "2.15cqh 5.2cqw",
          width: columns === 2 ? "100%" : "64cqw",
          alignSelf: "center",
          marginTop: "7.4cqh",
          opacity: interpolate(frame, [0, fps * 0.5], [0.18, 1], easing),
        }}
      >
        {cue.recipients.map((recipient, index) => (
          <div
            key={`${recipient.team}:${index}`}
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 0.8fr) minmax(0, 1.2fr)",
              alignItems: "baseline",
              gap: "1.4cqw",
            }}
          >
            <div style={{ ...text, fontSize: "5.1cqh", textAlign: "right" }}>
              {namesFor(recipient)}
            </div>
            <div
              style={{
                ...text,
                color: "#C0CBD4",
                fontSize: "3.65cqh",
                fontWeight: 520,
              }}
            >
              {recipient.team}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const CategoryHonors = ({ cue }: { cue: AwardCue }) => {
  if (cue.kind === "grand") return <GrandHonors cue={cue} />;
  if (cue.kind === "credits") return <MileageRoster cue={cue} />;
  return <RegularAwards cue={cue} />;
};
