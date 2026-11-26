# Obsidian Atelier 레퍼런스

2026년 11월 22일 기준. 실제 열람한 기술 브랜드 영상, 제품 시각화, 모션 원본에서 조명과 움직임의 적용 기준을 정리했다. 시상식과 방송 패키지 영상은 접속 결과를 별도로 기록했다.

## 열람한 원본과 적용

| 열람 자료 | 관찰 | 영상 적용 |
| --- | --- | --- |
| Remotion 공식 제품 트레일러 영상 | 공식 저장소의 완성 MP4를 디코딩해 18개 시점의 프레임을 확인했다. 0–1초에 단순한 호가 시작하고 2–4초에 중앙의 글자와 심볼이 자리를 잡는다. 20초 샘플은 로고와 브랜드명에만 집중한다. 94–97초의 끝화면은 큰 요소 한 개와 하위 요소 두 개로 정보의 순서를 매긴다. | 오프닝에 대사 없이 읽을 수 있는 하나의 얇은 광로를 먼저 보여준다. 타이틀이 열리면 주요 형태와 텍스트를 고정한다. 엔딩에는 행사명과 슬로건의 두 층만 남기고 기존 위치를 재사용한다. 구성 원리를 분석했으며 브랜드 심볼, 화면이나 음원을 옮기지 않았다. [공식 저장소 영상](https://github.com/remotion-dev/trailer/blob/63c2a66f2c7780f64c85c26e5f872daa31d9545c/trailer.mp4) · [제작 저장소 README](https://github.com/remotion-dev/trailer/blob/63c2a66f2c7780f64c85c26e5f872daa31d9545c/README.md) |
| Khronos Chronograph Watch의 제품 렌더와 제작 기록 | 밝은 샴페인 골드 면과 짙은 계기판 사이에 그림자가 남는다. 사선으로 꺾이는 면마다 밝기가 달라 얇은 엣지의 높이와 형태가 드러난다. | 대상의 금빛은 챔퍼와 링 외곽에서 시작한다. 큰 표면과 배경은 흑요석의 어두운 톤을 유지하고, 흰 글자와 밝은 샴페인 하이라이트를 분리한다. [제품 렌더](https://github.com/KhronosGroup/glTF-Sample-Assets/blob/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/ChronographWatch/screenshot/screenshot_Large.jpg) · [제작 기록](https://github.com/KhronosGroup/glTF-Sample-Assets/blob/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/ChronographWatch/README.md) |
| Khronos Car Concept의 제품 렌더와 3개 재질 상태 프리뷰 | 앞쪽 패널의 반사광은 넓게, 차체 모서리의 반사광은 가늘게 남는다. 검은 영역에도 형태를 구분할 만큼의 계조가 남는다. 동일한 실루엣에서 재질만 달라지는 비교 GIF로 확인했다. | 수상 장면의 금속 표면은 넓은 낮은 명도의 면광과 좁은 엣지 광으로 읽히게 한다. 전체 화면의 밝기를 동시에 높이는 효과를 줄인다. [제품 렌더](https://github.com/KhronosGroup/glTF-Sample-Assets/blob/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/CarConcept/screenshot/screenshot_Large.jpg) · [재질 프리뷰](https://github.com/KhronosGroup/glTF-Sample-Assets/blob/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/CarConcept/screenshot/variants.gif) |
| Khronos Stained Glass Lamp 회전 GIF와 Commercial Refrigerator 이징 비교 GIF | 회전 중 유리를 통과하는 광량이 바뀌어도 유리 조각 경계가 이어진다. 냉장고 애니메이션에서는 두 문이 같은 시작점과 끝점을 사용해도 중간 프레임의 위치가 다르다. | 오프닝의 회전은 관성 있게 느려지도록 조정한다. 유리 표면의 반사광을 이동시켜 공간감을 만들고, 한글 타이틀의 위치와 초점은 움직임이 멈춘 상태로 유지한다. [회전 GIF](https://github.com/KhronosGroup/glTF-Sample-Assets/blob/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/StainedGlassLamp/screenshot/screenshot_transmission_rotation.gif) · [이징 비교 GIF](https://github.com/KhronosGroup/glTF-Sample-Assets/blob/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/CommercialRefrigerator/screenshot/ease-vs-linear.gif) |
| IBM Carbon 공식 모션·안무 문서 | 반복 요소에는 시선에 부담이 적은 움직임을 권장한다. 중요한 순간에는 드문 표현적 모션을 두고, 공통 요소가 이동하면 시선이 따라가기 쉬워진다고 설명한다. IBM 공개 소스의 모션 가이드 원문을 확인했다. | 일정과 수상자 이름의 반복 공개에서는 이동 폭을 제한한다. 대상에서만 골드 링과 공간 이동을 강조한다. 인접 장면에서는 한 줄의 빛이나 타이틀의 수평 기준선을 공유해 시선이 머무를 위치를 알려준다. [Carbon 모션](https://github.com/carbon-design-system/carbon-website/blob/5e9cd1da43c32d3d3b991dc947b427f674da61a8/src/pages/elements/motion/overview.mdx) · [Carbon 안무](https://github.com/carbon-design-system/carbon-website/blob/5e9cd1da43c32d3d3b991dc947b427f674da61a8/src/pages/elements/motion/choreography.mdx) |

제품 스틸과 GIF는 열람용으로만 확인했다. Chronograph Watch와 Car Concept은 모델별 CC BY 4.0 표기와 로고·상표 범위가 따로 있다. 이 리서치에서 외부 스틸, 모델, 로고, 영상 또는 음원을 프로젝트에 가져오지 않았다. [Chronograph Watch 라이선스](https://github.com/KhronosGroup/glTF-Sample-Assets/blob/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/ChronographWatch/LICENSE.md) · [Car Concept 라이선스](https://github.com/KhronosGroup/glTF-Sample-Assets/blob/e124e8d8d7330a5372bc2b4d00d39a4a9d7997ea/Models/CarConcept/LICENSE.md)

## 시상식·브랜드·방송 레퍼런스 열람 상태

| 조사 대상 | 접근 결과 | 후속 검토 기준 |
| --- | --- | --- |
| 공식 시상식 오프닝과 공개 영상 | Academy 사이트와 Academy YouTube 채널이 프록시 CONNECT 403을 반환했다. | 오프닝의 첫 정보 노출, 로고 홀드, 현장 화면이 타이틀을 받아넘기는 순서를 확인한다. [2025 Academy Awards](https://www.oscars.org/oscars/ceremonies/2025) · [Oscars YouTube](https://www.youtube.com/@Oscars/videos) |
| 기술 브랜드 필름 | Apple Newsroom, Apple Events 및 Apple YouTube 채널이 같은 오류를 반환했다. | 제품이 모습을 드러내기 전 실루엣·광원·카메라 움직임의 순서를 확인한다. [Apple Events](https://www.apple.com/apple-events/) · [Apple YouTube](https://www.youtube.com/@Apple/videos) |
| 모션 스튜디오와 방송 패키지 | Vimeo·Vimeo Player, Behance, ManvsMachine·Tendril·Territory Studio·Stash Media 사이트가 같은 오류를 반환했다. | 방송 패키지의 타이틀·명패·카테고리 장면을 비교해 반복 요소와 장면별 강약을 확인한다. [ManvsMachine Vimeo](https://vimeo.com/manvsmachine) · [Tendril Vimeo](https://vimeo.com/tendril) · [Behance 시상 모션 검색](https://www.behance.net/search/projects?search=awards%20motion%20graphics) · [Territory Studio](https://territorystudio.com/) |

표에 적힌 차단된 시상 오프닝, Apple 브랜드 필름, 방송 패키지의 프레임이나 타임코드는 확인하지 못했다. 적용 기준은 별도로 확인한 Remotion 제품 트레일러, 제품 렌더·애니메이션, 공개 모션 문서와 행사 브리프에 근거한다.

## 11:3 시안 검토

- 오프닝과 대상 진입에서 한 프레임에 가장 밝은 요소 하나를 선정한다. 타이틀 공개 직전에는 재질의 실루엣이, 공개 직후에는 한글이 초점이 된다.
- 일반 수상 공개에서 이름이 등장하면 카메라와 엣지 이동량을 낮춘다. 이름이 좌우 장식과 겹치지 않는지 가장 긴 이름과 소속으로 확인한다.
- 화면 양쪽의 낮은 명도와 비대칭 조명으로 폭을 사용한다. 가운데 제목만 보아도 장면의 의미를 이해할 수 있고, 낮은 해상도에서도 엣지가 글자처럼 보이지 않는지 검토한다.
