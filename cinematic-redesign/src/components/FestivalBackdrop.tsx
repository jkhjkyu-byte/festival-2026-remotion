import { useLayoutEffect, useRef } from "react";
import {
  AbsoluteFill,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type Mode =
  | "opening"
  | "schedule"
  | "categories"
  | "cw"
  | "ms"
  | "quiz"
  | "ending";

type Props = {
  readonly mode: Mode;
  readonly gold?: number;
  readonly intensity?: number;
  readonly durationInFrames?: number;
};

type Point = readonly [number, number];

const width = 1980;
const height = 540;
const centerX = width / 2;
const centerY = height / 2;
const blue = "#479DFF";
const cyan = "#9BEFFF";
const goldLight = "#F8CB83";
const tau = 2 * Math.PI;

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const mix = (from: number, to: number, amount: number) =>
  from + (to - from) * amount;
const ease = (value: number) => {
  const progress = clamp(value);
  return progress * progress * (3 - 2 * progress);
};

const dust = Array.from({ length: 48 }, (_, index) => ({
  angle: random(`festival:angle:${index}`) * tau,
  x: random(`festival:x:${index}`) * 2 - 1,
  y: random(`festival:y:${index}`) * 2 - 1,
  depth: random(`festival:depth:${index}`),
  size: 1 + random(`festival:size:${index}`) * 2.4,
}));

const trace = (ctx: CanvasRenderingContext2D, points: readonly Point[]) => {
  ctx.beginPath();
  ctx.moveTo(...points[0]);
  for (const point of points.slice(1)) {
    ctx.lineTo(...point);
  }
  ctx.stroke();
};

const grid = (
  ctx: CanvasRenderingContext2D,
  time: number,
  strength: number,
) => {
  ctx.save();
  ctx.strokeStyle = blue;
  ctx.lineWidth = 1;
  ctx.globalAlpha = strength;
  ctx.translate(centerX + Math.sin(time * 0.13) * 54, 225);
  ctx.beginPath();
  for (let index = -13; index <= 13; index++) {
    if (Math.abs(index) < 4) continue;
    const base = index * 101;
    ctx.moveTo(base * 0.38, 6);
    ctx.lineTo(base, 342);
  }

  for (let index = 0; index < 11; index++) {
    const depth = ((index + time * 0.55) % 11) / 11;
    const y = 16 + depth ** 2 * 330;
    const edge = mix(268, 430, depth);
    ctx.moveTo(-1120, y);
    ctx.lineTo(-edge, y);
    ctx.moveTo(edge, y);
    ctx.lineTo(1120, y);
  }
  ctx.stroke();
  ctx.restore();
};

const drawDust = (
  ctx: CanvasRenderingContext2D,
  time: number,
  converge: number,
  gold: number,
  intensity: number,
) => {
  ctx.save();
  const rgb = [
    Math.round(mix(155, 248, gold)),
    Math.round(mix(239, 203, gold)),
    Math.round(mix(255, 131, gold)),
  ];
  ctx.fillStyle = `rgb(${rgb.join(",")})`;
  for (const dot of dust) {
    const depth = (dot.depth + time * 0.045) % 1;
    const perspective = mix(0.68, 1.24, depth);
    const side = Math.sign(dot.x);
    const wing = (0.39 + Math.abs(dot.x) * 0.58) * centerX;
    const turn = dot.angle + time * 0.16 * gold;
    const x =
      centerX + mix(side * wing * perspective, Math.cos(turn) * 190, converge);
    const y =
      centerY + mix(dot.y * 230 * perspective, Math.sin(turn) * 100, converge);
    const size = dot.size * perspective;
    ctx.globalAlpha =
      (0.18 + 0.44 * Math.sin(depth * Math.PI)) *
      intensity *
      mix(1, 0.4, converge * (1 - gold));
    ctx.fillRect(x, y, size * mix(2.2, 1, converge), size);
  }
  ctx.restore();
};

const circuits = (
  ctx: CanvasRenderingContext2D,
  time: number,
  strength: number,
  spread: number,
) => {
  ctx.save();
  ctx.lineWidth = 1.3;
  for (const side of [-1, 1]) {
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.scale(side, 1);
    for (let index = 0; index < 7; index++) {
      const start = 1000 + index * 34;
      const end = mix(65 + index * 22, 413 + index * 28, spread);
      const y = -202 + 67 * index;
      const bend = (index % 2 === 0 ? 1 : -1) * (32 + index * 4);
      const kink = start - 220 + Math.sin(time * 0.23 + index) * 22;
      const flatEnd = kink - Math.abs(bend);
      ctx.globalAlpha = strength * (index % 2 === 0 ? 0.55 : 0.36);
      ctx.strokeStyle = blue;
      trace(ctx, [
        [start, y],
        [kink, y],
        [flatEnd, y + bend],
        [end, y + bend],
      ]);

      const travel = (time * 0.25 + index * 0.31 + side * 0.3 + 1) % 1;
      const x = mix(flatEnd, end, travel);
      ctx.globalAlpha = strength * 0.72 * Math.sin(travel * Math.PI);
      ctx.strokeStyle = cyan;
      ctx.lineWidth = 1.9;
      trace(ctx, [
        [x, y + bend],
        [Math.min(x + 34, flatEnd), y + bend],
      ]);
      ctx.fillStyle = cyan;
      ctx.fillRect(end - 2, y + bend - 2, 4, 4);
      ctx.lineWidth = 1.3;
    }
    ctx.restore();
  }
  ctx.restore();
};

const radar = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  strength: number,
) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.lineWidth = 1.4;
  for (let index = 0; index < 4; index++) {
    const ring = radius * (0.27 + 0.25 * index);
    ctx.strokeStyle = blue;
    ctx.globalAlpha = strength * 0.43;
    ctx.beginPath();
    ctx.arc(0, 0, ring, 0, tau);
    ctx.stroke();
    const angle = time * 0.47 + index * 0.32;
    ctx.strokeStyle = cyan;
    ctx.globalAlpha = strength * 0.8;
    ctx.beginPath();
    ctx.arc(0, 0, ring, angle, angle + 0.34 + index * 0.13);
    ctx.stroke();
  }

  const angle = time * 0.47;
  ctx.rotate(angle);
  ctx.globalAlpha = strength * 0.48;
  const fan = ctx.createRadialGradient(0, 0, 10, 0, 0, radius);
  fan.addColorStop(0, "rgba(31, 94, 165, 0)");
  fan.addColorStop(0.5, "rgba(72, 196, 255, 0.19)");
  fan.addColorStop(1, "rgba(72, 196, 255, 0.04)");
  ctx.fillStyle = fan;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, radius, -0.43, 0);
  ctx.closePath();
  ctx.fill();
  trace(ctx, [
    [0, 0],
    [radius, 0],
  ]);
  ctx.restore();
};

