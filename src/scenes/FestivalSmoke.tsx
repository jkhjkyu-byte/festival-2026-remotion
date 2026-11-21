import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const easeOut = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.bezier(0.22, 1, 0.36, 1),
} as const;

const FestivalEmblem = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 640 640"
      style={{
        position: "absolute",
        top: "8%",
        right: "2.5%",
        width: "46%",
        height: "84%",
        overflow: "visible",
        opacity: interpolate(frame, [0, 1.4 * fps], [0.15, 1], easeOut),
        scale: interpolate(frame, [0, 1.4 * fps], [0.93, 1], easeOut),
        rotate: interpolate(frame, [0, 1.4 * fps], ["-5deg", "0deg"], easeOut),
      }}
    >
      <defs>
        <linearGradient id="festival-brass" x1="0" y1="0.06" x2="1" y2="0.83">
          <stop offset="0" stopColor="#523A23" />
          <stop offset="0.35" stopColor="#E9BE78" />
          <stop offset="0.46" stopColor="#FFE2AC" />
          <stop offset="0.7" stopColor="#A5733E" />
          <stop offset="1" stopColor="#211A1D" />
        </linearGradient>
        <linearGradient id="festival-rim" x2="0.82" y2="1">
          <stop offset="0" stopColor="#292738" />
          <stop offset="0.48" stopColor="#C09663" />
          <stop offset="1" stopColor="#282231" />
        </linearGradient>
        <linearGradient id="festival-depth" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#536181" />
          <stop offset="0.48" stopColor="#222C49" />
          <stop offset="1" stopColor="#0A1020" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="#7797AD" opacity="0.34">
        <circle cx="320" cy="320" r="275" strokeDasharray="2 12" />
        <path d="M320 24v35m0 522v35M24 320h35m522 0h35" />
        <path d="M70 178v-32h32m436 0h32v32m0 284v32h-32m-436 0H70v-32" />
        <path d="M37 373h98m370-106h98" />
      </g>
      <path
        d="M309 128 511 230 493 440 315 560 121 419 142 224Z M314 210 424 266 413 376 311 445 205 367 218 263Z"
        fill="url(#festival-depth)"
        fillRule="evenodd"
        stroke="#394863"
        strokeWidth="2"
      />
      <path
        d="M289 105 489 207 472 414 294 534 101 394 123 199Z M295 188 403 243 393 352 292 421 186 343 198 240Z"
        fill="url(#festival-brass)"
        fillRule="evenodd"
        stroke="url(#festival-rim)"
        strokeWidth="2"
      />
      <path
        d="M289 105 489 207 472 414 294 534 101 394 123 199Z M295 188 403 243 393 352 292 421 186 343 198 240Z"
        fill="none"
        stroke="#FCE6B8"
        strokeWidth="1.4"
        opacity="0.5"
      />
      <path
        d="m101 394 193 140 178-120m17-207 22 23m-39 184 21 26m-199 94 21 26m-214-166 20 25m277-164-6 98-100 68"
        fill="none"
        stroke="#F7CF88"
        strokeWidth="1.5"
        opacity="0.46"
      />
      <path
        d="m292 253 57 34-8 65-59 30-53-41 9-61Z"
        fill="none"
        stroke="#E9BE78"
        strokeWidth="1"
        opacity="0.36"
      />
      <path
        d="M123 199 289 105 489 207"
        fill="none"
        stroke="#FFF2CE"
        strokeWidth="2.5"
        strokeLinecap="round"
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset={interpolate(frame, [0, 1.15 * fps], [1, 0], easeOut)}
      />
    </svg>
  );
};

const FestivalTitle = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        position: "absolute",
        top: "24.5%",
        left: "10%",
        color: "#F4F7FC",
        fontFamily:
          '"Noto Sans CJK KR", "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif',
        whiteSpace: "nowrap",
      }}
    >
      <Interactive.Div
        name="행사 연도"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.15cqw",
          color: "#E9BE78",
          fontSize: "2.75cqw",
          fontWeight: 600,
          lineHeight: 1.2,
          letterSpacing: "0.19em",
          opacity: interpolate(
            frame,
            [0.16 * fps, 0.66 * fps],
            [0, 1],
            easeOut,
          ),
        }}
      >
        2026
        <span
          aria-hidden="true"
          style={{ width: "4.5cqw", height: 1.5, background: "#E9BE78" }}
        />
      </Interactive.Div>
      <Interactive.Div
        name="행사 이름"
        lang="ko"
        style={{
          marginTop: "0.85cqw",
          fontSize: "6.55cqw",
          fontWeight: 700,
          lineHeight: 1.08,
          letterSpacing: "-0.055em",
          translate: interpolate(
            frame,
            [0.18 * fps, 0.98 * fps],
            ["0px 2.2cqw", "0px 0cqw"],
            easeOut,
          ),
          opacity: interpolate(
            frame,
            [0.18 * fps, 0.98 * fps],
            [0, 1],
            easeOut,
          ),
        }}
      >
        기술/혁신
      </Interactive.Div>
      <Interactive.Div
        name="페스티벌 제목"
        style={{
          marginTop: "0.54cqw",
          fontFamily: "Arial, sans-serif",
          fontSize: "6.4cqw",
          fontWeight: 700,
          lineHeight: 1.02,
          letterSpacing: "0.025em",
          translate: interpolate(
            frame,
            [0.27 * fps, 1.06 * fps],
            ["0px 2cqw", "0px 0cqw"],
            easeOut,
          ),
          opacity: interpolate(
            frame,
            [0.27 * fps, 1.06 * fps],
            [0, 1],
            easeOut,
          ),
        }}
      >
        FESTIVAL
      </Interactive.Div>
    </div>
  );
};

export const FestivalSmoke = () => (
  <AbsoluteFill
    style={{
      containerType: "inline-size",
      overflow: "hidden",
      background:
        "radial-gradient(ellipse at 76% 49%, #1B2943 0%, #111F35 30%, #0A1020 63%, #070C18 100%)",
    }}
  >
    <FestivalEmblem />
    <FestivalTitle />
  </AbsoluteFill>
);
