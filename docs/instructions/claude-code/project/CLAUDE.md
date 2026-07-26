@AGENTS.md

# Claude Code Delta

- `/memory`로 이 파일과 `AGENTS.md`가 함께 로딩됐는지 확인합니다.
- 공유 설정은 `.claude/settings.json`, 개인 설정은 `.claude/settings.local.json`에 둡니다.
- 외부 MCP, Plugin, Skill, Hook은 소유자·코드·권한을 검토하기 전까지 활성화하지 않습니다.
- 프로젝트의 공용 규칙을 이 파일에 복제하지 않고 Claude Code에서만 필요한 차이만 둡니다.
- Spec Kit 명령 이름과 생성 경로는 설치된 통합을 기준으로 확인하고, 가짜 산출물을 만들지 않습니다.
- 공용 Skill 원본과 `.claude/skills/` 설치 사본이 있다면 직접 사본만 수정하지 않습니다.
- `CLAUDE.local.md`와 auto memory에는 팀 표준, 장기 결정, 비밀값을 저장하지 않습니다.
- 권한 설정을 우회하는 mode로 공용 계약의 외부 변경 승인 규칙을 무력화하지 않습니다.
- 완료 전 `/memory`로 적용된 지침을, `/permissions`로 실제 권한 출처를 다시 확인합니다.
