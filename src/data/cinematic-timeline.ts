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

export const getInstituteAwardCues = (code: InstituteCode): AwardCue[] => {
  const categories = festivalAwards[code].categories;
  const kinds: readonly AwardCue["kind"][] = ["regular", "grand"];
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
        const pages = Array.from(
          { length: Math.ceil(recipients.length / 8) },
          (_, page) => recipients.slice(page * 8, (page + 1) * 8),
        );
        return pages.map((page) => ({
          code,
          categoryIndex,
          kind,
          recipients: page,
        }));
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
