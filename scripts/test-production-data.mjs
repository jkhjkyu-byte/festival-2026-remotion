import assert from "node:assert/strict";
import {
  awardData,
  festivalCopy,
  festivalProductionFormat,
  getAwardTiming,
  getInstituteAwards,
  getSceneTiming,
} from "../src/data/production.ts";

const timeline = getSceneTiming();
assert.deepEqual(
  timeline.map(({ from }) => from),
  [0, 360, 900, 1620, 3150, 4680, 5280],
);
assert.equal(timeline.at(-1).from + timeline.at(-1).durationInFrames, 5400);
assert.equal(festivalProductionFormat.fps, 30);
assert.equal(
  festivalProductionFormat.width * 3,
  festivalProductionFormat.height * 11,
);
assert.equal(festivalCopy.schedule.poster.date, "2026.12.01(화) ~ 12.03(목)");
assert.equal(festivalCopy.schedule.CW.date, "2026.12.08(화) 14:00");
assert.equal(festivalCopy.schedule.MS.date, "2026.12.02(수) 14:00");

const expectedCategories = [
  "특허",
  "논문",
  "BP(개발설계)",
  "BP(제조/전문기술)",
  "BP(혁신과제)",
  "멘토멘티 공동 수행과제",
  "실시제안 마일리지",
];
assert.notEqual(awardData.CW.categories, awardData.MS.categories);

const fixture = (category) => ({
  category,
  name: "[QA 수상자]",
  affiliation: "[QA 소속]",
});
const originalMsCategories = awardData.MS.categories.slice();
awardData.CW.categories = expectedCategories.slice(0, 5);
awardData.CW.winners = [
  fixture("논문"),
  fixture("특허"),
  fixture("MS QA 분야 1"),
];
awardData.CW.grandPrize = fixture("특허");
assert.deepEqual(awardData.MS.categories, originalMsCategories);
awardData.MS.categories = [
  ...expectedCategories,
  "MS QA 분야 1",
  "MS QA 분야 2",
];
awardData.MS.winners = [fixture("MS QA 분야 1")];
awardData.MS.grandPrize = null;

const cw = getInstituteAwards("CW");
const ms = getInstituteAwards("MS");
assert.deepEqual([cw.categories.length, ms.categories.length], [5, 9]);
assert.deepEqual(
  cw.winners.map(({ category }) => category),
  ["특허", "논문"],
);
assert.deepEqual(
  ms.winners.map(({ category }) => category),
  ["MS QA 분야 1"],
);
assert.equal(cw.grandPrize.category, "특허");
assert.equal(ms.grandPrize, null);

assert.deepEqual(getAwardTiming(1530, true), {
  introEnd: 150,
  winnersEnd: 1020,
  grandEnd: 1350,
  rollupStart: 1350,
});
assert.deepEqual(getAwardTiming(1530, false), {
  introEnd: 150,
  winnersEnd: 1350,
  grandEnd: 1350,
  rollupStart: 1350,
});
console.log(
  "Master timing, schedule, independent 5/9 fields, recipient routing and optional prize passed.",
);
