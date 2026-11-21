#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

# Screen dimensions in pixels. Defaults are an 11:3 review deliverable.
width=${FESTIVAL_WIDTH:-1980}
height=${FESTIVAL_HEIGHT:-540}
if ! [[ "$width" =~ ^[1-9][0-9]{0,4}$ && "$height" =~ ^[1-9][0-9]{0,4}$ ]] ||
   (( width * 3 != height * 11 || width % 2 || height % 2 )); then
  printf '%s\n' 'FESTIVAL_WIDTH and FESTIVAL_HEIGHT must be positive even dimensions with aspect ratio 11:3.' >&2
  exit 2
fi

browser_flags=()
if [[ -n "${REMOTION_BROWSER_EXECUTABLE:-}" ]]; then
  browser_flags+=(--browser-executable="$REMOTION_BROWSER_EXECUTABLE")
fi

mkdir -p out
tmp_dir=$(mktemp -d out/.master.XXXXXX)
trap 'rm -r -- "$tmp_dir"' EXIT
./node_modules/.bin/remotion render FestivalMaster "$tmp_dir/master.mp4" \
  --width="$width" --height="$height" \
  --codec=h264 --crf=19 --pixel-format=yuv420p --color-space=bt709 \
  --audio-codec=aac --audio-bitrate=192K --jpeg-quality=88 \
  --concurrency="${FESTIVAL_CONCURRENCY:-4}" --is-production=false \
  "${browser_flags[@]}"

mv -- "$tmp_dir/master.mp4" out/festival-master.mp4
