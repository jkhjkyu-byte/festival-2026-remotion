# 2026 기술·혁신 FESTIVAL

Remotion과 TypeScript로 제작한 180초 시상식 마스터입니다. 구성은 오프닝, 일정, 시상 분야, CW 시상, 미사일시스템 시상, 퀴즈, 엔딩입니다. Studio의 `FestivalMaster`는 **3960×1080, 11:3, 30 fps** 작업 해상도로 설정되어 있습니다.

## 제작 산출물

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
