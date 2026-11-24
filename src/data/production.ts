export type InstituteCode = "CW" | "MS";

export type AwardRecipient = {
  category: string;
  name: string;
  affiliation: string;
};

type InstituteAwards = {
  institute: string;
  categories: readonly string[];
  winners: readonly AwardRecipient[];
  grandPrize: AwardRecipient | null;
};

type ScheduleItem = {
  name: string;
  date: string;
  place: string;
};

export const awardData: Record<InstituteCode, InstituteAwards> = {
  CW: {
    institute: "CW생산본부",
    categories: [
      "특허",
      "논문",
      "BP(개발설계)",
      "BP(제조/전문기술)",
      "BP(혁신과제)",
      "멘토멘티 공동 수행과제",
      "실시제안 마일리지",
    ],
    winners: [],
    grandPrize: null,
  },
  MS: {
    institute: "미사일시스템생산본부",
    categories: [
      "특허",
      "논문",
      "BP(개발설계)",
      "BP(제조/전문기술)",
      "BP(혁신과제)",
      "멘토멘티 공동 수행과제",
      "실시제안 마일리지",
    ],
    winners: [],
    grandPrize: null,
  },
};

export const festivalCopy = {
  title: "2026 기술·혁신 FESTIVAL",
  slogan: "기술의 도전, 혁신의 성과",
  schedule: {
    poster: {
      name: "우수 과제 포스터 전시회",
      date: "2026.12.01(화) ~ 12.03(목)",
      place: "L3동 중앙홀",
    },
    CW: {
      name: awardData.CW.institute,
      date: "2026.12.10(목) 14:00",
      place: "L3동 변화마당 회의실",
    },
    MS: {
      name: awardData.MS.institute,
      date: "2026.12.02(수) 14:00",
      place: "L3동 변화마당 회의실",
    },
  } satisfies Record<"poster" | InstituteCode, ScheduleItem>,
  quiz: {
    title: "SPECIAL QUIZ EVENT",
    invitation: "시상식에 참석해 퀴즈를 맞히면 상품을 드립니다.",
    notice: "잠시 후, 특별 퀴즈가 시작됩니다!",
    challenge: "여러분의 도전을 기다립니다.",
  },
};

export const festivalProductionFormat = { width: 3960, height: 1080, fps: 30 };

const masterSeconds = [12, 18, 24, 51, 51, 20, 4] as const;

export const getSceneTiming = () => {
  let from = 0;
  return masterSeconds.map((seconds) => {
    const durationInFrames = seconds * festivalProductionFormat.fps;
    const cue = { from, durationInFrames };
    from += durationInFrames;
    return cue;
  });
};

export const getAwardTiming = (
  durationFrames: number,
  hasGrandPrize: boolean,
) => {
  const { fps } = festivalProductionFormat;
  const introEnd = 5 * fps;
  const rollupStart = durationFrames - 6 * fps;
  const winnersEnd = rollupStart - (hasGrandPrize ? 11 * fps : 0);
  return { introEnd, winnersEnd, grandEnd: rollupStart, rollupStart };
};

export const getInstituteAwards = (code: InstituteCode) => {
  const entry = awardData[code];
  return {
    ...entry,
    winners: entry.categories.flatMap((category) =>
      entry.winners.filter((winner) => winner.category === category),
    ),
    grandPrize:
      entry.grandPrize && entry.categories.includes(entry.grandPrize.category)
        ? entry.grandPrize
        : null,
  };
};
