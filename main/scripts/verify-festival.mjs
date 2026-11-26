import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, renameSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repository = fileURLToPath(new URL("..", import.meta.url));
const fps = 30;
const duration = 180;
const samples = [
  [0, "opening-black"],
  [6, "network"],
  [10, "title"],
  [19, "exhibition"],
  [25, "institute-schedule"],
  [40, "category-reveal"],
  [51, "category-rollup"],
  [56, "cw-intro"],
  [70, "cw-awards"],
  [94, "cw-late-awards"],
  [102, "cw-rollup"],
  [107, "ms-intro"],
  [120, "ms-awards"],
  [145, "ms-late-awards"],
  [153, "ms-rollup"],
  [159, "quiz-intro"],
  [165, "quiz-invitation"],
  [172, "quiz-hold"],
  [178, "ending"],
  [179, "ending-black", 29],
];

function run(command, args) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    maxBuffer: 4 * 1024 * 1024,
    cwd: repository,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(
      `${command}: ${result.stderr.trim() || result.signal || result.status}`,
    );
  }
  return result;
}

function checkMetadata(video, width, height, expectedFrames, duration) {
  const { streams, format } = JSON.parse(
    run("ffprobe", [
      "-v",
      "error",
      "-show_streams",
      "-show_format",
      "-of",
      "json",
      video,
    ]).stdout,
  );
  assert.ok(
    format.format_name.split(",").includes("mp4"),
    "Expected MP4 container",
  );
  assert.equal(streams.length, 2, "Expected one video and one audio stream");
  const videoStream = streams.find((stream) => stream.codec_type === "video");
  const audioStream = streams.find((stream) => stream.codec_type === "audio");
  assert.ok(
    videoStream && audioStream,
    "Expected one video and one audio stream",
  );
  assert.deepEqual(
    [
      videoStream.width,
      videoStream.height,
      videoStream.avg_frame_rate,
      videoStream.r_frame_rate,
      Number(videoStream.nb_frames),
      videoStream.codec_name,
      videoStream.pix_fmt,
      videoStream.color_space,
    ],
    [width, height, "30/1", "30/1", expectedFrames, "h264", "yuv420p", "bt709"],
    "Unexpected video format or frame count",
  );
  assert.ok(
    Math.abs(Number(videoStream.duration) - duration) < 1 / fps,
    "Unexpected video duration",
  );
  assert.equal(audioStream.codec_name, "aac", "Expected AAC audio");
  assert.equal(audioStream.channels, 2, "Expected stereo audio");
  assert.ok(
    Math.abs(Number(audioStream.duration) - duration) < 2 / fps,
    "Audio duration differs from the timeline",
  );
}

function decodeVideo(video, expectedFrames, duration) {
  const { stdout, stderr } = run("ffmpeg", [
    "-hide_banner",
    "-nostdin",
    "-xerror",
    "-progress",
    "pipe:1",
    "-nostats",
    "-threads",
    "2",
    "-i",
    video,
    "-map",
    "0:v:0",
    "-map",
    "0:a:0",
    "-vf",
    "blackdetect=d=0.25:pix_th=0.035:pic_th=0.995",
    "-af",
    "volumedetect",
    "-fps_mode",
    "passthrough",
    "-f",
    "null",
    "-",
  ]);
  const frames = [...stdout.matchAll(/^frame=(\d+)/gm)].at(-1);
  assert.equal(
    Number(frames?.[1]),
    expectedFrames,
    "Decoded frame count differs from timeline",
  );
  assert.match(stdout, /^progress=end$/m, "Expected a complete decode");

  for (const match of stderr.matchAll(
    /black_start:([\d.]+) black_end:([\d.]+)/g,
  )) {
    const start = Number(match[1]);
    const end = Number(match[2]);
    const expectedOpening = start <= 1 / fps && end <= 2;
    const expectedEnding = start >= duration - 2 && end >= duration - 2 / fps;
    assert.ok(
      expectedOpening || expectedEnding,
      `Unexpected black interval ${start}–${end}s`,
    );
  }

  const volume = stderr.match(/mean_volume: (-?[\d.]+) dB/);
  assert.ok(
    volume && Number(volume[1]) > -90,
    "Audio track is silent or missing volume stats",
  );
  return volume[1];
}

function extractStills(video, samples) {
  const destination = join(repository, "out", "review");
  mkdirSync(destination, { recursive: true });
  const reviewPath = mkdtempSync(join(destination, "master-"));
  const select = samples
    .map(([time, , frameOffset = 0]) => `eq(n,${time * fps + frameOffset})`)
    .join("+");
  run("ffmpeg", [
    "-hide_banner",
    "-nostdin",
    "-v",
    "error",
    "-xerror",
    "-threads",
    "2",
    "-i",
    video,
    "-map",
    "0:v:0",
    "-vf",
    `select='${select}'`,
    "-frames:v",
    String(samples.length),
    "-fps_mode",
    "passthrough",
    "-threads",
    "2",
    join(reviewPath, "%02d.png"),
  ]);
  samples.forEach(([time, cue], index) => {
    const sequence = String(index + 1).padStart(2, "0");
    const timestamp = String(time).padStart(3, "0");
    renameSync(
      join(reviewPath, `${sequence}.png`),
      join(reviewPath, `${timestamp}s-${cue}.png`),
    );
  });
  return reviewPath;
}

function verify() {
  const width = Number(process.env.FESTIVAL_WIDTH || 1980);
  const height = Number(process.env.FESTIVAL_HEIGHT || 540);
  assert.ok(
    Number.isSafeInteger(width) &&
      Number.isSafeInteger(height) &&
      width > 0 &&
      height > 0 &&
      width % 2 === 0 &&
      height % 2 === 0 &&
      width * 3 === height * 11,
    "Expected positive even dimensions with aspect ratio 11:3",
  );
  const video = join(repository, "out", "festival-master.mp4");
  const expectedFrames = duration * fps;
  checkMetadata(video, width, height, expectedFrames, duration);
  const meanVolume = decodeVideo(video, expectedFrames, duration);
  const reviewPath = extractStills(video, samples);
  console.log(
    `Master passed: ${width}×${height}, ${expectedFrames} decoded frames at 30 fps, H.264 BT.709, AAC (${meanVolume} dBFS mean).`,
  );
  console.log(`${samples.length} stills for visual review: ${reviewPath}`);
}

try {
  verify();
} catch (error) {
  console.error(`Master failed: ${error.message}`);
  process.exitCode = 1;
}
