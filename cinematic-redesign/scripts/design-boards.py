#!/usr/bin/env python3
"""Generate the 11:3 design alternatives and contact sheets for the 180 s master."""
from __future__ import annotations

import argparse
import math
import random
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

from PIL import Image, ImageColor, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
FONTS = Path("/usr/share/fonts/opentype/noto")
W, H = 880, 240
INK = "#060b17"
BLUE = "#3cbaff"
CYAN = "#77f0ef"
GOLD = "#e7b46c"
WHITE = "#eff6ff"
MUTED = "#a7bddd"
LOCATION = "#d1deee"
VARIANTS = ("A", "B", "C", "D")
VARIANT_NAMES = (
    "A   대칭 · 광원에 집중",
    "B   비대칭 · 방향성 강조",
    "C   모듈 · 정보의 정렬",
    "D   종합 · 제작 방향",
)
EVENT = "2026 기술·혁신 FESTIVAL"
SLOGAN = "기술의 도전, 혁신의 성과"
CW = "CW기술연구소"
MS = "미사일시스템기술연구소"
FIELDS = (
    "특허", "논문", "BP(개발설계)", "BP(제조/전문기술)", "BP(혁신과제)",
    "멘토멘티 공동 수행과제", "실시제안 마일리지",
)


@dataclass(frozen=True)
class Beat:
    sample: float
    label: str
    motif: str
    title: str = ""
    subtitle: str = ""
    kicker: str = ""
    cards: tuple[tuple[str, ...], ...] = ()


def award(sample: float, field: int, institute: str) -> Beat:
    motif = "wave" if institute == CW else "orbit"
    return Beat(sample, "일반 수상 · " + FIELDS[field], motif, "[수상자 이름]",
                "[소속 / 팀명]", FIELDS[field] + "   /   " + institute)


def roster(sample: float, institute: str, motif: str) -> Beat:
    return Beat(sample, "전체 수상 명단", motif, institute, kicker="AWARD WINNERS",
                cards=(("[시상 분야]", "[수상자 이름]"), ("[시상 분야]", "[수상자 이름]"),
                       ("[시상 분야]", "[수상자 이름]")))


BEATS = (
    Beat(3.0, "암전에서 발생하는 청색 입자", "network"),
    Beat(8.8, "데이터 집결과 타이틀 진입", "network", EVENT, SLOGAN),
    Beat(11.0, "행사 타이틀 홀드 · 다음 컷은 일정", "network", EVENT, SLOGAN),
    Beat(18.0, "우수 과제 포스터 전시 일정", "timeline", "FESTIVAL SCHEDULE", cards=(
        ("우수 과제 포스터 전시회", "2026.12.01(화) ~ 12.03(목)", "L3동 중앙홀"),
    )),
    Beat(23.5, "두 연구소 시상 일정", "timeline", "FESTIVAL SCHEDULE", cards=(
        (CW, "2026.12.08(화) 14:00", "L3동 변화마당 회의실"),
        (MS, "2026.12.02(수) 14:00", "L3동 변화마당 회의실"),
    )),
    Beat(29.0, "일정 노드가 이어지는 회로", "timeline", "FESTIVAL SCHEDULE", cards=(
        ("포스터 전시회", "12.01–12.03"),
        ("CW 시상", "12.08  14:00"),
        ("미사일시스템 시상", "12.02  14:00"),
    )),
    Beat(32.5, "시상 분야 타이틀", "branch", "AWARD CATEGORIES"),
    Beat(38.0, "시상 분야 1–3", "branch", "AWARD CATEGORIES",
         cards=tuple((field,) for field in FIELDS[:3])),
    Beat(42.5, "시상 분야 4–5", "branch", "AWARD CATEGORIES",
         cards=tuple((field,) for field in FIELDS[3:5])),
    Beat(47.0, "시상 분야 6–7", "branch", "AWARD CATEGORIES",
         cards=tuple((field,) for field in FIELDS[5:])),
    Beat(52.0, "일곱 분야 전체 홀드", "branch", "혁신을 실현한 주인공들",
         cards=tuple((field,) for field in FIELDS)),
    Beat(57.0, "통신 파형 · CW기술연구소 도입", "wave", CW, "AWARD WINNERS"),
    award(62.0, 0, CW),
    award(67.0, 1, CW),
    award(72.0, 2, CW),
    award(77.0, 3, CW),
    award(82.0, 4, CW),
    Beat(89.7, "첫 대상의 금빛 점화", "halo", "대상", kicker="GRAND PRIZE"),
    Beat(93.0, "CW 대상 수상자 공개", "halo", "[대상 수상자 이름]",
         "[수상 분야 / 소속]", "대상   /   GRAND PRIZE"),
    Beat(97.0, "CW 대상 이름 홀드", "halo", "[대상 수상자 이름]",
         "[수상 분야 / 소속]", "대상   /   GRAND PRIZE"),
    roster(102.0, CW, "wave"),
    Beat(107.5, "좌표 그리드 · 미사일시스템기술연구소 도입",
         "orbit", MS, "AWARD WINNERS"),
    award(112.0, 0, MS),
    award(117.0, 1, MS),
    award(122.0, 3, MS),
    award(127.0, 4, MS),
    award(132.0, 5, MS),
    Beat(139.8, "최종 대상 클라이맥스 진입", "tunnel", "대상",
         kicker="GRAND PRIZE"),
    Beat(144.0, "최종 대상 수상자 공개", "tunnel", "[대상 수상자 이름]",
         "[수상 분야 / 소속]", "대상   /   GRAND PRIZE"),
    Beat(148.0, "최종 대상 이름 홀드", "tunnel", "[대상 수상자 이름]",
         "[수상 분야 / 소속]", "대상   /   GRAND PRIZE"),
    roster(152.0, MS, "orbit"),
    Beat(158.0, "퀴즈 진입 · 청색으로 복귀", "quiz", "SPECIAL QUIZ EVENT"),
    Beat(163.0, "홀로그램 카드와 큐브", "quiz", "QUIZ TIME",
         "퀴즈를 맞히고 선물도 받아가세요!"),
    Beat(167.0, "참여 안내 문구 홀드", "quiz", "QUIZ TIME",
         "퀴즈를 맞히고 선물도 받아가세요!"),
    Beat(172.0, "경품 · 행사 참여 유도", "gift", "잠시 후, 특별 퀴즈가 시작됩니다!",
         "여러분의 도전을 기다립니다."),
    Beat(177.5, "행사 타이틀 복귀 후 암전", "network", EVENT, SLOGAN),
)


