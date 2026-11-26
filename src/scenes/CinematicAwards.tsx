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
import type { AwardCue, DescriptionCue } from "../data/cinematic-timeline";

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

export const CategoryDescription = ({ cue }: { cue: DescriptionCue }) => {
  const phase = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { code, categoryIndex: index } = cue;
  const { name, categories } = festivalAwards[code];
  const category = categories[index];
  const mileage = category.name === "실시제안 마일리지";
  const alignRight =
    mileage && (Math.floor(index / 2) + (code === "MS" ? 1 : 0)) % 2 === 1;

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
  const count = cue.recipients.length;
  const rowWidth = Math.min(84, 44 + count * 9);

  return (
    <AbsoluteFill
      style={{
        background: centerShade,
        padding: "7cqh 8cqw",
        justifyContent: "center",
        alignItems: "center",
        textShadow: "0 0.3cqh 1.1cqh #100A06",
      }}
    >
      <div style={{ marginBottom: "7cqh", textAlign: "center" }}>
        <div
          style={{
            ...label,
            fontSize: "3.9cqh",
            marginBottom: "1.2cqh",
            color: "#DED3BE",
          }}
        >
          {name}
        </div>
        <Interactive.Div
          name="수상 분야명"
          style={{ ...text, fontSize: "8.35cqh" }}
        >
          {cue.title ?? category.name}
        </Interactive.Div>
        {cue.rank && (
          <div
            style={{
              ...label,
              color: champagne,
              fontSize: "5.8cqh",
              marginTop: "4.2cqh",
            }}
          >
            {cue.rank}
          </div>
        )}
      </div>
      <div
        style={{
          display: "grid",
          alignItems: "start",
          gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
          gap: "1.8cqw",
          width: `${rowWidth}cqw`,
          textAlign: "center",
        }}
      >
        {cue.recipients.map((recipient, index) => {
          const progress = settle(
            frame,
            fps * (0.02 + index * 0.078),
            fps * 0.27,
          );
          const mentor = formatMentorMenteeNames(recipient.names);
          return (
            <div
              key={index}
              style={{
                minWidth: 0,
                opacity: progress,
                translate: `0px ${1.45 * (1 - progress)}cqh`,
              }}
            >
              {!cue.rank && recipient.rank && (
                <div
                  style={{
                    ...label,
                    color: champagne,
                    fontSize: "4.15cqh",
                    marginBottom: "1.55cqh",
                  }}
                >
                  {recipient.rank}
                </div>
              )}
              <div
                style={{
                  ...text,
                  fontSize: mentor ? "5.05cqh" : "6.55cqh",
                  lineHeight: 1.12,
                }}
              >
                {mentor ?? namesFor(recipient)}
              </div>
              {recipient.names.length > 0 && (
                <div
                  style={{
                    ...text,
                    color: "#DED3BE",
                    fontWeight: 500,
                    fontSize: "4.0cqh",
                    marginTop: "1.15cqh",
                  }}
                >
                  {recipient.team}
                </div>
              )}
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
        padding: "10cqh 29cqw 10cqh 8cqw",
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
