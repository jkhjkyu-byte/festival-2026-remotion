# 제작 자산

Smoke 영상의 엠블럼과 배경은 코드로 제작한다. 운영용 로고, 시상 사진, 서체, 음악을 받으면 [자산 출처 기록](../../docs/design/README.md)에 원본, 권리 및 승인 상태를 남긴 뒤 사용한다. 렌더링에서 자산을 참조할 때는 `staticFile("assets/…")`을 사용한다.

`festival-audio/`의 MP3는 프로젝트의 자체 합성 음향이다. 재생 큐는 영상 타임라인에서 편집하며, `python3 scripts/make-festival-audio.py`로 파일을 재생성한다.

참고 영상 반영판의 `reference-cut/radar.jpg`와 `launch.jpg`는 자체 생성한 시네마틱 삽화다. 레이다와 원거리 발사 연출에 사용한다. `gift-pop.wav`는 합성한 리본 팝·차임 효과음이다. 첨부 영상과 스토리보드의 화면·음성은 본편 자산에 들어가지 않는다.

균등 노출 수정판의 `ceremony-cut/` JPEG는 새로 생성한 금속 디테일, 시상 홀, 트로피, 작업자의 손과 피날레 장면이다. `prize-hit.wav`는 대상 트로피 공개를 위해 합성한 충격음과 차임이다.

7S·시상 순서 수정판의 `awards-order/prize-chime.wav`는 대상 발표용으로 새로 합성한 부드러운 세 음의 차임이다.

명단·퀴즈 수정판의 검정 선물상자, 금속 리본, 빛과 색종이는 사용자 첨부 이미지를 연출 레퍼런스로 삼아 `src/three/QuizGift.tsx`에서 모델링·애니메이션했다. 개봉 시 기존에 합성한 `reference-cut/gift-pop.wav`를 사용한다.

`gala-cut/`의 무대 2종, 트로피, 레이더, 함정 CIWS와 발사·비행 사진풍 장면은 사용자가 첨부한 여섯 장의 참고 이미지를 바탕으로 제작한 생성 삽화다. 행사 영상의 본부 소개와 시상 배경에 사용했다.

`gala-motion/`의 전시관과 아치 무대, 트로피 무대 2종은 사용자가 제공한 시안의 조명과 구도를 바탕으로 새로 생성했다. `launch-sea.jpg`는 MS 소개 모션용으로 생성한 해상 배경이며, 발사체 실루엣과 연기는 `src/scenes/GalaLaunchMotion.tsx`에서 프레임 기반으로 합성한다.
