import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const clamped = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
const drift = { ...clamped, easing: Easing.bezier(0.24, 0.71, 0.19, 1) };
const leaf = Array.from({ length: 22 }, (_, index) => ({
  x: random(`honor:foil:x:${index}`),
  y: random(`honor:foil:y:${index}`),
  depth: random(`honor:foil:depth:${index}`),
  turn: random(`honor:foil:turn:${index}`),
}));

const Trophy = ({ sweep }: { readonly sweep: number }) => (
  <svg viewBox="0 0 416 399" width="100%" height="100%" aria-hidden="true">
    <defs>
      <linearGradient id="honor-fold-left" x1="0" x2="1" y1=".38" y2=".52">
        <stop offset="0" stopColor="#4E290F" />
        <stop offset=".24" stopColor="#BC8146" />
        <stop offset=".43" stopColor="#F7CE85" />
        <stop offset=".57" stopColor="#F9DFAD" />
        <stop offset=".72" stopColor="#8F4F1B" />
        <stop offset="1" stopColor="#482412" />
      </linearGradient>
      <linearGradient id="honor-fold-face" x1=".2" x2=".87" y1=".28" y2=".73">
        <stop offset="0" stopColor="#2D1409" />
        <stop offset=".29" stopColor="#734016" />
        <stop offset=".50" stopColor="#C88E4A" />
        <stop offset=".65" stopColor="#FDE2A7" />
        <stop offset=".73" stopColor="#AC6930" />
        <stop offset="1" stopColor="#482417" />
      </linearGradient>
      <linearGradient id="honor-fold-right" x1=".1" x2=".92" y1=".66" y2=".23">
        <stop offset="0" stopColor="#6C3A1D" />
        <stop offset=".24" stopColor="#AC7040" />
        <stop offset=".49" stopColor="#F8CF87" />
        <stop offset=".61" stopColor="#FFF5D3" />
        <stop offset=".76" stopColor="#A66224" />
        <stop offset="1" stopColor="#3D1A13" />
      </linearGradient>
      <linearGradient id="honor-pedestal">
        <stop offset="0" stopColor="#100C0C" />
        <stop offset=".26" stopColor="#473029" />
        <stop offset=".44" stopColor="#5A3C2D" />
        <stop offset=".63" stopColor="#201513" />
        <stop offset="1" stopColor="#0F0A0B" />
      </linearGradient>
      <linearGradient id="honor-edge" x1="0" x2=".62" y1="0" y2="1">
        <stop offset="0" stopColor="#FAE2B7" />
        <stop offset=".32" stopColor="#F5CB86" />
        <stop offset=".58" stopColor="#805024" />
        <stop offset="1" stopColor="#C18A55" />
      </linearGradient>
      <linearGradient
        id="honor-light-pass"
        gradientTransform={`translate(${sweep} 0)`}
      >
        <stop offset="0" stopColor="#FFFBE1" stopOpacity="0" />
        <stop offset=".49" stopColor="#FFFBE1" stopOpacity="0" />
        <stop offset=".52" stopColor="#FFFBE1" stopOpacity=".74" />
        <stop offset=".57" stopColor="#FCE4B0" stopOpacity=".18" />
        <stop offset=".69" stopColor="#FFFBE1" stopOpacity="0" />
      </linearGradient>
      <radialGradient id="honor-reflection">
        <stop offset="0" stopColor="#D28D4D" stopOpacity=".48" />
        <stop offset=".48" stopColor="#AA612E" stopOpacity=".19" />
        <stop offset="1" stopColor="#A55B26" stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx="212" cy="368" rx="195" ry="23" fill="url(#honor-reflection)" />
    <path
      d="M146 331Q211 320 276 331L278 362Q216 378 144 362Z"
      fill="url(#honor-pedestal)"
    />
    <path
      d="M146 331Q209 318 276 331Q223 350 146 331Z"
      fill="#62402D"
      stroke="#9B6B48"
      strokeWidth="1.2"
    />
    <path
      d="M147 360Q214 373 275 361"
      fill="none"
      stroke="#BD8755"
      strokeOpacity=".59"
      strokeWidth="1.8"
    />
    <path
      d="M198 334C196 271 148 239 123 187C84 105 144 46 214 21C187 59 164 107 175 154C190 218 242 262 225 332Z"
      fill="url(#honor-fold-left)"
      stroke="url(#honor-edge)"
      strokeWidth="1.3"
    />
    <path
      d="M214 21C176 86 158 123 170 158C192 221 244 263 225 332L209 337C229 278 174 237 146 180C119 126 149 55 214 21Z"
      fill="url(#honor-fold-face)"
    />
    <path
      d="M219 336C218 300 238 259 267 219C296 179 318 118 312 63C342 94 359 145 341 195C325 241 269 272 246 333Z"
      fill="url(#honor-fold-right)"
      stroke="url(#honor-edge)"
      strokeWidth="1.45"
    />
    <path
      d="M312 63C350 113 344 171 322 208C291 259 263 271 246 333L230 336C244 279 282 249 303 203C325 156 332 114 312 63Z"
      fill="url(#honor-fold-face)"
    />
    <path
      d="M214 21C176 86 158 123 170 158C192 221 244 263 225 332M312 63C344 109 336 164 317 206C290 252 262 273 246 333"
      fill="none"
      stroke="#F6D5A2"
      strokeWidth="1.1"
      strokeOpacity=".56"
    />
    <path
      d="M198 334C196 271 148 239 123 187C84 105 144 46 214 21C187 59 164 107 175 154C190 218 242 262 225 332ZM219 336C218 300 238 259 267 219C296 179 318 118 312 63C342 94 359 145 341 195C325 241 269 272 246 333Z"
      fill="url(#honor-light-pass)"
    />
    <path
      d="M155 335Q220 346 269 334"
      fill="none"
      stroke="#E0A46C"
      strokeOpacity=".45"
    />
  </svg>
);

