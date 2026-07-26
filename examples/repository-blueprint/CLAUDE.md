@AGENTS.md

# Claude Code delta

- `/memory`로 이 파일과 `AGENTS.md`가 함께 로딩되었는지 확인한다.
- 공유 설정은 `.claude/settings.json`, 개인 설정은 커밋하지 않는 `.claude/settings.local.json`에 둔다.
- 공용 Skill의 Claude 설치 사본은 `.claude/skills/verify-before-done/SKILL.md`이다. 원본은 `.ai/skills/verify-before-done/SKILL.md`이며 직접 사본만 수정하지 않는다.
- `.mcp.json.example`은 문서용 비활성 예시다. 사람이 서버를 검토하고 명시적으로 `.mcp.json`으로 복사하기 전에는 활성 MCP 설정으로 취급하지 않는다.
- 외부 상태를 바꾸는 명령은 `.claude/settings.json`의 `ask` 규칙과 공용 보안 지침을 모두 따른다. 규칙을 우회하는 permission mode를 사용하지 않는다.
