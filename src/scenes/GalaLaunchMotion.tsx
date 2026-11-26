import { useLayoutEffect, useRef } from "react";
import {
  AbsoluteFill,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type Paint = CanvasRenderingContext2D;

const width = 1320;
const height = 360;
const originX = 1050;
const originY = 329;
const tau = 2 * Math.PI;

const saturate = (n: number) => Math.min(1, Math.max(0, n));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (n: number) => {
  const t = saturate(n);
  return t * t * (3 - 2 * t);
};

const hash = (x: number, y: number, seed: number) => {
  let number = Math.imul(x, 153961) ^ Math.imul(y, 780577) ^ seed;
  number = Math.imul(number ^ (number >>> 16), 1664525);
  return ((number ^ (number >>> 15)) >>> 0) / 4294967296;
};

const grain = (x: number, y: number, seed: number) => {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const dx = ease(x - ix);
  const dy = ease(y - iy);
  return mix(
    mix(hash(ix, iy, seed), hash(ix + 1, iy, seed), dx),
    mix(hash(ix, iy + 1, seed), hash(ix + 1, iy + 1, seed), dx),
    dy,
  );
};

const makeCloud = (seed: number, warm: boolean) => {
  const sprite = document.createElement("canvas");
  const size = 105;
  sprite.width = size;
  sprite.height = size;
  const ctx = sprite.getContext("2d");
  if (!ctx) return sprite;
  const photo = ctx.createImageData(size, size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = (x / (size - 1)) * 2 - 1;
      const v = (y / (size - 1)) * 2 - 1;
      const dist = Math.hypot(u, v);
      const cloud =
        0.49 * grain(x / 19, y / 19, seed) +
        0.28 * grain(x / 8.1, y / 8.1, seed + 66) +
        0.15 * grain(x / 3.9, y / 3.9, seed + 128) +
        0.08 * grain(x / 1.85, y / 1.85, seed + 386);
      const opacity = ease((1 - dist) * 2.6) * ease((cloud - 0.15) * 2.38);
      const lighting = saturate(0.27 + cloud * 0.9 - v * 0.28 - u * 0.1);
      const offset = (y * size + x) * 4;
      photo.data[offset] = mix(warm ? 103 : 91, warm ? 245 : 202, lighting);
      photo.data[offset + 1] = mix(warm ? 71 : 102, warm ? 218 : 201, lighting);
      photo.data[offset + 2] = mix(warm ? 59 : 111, warm ? 179 : 210, lighting);
      photo.data[offset + 3] = opacity * 235;
    }
  }
  ctx.putImageData(photo, 0, 0);
  return sprite;
};

const flecks = Array.from({ length: 36 }, (_, index) => ({
  dx: random(`gala-vapor-x:${index}`),
  dy: random(`gala-vapor-y:${index}`),
  scale: random(`gala-vapor-s:${index}`),
  angle: random(`gala-vapor-a:${index}`) * tau,
}));

const glow = (
  ctx: Paint,
  x: number,
  y: number,
  rx: number,
  ry: number,
  color: string,
  opacity: number,
) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(rx, ry);
  const fog = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
  fog.addColorStop(0, color);
  fog.addColorStop(1, "transparent");
  ctx.globalAlpha = opacity;
  ctx.fillStyle = fog;
  ctx.fillRect(-1, -1, 2, 2);
  ctx.restore();
};

const paintCloud = (
  ctx: Paint,
  texture: HTMLCanvasElement,
  x: number,
  y: number,
  rx: number,
  ry: number,
  angle: number,
  opacity: number,
) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.globalAlpha = opacity;
  ctx.drawImage(texture, -rx, -ry, rx * 2, ry * 2);
  ctx.restore();
};

// Coordinates describe a fictional screen-space motion, independent of any equipment.
const follow = (time: number) => {
  const s = saturate((time + 0.025) / 3.43);
  return {
    x: originX + 175 * s ** 1.6,
    y: originY - 301 * (0.64 * s + 0.36 * s ** 1.34),
  };
};

