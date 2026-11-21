# 시상식 영상 레퍼런스와 적용 기준

## 오프닝과 타이포그래피

- **0–4초**. 한 번의 느린 전진과 근경·중경·원경의 서로 다른 이동량으로 깊이를 만든다. 희미한 신호점과 연결선은 넓은 화면 양편을 채우되, 중앙 텍스트 영역의 움직임과 명도를 낮춘다. 시작의 암전과 제어되지 않은 검은 프레임을 구분해 첫 프레임과 첫 발광 프레임을 각각 확인한다. [Remotion 프레임 기반 애니메이션](https://github.com/remotion-dev/remotion/blob/970849fc1921ed7e0c3175132fe9580e8875ab2f/packages/docs/docs/animating-properties.mdx)
- **4–8초**. 레이더 링과 양쪽 수평 데이터가 같은 소실점에 모이게 배치한다. 비슷한 타이밍으로 모든 요소를 켜기보다 스캔, 회로 활성화, 작은 타이틀 순으로 시작 시간을 분산한다. 데이터의 이동은 ease-in-out으로 속도를 올렸다 내리고, 장면 내 정착 동작은 끝에서 감속한다. 적용 예는 각각 cubic Bézier (0.42, 0, 0.58, 1), (0.22, 1, 0.36, 1)이다. [W3C CSS Easing 정의](https://github.com/w3c/csswg-drafts/blob/804b7b0055e80dfaba091e7f32a4bca303e569e3/css-easing-1/Overview.bs) · [Remotion Easing](https://github.com/remotion-dev/remotion/blob/970849fc1921ed7e0c3175132fe9580e8875ab2f/packages/docs/docs/easing.mdx)
- **8–12초**. 푸른 수평 광량을 단발로 올려 타이틀이 나타나는 순간을 강조한다. 마지막 2초에는 타이틀과 슬로건을 고정하고 광량을 낮춘다. 전경이 타이틀을 가리는 효과가 있으면 글자 홀드 시작 전까지 해제한다. 화면을 밝고 어둡게 연속 반전시키는 방식은 피한다. [W3C 섬광 기준 설명](https://github.com/w3c/wcag/blob/2766fae25fc8286f60181d655115cba054b797e1/understanding/20/three-flashes-or-below-threshold.html)
- **확인한 모션 사례**. Remotion의 Hello World 원본은 로고 이동(25–55프레임), 제목 시작(35프레임), 후속 정보 노출(75프레임)과 종료 페이드를 분리한다. 공식 Title 예제는 같은 스프링을 0·4·8프레임씩 어긋나게 배치해 글자와 배경이 한 번에 등장하는 것을 피한다. 이 프로젝트에는 신호 → 행사명 → 슬로건의 순차 공개로 적용했다. [Hello World 구현](https://github.com/remotion-dev/remotion/blob/970849fc1921ed7e0c3175132fe9580e8875ab2f/packages/template-helloworld/src/HelloWorld.tsx) · [Title 구현](https://github.com/remotion-dev/remotion/blob/970849fc1921ed7e0c3175132fe9580e8875ab2f/packages/example/src/Title/index.tsx)
- **시퀀스 비교 후보**. 다음 시각 검토에서 Westworld의 미세 디테일과 전체 형상 공개, TRON: Legacy의 광로와 실루엣을 비교한다. 편집과 미술 레퍼런스로만 사용한다. 현재 클라우드 프록시에서 아래 영상과 인터뷰를 열 수 없어 타임코드 기반 분석은 남아 있다. [Westworld](https://www.artofthetitle.com/title/westworld/) · [TRON: Legacy](https://www.artofthetitle.com/title/tron-legacy/)

## 광학, LED와 가독성

- **광각 제어**. Three.js PerspectiveCamera의 FOV는 수직 기준이다. 11:3에서는 수직 30°가 수평 약 89°, 수직 45°가 수평 약 113°이므로 가장자리의 형상이 크게 변형된다. 3D 카메라에 고정 자막을 종속시키지 않고, 필요한 경우 CSS·Remotion의 화면 공간 레이어에 타이틀을 둔다. 좌우 궤적과 입자는 원근 왜곡을 활용할 수 있다. [Three.js PerspectiveCamera 소스](https://github.com/mrdoob/three.js/blob/6246c818834fd19d0c216d3dbc074b6cc9c27896/src/cameras/PerspectiveCamera.js)
- **안전 여백**. 외곽 8%를 시안의 보수적 검사 구간으로 사용한다. 3960×1080에서 좌우 약 317px, 상하 약 86px이다. 이름과 소속은 중앙에 두고 연결선·HUD를 양 끝에 배치한다. 행사장 컨트롤러의 실제 크롭과 타일 경계를 받으면 대체한다. EBU R95 문서는 안전 영역의 방송 참고 자료다. 해당 원문과 Brompton 장비 자료는 이 세션에서 프록시가 막아 읽지 못했으며 현장 장비 모델도 제공되지 않았다. [EBU R95](https://tech.ebu.ch/publications/r095) · [Brompton Tessera SX40](https://www.bromptontech.com/product/tessera-sx40/)
- **픽셀 매핑**. 시안은 3960×1080 정사각 픽셀로 만들고 LED 컨트롤러에서 가로 늘이기를 피한다. 영상의 출력 확인에는 프레임 크기와 함께 SAR, DAR, FPS, 픽셀 포맷을 읽는다. 실측 LED 픽셀 매트릭스, 크롭 영역, 재생 장치가 허용하는 H.264 레벨과 최대 비트레이트, 색공간·범위, 오디오 레벨은 인수 검증 전에 확인한다. [FFmpeg 필터 문서](https://github.com/FFmpeg/FFmpeg/blob/b2760fdd7ebc8bc120f3d1b626f549a3accda31e/doc/filters.texi) · [ffprobe 문서](https://github.com/FFmpeg/FFmpeg/blob/b2760fdd7ebc8bc120f3d1b626f549a3accda31e/doc/ffprobe.texi)
- **읽기 우선**. 정상 크기와 축소한 11:3 시안에서 가장 긴 한글 타이틀의 줄바꿈·자간을 확인한다. 움직이는 배경에서 글자와 가장 밝은 배경 프레임의 대비를 측정한다. 4.5:1은 시안 비교에 쓰는 내부 목표이며 실측 LED의 밝기나 뒷자리 가독성을 대신하지 않는다. [W3C 대비 기준 설명](https://github.com/w3c/wcag/blob/2766fae25fc8286f60181d655115cba054b797e1/understanding/20/contrast-minimum.html)

## 시상 리듬과 사용 권리

- **발표**. 부문·이름·소속을 한 시점에 경쟁시키지 않는다. 각 일반 수상자는 부문을 먼저 보여 주고 사람 이름이 열린 뒤 배경 움직임을 줄인다. 대상은 감속과 암전 → 작은 금빛 좌표 → 등급 → 이름 → 최소 4초 유지의 순서를 지킨다. CW는 수평 파형을, 미사일시스템기술연구소는 깊이감 있는 대각선 궤적을 쓴다. 영화예술과학아카데미 공식 시상식 자료는 행사 공개 구조의 후속 비교 후보다. 현재 프록시가 Academy 원문을 막아 사건이나 연출 디테일을 이 자료에 귀속하지 않았다. [Academy 제97회 시상식 자료](https://www.oscars.org/oscars/ceremonies/2025)
- **제작과 권리**. 빛, 궤적, 레이더, 회로와 입자는 직접 제작한다. 참고 영상, 샷, 작품 로고, 타이틀 글자 디자인과 음원은 이 작업에 복제하지 않았다. 이후 사용할 이미지·음원·글꼴은 원 출처, 라이선스, 기업 행사 상영과 편집 허용 범위를 기록한다. [Remotion 정적 자산 안내](https://www.remotion.dev/docs/staticfile)
