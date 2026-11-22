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
export const masterSeconds = [10, 12, 18, 56, 18, 52, 10, 4] as const;
export const masterCues = masterSeconds.map((seconds, index) => ({
  from:
    masterSeconds.slice(0, index).reduce((sum, value) => sum + value, 0) * fps,
  durationInFrames: seconds * fps,
}));
export const durationInFrames = 180 * fps;

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

  const allotted = (code === "CW" ? masterSeconds[3] : masterSeconds[5]) * fps;
  const creditFrames = (code === "CW" ? 11 : 9) * fps;
  const grandFrames = 108;
  const fixedFrames = items.reduce(
    (sum, { kind }) =>
      sum +
      (kind === "grand" ? grandFrames : kind === "credits" ? creditFrames : 0),
    0,
  );
  const readingWeight = (item: (typeof items)[number]) =>
    item.kind === "regular" ? 4 + item.recipients.length : 0;
  const totalWeight = items.reduce((sum, item) => sum + readingWeight(item), 0);
  let consumedWeight = 0;
  let start = 0;

  return items.map((item) => {
    let frames: number;
    if (item.kind === "grand") {
      frames = grandFrames;
    } else if (item.kind === "credits") {
      frames = creditFrames;
    } else {
      const before = consumedWeight;
      consumedWeight += readingWeight(item);
      frames =
        Math.round(((allotted - fixedFrames) * consumedWeight) / totalWeight) -
        Math.round(((allotted - fixedFrames) * before) / totalWeight);
    }
    const cue = { ...item, frames, start };
    start += frames;
    return cue;
  });
};