const seaHaze = (
  ctx: Paint,
  time: number,
  clouds: readonly HTMLCanvasElement[],
) => {
  const swelling = 0.41 + ease(time / 0.9) * 0.88;
  const ignition = 0.19 + Math.exp(-time * 2.85) * 0.81;
  glow(
    ctx,
    originX - 2,
    originY,
    145 * swelling,
    38 * swelling,
    "#FFD196",
    0.76 * ignition,
  );
  glow(
    ctx,
    originX,
    originY + 21,
    53 * swelling,
    22 * swelling,
    "#F8974D",
    0.64 * ignition,
  );

  for (let index = 0; index < 23; index++) {
    const puff = flecks[index];
    const x = originX + (puff.dx - 0.49) * swelling * 129 + time * 6;
    const y = originY + (puff.dy - 0.43) * swelling * 25;
    const texture = clouds[index % clouds.length];
    paintCloud(
      ctx,
      texture,
      x,
      y,
      (18 + puff.scale * 23) * swelling,
      (9 + puff.scale * 12) * swelling,
      0.14 * Math.sin(puff.angle),
      (0.43 + 0.18 * puff.dy) * (0.9 - time * 0.065),
    );
  }

  glow(ctx, originX, originY - 2, 16, 6.8, "#FFF5D8", ignition * 0.82);
  ctx.save();
  ctx.strokeStyle = "#FFC782";
  for (let i = 1; i <= 6; i++) {
    const wave = 0.68 + 0.2 * Math.sin(time * 3.4 + i * 2.9);
    ctx.beginPath();
    const y = originY + i * 3.1 + 3;
    const length = (18 + 5.1 * i) * wave;
    ctx.moveTo(originX - length / 2, y);
    ctx.lineTo(originX + length / 2, y);
    ctx.globalAlpha = ignition * 0.27 * (1 - i / 9);
    ctx.lineWidth = 0.65 + i * 0.11;
    ctx.stroke();
  }
  ctx.restore();
};

const smokeTrail = (
  ctx: Paint,
  time: number,
  clouds: readonly HTMLCanvasElement[],
) => {
  for (let index = 45; index >= 1; index--) {
    const age = index * 0.071;
    const when = time - age;
    if (when < 0) continue;
    const initial = follow(when);
    const puff = flecks[index % flecks.length];
    const spread = 1 - Math.exp(-1.47 * age);
    const radius = 5.5 + spread * (15 + puff.scale * 9);
    const driftX = age * (6 + (puff.dx - 0.4) * 11);
    const driftY = (puff.dy - 0.55) * spread * 17 + age * 1.8;
    paintCloud(
      ctx,
      clouds[index % clouds.length],
      initial.x + driftX,
      initial.y + driftY,
      radius,
      radius * (0.82 + puff.dy * 0.4),
      puff.angle + age * 0.45,
      0.65 + 0.15 * (1 - spread),
    );
  }
};

const movingLight = (ctx: Paint, time: number) => {
  const lead = follow(time);
  const aim = follow(time + 0.021);
  const angle = Math.atan2(aim.y - lead.y, aim.x - lead.x);
  const energy = 0.9 + 0.055 * Math.sin(time * 21);
  ctx.save();
  ctx.translate(lead.x, lead.y);
  ctx.rotate(angle);

  glow(ctx, -8, 0, 44, 24, "#FFAA57", energy * 0.64);
  glow(ctx, -6, 0, 28, 9, "#FFD38F", energy * 0.77);
  const exhaust = ctx.createLinearGradient(-34, 0, 3, 0);
  exhaust.addColorStop(0, "#F0A45A00");
  exhaust.addColorStop(0.42, "#EFA34A70");
  exhaust.addColorStop(0.76, "#FFD995");
  exhaust.addColorStop(1, "#FFF3D0");
  ctx.fillStyle = exhaust;
  ctx.beginPath();
  ctx.moveTo(-39, -1);
  ctx.quadraticCurveTo(-16, -5, 1, -3.25);
  ctx.lineTo(1, 3.25);
  ctx.quadraticCurveTo(-17, 5, -39, 1);
  ctx.closePath();
  ctx.fill();

  const rim = ctx.createLinearGradient(0, -3.8, 0, 3.8);
  rim.addColorStop(0, "#B9C3CD");
  rim.addColorStop(0.27, "#71818F");
  rim.addColorStop(0.72, "#353E4C");
  rim.addColorStop(1, "#232936");
  ctx.fillStyle = rim;
  ctx.beginPath();
  ctx.moveTo(0, -3.1);
  ctx.lineTo(12, -3.1);
  ctx.quadraticCurveTo(16, -3, 23, 0);
  ctx.quadraticCurveTo(16, 2.8, 11, 3.1);
  ctx.lineTo(0, 3.1);
  ctx.closePath();
  ctx.fill();

  glow(ctx, -3, 0, 9, 4.2, "#FFF5D9", 0.87);
  ctx.restore();
};

export const GalaLaunchMotion = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const picture = useRef<HTMLCanvasElement>(null);
  const clouds = useRef<readonly HTMLCanvasElement[] | null>(null);
  const time = frame / fps;

  useLayoutEffect(() => {
    const ctx = picture.current?.getContext("2d");
    if (!ctx) return;

    clouds.current ??= Array.from({ length: 6 }, (_, index) =>
      makeCloud(52421 * (index + 13), index < 4),
    );
    ctx.clearRect(0, 0, width, height);
    seaHaze(ctx, time, clouds.current);
    smokeTrail(ctx, time, clouds.current);
    movingLight(ctx, time);
  }, [time]);

  return (
    <AbsoluteFill aria-hidden="true" style={{ pointerEvents: "none" }}>
      <canvas
        ref={picture}
        width={width}
        height={height}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </AbsoluteFill>
  );
};
