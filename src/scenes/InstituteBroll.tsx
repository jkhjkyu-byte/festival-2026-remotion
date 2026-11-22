import { useLayoutEffect, useRef } from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { festivalAwards } from "../data/award-roster";

type Code = "CW" | "MS";
type Point = readonly [number, number];
type Space = readonly [number, number, number];
type Context = CanvasRenderingContext2D;

const width = 1320;
const height = 360;
const turn = Math.PI * 2;
const steps = 28;
const bands = [0, 0.31, 0.56, 0.77, 1] as const;
const clamp = (value: number) => Math.min(1, Math.max(0, value));
const mix = (from: number, to: number, amount: number) =>
  from + (to - from) * amount;
const smooth = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

const dust = Array.from({ length: 24 }, (_, index) => ({
  x: random(`institute-cloud:x:${index}`),
  y: random(`institute-cloud:y:${index}`),
  size: random(`institute-cloud:size:${index}`),
}));

const path = (ctx: Context, points: readonly Point[]) => {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let index = 1; index < points.length; index++) {
    ctx.lineTo(points[index][0], points[index][1]);
  }
};

const hazyLight = (
  ctx: Context,
  x: number,
  y: number,
  rx: number,
  ry: number,
  center: string,
) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(rx, ry);
  const light = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
  light.addColorStop(0, center);
  light.addColorStop(1, "transparent");
  ctx.fillStyle = light;
  ctx.fillRect(-1, -1, 2, 2);
  ctx.restore();
};

const sky = (ctx: Context, code: Code, t: number) => {
  const slate = code === "CW";
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, slate ? "#0d2538" : "#242235");
  gradient.addColorStop(0.54, slate ? "#426378" : "#795760");
  gradient.addColorStop(0.82, slate ? "#879b9e" : "#c38d6b");
  gradient.addColorStop(1, slate ? "#96a9a4" : "#d99d76");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  hazyLight(
    ctx,
    slate ? 1195 : 970,
    slate ? 194 : 247,
    slate ? 460 : 420,
    200,
    slate ? "#b6d0ca82" : "#ffc788a6",
  );
  for (const cloud of dust.slice(0, 10)) {
    hazyLight(
      ctx,
      cloud.x * (width + 220) - 120 - t * 12,
      60 + cloud.y * 156,
      136 + cloud.size * 244,
      6 + 15 * cloud.y,
      slate ? "#cee4ee22" : "#ecb69e25",
    );
  }
};

const ridge = (
  ctx: Context,
  color: string,
  y: number,
  amplitude: number,
  wave: number,
  t: number,
  parallax: number,
) => {
  ctx.beginPath();
  ctx.moveTo(-25, height);
  for (let x = -25; x <= width + 45; x += 14) {
    const q = (x + parallax * t) * 0.012;
    const profile =
      Math.sin(q + wave) * 0.53 +
      Math.sin(q * 1.91 - 0.71 * wave) * 0.25 +
      Math.sin(q * 4.11 + wave) * 0.14 +
      Math.sin(q * 9.72 - wave) * 0.08;
    ctx.lineTo(x, y + profile * amplitude);
  }
  ctx.lineTo(width + 45, height);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
};

const stageGround = (ctx: Context, code: Code, t: number) => {
  if (code === "CW") {
    ridge(ctx, "#728991", 224, 33, 2.7, t, 12);
    hazyLight(ctx, 786, 251, 760, 55, "#adc2bd43");
    ridge(ctx, "#4c6066", 260, 32, 1.6, t, 20);
    ridge(ctx, "#293e44", 288, 30, 5, t, 35);
    ridge(ctx, "#182b2c", 324, 24, 2, t, 54);

    ctx.fillStyle = "#132a2a";
    const yard = 53 * t;
    for (let index = 0; index < 26; index++) {
      const x = index * 69 - yard;
      const y = 335 + Math.sin(index * 3.8) * 14;
      const post = 4 + 6 * Math.sin(index * 2.38) ** 2;
      ctx.fillRect(x, y - post, 1.4, post);
    }
  } else {
    ridge(ctx, "#84636a", 253, 26, 4.9, t, 7);
    ridge(ctx, "#694c57", 275, 23, 1.3, t, 12);
    hazyLight(ctx, 959, 276, 580, 32, "#e5a97536");
    ridge(ctx, "#523f46", 295, 18, 3.7, t, 20);
    ridge(ctx, "#29252d", 337, 25, 1.2, t, 42);
  }
};

