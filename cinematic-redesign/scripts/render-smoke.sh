#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

browser_flags=()
if [[ -n "${REMOTION_BROWSER_EXECUTABLE:-}" ]]; then
  browser_flags+=(--browser-executable="$REMOTION_BROWSER_EXECUTABLE")
fi
mkdir -p out
temporary_output=$(mktemp -d out/.smoke.XXXXXX)
trap 'rm -r -- "$temporary_output"' EXIT
video="$temporary_output/festival-smoke.mp4"

./node_modules/.bin/remotion render FestivalSmoke "$video" \
  --codec=h264 --pixel-format=yuv420p --color-space=bt709 \
  --scale=0.3333333333333333 --concurrency=2 --muted --is-production=false \
  "${browser_flags[@]}"

ffprobe -v error -show_entries stream=codec_name,width,height,avg_frame_rate,nb_frames,pix_fmt,color_space \
  -of json "$video" | node --input-type=module -e '
    import assert from "node:assert/strict";
    import { readFileSync } from "node:fs";
    const { streams } = JSON.parse(readFileSync(0, "utf8"));
    assert.deepEqual(streams, [{
      codec_name: "h264", width: 640, height: 360, pix_fmt: "yuv420p",
      color_space: "bt709", avg_frame_rate: "30/1", nb_frames: "90",
    }]);
  '
ffmpeg -nostdin -v error -xerror -i "$video" -map 0:v:0 -f null -
mv -- "$video" out/festival-smoke.mp4
printf '%s\n' 'out/festival-smoke.mp4: H.264, 640×360, 30 fps, 90 frames, yuv420p, BT.709. Full decode passed.'
