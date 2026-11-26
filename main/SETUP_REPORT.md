# 2026 기술/혁신 FESTIVAL 설치 및 검증 보고서

2026-11-22 KST · GitHub `jkhjkyu-byte/festival-2026-remotion`

기존 TypeScript 템플릿과 공식 Remotion 스킬을 저장소 루트에 통합했다. 리서치·기획·아트·모션·기술·QA를 별도 하위 에이전트에 배정했다. 모션 초안의 행사명 공백 오류를 QA가 독립 렌더에서 발견했고, 수정본을 같은 기준으로 재평가했다. [독립 QA 기록](docs/reviews/README.md)

## 런타임과 패키지

| 구성 | 설치·확인 결과 |
| --- | --- |
| 클라우드 OS | Debian 13, Linux x86_64. GPU 장치 `/dev/dri` 없이 SwiftShader 소프트웨어 렌더 확인 |
| Node.js / npm | 24.22.3 / 11.19.1. `.nvmrc`, `engines`, `packageManager`에 고정 |
| Remotion | `remotion`, `@remotion/cli`, `@remotion/three`, `@remotion/eslint-config-flat` 4.0.545 |
| React | React / React DOM 19.3.1, React 타입 19.3.0 |
| 3D | Three.js와 타입 0.187.0, R3F 9.8.2. React 19.3.1은 R3F의 범위 `>=19 <19.4`에 해당하며, `@remotion/three`는 Remotion 4.0.545와 일치 |
| TypeScript와 검사 도구 | TypeScript 5.9.3, ESLint 10.12.0, Prettier 3.8.1, `@types/web` 0.0.166 |
| 렌더러 | 시스템 Chromium 156.0.8078.79. 기본 Chrome Headless Shell은 `remotion.media` 다운로드가 프록시 HTTP 403으로 차단되어 프로젝트 스크립트에서 Chromium을 명시할 수 있게 구성 |
| 인코딩과 한글 | FFmpeg / ffprobe 7.1.5-0+deb13u1, libx264와 AAC 확인. Noto Sans CJK KR을 확인하고 테스트 영상에서 한글 글리프 확인 |
| 스킬 실행 도구 | Python 3.12.14와 uv 0.13.9. 로컬 디자인 검색과 BMAD 구성 해석에는 확인한 표준 라이브러리 스크립트만 사용 |

직접 의존성은 정확한 버전으로 선언하고 전이 의존성은 `package-lock.json`에 고정했다. 깨끗한 검증 디렉터리에서 `npm ci`로 358개 패키지를 재설치했고, `npm ls --depth=0`로 실제 설치 버전을 확인했다. `npm audit --omit=dev`에서 현재 npm 데이터베이스가 보고한 알려진 이슈는 0건이었다.

