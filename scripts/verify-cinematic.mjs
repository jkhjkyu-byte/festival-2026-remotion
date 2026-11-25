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
const display = asModule(
  stripTypeScriptTypes(
    readFileSync(
      new URL("../src/data/award-display.ts", import.meta.url),
      "utf8",
    ),
  ),
);
const { formatMentorMenteeNames } = await import(display);
const mentors = festivalAwards.CW.categories.find(
  ({ name }) => name === "멘토멘티 협동과제",
);
assert.ok(mentors);
assert.deepEqual(
  mentors.recipients.map(({ names }) => formatMentorMenteeNames(names)),
  [
    "멘토(홍동근) / 멘티(김효근)",
    "멘토(홍성일) / 멘티(이동훈, 이준영)",
    "멘토(박건우, 김기웅, 김덕연) / 멘티(홍승표)",
  ],
);
assert.equal(formatMentorMenteeNames(["공동 수상", "수상자"]), null);

const timing = stripTypeScriptTypes(
  readFileSync(
    new URL("../src/data/cinematic-timeline.ts", import.meta.url),
    "utf8",
  ),
)
  .replace('"./award-roster"', JSON.stringify(roster))
  .replace('"./award-display"', JSON.stringify(display));
const {
  masterCues,
  getInstituteAwardCues,
  getInstituteProgramCues,
  durationInFrames,
  cardFrames,
} = await import(asModule(timing));

assert.deepEqual(
  masterCues.map(({ from }) => from),
  [0, 180, 360, 720, 5760, 6120, 10620, 10800, 10980],
);
assert.equal(durationInFrames, 11160);
assert.equal(cardFrames, 180);
assert.equal(festivalAwards.CW.name, "CW생산본부");
assert.equal(festivalAwards.MS.name, "미사일시스템생산본부");
for (const index of [2, 4]) {
  assert.equal(masterCues[index].durationInFrames, 2 * cardFrames);
}
for (const index of [0, 1, 6, 7, 8]) {
  assert.equal(masterCues[index].durationInFrames, cardFrames);
}
const rankOrder = ["최우수", "우수", "장려"];
const sevenIndex = festivalAwards.CW.categories.findIndex(
  ({ name }) => name === "7S 낭비제거활동",
);
const seven = getInstituteAwardCues("CW").filter(
  ({ categoryIndex }) => categoryIndex === sevenIndex,
);
assert.deepEqual(
  seven.map(({ kind, rank, recipients }) => [kind, rank, recipients.length]),
  [
    ["grand", undefined, 1],
    ["regular", "최우수", 3],
    ["regular", undefined, 3],
    ["regular", undefined, 3],
  ],
);
assert.deepEqual(seven[0].recipients[0].names, ["김태호"]);
assert.deepEqual(
  seven[2].recipients.map(({ rank }) => rank),
  ["우수", "우수", "혁신 제안 우수인"],
);
assert.deepEqual(
  seven.map(({ title }) => title),
  [
    undefined,
    "7S 낭비제거 활동 - 개인",
    "7S 낭비제거 활동 - 개인",
    "7S 낭비제거 활동 - 단체",
  ],
);
assert.deepEqual(
  seven[3].recipients.map(({ rank }) => rank),
  ["지속실천 우수팀", "최다 제출팀", "다각화 제안 우수팀"],
);

const expected = {
  CW: {
    frames: 5040,
    categories: [
      ["논문", 6, 1],
      ["특허", 3, 0],
      ["BP(개발설계)", 9, 1],
      ["BP(전문기술)", 2, 1],
      ["BP(혁신과제)", 6, 1],
      ["7S 낭비제거활동", 10, 1],
      ["멘토멘티 협동과제", 3, 0],
      ["실시제안 마일리지", 10, 0],
    ],
  },
  MS: {
    frames: 4500,
    categories: [
      ["논문", 3, 1],
      ["특허", 3, 0],
      ["BP(개발설계)", 8, 1],
      ["BP(제조전문)", 6, 1],
      ["BP(혁신과제)", 4, 1],
      ["부품국산화", 3, 0],
      ["산학과제", 3, 0],
      ["실시제안 마일리지", 8, 0],
    ],
  },
};
for (const [code, { frames, categories }] of Object.entries(expected)) {
  assert.deepEqual(
    festivalAwards[code].categories.map(({ name, recipients }) => [
      name,
      recipients.length,
      recipients.filter(({ rank }) => rank === "대상").length,
    ]),
    categories,
  );
  const count = categories.reduce((sum, [, size]) => sum + size, 0);
  const cues = getInstituteAwardCues(code);
  const program = getInstituteProgramCues(code);
  let cursor = 0;
  for (const cue of program) {
    assert.equal(cue.start, cursor);
    assert.equal(cue.frames, cardFrames);
    cursor += cue.frames;
  }
  for (const [index, [, , grand]] of categories.entries()) {
    const pages = program.filter(
      ({ categoryIndex }) => categoryIndex === index,
    );
    assert.equal(pages[0].kind, "description");
    if (grand) assert.equal(pages[1].kind, "grand");
    const ordinary = pages.filter(({ kind }) => kind === "regular");
    const special = code === "CW" && index === sevenIndex;
    for (const cue of ordinary) {
      assert.ok(cue.recipients.length <= 5);
      assert.ok(cue.recipients.every((item) => item.rank !== "대상"));
      if (!special)
        assert.ok(cue.recipients.every(({ rank }) => rank === cue.rank));
    }
    if (!special) {
      const priorities = ordinary.map(({ rank }) => rankOrder.indexOf(rank));
      assert.deepEqual(
        priorities,
        [...priorities].sort((a, b) => a - b),
      );
    }
  }
  for (const cue of cues) {
    assert.ok(
      cue.recipients.every((entry) =>
        festivalAwards[code].categories[cue.categoryIndex].recipients.includes(
          entry,
        ),
      ),
    );
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
  assert.deepEqual(
    cues
      .filter(({ kind }) => kind === "grand")
      .map(({ categoryIndex }) => categoryIndex),
    categories.flatMap(([, , grand], index) => (grand ? [index] : [])),
  );
  assert.equal(cues.at(-1).kind, "credits");
  assert.equal(cursor, frames);
}
assert.deepEqual(
  festivalAwards.MS.categories
    .find(({ name }) => name === "논문")
    .recipients.find(({ team, rank }) => team === "3팀" && rank === "최우수")
    .names,
  ["김하림", "이준엽"],
);

console.log(
  "CW/MS category order and counts, 87 award rows, separate rank pages, nine grand-prize cues, 7S groupings, uniform six-second pages and mentor/mentee labels passed.",
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
