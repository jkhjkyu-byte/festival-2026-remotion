#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

render() {
  ./node_modules/.bin/remotion render "$@" --codec=h264 --pixel-format=yuv420p \
    --color-space=bt709 --is-production=false "${browser_flags[@]}"
}

browser_flags=()
if [[ -n "${REMOTION_BROWSER_EXECUTABLE:-}" ]]; then
  browser_flags+=(--browser-executable="$REMOTION_BROWSER_EXECUTABLE")
fi
mkdir -p out/redesign

case "${1:-master}" in
  plates)
    mkdir -p public/assets/cinematic-plates
    render CinematicStagePlates out/redesign/stage-reel.mp4 --gl=swangle \
      --concurrency="${FESTIVAL_CONCURRENCY:-2}" --muted --crf=16
    names=(opening schedule cw ms cw-gold ms-gold quiz ending)
    for i in "${!names[@]}"; do
      plate="public/assets/cinematic-plates/${names[i]}.mp4"
      ffmpeg -nostdin -v error -xerror -y -ss "$((i * 4))" -i out/redesign/stage-reel.mp4 \
        -map 0:v:0 -frames:v 120 -an -c:v libx264 -preset fast -crf 16 -pix_fmt yuv420p \
        -color_primaries bt709 -colorspace bt709 -color_trc bt709 "$plate"
      test "$(ffprobe -v error -select_streams v:0 -show_entries stream=nb_frames -of csv=p=0 "$plate")" = 120
    done
    ;;
  proofs)
    for kind in Opening Award; do
      render "Cinematic${kind}Proof" "out/redesign/proof-${kind,,}.mp4" --width=1320 --height=360 \
        --gl=swangle --concurrency="${FESTIVAL_CONCURRENCY:-2}" --crf=18 --audio-codec=aac
    done
    ;;
  master|reference|ceremony|awards-order|roster-quiz)
    output="out/redesign/festival-cinematic.mp4"
    if [[ "${1:-master}" == reference ]]; then
      output="out/reference-cut/festival-reference-cut.mp4"
    elif [[ "${1:-master}" == ceremony ]]; then
      output="out/ceremony-cut/festival-ceremony-cut.mp4"
    elif [[ "${1:-master}" == awards-order ]]; then
      output="out/awards-order/festival-awards-order.mp4"
    elif [[ "${1:-master}" == roster-quiz ]]; then
      output="out/roster-quiz/festival-roster-quiz.mp4"
    fi
    mkdir -p "$(dirname "$output")"
    width=${FESTIVAL_WIDTH:-1980}
    height=${FESTIVAL_HEIGHT:-540}
    if ! [[ "$width" =~ ^[1-9][0-9]{0,4}$ && "$height" =~ ^[1-9][0-9]{0,4}$ ]] ||
       (( width * 3 != height * 11 || width % 2 || height % 2 )); then
      printf '%s\n' 'Set positive, even dimensions with 11:3 aspect ratio.' >&2
      exit 2
    fi
    tmp_dir=$(mktemp -d "$(dirname "$output")/.master.XXXXXX")
    trap 'rm -r -- "$tmp_dir"' EXIT
    render FestivalCinematic "$tmp_dir/output.mp4" --width="$width" --height="$height" \
      --audio-codec=aac --audio-bitrate=192K --x264-preset=fast --crf=18 --jpeg-quality=88 \
      --concurrency="${FESTIVAL_CONCURRENCY:-4}"
    mv -- "$tmp_dir/output.mp4" "$output"
    ;;
  *)
    printf '%s\n' 'Usage: bash scripts/render-cinematic.sh [proofs|plates|master|reference|ceremony|awards-order|roster-quiz]' >&2
    exit 2
    ;;
esac