Three.js와 React Three Fiber는 3D 진단을 통과했다. 음원·자막·영상 편집은 먼저 Remotion의 기능과 기존 FFmpeg를 사용하고, 본편 입출력 요구가 확정될 때 필요한 패키지를 추가한다. GSAP 3.15.1은 검토 후 보류했다. 기본 프레임 루프로 구동되는 GSAP 타임라인은 프레임 탐색 및 병렬 렌더와 시점이 어긋날 수 있다. 채택할 경우 정지한 타임라인을 `frame / fps`로 매번 탐색하고 임의 순서 프레임 및 병렬 렌더를 먼저 비교한다. [GSAP 라이선스](https://gsap.com/standard-license)

공식 Remotion 패키지의 사용 조건을 확인했다. 회사 규모와 사용 목적을 바탕으로 본편 제작·납품 전에 적용되는 Remotion 라이선스를 확인한다. [Remotion 라이선스](https://www.remotion.dev/docs/license/pricing)

## 스킬 검증 및 설치 상태

| 이름 | 존재·공식 출처·라이선스 | 확인 및 현재 적용 |
| --- | --- | --- |
| Remotion Skills | Remotion 공식 GitHub. 조사한 스킬 저장소 리비전에 독립 라이선스 파일이 없으며, 공식 README에 프로젝트 설치 경로가 안내되어 있다. [고정 소스](https://github.com/remotion-dev/skills/tree/6f55706d1069e512430582ad86e4e57dc07afe1b) | **설치 13개**. 설치 트리를 고정 리비전 `6f55706`과 비교했다. 프로젝트 `.agents/skills`에 사용하며 Git에는 출처 고정 복원 스크립트와 무결성 목록을 커밋한다. 깨끗한 경로에서 13개 복원을 확인했다. |
| Deep Research | OpenAI 호스팅 제품과 Responses API의 리서치 모델. 공식 Cookbook 예제는 MIT이며 호스팅 서비스 조건은 별도다. [공식 예제](https://github.com/openai/openai-cookbook/blob/dfd760b4de0bd175b51ad05b9b5260c36dfea09c/examples/deep_research_api/introduction_to_deep_research_api.ipynb) | **워크플로**. 확인한 OpenAI 공개 스킬 트리에 동일 명칭의 독립 설치물이 없어 공식 원문 확인과 출처 추적 절차를 구현했다. |
| BMAD Method | BMAD 제작 조직의 공식 MIT 배포. 설치 검증은 npm 안정판 6.12.4와 대응 릴리스 커밋을 사용했다. [고정 소스](https://github.com/bmad-code-org/BMAD-METHOD/tree/bab9082c3e884e0d72c759bcd1a6d90bcc01be84) | **선택 설치**. `bmad-advanced-elicitation`, MIT 라이선스와 표준 라이브러리 기반 보조 파일을 프로젝트에 포함했다. 구성 읽기와 방법 분류 조회를 오프라인에서 실행했다. |
| Creative Intelligence Suite | BMAD의 공식 MIT 모듈. 검증한 v0.3.2는 BMAD 6 설치 경로를 제공한다. [고정 소스](https://github.com/bmad-code-org/bmad-module-creative-intelligence-suite/tree/97298b22fee1c7e482710d3a8414adb5cfccccd9) | **선택 설치**. `bmad-cis-storytelling`과 한국어 프로젝트 구성을 포함했다. 각 활성화 후크는 기본값인 빈 상태이며, 구성 읽기를 오프라인에서 확인했다. 전체 모듈 로스터와 Party Mode는 이 설치 범위 밖이다. |
| Elephant & Goldfish Model | Google 조직의 Apache-2.0 연구 플러그인. 매니페스트 0.1.1은 전체 번들, 로컬 실행기, 새 세션이 필요한 설치를 명시하며 클라우드 검증이 부분적이다. [고정 Codex 설치 문서](https://github.com/google/elephant-goldfish-model/blob/7d1b721e51448518cc9b0336465041230200dd10/docs/codex.md) | **워크플로**. 현재 프로젝트 단위에서 검증된 활성화 경로를 확보하지 못했다. 독립 컨텍스트에서 근거만 받아 리뷰하는 절차를 반영했다. |
| Superpowers | Jesse Vincent의 MIT 프로젝트. 공식 Codex 마켓플레이스 제공 사실과 원문을 확인했다. [고정 소스](https://github.com/obra/superpowers/tree/22f0b463e7a5e579904dd6211a520321035526f7) | **선택 설치 2개**. `verification-before-completion`, `receiving-code-review` 문서와 라이선스를 포함했다. 플러그인의 실행 후크는 사용하지 않는다. |
| UI UX Pro Max | Next Level Builder의 MIT 프로젝트. 공식 지원 도구와 Python 검색 소스, 데이터 출처를 검토했다. [고정 소스](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/f76d1653d7467fc11fb9d9d79295a421c92ab958) | **설치**. Codex 프로젝트 경로에 검색 스킬, 검토한 표준 라이브러리 Python 파일 5개, 데이터·라이선스를 포함했다. npm 전역 설치 도구 없이 타이포그래피와 디자인 시스템 조회를 확인했다. 적용할 글꼴·아이콘의 자산 권리는 개별 확인한다. |
| Holmaark | 정확한 이름으로 GitHub 공개 저장소·사용자와 npm에서 공식 배포를 확인할 수 없었다. 라이선스와 신뢰 근거도 확인하지 못했다. [GitHub 검색](https://github.com/search?q=Holmaark&type=repositories) | **미설치**. 공식 출처, 커밋, 라이선스, 실행 권한을 확인하는 절차를 문서에 반영했다. |

BMAD/CIS는 임시 디렉터리에서 설치했다. BMAD 설치 도구의 SHA-512와 하위 잠금 트리를 확인했고, 알려진 권고가 있던 설치 도구의 전이 의존성은 임시 환경에서 수정 버전으로 해석한 다음 `npm audit` 0건을 확인했다. 라이프사이클 스크립트를 끈 `npm ci`로 준비하고, 검증한 CIS 커밋의 로컬 Git 소스와 오프라인 npm으로 설치했다. 프로젝트에는 검토한 두 스킬, 필요한 파일과 라이선스만 포함했다. CIS의 템플릿 설명과 데이터 열 이름은 차이가 있다. 실제 CSV의 `category,story_type,name,description,key_questions`를 사용한다. [제작 워크플로](docs/WORKFLOW.md) · [추가 출처](docs/research/production-research.md)

## 실행 및 재현 근거

| 검사 | 결과 |
| --- | --- |
| Studio | `npm run dev -- --host=0.0.0.0 --port=3000 --no-open`으로 실행. `/FestivalSmoke`와 `/bundle.js`의 HTTP 응답 및 번들의 두 컴포지션 확인 |
| 린트와 타입 | `npm run lint` 성공. ESLint와 `tsc --noEmit` |
| 빌드 | `npm run build` 성공. 출력은 `build/` |
| 2D MP4 | `REMOTION_BROWSER_EXECUTABLE=/usr/bin/chromium npm run render:smoke` 성공. `out/festival-smoke.mp4`는 640×360, H.264, 30fps, 90프레임, 3.000초, yuv420p, BT.709, 제한 범위, 무음. 전체 디코딩과 독립 QA 재검토 통과 |
| 3D | `npx --no-install remotion still FestivalWebGL out/festival-webgl.png --frame=14 --browser-executable=/usr/bin/chromium --gl=swangle` 성공. 640×360 PNG의 도형과 조명을 확인했다. WebGL2 컨텍스트와 SwiftShader 픽셀 읽기도 기술 담당이 별도 확인 |
| 현장 | 최종 상영 승인 보류. 화면·송출 규격, 무대 큐, 음향과 객석 가독성을 현장에서 확인해야 한다. |

본편 리서치와 디자인은 [리서치 계획](docs/research/production-research.md), [12초 오프닝 스토리보드](docs/storyboard/README.md), [스타일 프레임 계획](docs/design/README.md)에서 착수할 수 있다.
