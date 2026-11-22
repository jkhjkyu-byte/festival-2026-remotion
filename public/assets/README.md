# 제작 자산

Smoke 영상의 엠블럼과 배경은 코드로 제작한다. 운영용 로고, 시상 사진, 서체, 음악을 받으면 [자산 출처 기록](../../docs/design/README.md)에 원본, 권리 및 승인 상태를 남긴 뒤 사용한다. 렌더링에서 자산을 참조할 때는 `staticFile("assets/…")`을 사용한다.

`festival-audio/`의 MP3는 프로젝트의 자체 합성 음향이다. 재생 큐는 영상 타임라인에서 편집하며, `python3 scripts/make-festival-audio.py`로 파일을 재생성한다.

참고 영상 반영판의 `reference-cut/radar.jpg`와 `launch.jpg`는 자체 생성한 시네마틱 삽화다. 레이다와 원거리 발사 연출에 사용한다. `gift-pop.wav`는 합성한 리본 팝·차임 효과음이다. 첨부 영상과 스토리보드의 화면·음성은 본편 자산에 들어가지 않는다.

균등 노출 수정판의 `ceremony-cut/` JPEG는 새로 생성한 금속 디테일, 시상 홀, 트로피, 작업자의 손과 피날레 장면이다. `prize-hit.wav`는 대상 트로피 공개를 위해 합성한 충격음과 차임이다.
