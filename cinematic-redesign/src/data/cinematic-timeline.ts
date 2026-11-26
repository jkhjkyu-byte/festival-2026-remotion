import { groupRecipientsByRank } from "./award-display";
import { festivalAwards, type Recipient } from "./award-roster";
import type { InstituteCode } from "./production";

type Page = {
  readonly code: InstituteCode;
  readonly categoryIndex: number;
  readonly start: number;
  readonly frames: number;
};

export type AwardCue = Page & {
  readonly kind: "regular" | "grand" | "credits";
  readonly title?: string;
  readonly rank?: string;
  readonly recipients: readonly Recipient[];
};

export type DescriptionCue = Page & { readonly kind: "description" };
export type ProgramCue = AwardCue | DescriptionCue;

export const fps = 30;
export const cardSeconds = 6;
export const instituteIntroSeconds = cardSeconds;
export const cardFrames = fps * cardSeconds;

const ordinaryRanks = ["최우수", "우수", "장려"];
const rankPriority = (rank: string) => {
  const index = ordinaryRanks.indexOf(rank);
  return index === -1 ? ordinaryRanks.length : index;
};

type AwardPage = Pick<AwardCue, "kind" | "rank" | "title" | "recipients">;

const pageSize = 5;
const pagesFor = (
  recipients: readonly Recipient[],
  kind: AwardPage["kind"],
  rank?: string,
): AwardPage[] =>
  Array.from(
    { length: Math.ceil(recipients.length / pageSize) },
    (_, page) => ({
      kind,
      rank,
      recipients: recipients.slice(page * pageSize, (page + 1) * pageSize),
    }),
  );

const awardPages = (
  code: InstituteCode,
  category: string,
  recipients: readonly Recipient[],
): AwardPage[] => {
  if (category === "실시제안 마일리지") {
    return [{ kind: "credits", recipients }];
  }
  const grand = pagesFor(
    recipients.filter(({ rank }) => rank === "대상"),
    "grand",
  );
  const regular = recipients
    .filter(({ rank }) => rank !== "대상")
    .sort((left, right) => rankPriority(left.rank) - rankPriority(right.rank));

  if (code === "CW" && category === "7S 낭비제거활동") {
    const personalTitle = "7S 낭비제거 활동 - 개인";
    const personal = regular.filter(({ names }) => names.length > 0);
    const teams = regular.filter(({ names }) => names.length === 0);
    return [
      ...grand,
      ...pagesFor(
        personal.filter(({ rank }) => rank === "최우수"),
        "regular",
        "최우수",
      ).map((page) => ({ ...page, title: personalTitle })),
      ...pagesFor(
        personal.filter(({ rank }) => rank !== "최우수"),
        "regular",
      ).map((page) => ({ ...page, title: personalTitle })),
      ...pagesFor(teams, "regular").map((page) => ({
        ...page,
        title: "7S 낭비제거 활동 - 단체",
      })),
    ];
  }

  return [
    ...grand,
    ...groupRecipientsByRank(regular).flatMap(({ rank, members }) =>
      pagesFor(members, "regular", rank),
    ),
  ];
};

type ProgramPage =
  | Omit<DescriptionCue, "start" | "frames">
  | Omit<AwardCue, "start" | "frames">;

export const getInstituteProgramCues = (code: InstituteCode): ProgramCue[] => {
  const pages = festivalAwards[code].categories.flatMap<ProgramPage>(
    ({ name, recipients }, categoryIndex) => [
      { code, categoryIndex, kind: "description" },
      ...awardPages(code, name, recipients).map((page) => ({
        code,
        categoryIndex,
        ...page,
      })),
    ],
  );
  return pages.map((page, index) => ({
    ...page,
    frames: cardFrames,
    start: index * cardFrames,
  }));
};

export const getInstituteAwardCues = (code: InstituteCode): AwardCue[] =>
  getInstituteProgramCues(code).filter(
    (cue): cue is AwardCue => cue.kind !== "description",
  );

const masterSeconds = [
  cardSeconds,
  cardSeconds,
  instituteIntroSeconds + cardSeconds,
  getInstituteProgramCues("CW").length * cardSeconds,
  instituteIntroSeconds + cardSeconds,
  getInstituteProgramCues("MS").length * cardSeconds,
  cardSeconds,
  cardSeconds,
  cardSeconds,
];

let cutFrame = 0;
export const masterCues = masterSeconds.map((seconds) => {
  const durationInFrames = seconds * fps;
  const from = cutFrame;
  cutFrame += durationInFrames;
  return { from, durationInFrames };
});
export const durationInFrames = cutFrame;
