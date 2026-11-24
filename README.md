# 2026 기술·혁신 FESTIVAL

Remotion과 TypeScript로 제작한 시상식 영상입니다. 최신 본편은 Studio의 `FestivalCinematic`에서 확인할 수 있습니다. 작업 해상도는 3960×1080, 배포본은 1980×540이며, 두 영상 모두 11:3, 30 fps입니다.

## 최신 전시 포스터 퀴즈·수상자 배치 수정판

- [4분 54초 본편 MP4](deliverables/poster-quiz-cut/festival-poster-quiz-cut.mp4)
- [주요 장면 모음](deliverables/poster-quiz-cut/scene-review.jpg) · [검수 결과](docs/reviews/poster-quiz-cut-qa.md)

최우수·우수 등은 각 등급 제목 아래에 수상자를 가로로 배치합니다. 04:42에 시작하는 퀴즈는 전시 포스터를 중심으로 안내하며, 선물상자에서 퍼진 금빛 색종이가 바닥에 내려앉습니다.

```bash
REMOTION_BROWSER_EXECUTABLE=/usr/bin/chromium npm run render:cinematic -- poster-quiz-cut
node --disable-warning=ExperimentalWarning scripts/verify-cinematic.mjs out/poster-quiz-cut/festival-poster-quiz-cut.mp4
```

## 이전 일정·가독성 수정판

- [4분 54초 본편 MP4](deliverables/readability-cut/festival-readability-cut.mp4)
- [주요 장면 모음](deliverables/readability-cut/scene-review.jpg) · [검수 결과](docs/reviews/readability-cut-qa.md)

CW·MS의 분야 소개와 시상 화면은 각각 6초입니다. 일반 시상은 등급별로 열을 나누어 중앙에 배치합니다. CW 시상식 일정은 2026.12.10(목) 14:00, L3동 변화마당 회의실입니다. 퀴즈는 04:42에 시작합니다.

```bash
REMOTION_BROWSER_EXECUTABLE=/usr/bin/chromium npm run render:cinematic -- readability-cut
node --disable-warning=ExperimentalWarning scripts/verify-cinematic.mjs out/readability-cut/festival-readability-cut.mp4
```

## 이전 명단·퀴즈 수정판

- [3분 40초 본편 MP4](deliverables/roster-quiz/festival-roster-quiz.mp4)
- [주요 장면 모음](deliverables/roster-quiz/scene-review.jpg) · [검수 결과](docs/reviews/updated-roster-qa.md)

`default.xlsx`의 CW 49건, MS 38건을 본부별 데이터에 반영했습니다. 분야 소개와 수상 화면은 각각 4초이며, 대상 발표는 엑셀에 대상이 있는 분야에 배정합니다. 03:26부터 시상식 현장 퀴즈와 경품을 안내합니다.

```bash
REMOTION_BROWSER_EXECUTABLE=/usr/bin/chromium npm run render:cinematic -- roster-quiz
node --disable-warning=ExperimentalWarning scripts/verify-cinematic.mjs out/roster-quiz/festival-roster-quiz.mp4
```

## 이전 7S·시상 순서 수정판

- [3분 44초 이전본 MP4](deliverables/awards-order/festival-awards-order.mp4)
- [7S·시상 순서 장면 모음](deliverables/awards-order/scene-review.jpg) · [검수 결과](docs/reviews/awards-order-qa.md)

7S는 개인 수상자 6명, 팀 시상 3건, 대상 김태호를 총 세 화면에 표시한다. 일반 시상은 최우수 → 우수 → 장려 순서로 정렬하고, 두 열에서는 왼쪽 위에서 아래로 공개한 뒤 오른쪽 열을 공개한다. 대상 공개에는 새로 합성한 부드러운 차임을 사용한다.

```bash
REMOTION_BROWSER_EXECUTABLE=/usr/bin/chromium npm run render:cinematic -- awards-order
node --disable-warning=ExperimentalWarning scripts/verify-cinematic.mjs out/awards-order/festival-awards-order.mp4
```

## 이전 시상식 연출·균등 노출 수정판

- [3분 44초 수정본 MP4](deliverables/ceremony-cut/festival-ceremony-cut.mp4) · 1980×540, 11:3, 30 fps
- [주요 장면 모음](deliverables/ceremony-cut/scene-review.jpg)
- [편집·시간표](docs/design/ceremony-cut.md) · [검수 결과](docs/reviews/ceremony-cut-qa.md)

```bash
REMOTION_BROWSER_EXECUTABLE=/usr/bin/chromium npm run render:cinematic -- ceremony
node --disable-warning=ExperimentalWarning scripts/verify-cinematic.mjs out/ceremony-cut/festival-ceremony-cut.mp4
```

## 이전 참고 영상 반영판

- [180초 참고 영상 반영판 MP4](deliverables/reference-cut/festival-reference-cut.mp4) · 1980×540, 11:3, 30 fps
- [주요 장면 모음](deliverables/reference-cut/scene-review.jpg)
- [편집 방향](docs/design/reference-cut.md) · [검수 결과](docs/reviews/reference-cut-qa.md)

