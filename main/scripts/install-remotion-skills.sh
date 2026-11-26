#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

origin=https://github.com/remotion-dev/skills.git
revision=6f55706d1069e512430582ad86e4e57dc07afe1b
source_dir=$(mktemp -d)
trap 'rm -r -- "$source_dir"' EXIT
git init --quiet "$source_dir/repo"
git -C "$source_dir/repo" fetch --quiet --depth=1 "$origin" "$revision"
test "$(git -C "$source_dir/repo" rev-parse FETCH_HEAD)" = "$revision"
git -C "$source_dir/repo" archive "$revision" skills | tar -x -C "$source_dir"
mkdir -p .agents/skills

for skill in "$source_dir"/skills/remotion-*; do
  target=".agents/skills/${skill##*/}"
  if [[ -e "$target" ]] && ! diff -qr "$skill" "$target"; then
    printf 'Conflicting Remotion skill: %s\n' "$target" >&2
    exit 1
  fi
done

for skill in "$source_dir"/skills/remotion-*; do
  target=".agents/skills/${skill##*/}"
  if [[ ! -e "$target" ]]; then
    cp -R "$skill" "$target"
  fi
done
printf 'Verified official Remotion skills at %s\n' "$revision"
