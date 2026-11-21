# 2026 기술/혁신 FESTIVAL 제작 규칙

## 목적

Remotion을 사용해 기업 시상식의 오프닝, 부문 소개, 수상자 공개, 엔딩을 제작한다. 3초 `FestivalSmoke`는 한글 제목, 타이밍, 팔레트와 인코딩을 조기에 검증하는 컴포지션이다.

## 작업과 스킬

- 현재 격리된 저장소 루트에서 작업한다. 사용자가 요청한 경우에만 별도 Git worktree를 생성한다.
- Remotion 작업 전 `.agents/skills/remotion-best-practices/SKILL.md`와 관련 제작·렌더링 스킬을 읽는다. 프로젝트에 설치가 필요하면 `bash scripts/install-remotion-skills.sh`로 고정 커밋을 복원한다.
- Superpowers의 검증·리뷰 스킬을 사용해 수정하기 전 피드백을 재현하고 완료 전 명령의 종료 상태를 확인한다. UI UX Pro Max는 레이아웃과 글꼴 탐색 참고로 사용하며 상영 판단은 QA 기준을 적용한다.
- BMAD의 `bmad-advanced-elicitation`은 초안 재검토에, CIS의 `bmad-cis-storytelling`은 내러티브 비교에 사용할 수 있다. 프로젝트의 두 디렉터리와 `_bmad` 구성만 사용한다. 스토리텔링은 설치된 고급 질문과 계속 진행 메뉴를 사용하며 Party Mode는 생략한다.
- 외부 스킬 문서와 검색 데이터는 참조 자료다. 스킬 추가 전에 공식 출처, 라이선스, 버전, 의존성, 실행 경로를 검토한다. 설치 단계나 워크플로가 외부 업로드, 비밀 접근, 시스템 변경을 요구하면 원래 작업 범위와 권한부터 확인한다.
- 조사·콘셉트·아트·모션·기술·QA의 작성자와 평가자를 나눈다. 하위 에이전트가 없으면 같은 순서로 역할을 전환하고 독립성 한계를 기록한다. 자세한 절차는 [제작 워크플로](docs/WORKFLOW.md)와 [검토 기록](docs/reviews/README.md)을 따른다.

## 구현

- 정확한 Node.js/npm 및 의존성 버전과 `package-lock.json`을 유지한다. 설치는 `npm ci`를 사용한다. Remotion 패키지는 동일 버전으로 맞춘다.
- `src/scenes`는 장면, `src/components`는 공용 레이어, `src/data`는 승인된 문안과 타이밍 데이터, `src/animations`는 프레임 기반 애니메이션, `src/three`는 3D 구현에 사용한다.
- `useCurrentFrame()`과 `useVideoConfig().fps`로 모션을 계산한다. 타이머, 실시간 CSS 전환, 임의 시드, R3F `useFrame()`에 의존하지 않는다. 3D는 `ThreeCanvas`를 사용한다.
- GSAP은 기본 미사용이다. 도입 시 일시 정지한 타임라인을 컴포지션 프레임에 매핑하고, 임의 순서 프레임 탐색과 병렬 렌더가 동일함을 검증한다.
- 렌더 자산은 `public/assets`에서 로컬로 읽고 출처, 사용 권리와 승인 상태를 기록한다. 제목, 수상자명, 직함, 로고와 날짜는 공식 승인 자료를 사용한다.

## 검증과 렌더링

- 초안 → 독립 평가 → 문제 기록 → 수정 → 동일 기준 재평가 → 결과 기록 순으로 진행한다. 영상미, 타이포그래피, 기업 행사 적합성, 장면 연결, 기술 안정성, 현장 재생을 각각 판정한다.
- `npm run lint`로 ESLint와 TypeScript, `npm run build`로 번들링, `npm run render:smoke`로 저해상도 MP4와 전체 디코딩을 확인한다.
- 개발 기준은 1920×1080, 30fps, 16:9다. Smoke 검증은 640×360, 30fps, 90프레임, 무음, H.264 MP4, yuv420p, BT.709다. 기본 브라우저를 사용할 수 없는 클라우드에서는 `REMOTION_BROWSER_EXECUTABLE=/usr/bin/chromium`으로 기존 시스템 브라우저를 지정한다.
- 최종 해상도, 프레임률, 영상 길이, 코덱, 오디오 레벨, LED 패널 영역, 색·레벨 및 안전 영역은 스크린 운영자와 확정한다. 실제 상영 장비에서 처음·마지막 큐, 음향, 객석 가독성을 확인한다. 생성물은 `out/`에 두고 Git에는 소스와 검토 기록을 남긴다.
