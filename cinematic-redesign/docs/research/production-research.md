# 2026 기술/혁신 FESTIVAL 영상 리서치

2026년 11월 22일 기준. 제작을 시작할 때 확인할 상영 조건, 참고 자료, 리서치 절차를 기록한다.

## 참고 자료와 적용 가설

| 기준 | 제작에 적용할 내용 | 근거 |
| --- | --- | --- |
| 프레임 기반 모션 | 카메라, 타이틀, 광량은 같은 프레임 번호와 FPS를 입력으로 사용한다. 중요한 비주얼 변화는 해당 프레임으로 직접 이동해도 동일해야 한다. | [Remotion 공식 애니메이션 가이드](https://github.com/remotion-dev/remotion/blob/970849fc1921ed7e0c3175132fe9580e8875ab2f/packages/docs/docs/animating-properties.mdx) |
| 밝기 대비 | 필수 이름·부문·소속은 글자 뒤 움직이는 배경의 가장 밝은 프레임과 가장 어두운 프레임을 각각 점검한다. 본문과 이름은 초기 디지털 시안에서 최소 4.5:1을 목표로 삼고 최종 판정은 상영 위치에서 한다. 이 값은 WCAG 웹 기준을 내부 시안 점검에 응용한 값이다. | [W3C WCAG 대비 기준 설명](https://github.com/w3c/wcag/blob/2766fae25fc8286f60181d655115cba054b797e1/understanding/20/contrast-minimum.html) |
| 섬광 | 화면 전체의 밝고 어두운 점멸을 피한다. 하이라이트는 광량의 점진적 변화, 이동하는 반사광, 부드러운 디졸브로 구현한다. 반복 플래시가 생기는 경우 해당 구간을 별도로 검토한다. | [W3C WCAG 섬광 기준 설명](https://github.com/w3c/wcag/blob/2766fae25fc8286f60181d655115cba054b797e1/understanding/20/three-flashes-or-below-threshold.html) |
| 방송 화면 여백 | 장비 사양을 받기 전에는 필수 텍스트를 화면 각 변에서 10% 안쪽에 배치해 시안을 비교한다. 10%는 내부 초기값이다. 실제 LED 매핑, 플레이어 스케일링 및 현장 마스킹을 받고 조정한다. | [EBU R95 안전 영역 권고안](https://tech.ebu.ch/publications/r095) |
| 시상식 구조 | 부문 인지 → 후보 또는 공적 요약 → 발표 → 수상자명 정지 구간의 정보 순서를 관찰한다. 영상 레퍼런스를 모을 때는 충분한 홀드, 발표 전 리듬, 로고와 타이포그래피 위계를 타임코드 단위로 기록한다. | [미국영화예술과학아카데미 2025 시상식 자료](https://www.oscars.org/oscars/ceremonies/2025) |

Remotion과 W3C 문서 원문을 확인했다. EBU·Academy 사이트는 현재 클라우드 프록시에서 열리지 않아 다음 리서치 때 원문과 행사 영상 확인이 필요하다. 화면 여백과 시상 장면 순서는 검증할 제작 가설로 다룬다. 참고 영상에서 자산을 가져오는 경우 사용 권리와 출처를 별도로 확인한다.

## 첫 리서치 스프린트

1. **행사 조건 확인**. 영상의 역할, 수상 순서, 런타임, 이름·소속·직함의 공식 표기, 스크린·송출 규격, 로고·폰트 사용 권리를 수집한다. 화면 비율이나 프레임레이트를 먼저 고정해야 할 때는 후보를 기록하고 현장 사양을 받으면 재결정한다.
2. **레퍼런스 3종 비교**. 시상 오프닝, 수상자 공개, 한글 가독성이 좋은 기업 영상에서 각각 한 사례를 고른다. 행사 공식 링크, 관찰 타임코드, 정보 순서, 사운드 큐, 채택할 원리, 제작상의 제약을 기록한다.
3. **스타일 프레임을 두 안으로 비교**. 큰 한글 이름, 가장 긴 후보 이름, 배경 하이라이트가 지나가는 프레임을 각 안에 넣는다. 같은 문구와 화면 크기로 비교하며 색상, 글자 크기, 위치, 피사체와의 대비를 기록한다.
4. **10–20초 애니매틱**. 예비 장면의 도입에서 수상자명 공개까지 이어 붙인다. 마지막 정보를 읽는 시간이 충분한지 보기 위해 무음으로 1회, 임시 박자 또는 큐를 넣어 1회 재생한다.
5. **상영 리허설**. 행사 시스템 담당자에게 재생기·LED 기본 해상도, 화면 비율, FPS, 코덱·오디오 형식, 안전 영역, 최대 비트레이트, 색공간과 밝기, 관객 좌석 거리를 확인한다. 리허설에서 중앙과 뒷자리의 가독성을 평가하고 현장 사양으로 인코딩한 테스트 파일을 재생한다.

## 스킬 및 방법론 증거

| 대상 | 실재와 공식 출처 | 라이선스와 신뢰 근거 | 현재 적용 경로 |
| --- | --- | --- | --- |
| Deep Research | OpenAI의 호스팅 기능과 Responses API 모델을 공식 Cookbook 예제로 확인했다. 확인한 OpenAI Skills 커밋 트리에서 독립적인 Deep Research 스킬을 찾지 못했다. | Cookbook 예제는 MIT이며 서비스는 별도 약관과 접근 권한을 따른다. | 외부 코드 없이 아래 리서치 절차를 적용한다. 공식 제품 또는 API로 조사할 때도 발행 주체와 원문을 검증한다. [Cookbook 예제](https://github.com/openai/openai-cookbook/blob/dfd760b4de0bd175b51ad05b9b5260c36dfea09c/examples/deep_research_api/introduction_to_deep_research_api.ipynb) · [Cookbook 라이선스](https://github.com/openai/openai-cookbook/blob/dfd760b4de0bd175b51ad05b9b5260c36dfea09c/LICENSE) · [OpenAI Skills 트리](https://github.com/openai/skills/tree/49f948faa9258a0c61caceaf225e179651397431) |
| Creative Intelligence Suite | BMAD 제작 조직의 스킬 묶음이다. 공식 README는 bmad와 bmod-core-tools 허브를 먼저 프로젝트에 추가하도록 안내한다. | MIT. 저장소에 원본 SKILL.md와 라이선스가 있으며, npm 패키지 bmad-creative-intelligence-suite의 메타데이터도 같은 저장소를 가리킨다. npm 조회 버전은 0.1.9였으며 GitHub에는 더 최신 릴리스 태그가 있다. | 프로젝트 로컬 설치가 가능하다. 확인한 소스와 고정 리비전을 사용하고, 허브와 묶음이 요청하는 작업을 검토한다. [고정 README](https://github.com/bmad-code-org/bmad-module-creative-intelligence-suite/blob/3e89a5df66b4d155aa520072fa3288d3067f8dd7/README.md) · [라이선스](https://github.com/bmad-code-org/bmad-module-creative-intelligence-suite/blob/3e89a5df66b4d155aa520072fa3288d3067f8dd7/LICENSE) |
| Elephant & Goldfish Model | google/elephant-goldfish-model 소스에 Codex CLI 또는 데스크톱으로 설치하는 EGM 플러그인이 있다. 확인한 Codex 매니페스트 버전은 0.1.1이다. | Apache-2.0. 소스가 Google 조직에 있으며, README에 Google 공식 제품 지원 범위 밖임을 명시한다. | 프로젝트에는 아래 독립 검토 절차를 적용한다. 공식 설치에는 페르소나·자료를 포함한 전체 번들, 로컬 실행기와 새 세션이 필요하다. CLI는 사용자 구성의 마켓플레이스를 사용하고 문서에 클라우드 지원의 한계가 명시되어 있다. [Codex 설치 문서](https://github.com/google/elephant-goldfish-model/blob/7d1b721e51448518cc9b0336465041230200dd10/docs/codex.md) · [매니페스트](https://github.com/google/elephant-goldfish-model/blob/7d1b721e51448518cc9b0336465041230200dd10/.codex-plugin/plugin.json) · [라이선스](https://github.com/google/elephant-goldfish-model/blob/7d1b721e51448518cc9b0336465041230200dd10/LICENSE) |
| Holmaark | 정확한 표기로 GitHub 공개 저장소·사용자와 npm을 조회했으며 결과는 각 0건이었다. 공개 검색 범위에서 만든 주체, 배포물, 원문을 확인할 수 없었다. | 라이선스와 신뢰성을 판단할 출처가 없다. | 외부 설치를 보류한다. 의도한 출처를 확보할 때까지 아래 참조 검증 절차로 관리한다. [GitHub 저장소 검색](https://github.com/search?q=Holmaark&type=repositories) · [npm 검색](https://www.npmjs.com/search?q=Holmaark) |

## 독립 검토와 출처 검증 절차

- **Deep Research 방식의 리서치**. 의사결정 질문을 좁히고 공식 발행물과 현재 버전을 우선 확인한다. 자료명, 발행자, 날짜, URL, 실제 확인한 내용, 열람 제한을 표에 기록한다. 자료가 서로 다른 값을 제시하면 적용 범위와 근거를 제시한다. 프레젠테이션에 넣을 문장과 자산은 주장, 출처, 사용 권리까지 추적할 수 있게 한다.
- **EGM 방식의 독립 검토**. 초안 작성자는 요구사항, 근거 링크, 남은 가정을 문서에 정리한다. 별도 검토자에게 현재 산출물, 명시된 요구사항, 참고 파일 경로만 전달한다. Codex에서 가능한 경우 `fork_turns: "none"`으로 시작한다. 이전 대화 맥락을 제외해도 저장소 지침과 파일시스템은 공유되므로 배경 설명은 문서 자체에 있어야 한다. 검토자는 재현 위치와 문제의 이유를 남긴다. 작성자는 수정 후 같은 근거로 다시 평가받고 통과 여부를 기록한다.
- **Holmaark 참조 검증**. 제공된 출처가 생기면 발행 주체와 정확한 프로젝트명, 릴리스나 Git 리비전, 라이선스 파일, 설치 시 실행되는 코드와 요구 권한을 확인한다. 확인 전에는 이름만으로 기능이나 권한을 추정하지 않는다.
