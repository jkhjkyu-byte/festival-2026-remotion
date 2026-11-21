# 제작 자산

Smoke 영상의 엠블럼과 배경은 코드로 제작한다. 운영용 로고, 시상 사진, 서체, 음악을 받으면 [자산 출처 기록](../../docs/design/README.md)에 원본, 권리 및 승인 상태를 남긴 뒤 사용한다. 렌더링에서 자산을 참조할 때는 `staticFile("assets/…")`을 사용한다.

`festival-audio/`의 MP3는 프로젝트의 자체 합성 음향이다. 재생 큐는 영상 타임라인에서 편집하며, `python3 scripts/make-festival-audio.py`로 파일을 재생성한다.