const drawDish = (ctx: Context, t: number) => {
  const x = 1000 - t * 25;
  const y = 137 + t * 5;
  const yaw = mix(-0.74, 0.69, smooth(t + 0.07));
  const pitch = -0.34;
  const size = 1 + 0.11 * t;

  // The painted station is a fictional silhouette. The surface is mapped for
  // perspective, shading and parallax only.
  const project = ([px, py, pz]: Space): Point => {
    const tiltY = py * Math.cos(pitch) - pz * Math.sin(pitch);
    const tiltZ = py * Math.sin(pitch) + pz * Math.cos(pitch);
    const turnX = px * Math.cos(yaw) + tiltZ * Math.sin(yaw);
    const turnZ = -px * Math.sin(yaw) + tiltZ * Math.cos(yaw);
    const depth = (size * 550) / (550 - turnZ);
    return [x + depth * turnX, y + depth * tiltY];
  };

  const disk = (radius: number, index: number): Point => {
    const angle = (index / steps) * turn;
    return project([
      radius * 109 * Math.cos(angle),
      radius * 109 * Math.sin(angle),
      48 * radius ** 2,
    ]);
  };

  ctx.fillStyle = "#17272c";
  path(ctx, [
    [x - 54, y + 172],
    [x + 53, y + 172],
    [x + 38, y + 104],
    [x - 24, y + 104],
  ]);
  ctx.closePath();
  ctx.fill();
  const steel = ctx.createLinearGradient(x - 44, 0, x + 45, 0);
  steel.addColorStop(0, "#849396");
  steel.addColorStop(0.4, "#465862");
  steel.addColorStop(1, "#1b2d38");
  ctx.fillStyle = steel;
  path(ctx, [
    [x - 32, y + 141],
    [x + 36, y + 141],
    [x + 30, y + 67],
    [x - 17, y + 59],
  ]);
  ctx.closePath();
  ctx.fill();

  const look = project([0, -26, 105]);
  const span = 520;
  const sweep = ctx.createLinearGradient(
    look[0],
    look[1],
    look[0] - span,
    y - 41,
  );
  sweep.addColorStop(0, "#97ddff1c");
  sweep.addColorStop(0.47, "#8ac8e72b");
  sweep.addColorStop(1, "#a0d9ff00");
  ctx.fillStyle = sweep;
  const beamY = y - 20 + 29 * Math.sin(t * Math.PI);
  path(ctx, [look, [look[0] - span, beamY - 96], [look[0] - span, beamY + 54]]);
  ctx.closePath();
  ctx.fill();

  const rim = Array.from({ length: steps + 1 }, (_, index) => disk(1, index));
  ctx.lineJoin = "round";
  path(ctx, rim);
  ctx.lineWidth = 4.8;
  ctx.strokeStyle = "#202e36";
  ctx.stroke();

  for (let band = 0; band < bands.length - 1; band++) {
    const inner = bands[band];
    const outer = bands[band + 1];
    for (let step = 0; step < steps; step++) {
      const angle = ((step + 0.5) / steps) * turn;
      const light = mix(68, 168, (1 - Math.sin(angle + yaw / 2)) / 2);
      const metal = Math.round(light + 20 * outer + 6 * (step % 2));
      ctx.fillStyle = `rgb(${metal - 10}, ${metal + 6}, ${metal + 11})`;
      path(ctx, [
        disk(inner, step),
        disk(outer, step),
        disk(outer, step + 1),
        disk(inner, step + 1),
      ]);
      ctx.closePath();
      ctx.fill();
    }
  }

  ctx.lineWidth = 0.7;
  ctx.strokeStyle = "#ccdae670";
  for (const band of bands.slice(2)) {
    path(
      ctx,
      Array.from({ length: steps + 1 }, (_, index) => disk(band, index)),
    );
    ctx.stroke();
  }

  const support = project([0, -4, 115]);
  ctx.lineWidth = 2.8;
  ctx.strokeStyle = "#243d4a";
  for (const step of [4, 11, 18, 24]) {
    path(ctx, [disk(0.9, step), support]);
    ctx.stroke();
  }
  ctx.fillStyle = "#203442";
  ctx.beginPath();
  ctx.ellipse(support[0], support[1], 9, 5, -0.3, 0, turn);
  ctx.fill();

  ctx.lineWidth = 1.6;
  ctx.strokeStyle = "#c6d9dec0";
  path(ctx, rim);
  ctx.stroke();
  hazyLight(ctx, x + 31, y + 151, 228, 42, "#7e929160");
};

