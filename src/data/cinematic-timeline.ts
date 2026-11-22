import { festivalAwards, type Recipient } from "./award-roster";
import type { InstituteCode } from "./production";

export type AwardCue = {
  readonly code: InstituteCode;
  readonly categoryIndex: number;
  readonly kind: "regular" | "grand" | "credits";
  readonly start: number;
  readonly frames: number;
  readonly recipients: readonly Recipient[];
};

export const fps = 30;
export const cardSeconds = 4;
export const instituteIntroSeconds = 4;
export const cardFrames = fps * cardSeconds;

const ordinaryRanks = ["최우수", "우수", "장려"];

const rankPriority = (rank: string) => {
  const index = ordinaryRanks.indexOf(rank);
  return index === -1 ? ordinaryRanks.length : index;
};

const awardPages = (
  code: InstituteCode,
  category: string,
  kind: "regular" | "grand",
  recipients: readonly Recipient[],
): readonly (readonly Recipient[])[] => {
  const ordered =
    kind === "regular"
      ? [...recipients].sort(
          (left, right) => rankPriority(left.rank) - rankPriority(right.rank),
        )
      : recipients;

  if (code === "CW" && category === "7S 낭비제거활동" && kind === "regular") {
    const people = ordered.filter(({ names }) => names.length > 0);
    const teams = ordered.filter(({ names }) => names.length === 0);
    return [
      ...(people.length ? [people] : []),
      ...(teams.length ? [teams] : []),
    ];
  }

  return Array.from({ length: Math.ceil(ordered.length / 8) }, (_, page) =>
    ordered.slice(page * 8, (page + 1) * 8),
  );
};

export const getInstituteAwardCues = (code: InstituteCode): AwardCue[] => {
  const categories = festivalAwards[code].categories;
  const kinds = ["regular", "grand"] as const;
  const items = categories.flatMap<Omit<AwardCue, "start" | "frames">>(
    (category, categoryIndex) => {
      if (category.name === "실시제안 마일리지") {
        return [
          {
            code,
            categoryIndex,
            kind: "credits" as const,
            recipients: category.recipients,
          },
        ];
      }
      return kinds.flatMap((kind) => {
        const recipients = category.recipients.filter(({ rank }) =>
          kind === "grand" ? rank === "대상" : rank !== "대상",
        );
        return awardPages(code, category.name, kind, recipients).map(
          (page) => ({
            code,
            categoryIndex,
            kind,
            recipients: page,
          }),
        );
      });
    },
  );

  return items.map((item, index) => ({
    ...item,
    frames: cardFrames,
    start: index * cardFrames,
  }));
};

export const masterSeconds = [
  10,
  12,
  instituteIntroSeconds + festivalAwards.CW.categories.length * cardSeconds,
  getInstituteAwardCues("CW").length * cardSeconds,
  instituteIntroSeconds + festivalAwards.MS.categories.length * cardSeconds,
  getInstituteAwardCues("MS").length * cardSeconds,
  8,
  10,
  4,
];

let cutFrame = 0;
export const masterCues = masterSeconds.map((seconds) => {
  const durationInFrames = seconds * fps;
  const from = cutFrame;
  cutFrame += durationInFrames;
  return { from, durationInFrames };
});
export const durationInFrames = cutFrame;
