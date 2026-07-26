@./AGENTS.md

# Gemini CLI Delta

- `/memory show`로 이 파일과 `AGENTS.md`가 함께 로딩됐는지 확인합니다.
- 공용 규칙을 중복 로드하지 않도록 `context.fileName`에 `AGENTS.md`를 추가하지 않습니다.
- Workspace 설정, MCP, Hook은 폴더를 신뢰하고 소유자·코드·권한을 검토한 뒤 활성화합니다.
- 무승인 모드로 공용 지침의 push, merge, release, deploy 승인 규칙을 우회하지 않습니다.