export const HonorProcession = ({
  image,
}: { readonly image?: string } = {}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const frames = Math.min(
    durationInFrames,
    Math.max(2, Math.round(fps * 0.82)),
  );
  const progress = frame / Math.max(1, frames - 1);

  if (progress >= 1) return null;

  const enter = interpolate(progress, [0, 0.1], [0, 1], drift);
  const exit = interpolate(progress, [0.56, 1], [1, 0], clamped);
  const pull = interpolate(progress, [0, 0.69, 1], [2.7, 1, 0.94], drift);
  const light = interpolate(
    progress,
    [0, 0.2, 0.47, 0.75, 1],
    [0, 0.17, 0.72, 0.18, 0],
    clamped,
  );
  const travel = interpolate(progress, [0, 0.83], [16, 0], drift);

  return (
    <AbsoluteFill
      aria-hidden="true"
      style={{
        overflow: "hidden",
        pointerEvents: "none",
        opacity: enter * exit,
        background:
          "radial-gradient(ellipse at 76% 59%, #613517 0%, #2D1714 22%, #120E12 54%, #100D10 100%)",
      }}
    >
      {image ? (
        <Img
          src={staticFile(image)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 53%",
            transformOrigin: "72% 53%",
            scale: interpolate(progress, [0, 0.79], [1.54, 1], drift),
            translate: `${travel * -0.16}% 0`,
          }}
        />
      ) : (
        <>
          <div
            style={{
              position: "absolute",
              width: "57%",
              height: "14%",
              left: "46%",
              top: "83%",
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse, #D78A4F38 0%, #86432932 18%, transparent 74%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: "8.5%",
              top: "1%",
              width: "27%",
              height: "105%",
              scale: pull,
              translate: `${travel * -1.75}% ${travel * 2.2}%`,
              transformOrigin: "58% 25%",
            }}
          >
            <Trophy
              sweep={interpolate(progress, [0.08, 0.76], [-0.68, 0.51], drift)}
            />
          </div>
        </>
      )}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, #08090BA6 0%, #08090B73 47%, transparent 73%), linear-gradient(0deg, #06070AA1 0%, transparent 25%, transparent 84%, #06070A54 100%)",
        }}
      />
      {leaf.map((fleck, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: `${47 + fleck.x * 45 + progress * (3 + fleck.depth * 6)}%`,
            top: `${11 + fleck.y * 70 - progress * (2 + fleck.depth * 10)}%`,
            width: `${0.11 + fleck.depth * 0.16}cqh`,
            height: `${0.19 + fleck.depth * 0.33}cqh`,
            rotate: `${75 * fleck.turn + 91 * progress}deg`,
            backgroundColor: fleck.depth > 0.6 ? "#FFDB9D" : "#A96A47",
            opacity: light * (0.29 + 0.59 * fleck.depth),
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: "41%",
          top: "74%",
          width: "58%",
          height: "6%",
          background:
            "radial-gradient(ellipse, #FFD899AA 0%, #D9864564 20%, transparent 72%)",
          opacity: light * 0.69,
          scale: `${0.3 + 0.7 * progress} 1`,
        }}
      />
    </AbsoluteFill>
  );
};