```bash
REMOTION_BROWSER_EXECUTABLE=/usr/bin/chromium npm run render:cinematic -- reference
node --disable-warning=ExperimentalWarning scripts/verify-cinematic.mjs out/reference-cut/festival-reference-cut.mp4
```

## 시네마틱 재제작

Studio의 `FestivalCinematic`이 재제작한 180초 본편입니다. [장면 구성과 엑셀 반영 기준](docs/storyboard/cinematic-master.md), [세 가지 디자인 시안](docs/design/cinematic-redesign.md), [독립 검수](docs/reviews/cinematic-redesign-qa.md)를 참조하세요. 수상자 편집은 `src/data/award-roster.ts`에서 합니다.

- [180초 재제작 마스터 MP4](deliverables/cinematic/festival-cinematic.mp4) · 1980×540, 11:3, 30 fps
- [수정 전후 비교 이미지](deliverables/cinematic/before-after.jpg)
- [오프닝 5초 프루프](deliverables/cinematic/proof-opening.mp4)
- [대상 발표 5초 프루프](deliverables/cinematic/proof-award.mp4)
- [3개 디자인 방향 비교](deliverables/cinematic/design/concept-contact.jpg)

```bash
REMOTION_BROWSER_EXECUTABLE=/usr/bin/chromium npm run render:cinematic -- proofs
REMOTION_BROWSER_EXECUTABLE=/usr/bin/chromium npm run render:cinematic -- plates  # 3D 무대 소스를 바꾼 경우
REMOTION_BROWSER_EXECUTABLE=/usr/bin/chromium npm run render:cinematic -- master
node --disable-warning=ExperimentalWarning scripts/verify-cinematic.mjs out/redesign/festival-cinematic.mp4
```

## 기존 제작 산출물

- [180초 마스터 MP4](deliverables/festival-master.mp4) · 1980×540, 11:3, 30 fps, H.264/AAC
- [36구간 디자인 시안 ZIP](deliverables/festival-design-review.zip) · 원안 108장, 종합안 36장 및 콘택트 시트
- [완성 영상 검수 프레임](deliverables/master-contact.jpg)
- [독립 검수 결과](docs/reviews/production-qa.md)

## 실행과 검수

Node.js 24.22.3, npm 11.19.1, FFmpeg/ffprobe, 한글 글꼴 Noto Sans CJK KR을 사용합니다.

```bash
npm ci
bash scripts/install-remotion-skills.sh
npm run dev -- --host=0.0.0.0 --no-open
```

```bash
npm run lint
npm run build
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/test-production-data.mjs
REMOTION_BROWSER_EXECUTABLE=/usr/bin/chromium npm run render:festival
node scripts/verify-festival.mjs
```

검토용 마스터는 기본 **1980×540, H.264 BT.709, AAC 스테레오**이며 `out/festival-master.mp4`에 저장됩니다. Remotion 기본 브라우저를 사용할 수 있는 환경에서는 `REMOTION_BROWSER_EXECUTABLE` 옵션을 생략합니다. 현장 픽셀 규격을 받으면 짝수 너비와 높이를 지정해 11:3으로 다시 렌더링합니다.

```bash
FESTIVAL_WIDTH=3960 FESTIVAL_HEIGHT=1080 REMOTION_BROWSER_EXECUTABLE=/usr/bin/chromium npm run render:festival
FESTIVAL_WIDTH=3960 FESTIVAL_HEIGHT=1080 node scripts/verify-festival.mjs
```

## 수상 및 일정 데이터

[production.ts](src/data/production.ts)의 `awardData.CW` 또는 `awardData.MS`에서 해당 연구소의 `categories`, `winners`, `grandPrize`를 수정합니다. 각 수상자에는 `category`, `name`, `affiliation`을 입력합니다. 분야 이름은 해당 연구소 목록과 정확히 일치해야 하며 목록에서는 중복 없이 입력합니다. 분야 순서는 시상 분야 소개와 개인 발표에 반영됩니다. 대상이 없거나 미확정이면 `grandPrize: null`을 유지합니다. 해당 구간은 일반 발표 시간에 배정됩니다. 승인된 수상자가 없으면 분야별 수상 정보와 최종 명단을 입력 대기로 표기합니다.

`festivalCopy.schedule`에서 일정과 장소를 관리합니다. 음향은 [원본 합성 스크립트](scripts/make-festival-audio.py)로 생성한 신시사이저 큐를 사용하며, 별도 음원 샘플은 포함하지 않습니다.

## 제작 자료

- [연출 레퍼런스와 적용 근거](docs/research/festival-references.md)
- [180초 스토리보드](docs/storyboard/production-storyboard.md)
- [36구간 아트 시안과 평가](docs/design/production-design.md)
- [마스터 검수 결과](docs/reviews/production-qa.md)
- [Codex 제작·검증 규칙](AGENTS.md)
- [개발 환경 설치 기록](SETUP_REPORT.md)