const launchOrigin = 1030;
const launchHeight = 293;
const start = 0.2;
const heightAt = (progress: number) => launchHeight - progress ** 1.58 * 295;
const xAt = (progress: number) => launchOrigin + progress ** 1.33 * 79;

const drawAscent = (ctx: Context, t: number) => {
  const progress = clamp((t - start) / (1 - start));
  const ignition = smooth((t - 0.12) / 0.14);
  const camera = t * 32;
  const origin = launchOrigin - camera;
  const y = heightAt(progress);
  const x = xAt(progress) - camera;

  ctx.fillStyle = "#2b2b31";
  ctx.fillRect(origin - 49, launchHeight - 6, 120, 7);
  ctx.fillRect(origin - 66, launchHeight - 12, 26, 13);
  ctx.fillRect(origin + 39, launchHeight - 21, 12, 22);

  if (ignition > 0) {
    hazyLight(
      ctx,
      origin,
      launchHeight + 9,
      215 * ignition,
      75 * ignition,
      "#ffa75b9a",
    );
    hazyLight(
      ctx,
      origin,
      launchHeight - 1,
      82 * ignition,
      28 * ignition,
      "#ffce8bd6",
    );

    for (const dot of dust) {
      const spread = 1.4 * ignition + progress;
      const groundX = origin + mix(-100, 143, dot.x) * spread;
      const groundY = launchHeight + 13 - (12 + progress * 42) * dot.y;
      const density = 0.44 + 0.53 * dot.size;
      hazyLight(
        ctx,
        groundX,
        groundY,
        (32 + dot.size * 64) * spread,
        (21 + 32 * dot.y) * spread,
        density > 0.69 ? "#9a786a88" : "#d0a38963",
      );
    }
  }

  for (let index = 24; index >= 1; index--) {
    const age = index / 26;
    const sample = progress - index * 0.024;
    if (sample <= 0) continue;
    const vapor = dust[index - 1];
    const plumeX = xAt(sample) - camera + (vapor.x - 0.32) * age * 155;
    const plumeY = heightAt(sample) + 8 + 11 * age;
    hazyLight(
      ctx,
      plumeX,
      plumeY,
      12 + age * 37 + vapor.size * 6,
      11 + age * 29,
      age < 0.2 ? "#ffd0a494" : "#c6a79d6c",
    );
  }

  if (progress > 0) {
    const flicker = 0.92 + 0.08 * Math.sin(progress * 49);
    hazyLight(ctx, x, y + 16, 30 * flicker, 52 * flicker, "#ffae5ba6");
    hazyLight(ctx, x, y + 13, 9 * flicker, 29 * flicker, "#fff2bcea");
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(0.21 + 0.1 * progress);
    ctx.fillStyle = "#25252d";
    ctx.beginPath();
    ctx.moveTo(-2.6, 3);
    ctx.quadraticCurveTo(-3.9, -17, 0, -25);
    ctx.quadraticCurveTo(4.2, -17, 2.7, 3);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
};

const finish = (ctx: Context, code: Code) => {
  const shade = ctx.createLinearGradient(0, 0, width, 0);
  shade.addColorStop(0, "#07131eac");
  shade.addColorStop(0.42, "#08121c90");
  shade.addColorStop(0.73, "#0c172628");
  shade.addColorStop(1, "#0a101933");
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, width, height);

  const vignette = ctx.createLinearGradient(0, 0, 0, height);
  vignette.addColorStop(0, "#060d1844");
  vignette.addColorStop(0.66, "#10101900");
  vignette.addColorStop(1, code === "CW" ? "#06131bae" : "#1c141bbe");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);

  for (let index = 0; index < 304; index++) {
    const x = (index * 127 + 183) % width;
    const y = (index * 49 + Math.floor(index / 13) * 19) % height;
    ctx.fillStyle = index % 5 < 2 ? "#eff8ff13" : "#11101717";
    ctx.fillRect(x, y, index % 3 === 0 ? 2 : 1, 1);
  }
};

