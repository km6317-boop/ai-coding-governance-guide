# Claude Code 지침 팩

## 설치

1. `global/CLAUDE.md`를 `~/.claude/CLAUDE.md`로 복사합니다.
2. 함께 들어 있는 `shared/AGENTS.md`를 저장소 루트의 `AGENTS.md`로 복사하고,
   `project/CLAUDE.md`도 루트에 복사합니다.
3. 개인 프로젝트 차이가 필요하면 `local/CLAUDE.local.md`를 루트에 복사하고 gitignore를
   확인합니다.
4. `/memory`에서 전역·프로젝트·로컬 파일과 `AGENTS.md` import가 로딩됐는지 확인합니다.

Claude Code는 `AGENTS.md`를 자동으로 읽지 않으므로 프로젝트 `CLAUDE.md`가
`@AGENTS.md`로 가져옵니다. 공용 규칙은 `AGENTS.md`만 편집하고 `CLAUDE.md`에는 Claude
전용 차이만 유지하세요.

지침과 설정은 별개입니다. 사용자 설정은 `~/.claude/settings.json`, 공유 프로젝트 설정은
`.claude/settings.json`, 비공개 프로젝트 설정은 `.claude/settings.local.json`에 둡니다.
