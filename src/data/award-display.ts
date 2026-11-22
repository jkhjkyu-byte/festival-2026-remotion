export const formatMentorMenteeNames = (names: readonly string[]) => {
  const roles = /^\s*멘토\s*:\s*(.+?)\s*\/\s*멘티\s*:\s*(.+?)\s*$/s.exec(
    names.join(", "),
  );
  return roles ? `멘토(${roles[1]})/멘티(${roles[2]})` : null;
};