const communications = (
  ctx: CanvasRenderingContext2D,
  time: number,
  strength: number,
) => {
  radar(ctx, 308, 255, 149, time, strength);
  ctx.save();
  ctx.translate(1470, 192);
  ctx.strokeStyle = cyan;
  ctx.lineWidth = 1.4;
  ctx.globalAlpha = strength * 0.52;
  trace(ctx, [
    [0, 14],
    [38, -24],
    [338, -24],
    [368, 6],
    [368, 134],
    [337, 165],
    [38, 165],
    [0, 127],
    [0, 14],
  ]);
  ctx.strokeStyle = blue;
  ctx.globalAlpha = strength * 0.34;
  trace(ctx, [
    [47, -14],
    [315, -14],
    [342, 13],
    [342, 134],
    [317, 154],
    [47, 154],
  ]);
  ctx.fillStyle = blue;
  for (let index = 0; index < 14; index++) {
    const amplitude =
      6 + (0.5 + 0.5 * Math.sin(index * 0.74 + time * 1.6)) * 27;
    ctx.globalAlpha = strength * mix(0.32, 0.67, index / 13);
    ctx.fillRect(35 + index * 21, 77 - amplitude, 3, 2 * amplitude);
  }
  ctx.strokeStyle = cyan;
  ctx.globalAlpha = strength * 0.59;
  ctx.beginPath();
  ctx.moveTo(23, 77);
  for (let index = 1; index < 48; index++) {
    const envelope = 0.28 + 0.72 * Math.sin((index / 48) * Math.PI);
    const y = 77 + Math.sin(index * 0.47 - time * 2.2) * envelope * 29;
    ctx.lineTo(23 + index * 6.7, y);
  }
  ctx.stroke();
  ctx.restore();
};

