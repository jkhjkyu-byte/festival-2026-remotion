"""Generate original oscillator-based stereo cues. Python 3 and FFmpeg."""
from array import array
from math import exp, pi, sin
from pathlib import Path
import subprocess
import sys

RATE = 32000
TAU = 2 * pi
DEST = Path(__file__).resolve().parents[1] / "public/assets/festival-audio"

# Seconds, root pitch in Hz, timed motif pitches as ratios of the root, pulse interval.
CUES = {
    "opening": (12, 55, (1, 1.5, 2, 2.667, 3), 1.5),
    "technology": (8, 65.406, (2, 3, 2.667, 4, 3, 2.667, 2, 1.5), 0.5),
    "honors": (12, 58.27, (1, 2, 2.667, 3, 4, 6), 1),
    "gold": (11, 73.416, (1, 2, 2.5, 3, 4, 6), 1.45),
    "quiz": (10, 98, (2, 2.5, 3, 4, 3, 2.5, 4, 5), 0.38),
    "ending": (4, 55, (3, 2.667, 2, 1.5), 0.6),
}


def make_cue(name, seconds, root, motif, beat):
    signal = array("h")
    for i in range(seconds * RATE):
        t = i / RATE
        # Seam-free endpoints; the sine pad and damped motif are mixed below clipping.
        envelope = min(1, t / 0.35, (seconds - t) / 0.55)
        slot = int(t / beat)
        elapsed = t - slot * beat
        note = root * motif[slot % len(motif)]
        attack = min(1, elapsed * 48)
        bloom = 0.55 + 0.45 * sin(pi * t / seconds)
        pad = (
            0.047 * sin(TAU * root * t)
            + 0.017 * sin(TAU * root * 1.5 * t + 0.35 * sin(TAU * 0.13 * t))
            + 0.013 * sin(TAU * root * 2.003 * t)
        )
        pluck = 0.062 * attack * exp(-7 * elapsed) * (
            sin(TAU * note * elapsed) + 0.23 * sin(TAU * 2.003 * note * elapsed)
        )
        pulse_level = 0.055 if name == "quiz" else 0.026
        pulse = pulse_level * attack * exp(-16 * elapsed) * sin(TAU * (55 * elapsed + 0.7 * (1 - exp(-30 * elapsed))))
        impact = 0.0
        if name in ("opening", "gold"):
            offset = t - (8 if name == "opening" else 2.9)
            if offset > 0:
                impact = 0.16 * min(1, offset * 20) * exp(-2.3 * offset) * sin(TAU * (46 * offset + 1.8 * (1 - exp(-4 * offset))))
        pan = 0.5 + 0.28 * sin(TAU * 0.21 * t)
        shared = bloom * pad + pulse + impact
        signal.extend((int(32767 * envelope * (shared + pluck * pan)),
                       int(32767 * envelope * (shared + pluck * (1 - pan)))))

    if sys.byteorder != "little":
        signal.byteswap()
    subprocess.run(
        ["ffmpeg", "-nostdin", "-hide_banner", "-loglevel", "error", "-y",
         "-f", "s16le", "-ar", str(RATE), "-ac", "2", "-i", "pipe:0",
         "-codec:a", "libmp3lame", "-b:a", "96k", str(DEST / f"{name}.mp3")],
        input=signal.tobytes(), check=True,
    )


if __name__ == "__main__":
    DEST.mkdir(parents=True, exist_ok=True)
    for cue, settings in CUES.items():
        make_cue(cue, *settings)
