import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";
import { spawnSync } from "node:child_process";

const asModule = (text) =>
  `data:text/javascript;base64,${Buffer.from(text).toString("base64")}`;
const roster = asModule(
  stripTypeScriptTypes(
    readFileSync(
      new URL("../src/data/award-roster.ts", import.meta.url),
      "utf8",
    ),
  ),
);
const { festivalAwards } = await import(roster);
const { formatMentorMenteeNames } = await import(
  asModule(
    stripTypeScriptTypes(
      readFileSync(
        new URL("../src/data/award-display.ts", import.meta.url),
        "utf8",
      ),
    ),
  )
);
const mentors = festivalAwards.CW.categories.find(
  ({ name }) => name === "멘토멘티 공동 수행과제",
);
assert.ok(mentors);
assert.deepEqual(
  mentors.recipients.map(({ names }) => formatMentorMenteeNames(names)),
  [
    "멘토(홍동근)/멘티(김효근)",
    "멘토(홍성일)/멘티(이동훈)",
    "멘토(박건우, 김기웅, 김덕연)/멘티(홍승표)",
  ],
);
assert.equal(formatMentorMenteeNames(["공동 수상", "수상자"]), null);

const timing = stripTypeScriptTypes(
  readFileSync(
    new URL("../src/data/cinematic-timeline.ts", import.meta.url),
    "utf8",
  ),
).replace('"./award-roster"', JSON.stringify(roster));
const { masterCues, getInstituteAwardCues, durationInFrames, cardFrames } =
  await import(asModule(timing));

assert.deepEqual(
  masterCues.map(({ from }) => from),
  [0, 300, 660, 1740, 3420, 4500, 6060, 6300, 6600],
);
assert.equal(durationInFrames, 6720);
assert.equal(cardFrames, 120);
assert.equal(festivalAwards.CW.name, "CW생산본부");
assert.equal(festivalAwards.MS.name, "미사일시스템생산본부");
for (const index of [2, 4]) {
  assert.equal(masterCues[index].durationInFrames, 120 + 8 * cardFrames);
}
assert.equal(masterCues[6].durationInFrames, 240);
for (const [code, frames, count] of [
  ["CW", 1680, 49],
  ["MS", 1560, 37],
]) {
  assert.equal(festivalAwards[code].categories.length, 8);
  const cues = getInstituteAwardCues(code);
  let cursor = 0;
  for (const cue of cues) {
    assert.equal(cue.start, cursor);
    assert.equal(cue.frames, cardFrames);
    assert.ok(
      cue.recipients.every((entry) =>
        festivalAwards[code].categories[cue.categoryIndex].recipients.includes(
          entry,
        ),
      ),
    );
    if (cue.kind === "grand")
      assert.ok(cue.recipients.every(({ rank }) => rank === "대상"));
    if (cue.kind === "regular")
      assert.ok(cue.recipients.every(({ rank }) => rank !== "대상"));
    cursor += cue.frames;
  }
  assert.equal(
    cues
      .map(({ recipients }) => recipients.length)
      .reduce((sum, size) => sum + size, 0),
    count,
  );
  assert.equal(
    new Set(cues.flatMap(({ recipients }) => recipients)).size,
    count,
  );
  assert.equal(cues.filter(({ kind }) => kind === "grand").length, 5);
  assert.equal(cues.at(-1).kind, "credits");
  assert.equal(cursor, frames);
}
console.log(
  "CW/MS category, 86 award rows, 10 grand-prize cues, uniform four-second pages, production division labels and mentor/mentee labels passed.",
);

function run(cmd, args) {
  const result = spawnSync(cmd, args, { encoding: "utf8" });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
}

const video = process.argv[2];
if (video) {
  const length = Number(process.argv[3] || durationInFrames / 30);
  const { streams } = JSON.parse(
    run("ffprobe", ["-v", "error", "-show_streams", "-of", "json", video]),
  );
  const visual = streams.find(({ codec_type }) => codec_type === "video");
  const audio = streams.find(({ codec_type }) => codec_type === "audio");
  assert.equal(visual.width * 3, visual.height * 11);
  assert.equal(visual.codec_name, "h264");
  assert.equal(visual.avg_frame_rate, "30/1");
  assert.equal(Number(visual.nb_frames), length * 30);
  assert.equal(Number(visual.duration), length);
  assert.equal(visual.pix_fmt, "yuv420p");
  assert.equal(visual.color_space, "bt709");
  assert.equal(audio.codec_name, "aac");
  assert.equal(audio.channels, 2);
  const progress = run("ffmpeg", [
    "-v",
    "error",
    "-nostdin",
    "-xerror",
    "-i",
    video,
    "-map",
    "0:v",
    "-map",
    "0:a",
    "-progress",
    "pipe:1",
    "-f",
    "null",
    "-",
  ]);
  assert.equal(
    Number([...progress.matchAll(/^frame=(\d+)/gm)].at(-1)?.[1]),
    length * 30,
  );
  assert.match(progress, /^progress=end$/m);
  console.log(
    `${video}: ${visual.width}×${visual.height}, ${length}s, ${visual.nb_frames} decoded video frames and AAC stereo.`,
  );
}