const lightPaths = (
  ctx: CanvasRenderingContext2D,
  time: number,
  strength: number,
) => {
  ctx.save();
  ctx.lineWidth = 1.6;
  ctx.strokeStyle = blue;
  ctx.globalAlpha = strength * 0.68;
  ctx.beginPath();
  ctx.moveTo(-70, 460);
  ctx.bezierCurveTo(110, 427, 367, 350, 634, 236);
  ctx.moveTo(1323, 296);
  ctx.bezierCurveTo(1600, 248, 1829, 120, 2044, 22);
  ctx.stroke();
  ctx.globalAlpha = strength * 0.28;
  ctx.beginPath();
  ctx.moveTo(-56, 518);
  ctx.bezierCurveTo(145, 489, 407, 375, 655, 220);
  ctx.moveTo(1390, 332);
  ctx.bezierCurveTo(1644, 275, 1827, 176, 2054, 39);
  ctx.stroke();

  const phase = (time * 0.21 + 0.3) % 1;
  ctx.strokeStyle = cyan;
  ctx.globalAlpha = strength * ease(phase * 7) * ease((1 - phase) * 7);
  const xLeft = mix(-12, 587, phase);
  const yLeft = 451 - 75 * phase - 110 * phase ** 1.65;
  const xRight = mix(1372, 1990, phase);
  const yRight = 288 - 96 * phase - 160 * phase ** 1.7;
  trace(ctx, [
    [xLeft - 35, yLeft + 11],
    [xLeft, yLeft],
  ]);
  trace(ctx, [
    [xRight - 50, yRight + 23],
    [xRight, yRight],
  ]);
  ctx.restore();
};

const categories = (
  ctx: CanvasRenderingContext2D,
  time: number,
  strength: number,
) => {
  ctx.save();
  ctx.strokeStyle = blue;
  ctx.fillStyle = cyan;
  ctx.lineWidth = 1.5;
  for (let index = 0; index < 7; index++) {
    const angle = ((index + 0.5) * tau) / 7;
    const x = centerX + Math.cos(angle) * 787;
    const y = centerY + Math.sin(angle) * 208;
    ctx.globalAlpha = strength * 0.48;
    trace(ctx, [
      [centerX + (x - centerX) * 0.35, centerY + (y - centerY) * 0.35],
      [x, y],
    ]);
    ctx.globalAlpha = strength * (0.4 + 0.4 * Math.sin(time * 1.8 - index));
    ctx.fillRect(x - 2, y - 2, 4, 4);
  }
  ctx.restore();
};

const cubes = (
  ctx: CanvasRenderingContext2D,
  time: number,
  strength: number,
) => {
  ctx.save();
  ctx.lineWidth = 1.5;
  for (let index = 0; index < 12; index++) {
    const side = index < 6 ? -1 : 1;
    const phase = (time * 0.31 + index * 0.19) % 1;
    const radius = 14 + (index % 4) * 12;
    const x =
      centerX + side * (497 + (index % 6) * 74 + 15 * Math.cos(phase * tau));
    const y = 84 + (index % 6) * 69 + 25 * Math.sin(phase * tau);
    const half = radius * 0.77;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(0.06 * Math.sin(time + index));
    ctx.strokeStyle = cyan;
    ctx.fillStyle = "#163967";
    ctx.globalAlpha = strength * (0.31 + 0.21 * Math.sin(phase * tau));
    const outline: Point[] = [
      [-half, 0],
      [-half, -radius],
      [0, -radius * 1.45],
      [half, -radius],
      [half, 0],
      [0, radius * 0.45],
      [-half, 0],
    ];
    trace(ctx, outline);
    ctx.fill();
    trace(ctx, [
      [-half, -radius],
      [0, -radius * 0.55],
      [half, -radius],
    ]);
    trace(ctx, [
      [0, -radius * 0.55],
      [0, radius * 0.45],
    ]);
    ctx.restore();
  }
  ctx.restore();
};

const goldRings = (
  ctx: CanvasRenderingContext2D,
  time: number,
  gold: number,
  intensity: number,
  wide: boolean,
) => {
  ctx.save();
  ctx.translate(centerX, centerY);
  const halo = ctx.createRadialGradient(0, 0, 14, 0, 0, wide ? 660 : 560);
  halo.addColorStop(0, "#3c211300");
  halo.addColorStop(0.37, "#74442e00");
  halo.addColorStop(0.56, "#cc813662");
  halo.addColorStop(0.76, "#a956261e");
  halo.addColorStop(1, "#a9562600");
  ctx.globalAlpha = gold * intensity * 0.76;
  ctx.fillStyle = halo;
  ctx.fillRect(-centerX, -centerY, width, height);

  ctx.strokeStyle = goldLight;
  ctx.scale(wide ? 1.83 : 1.61, 1);
  for (let index = 0; index < 3; index++) {
    const radius = 142 + index * 78 + gold * (wide ? 90 : 62);
    ctx.lineWidth = index === 1 ? 2.5 : 1.35;
    ctx.globalAlpha = gold * intensity * (0.57 - 0.12 * index);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, tau);
    ctx.stroke();
    const angle = time * 0.19 + index * 1.22;
    ctx.globalAlpha *= 1.45;
    ctx.beginPath();
    ctx.arc(0, 0, radius, angle, angle + 0.66);
    ctx.stroke();
  }
  ctx.restore();
};