@lru_cache
def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    weight = "Bold" if bold else "Regular"
    return ImageFont.truetype(str(FONTS / f"NotoSansCJK-{weight}.ttc"), size, index=1)


@lru_cache
def rgb(hex_color: str, alpha: int) -> tuple[int, int, int, int]:
    return (*ImageColor.getrgb(hex_color), alpha)


def text(
    draw: ImageDraw.ImageDraw, xy: tuple[float, float], wording: str, size: int,
    max_width: float, color: str = WHITE, *, bold: bool = False, anchor: str = "mm",
) -> None:
    if not wording:
        return
    while size > 10 and font(size, bold).getlength(wording) > max_width:
        size -= 1
    draw.text(xy, wording, fill=color, font=font(size, bold), anchor=anchor)


@lru_cache
def base(accent: str, center: float, amplitude: int) -> Image.Image:
    tint = ImageColor.getrgb(accent)
    light = Image.new("L", (W, H))
    light.putdata([
        int(amplitude * math.exp(-(((x - center) / 370) ** 2 + ((y - H / 2) / 120) ** 2)))
        for y in range(H) for x in range(W)
    ])
    return Image.composite(Image.new("RGB", (W, H), tint),
                           Image.new("RGB", (W, H), INK), light).convert("RGBA")


def diamond(draw: ImageDraw.ImageDraw, x: float, y: float, w: float, h: float,
            color: tuple[int, int, int, int], width: int = 1) -> None:
    points = [(x, y - h), (x + w, y), (x, y + h), (x - w, y), (x, y - h)]
    draw.line(points, fill=color, width=width)


