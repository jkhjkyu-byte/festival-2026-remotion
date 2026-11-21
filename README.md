# 2026 기술/혁신 FESTIVAL

Remotion과 TypeScript를 사용하는 시상식 영상 제작 프로젝트입니다. `FestivalSmoke`는 행사 타이틀·모션·인코딩을 확인하는 3초 컴포지션이며, `FestivalWebGL`은 3D 렌더링 진단용입니다.

## 실행

Node.js 24.22.3, npm 11.19.1, FFmpeg와 ffprobe가 필요합니다. 클라우드에는 한글 폰트 Noto Sans CJK KR이 설치되어 있습니다.

```bash
npm ci
bash scripts/install-remotion-skills.sh
npm run dev -- --host=0.0.0.0 --no-open
```

## 검증

```bash
npm run lint
npm run build
npm run render:smoke
```

Remotion 전용 브라우저 다운로드가 차단된 환경에서는 `REMOTION_BROWSER_EXECUTABLE=/usr/bin/chromium npm run render:smoke`를 실행합니다. 성공한 파일은 `out/festival-smoke.mp4`에 저장됩니다. 3D 진단과 실행 결과는 [설치 보고서](SETUP_REPORT.md)에 있습니다.

## 제작 자료

- [영상 리서치](docs/research/production-research.md)
- [오프닝 및 시상 스토리보드](docs/storyboard/README.md)
- [아트 디렉션](docs/design/README.md)
- [제작 워크플로](docs/WORKFLOW.md)
- [독립 QA와 상영 승인](docs/reviews/README.md)
- [Codex 작업 지침](AGENTS.md)