const openingEnergy = (
  ctx: CanvasRenderingContext2D,
  progress: number,
  intensity: number,
) => {
  ctx.save();
  const pulse =
    ease((progress - 0.58) / 0.08) * (1 - ease((progress - 0.67) / 0.13));
  const sweep =
    ease((progress - 0.31) / 0.08) * (1 - ease((progress - 0.6) / 0.21));
  if (sweep > 0) {
    radar(
      ctx,
      centerX,
      centerY,
      146 + sweep * 49,
      progress * 9,
      sweep * intensity * 0.42,
    );
  }
  if (pulse > 0) {
    const glow = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      230,
    );
    glow.addColorStop(0, "rgba(75, 169, 255, 0.32)");
    glow.addColorStop(1, "rgba(29, 105, 220, 0)");
    ctx.fillStyle = glow;
    ctx.globalAlpha = pulse * intensity;
    ctx.fillRect(centerX - 230, centerY - 230, 460, 460);
  }
  ctx.restore();
};

export const FestivalBackdrop = ({
  mode,
  gold = 0,
  intensity = 1,
  durationInFrames,
}: Props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const canvas = useRef<HTMLCanvasElement>(null);
  const time = frame / fps;
  const accent = clamp(gold);
  const energy = clamp(intensity);
  const duration =
    durationInFrames ?? (mode === "opening" ? 12 * fps : 4 * fps);
  const progress = clamp(frame / Math.max(1, duration - 1));
  const visibility =
    mode === "opening"
      ? ease(progress / 0.23)
      : mode === "ending"
        ? 1 - ease((progress - 0.77) / 0.19)
        : 1;

  useLayoutEffect(() => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    if (visibility <= 0) return;

    // Blue traces recede underneath the grand-prize light without a phase jump.
    const blueStrength = energy * (1 - accent * 0.84);
    const convergence =
      mode === "opening"
        ? 0.82 * ease((progress - 0.25) / 0.43)
        : mode === "ending"
          ? ease(progress / 0.68)
          : 0;

    grid(ctx, time, blueStrength * (mode === "ms" ? 0.48 : 0.2));
    circuits(
      ctx,
      time,
      blueStrength * (mode === "opening" ? 0.76 : 0.34),
      1 - convergence,
    );
    drawDust(ctx, time, Math.max(convergence, accent * 0.77), accent, energy);

    switch (mode) {
      case "opening":
        openingEnergy(ctx, progress, energy);
        break;
      case "schedule":
        circuits(ctx, time * 0.68 + 0.7, blueStrength * 0.49, 0.77);
        break;
      case "categories":
        categories(ctx, time, blueStrength);
        break;
      case "cw":
        communications(ctx, time, blueStrength);
        break;
      case "ms":
        radar(ctx, 1634, 284, 117, time, blueStrength * 0.52);
        lightPaths(ctx, time, blueStrength);
        break;
      case "quiz":
        cubes(ctx, time, blueStrength);
        break;
      case "ending":
        break;
    }
    if (accent > 0) goldRings(ctx, time, accent, energy, mode === "ms");
  }, [accent, energy, mode, progress, time, visibility]);

  return (
    <AbsoluteFill
      aria-hidden="true"
      style={{ backgroundColor: "#000", pointerEvents: "none" }}
    >
      <AbsoluteFill
        style={{
          opacity: visibility,
          background:
            "radial-gradient(ellipse at 20% 29%, #10274B 0%, transparent 46%), radial-gradient(ellipse at 83% 70%, #122B51 0%, transparent 42%), linear-gradient(112deg, #0B1730, #060B17 44%, #060B17 57%, #0B1730)",
        }}
      >
        <AbsoluteFill
          style={{
            opacity: accent,
            background:
              "radial-gradient(ellipse at 50% 56%, #331D12, #10101C 41%, #060B17 77%)",
          }}
        />
        <canvas
          ref={canvas}
          width={width}
          height={height}
          style={{
            // On the prize cue, paint the canvas above the positioned gold wash.
            position: accent > 0 ? "absolute" : undefined,
            inset: accent > 0 ? 0 : undefined,
            width: "100%",
            height: "100%",
            display: "block",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