def background_art(beat: Beat, variant: str, index: int, color: str) -> Image.Image:
    overlay = Image.new("RGBA", (W, H))
    line = ImageDraw.Draw(overlay)
    rng = random.Random((index + 1) * 101 + VARIANTS.index(variant))
    cx = 650 if variant == "B" else W / 2
    cy = H / 2
    faint, mid, bright = (rgb(color, alpha) for alpha in (44, 99, 184))
    for _ in range(70):
        x, y = rng.randrange(W), rng.randrange(H)
        diameter = rng.choice((1, 1, 2))
        line.ellipse((x, y, x + diameter, y + diameter), fill=rgb(color, rng.randint(28, 124)))

    if variant in ("B", "D"):
        for row in range(8):
            dy = (row - 3) * 17
            for side in (-1, 1):
                start = cx + side * (92 if variant == "B" else 174)
                bend = cx + side * (130 + row * 17)
                edge = 0 if side < 0 else W
                if beat.motif == "wave":
                    inner = 637 if variant == "B" else 170
                    span = range(0, W - inner, 4) if variant == "B" else range(0, inner + 1, 4)
                    points = [
                        (edge - side * x,
                         cy + dy * .66 + (11 + row * 2) *
                         math.sin(x / (21 + row * 2) + row * .54 + index * .2))
                        for x in span
                    ]
                    line.line(points, fill=mid if row in (2, 5) else faint, width=1)
                elif beat.motif == "orbit":
                    line.arc((cx - 370 - row * 18, cy - 130 + row * 4,
                              cx + 370 + row * 18, cy + 130 - row * 4),
                             153 + side * 24, 345 + side * 24, fill=faint, width=1)
                else:
                    line.line(((edge, cy + dy * 1.9), (bend, cy + dy * 1.9),
                               (start, cy + dy * .52)),
                              fill=bright if row in (1, 5) else mid, width=1)
                    line.ellipse((start - 2, cy + dy * .52 - 2,
                                  start + 2, cy + dy * .52 + 2), fill=bright)
    elif variant == "C":
        for x in range(16, W, 48):
            line.line((x, 0, x, H), fill=faint)
        for y in range(20, H, 26):
            line.line((0, y, W, y), fill=faint)
        for side in (-1, 1):
            for row in range(4):
                for column in range(3):
                    x = cx + side * (208 + 58 * column)
                    y = 44 + 43 * row
                    border = mid if (row + column + index) % 3 == 0 else faint
                    line.rectangle((x - 19, y - 14, x + 19, y + 14), outline=border)
                    line.point((x, y), fill=bright)

    if beat.motif in ("halo", "tunnel") or (variant == "A" and beat.motif != "gift"):
        perspective = beat.motif == "tunnel"
        for number in range(1, 7):
            r = 24 * number
            x, y = (cx + number * 5, cy + number * 2) if perspective else (cx, cy)
            spread = r * (1.62 if perspective else 1.0)
            bounds = (x - spread, y - r, x + spread, y + r)
            line.arc(bounds, 4 + number * 8, 170 + number * 8,
                     fill=bright if number in (2, 5) else mid, width=2)
            line.arc(bounds, 194 + number * 8, 338 + number * 8, fill=mid, width=1)
            if beat.motif in ("halo", "tunnel") and variant in ("A", "D"):
                diamond(line, x, y, 2.0 * r, 1.05 * r, faint)
    if variant == "D" and beat.motif == "network" and index < 2:
        for radius in (28, 59, 95, 132):
            bounds = (cx - radius, cy - radius, cx + radius, cy + radius)
            line.arc(bounds, 179, 303, fill=mid, width=2)
            line.arc(bounds, 11, 103, fill=faint, width=1)
    if beat.motif == "branch":
        for left, right, top in ((62, 292, 43), (W - 292, W - 62, 190)):
            step = (right - left) / 6
            line.line((left, top, right, top), fill=mid)
            for n in range(7):
                x = left + step * n
                line.ellipse((x - 3, top - 3, x + 3, top + 3), fill=bright)
    if beat.motif == "timeline":
        line.line((60, 177, W - 60, 177), fill=mid, width=2)
        for x in (104, 440, 776):
            diamond(line, x, 177, 5, 5, bright, 2)
    if beat.motif in ("quiz", "gift"):
        for x in (140, 740):
            for offset in (0, -28, 28):
                diamond(line, x + offset * 2, cy + offset, 42, 29, mid, 2)
            if beat.motif == "quiz":
                text(line, (x, cy), "?", 68, 96, color, bold=True)
            else:
                line.rectangle((x - 39, cy - 21, x + 39, cy + 22), outline=bright, width=2)
                line.line((x, cy - 29, x, cy + 21), fill=bright, width=3)
                line.line((x - 44, cy - 12, x + 44, cy - 12), fill=bright, width=2)
    if variant == "D" and beat.motif in ("network", "timeline", "branch", "quiz", "gift"):
        for side in (-1, 1):
            center = W / 2 + side * 251
            vertical = 74 + ((index * 11) % 78)
            diamond(line, center, vertical, 78, 26, mid)
            diamond(line, center, vertical, 92, 37, faint)
            end = center + side * 77
            line.line((center, vertical - 26, end, vertical - 26),
                      fill=rgb(color, 205), width=2)
    return overlay