const AnimatedInstrument = ({ code }: { readonly code: Code }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const canvas = useRef<HTMLCanvasElement>(null);
  const progress = clamp(frame / Math.max(1, durationInFrames - 1));

  useLayoutEffect(() => {
    const ctx = canvas.current?.getContext("2d", { alpha: false });
    if (!ctx) return;
    sky(ctx, code, progress);
    stageGround(ctx, code, progress);
    if (code === "CW") {
      drawDish(ctx, progress);
    } else {
      drawAscent(ctx, progress);
    }
    finish(ctx, code);
  }, [code, progress]);

  return (
    <AbsoluteFill
      aria-hidden="true"
      style={{ pointerEvents: "none", backgroundColor: "#09121a" }}
    >
      <canvas
        ref={canvas}
        width={width}
        height={height}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </AbsoluteFill>
  );
};

export const InstituteBroll = ({ code }: { readonly code: Code }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const time = frame / fps;
  const progress = clamp(frame / Math.max(1, durationInFrames - 1));
  const secondShot = smooth((time - 1.83) / 0.52);
  const photoOpacity = code === "CW" ? 1 - secondShot : secondShot;
  const scale = interpolate(progress, [0, 1], [1.02, 1.115]);
  const pan = interpolate(progress, [0, 1], [0, code === "CW" ? -1.8 : -1.1]);
  const fade = smooth((time - 0.22) / 0.65);
  const title = festivalAwards[code].name;

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#09121a" }}>
      <AnimatedInstrument code={code} />
      {photoOpacity > 0 ? (
        <Img
          src={staticFile(
            `assets/reference-cut/${code === "CW" ? "radar" : "launch"}.jpg`,
          )}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `translateX(${pan}%) scale(${scale})`,
            opacity: photoOpacity,
            filter: "saturate(.89) contrast(1.06)",
          }}
        />
      ) : null}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg,#08101ee8 1%,#0b1527b9 31%,#0c182542 59%,transparent 83%)",
          justifyContent: "center",
          paddingLeft: "9cqw",
        }}
      >
        <div
          style={{
            width: "55cqw",
            opacity: fade,
            translate: `${-1.35 * (1 - fade)}cqw 0`,
          }}
        >
          <div
            style={{
              fontSize: "4.15cqh",
              fontWeight: 720,
              letterSpacing: ".13em",
              color: "#d6e6f3",
            }}
          >
            {code === "CW"
              ? "CW TECHNOLOGY LAB"
              : "MISSILE SYSTEM TECHNOLOGY LAB"}
          </div>
          <div
            style={{
              width: "10cqw",
              height: 2,
              margin: "3cqh 0 4cqh",
              backgroundColor: code === "CW" ? "#8bc4ee" : "#efbc80",
            }}
          />
          <div
            style={{
              fontSize: "11cqh",
              fontWeight: 850,
              letterSpacing: "-.06em",
              lineHeight: 1.2,
              whiteSpace: "nowrap",
              color: "#f5f7fc",
            }}
          >
            {title}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
