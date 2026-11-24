import type { Recipient } from "./award-roster";

export const formatMentorMenteeNames = (names: readonly string[]) => {
  const roles = /^\s*멘토\s*:\s*(.+?)\s*\/\s*멘티\s*:\s*(.+?)\s*$/s.exec(
    names.join(", "),
  );
  return roles ? `멘토(${roles[1]}) / 멘티(${roles[2]})` : null;
};

export const groupRecipientsByRank = (recipients: readonly Recipient[]) => {
  const groups = new Map<string, Recipient[]>();
  for (const recipient of recipients) {
    const list = groups.get(recipient.rank);
    if (list) list.push(recipient);
    else groups.set(recipient.rank, [recipient]);
  }
  return Array.from(groups, ([rank, members]) => ({ rank, members }));
};

export const layoutRecipientRows = (members: readonly Recipient[]) => {
  const count = Math.ceil(members.length / 3);
  return Array.from({ length: count }, (_, index) => {
    const start = Math.floor((index * members.length) / count);
    const end = Math.floor(((index + 1) * members.length) / count);
    return { start, members: members.slice(start, end) };
  });
};