def render_cards(canvas: Image.Image, beat: Beat, variant: str, color: str) -> Image.Image:
    data = beat.cards
    per_row = 4 if len(data) >= 5 else len(data)
    row_count = math.ceil(len(data) / per_row)
    layer = Image.new("RGBA", (W, H))
    draw = ImageDraw.Draw(layer)
    heading_x = 88 if variant == "B" else W / 2
    anchor = "lm" if variant == "B" else "mm"
    if variant == "D":
        half_width = min(344, font(37, True).getlength(beat.title) / 2 + 22)
        draw.rounded_rectangle((heading_x - half_width, 39, heading_x + half_width, 84),
                               9, fill=(6, 13, 27, 215))
    if beat.kicker:
        text(draw, (heading_x, 35), beat.kicker, 12, 700, color, bold=True, anchor=anchor)
    text(draw, (heading_x, 61), beat.title, 37, 704, bold=True, anchor=anchor)
    gap = 10 if variant != "C" else 16
    width = (694 - gap * (per_row - 1)) / max(per_row, 2) if per_row > 1 else 436
    height = 38 if row_count == 2 else 88
    for i, card in enumerate(data):
        row, col = divmod(i, per_row)
        items = min(per_row, len(data) - row * per_row)
        span = items * width + (items - 1) * gap
        start = 88 if variant == "B" else (W - span) / 2
        x = start + col * (width + gap)
        y = 100 + row * (height + 9)
        fill = (10, 21, 40, 247) if variant in ("C", "D") else (11, 23, 48, 223)
        draw.rounded_rectangle((x, y, x + width, y + height), 7, fill=fill,
                               outline=rgb(color, 144 if variant != "A" else 90))
        point_x = x + width / 2 if variant != "C" else x + 12
        card_anchor = "lm" if variant == "C" else "mm"
        line_spacing = 25 if len(card) == 3 else 21
        for j, row_text in enumerate(card):
            y_text = y + height / 2 + (j - (len(card) - 1) / 2) * line_spacing
            is_date = j == 1 and len(card) == 3
            is_location = j == 2 and beat.motif == "timeline"
            size = 25 if is_date else 17 + (len(card) == 1 or is_location) * 2
            ink = LOCATION if is_location and variant == "D" else WHITE if j < 2 else MUTED
            text(draw, (point_x, y_text), row_text, size, width - 24,
                 ink, bold=j < 2 or (is_location and variant == "D"), anchor=card_anchor)
    return Image.alpha_composite(canvas, layer)


def render_hero(canvas: Image.Image, beat: Beat, variant: str, color: str) -> Image.Image:
    layer = Image.new("RGBA", (W, H))
    draw = ImageDraw.Draw(layer)
    center = variant != "B"
    x = W / 2 if center else 88
    anchor = "mm" if center else "lm"
    roster_area = (166, 59, 714, 181) if center else (71, 58, 591, 182)
    if variant in ("C", "D"):
        draw.rounded_rectangle(roster_area, radius=9, fill=(6, 13, 27, 221),
                               outline=rgb(color, 67))
    elif variant == "B":
        draw.rounded_rectangle(roster_area, radius=13, fill=(6, 13, 27, 184))
        draw.line((74, 77, 74, 163), fill=rgb(color, 235), width=2)
    else:
        draw.rounded_rectangle(roster_area, radius=18, fill=(6, 13, 27, 119))
    if beat.kicker:
        text(draw, (x, 84), beat.kicker, 14, 470, color, bold=True, anchor=anchor)
    title_size = 56 if beat.motif in ("halo", "tunnel") else 42
    title_y = 115 if beat.subtitle else 126
    text(draw, (x, title_y), beat.title, title_size, 505 if center else 480,
         GOLD if beat.motif in ("halo", "tunnel") and beat.title == "대상" else WHITE,
         bold=True, anchor=anchor)
    if beat.subtitle:
        text(draw, (x, 155), beat.subtitle, 20, 474, MUTED, anchor=anchor)
    if variant == "D":
        draw.line((x - 33, 182, x + 33, 182), fill=rgb(color, 198), width=2)
    return Image.alpha_composite(canvas, layer)


