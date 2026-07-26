# Claude Code 지침 팩

## 폴더별로 무엇을 넣나

| 범위 | 대상 폴더와 파일 | 넣을 내용 | Git |
|---|---|---|---|
| 전역 | `~/.claude/CLAUDE.md` | 선호 언어, 개인 작업 습관, 모든 프로젝트의 기본 동작 | 공유하지 않음 |
| 프로젝트 공통 | `repo/AGENTS.md` | 5계층 공통 계약, Spec Kit·OKF, 실제 검사 명령, 보안·완료 조건 | 커밋 |
| 프로젝트 어댑터 | `repo/CLAUDE.md` | `@AGENTS.md` import와 Claude만의 로딩·Skill·권한 차이 | 커밋 |
| 개인 로컬 | `repo/CLAUDE.local.md` | 비밀값 없는 sandbox URL, fixture, 개인 검증 메모 | gitignore |

`CLAUDE.local.md`에는 팀 표준, Spec 수용 기준, OKF 결정, 토큰을 넣지 않습니다. 공유
프로젝트 설정은 `repo/.claude/settings.json`, 개인 프로젝트 설정은
`repo/.claude/settings.local.json`에 두어 자연어 지침과 실행 통제를 분리합니다.

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
