import { useId } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { festivalAwards } from "../data/award-roster";

const easeOut = {
  easing: Easing.bezier(0.22, 1, 0.36, 1),
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const documentIcon =
  "M-20-26H7L20-13V26H-20Z M7-26V-13H20 M-11-4H11 M-11 6H11 M-11 16H5";
const gearIcon =
  "M-7-24H7L9-18 15-15 22-17 27-7 22-2V4L27 8 21 18 14 17 9 20 7 26H-7L-9 20-15 17-22 18-27 8-22 4V-2L-27-7-22-17-15-15-9-18Z M0-10a11 11 0 1 0 0 22 11 11 0 0 0 0-22Z";

const icons: Readonly<Record<string, string>> = {
  논문: documentIcon,
  특허: "M-23-24H15V-1 M-23-24V24H-4 M-15-14H7 M-15-5H1 M-15 6H-5 M15 0a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z M11 17 9 27 15 24 21 27 19 17",
  "BP(개발설계)":
    "M0-25 23-12V14L0 27-23 14V-12Z M-23-12 0 1 23-12 M0 1V27 M-11-18 12-5V8",
  "BP(전문기술)": gearIcon,
  "BP(제조전문)": gearIcon,
  "BP(혁신과제)":
    "M-11 12C-11 3-20-1-20-11a20 20 0 0 1 40 0C20-1 11 3 11 12 M-11 12H11 M-9 19H9 M-4 26H4 M0-19V-1 M-8-10H8",
  "7S 낭비제거활동":
    "M-25-18H-6V1H-25Z M-25 9H-6V26H-25Z M4 9H23V26H4Z M13-23 16-14 25-11 16-8 13 1 10-8 1-11 10-14Z",
  "멘토멘티 협동과제":
    "M-14-20a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z M14-20a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z M-28 20V13Q-28 2-14 2 -4 2 0 10 4 2 14 2 28 2 28 13V20 M-8 18 0 25 8 18",
  부품국산화:
    "M-23-22H-9V-7H-23Z M9-22H23V-7H9Z M-7 10H7V25H-7Z M-16-7V2H16V-7 M0 2V10 M-28-25V-30H-20 M28-25V-30H20",
  산학과제: "M-28-9 0-24 28-9 0 6Z M-17-3V12Q0 24 17 12V-3 M27-8V12 M27 12V18",
  "실시제안 마일리지":
    "M-24 22H24 M-20 15V6 M-8 15V0 M4 15V-8 M16 15V-16 M-24-4-11-12-1-10 21-25 M9-25H21V-13",
};

const splitNames: Readonly<Record<string, readonly string[]>> = {
  "7S 낭비제거활동": ["7S", "낭비제거활동"],
  "멘토멘티 협동과제": ["멘토멘티", "협동과제"],
  "실시제안 마일리지": ["실시제안", "마일리지"],
};

const viewWidth = 1980;
const viewHeight = 540;
const orbitX = 990;
const orbitY = 309;
const orbitRadiusX = 367;
const orbitRadiusY = 135;
const hexOuter = "-105,0 -55,-86 55,-86 105,0 55,86 -55,86";
const hexDarkBevel = "-100,0 -53,-82 53,-82 100,0 53,82 -53,82";
const hexFace = "-95,0 -50,-78 50,-78 95,0 50,78 -50,78";

// Position the diagonals by the beveled edges so the gaps match on a wide orbit.
const diagonal = Math.acos(209 / orbitRadiusX);
const eightCardAngles = [
  -Math.PI / 2,
  -diagonal,
  0,
  diagonal,
  Math.PI / 2,
  Math.PI - diagonal,
  Math.PI,
  Math.PI + diagonal,
];

const font = "'Noto Sans CJK KR', 'Noto Sans KR', Arial, sans-serif";

export const GalaCategoryOrbit = ({ code }: { code: "CW" | "MS" }) => {
  const frame = useCurrentFrame();
  const artworkId = useId();
  const { name, categories } = festivalAwards[code];
  const titleProgress = interpolate(frame, [0, 24], [0, 1], easeOut);
  const orbitProgress = interpolate(frame, [0, 33], [0, 1], easeOut);

  return (
    <AbsoluteFill
      lang="ko"
      style={{
        background:
          "radial-gradient(ellipse at 50% 54%, #14243d 0%, #0a1323 48%, #04070f 83%)",
      }}
    >
      <svg
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        width="100%"
        height="100%"
        role="img"
        aria-label={`${name} 시상 분야`}
        style={{ display: "block", fontFamily: font }}
      >
        <defs>
          <linearGradient
            id={`${artworkId}-rim`}
            x1="18%"
            x2="85%"
            y1="0%"
            y2="100%"
          >
            <stop offset="0" stopColor="#745024" />
            <stop offset=".18" stopColor="#ffe4a4" />
            <stop offset=".36" stopColor="#ab782f" />
            <stop offset=".55" stopColor="#f2c46f" />
            <stop offset=".72" stopColor="#996325" />
            <stop offset=".88" stopColor="#e1af6c" />
            <stop offset="1" stopColor="#613a14" />
          </linearGradient>
          <linearGradient
            id={`${artworkId}-face`}
            x1="15%"
            x2="80%"
            y1="0%"
            y2="100%"
          >
            <stop offset="0" stopColor="#263e5d" />
            <stop offset=".27" stopColor="#142740" />
            <stop offset=".7" stopColor="#0b182b" />
            <stop offset="1" stopColor="#06101f" />
          </linearGradient>
          <linearGradient
            id={`${artworkId}-orbit`}
            x1="3%"
            x2="97%"
            y1="4%"
            y2="100%"
          >
            <stop offset="0" stopColor="#ffb847" stopOpacity=".48" />
            <stop offset=".2" stopColor="#ffe2a4" />
            <stop offset=".49" stopColor="#b5813b" stopOpacity=".8" />
            <stop offset=".76" stopColor="#fff0b7" />
            <stop offset="1" stopColor="#d78b3a" stopOpacity=".64" />
          </linearGradient>
          <radialGradient id={`${artworkId}-floor`}>
            <stop offset="0" stopColor="#f3a83d" stopOpacity=".18" />
            <stop offset=".47" stopColor="#ca8229" stopOpacity=".085" />
            <stop offset="1" stopColor="#70441d" stopOpacity="0" />
          </radialGradient>
          <filter
            id={`${artworkId}-bloom`}
            x="-25%"
            y="-65%"
            width="150%"
            height="230%"
          >
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>

        <ellipse
          cx={orbitX}
          cy="466"
          rx="625"
          ry="62"
          fill={`url(#${artworkId}-floor)`}
          opacity={orbitProgress}
        />
        <g opacity={orbitProgress} fill="none">
          <ellipse
            cx={orbitX}
            cy={orbitY}
            rx={orbitRadiusX}
            ry={orbitRadiusY}
            stroke="#f0a73b"
            strokeWidth="11"
            opacity=".43"
            filter={`url(#${artworkId}-bloom)`}
          />
          <ellipse
            cx={orbitX}
            cy={orbitY}
            rx={orbitRadiusX}
            ry={orbitRadiusY}
            stroke={`url(#${artworkId}-orbit)`}
            strokeWidth="2.5"
          />
        </g>

        <g opacity={titleProgress} textAnchor="middle">
          <text
            x={orbitX}
            y="53"
            fontSize="43"
            fontWeight="750"
            letterSpacing=".4"
            fill="#fff5df"
          >
            {name} 시상 분야
          </text>
        </g>

        {categories.map(({ name: award }, index) => {
          const angle =
            categories.length === eightCardAngles.length
              ? eightCardAngles[index]
              : (index * Math.PI * 2) / categories.length - Math.PI / 2;
          const x = orbitX + orbitRadiusX * Math.cos(angle);
          const y = orbitY + orbitRadiusY * Math.sin(angle);
          const progress = interpolate(
            frame,
            [4 + index * 2, 31 + index * 2],
            [0, 1],
            easeOut,
          );
          const lines = splitNames[award] ?? [award];
          const icon = icons[award] ?? documentIcon;

          return (
            <g
              key={award}
              aria-label={award}
              transform={`translate(${x} ${y + (1 - progress) * 15}) scale(${0.78 + progress * 0.06})`}
              opacity={progress}
            >
              <polygon
                points={hexOuter}
                fill="#0a0b11"
                stroke="#e89d36"
                strokeWidth="4"
                opacity=".38"
                filter={`url(#${artworkId}-bloom)`}
              />
              <polygon
                points={hexOuter}
                fill={`url(#${artworkId}-rim)`}
                stroke="#c88f40"
                strokeWidth="1"
              />
              <polygon points={hexDarkBevel} fill="#50321a" />
              <polygon
                points={hexFace}
                fill={`url(#${artworkId}-face)`}
                stroke="#f0bc72"
                strokeWidth=".9"
              />
              <path
                d="M-103-2-54-85H54L72-55"
                fill="none"
                stroke="#ffe1a5"
                strokeWidth="1.1"
                strokeOpacity=".72"
              />
              <path
                d={icon}
                transform={`translate(0 ${lines.length > 1 ? -31 : -27})`}
                fill="none"
                stroke="#f3c67e"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <text
                y={lines.length > 1 ? 18 : 37}
                fontSize={lines.length > 1 ? 23 : 27}
                fontWeight="700"
                textAnchor="middle"
                fill="#fff4df"
              >
                {lines.map((line, lineIndex) => (
                  <tspan key={line} x="0" dy={lineIndex === 0 ? 0 : 27}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
