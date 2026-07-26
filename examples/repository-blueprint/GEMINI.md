@./AGENTS.md

# Gemini CLI delta

- 이 파일의 import를 통해 공용 `AGENTS.md`를 읽는다. `context.fileName`에 두 파일을 동시에 추가하여 중복 로딩하지 않는다.
- `/memory show`로 실제 합쳐진 컨텍스트를, `/skills list`로 Skill 발견 상태를 확인한다.
- 공용 Skill의 Gemini 설치 사본은 Codex와 함께 쓰는 `.agents/skills/verify-before-done/SKILL.md`이다. 원본은 `.ai/skills/verify-before-done/SKILL.md`이며 설치 사본만 직접 수정하지 않는다.
- `.gemini/settings.json`에 정의된 예시 MCP는 `mcp.excluded`에 있어 비활성이다. 서버와 도구를 사람이 검토하기 전에는 제외 목록에서 제거하지 않는다.
- 기본 승인 모드를 유지하고 `yolo` 또는 무승인 실행으로 push, merge, release, deploy 규칙을 우회하지 않는다.
