# 세 코딩 AI, 하나의 저장소

Gemini CLI, Claude Code, Codex를 같은 GitHub 저장소 규칙으로 운영하기 위한
초보자용 한국어 가이드입니다. 2026-07-26의 공급사 공식 문서를 기준으로 작성했으며,
GitHub Spec Kit v0.14.2와 Google Cloud Open Knowledge Format(OKF) v0.2를 사용합니다.

## 구성

- `docs/` — GitHub Pages에 바로 게시할 정적 HTML
- `docs/downloads/` — 게시된 페이지에서 내려받을 AI별 지침 팩, 청사진 ZIP과 Pages workflow
- `docs/instructions/` — 페이지의 Markdown 열람기가 표시하는 지침 원문
- `examples/repository-blueprint/` — 새 저장소에 복사해 적용할 실전 청사진
- `examples/instruction-packs/` — Codex·Claude Code·Gemini CLI의 전역·프로젝트·로컬 지침 원본
- `examples/pages-actions.yml.example` — GitHub Actions로 Pages를 게시할 때 사용할 예제

## 로컬에서 읽기

`docs/index.html`을 브라우저로 열면 됩니다. 모든 CSS와 JavaScript는 로컬 파일이며
외부 라이브러리를 사용하지 않습니다.

## 가장 단순한 GitHub Pages 게시

1. 이 패키지의 `docs/`를 대상 저장소의 루트 `docs/`로 복사합니다.
2. GitHub 저장소에서 **Settings → Pages**로 이동합니다.
3. **Deploy from a branch**를 선택합니다.
4. branch는 `main`, folder는 `/docs`를 선택하고 저장합니다.

빌드 검사가 필요하면 Pages source를 **GitHub Actions**로 바꾸고
`examples/pages-actions.yml.example`을 `.github/workflows/pages.yml`로 복사하세요.
두 게시 방식을 동시에 설정하지 않습니다.

## 청사진 사용

`examples/repository-blueprint/README.md`를 먼저 읽으세요. 실제 저장소에 적용할 때는
전용 브랜치에서 필요한 파일만 복사하고 diff를 검토합니다. 청사진은 Spec Kit가 생성한
것처럼 보이는 가짜 `.specify/` 또는 `specs/`를 포함하지 않습니다. 공식 `specify`
명령을 실행해 실제 프로젝트 파일을 생성해야 합니다.

```powershell
node examples/repository-blueprint/scripts/verify-ai-config.mjs
```

## 공개 전 주의

GitHub Pages에는 토큰, 내부 URL, 고객 데이터, 사내 전용 정책을 넣지 마세요.
공개 URL이 확정되면 `docs/assets/og.png`의 절대 URL을 `og:image` 메타 태그로 추가할 수
있습니다.