def with_fixture_words(beat: Beat) -> Beat:
    if beat.motif in ("halo", "tunnel") or beat.title == "[수상자 이름]":
        cw = beat.motif in ("halo", "wave")
        institute = CW if cw else MS
        motif = "wave" if cw else "orbit"
        return Beat(beat.sample, beat.label, motif, "[수상자 이름]",
                    "[소속 / 팀명]", "[시상 분야]   /   " + institute)
    if beat.label == "전체 수상 명단":
        return Beat(beat.sample, beat.label, beat.motif, beat.title, kicker=beat.kicker,
                    cards=(("수상자 명단 입력 대기",),))
    return beat


def render(beat: Beat, variant: str, index: int) -> Image.Image:
    if variant == "D":
        beat = with_fixture_words(beat)
    color = (GOLD if beat.motif in ("halo", "tunnel")
             else CYAN if beat.motif in ("quiz", "gift") and variant in ("B", "D")
             else BLUE)
    cx = 640 if variant == "B" else W / 2
    amplitude = (28 if variant == "A" else 18) if beat.title else 13
    canvas = base(color, cx, amplitude)
    art = background_art(beat, variant, index, color)
    canvas = Image.alpha_composite(canvas, art.filter(ImageFilter.GaussianBlur(4)))
    canvas = Image.alpha_composite(canvas, art)
    if beat.cards:
        canvas = render_cards(canvas, beat, variant, color)
    elif beat.title:
        canvas = render_hero(canvas, beat, variant, color)
    return canvas.convert("RGB")


def clock(seconds: float, *, sample: bool = False) -> str:
    whole = int(seconds)
    suffix = f".{round((seconds - whole) * 10):01d}" if sample else ""
    return f"{whole // 60:02d}:{whole % 60:02d}{suffix}"


def build(out: Path) -> None:
    alternatives = out / "frames"
    alternatives.mkdir(parents=True, exist_ok=True)
    margin, gap, header, row_gap = 32, 20, 110, 56
    column_w = W + gap
    sheet_w = margin * 2 + 4 * W + gap * 3
    per_sheet = 6
    for first in range(0, len(BEATS), per_sheet):
        entries = BEATS[first:first + per_sheet]
        sheet = Image.new("RGB", (sheet_w, header + (H + row_gap) * len(entries) + margin),
                          "#0d1525")
        draw = ImageDraw.Draw(sheet)
        number = first // per_sheet + 1
        heading = f"2026 기술·혁신 FESTIVAL  /  아트 시안  {number:02d} / 06"
        text(draw, (margin, 29), heading, 25, sheet_w - margin * 2, bold=True, anchor="lm")
        for column, name in enumerate(VARIANT_NAMES):
            x = margin + column * column_w
            text(draw, (x, 78), name, 21, W, WHITE if column == 3 else MUTED,
                 bold=column == 3, anchor="lm")
        for row, beat in enumerate(entries):
            index = first + row
            start = index * 5
            assert start <= beat.sample < start + 5
            top = header + row * (H + row_gap)
            timing = f"{clock(start)}–{clock(start + 5)}  /  시안 시점 {clock(beat.sample, sample=True)}"
            note = "   ·   A–C 대상 확정 시 적용 / D 대상 미확정 상태" if beat.motif in ("halo", "tunnel") else ""
            text(draw, (margin, top + 13), f"{index + 1:02d}   {timing}   ·   {beat.label}{note}",
                 21, sheet_w - margin * 2, WHITE, bold=True, anchor="lm")
            for column, variant in enumerate(VARIANTS):
                frame = render(beat, variant, index)
                x = margin + column * column_w
                y = top + 36
                sheet.paste(frame, (x, y))
                frame.save(alternatives / f"{index + 1:02d}-{variant}.png", optimize=True)
                draw.rectangle((x - 1, y - 1, x + W, y + H),
                               outline="#598bbe" if variant == "D" else "#293a54")
        sheet.save(out / f"contact-{number:02d}.jpg", quality=91, subsampling=0)
    print(f"Generated {len(BEATS) * len(VARIANTS)} design stills and "
          f"{math.ceil(len(BEATS) / per_sheet)} contact sheets in {out}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, default=ROOT / "out/design")
    build(parser.parse_args().out)
