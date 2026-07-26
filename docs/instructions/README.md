# 코딩 AI 지침 팩

이 디렉터리는 가이드가 제안하는 저장소 중심 운영 원칙을 전역·프로젝트·로컬 범위에
맞게 적용한 복사 가능한 템플릿입니다.

## 이 가이드에서 실제로 반영한 내용

공통 `shared/AGENTS.md`는 단순한 코딩 스타일 파일이 아닙니다. 다음 운영 제안을 실제
행동 규칙과 완료 조건으로 변환합니다.

- 저장소를 제어 평면으로 삼는 RULES·CHANGE·KNOW·ADAPT·GATE 5계층
- 공통 규칙은 `AGENTS.md` 한 곳에 두고 AI별 파일은 얇은 어댑터로 유지하는 방식
- Spec Kit의 constitution → specify → clarify → plan → tasks → analyze → implement 흐름
- `specs/`의 현재 변경 계약과 `knowledge/`의 OKF v0.2 장기 지식 분리
- OKF의 source·generated·status·stale_after·verified 신뢰 신호 관리
- Instructions·Settings·Skill·MCP·Plugin·Hook의 책임 분리
- 이슈별 branch, AI 작업별 worktree, 겹치는 공유 파일의 순차 작업
- 비밀값·공급망·외부 변경 승인과 prompt injection 방어
- 테스트·lint·build·보안 검사·CI를 최종 병합 판정으로 사용하는 완료 조건

도구별 전역·프로젝트·로컬 파일에는 위 공통 원칙을 반복하지 않고, 각 제품의 로딩 확인,
설정 위치, Skill 사본, MCP·Hook 신뢰, 로컬 memory 차이만 추가했습니다.

## 공통 원칙

- 전역 지침에는 여러 저장소에서 반복할 개인 기본값만 둡니다.
- 프로젝트의 도구 중립 규칙은 루트 `AGENTS.md`를 단일 원본으로 사용합니다.
- Claude Code와 Gemini CLI의 프로젝트 파일은 `AGENTS.md`를 가져오는 얇은 어댑터입니다.
- 로컬 지침은 개인 환경 또는 특정 하위 폴더에만 필요한 차이만 담습니다.
- Spec Kit의 현재 변경 계약과 OKF의 장기 지식을 지침 파일에 복제하지 않고 링크합니다.
- 자연어 지침은 보안 경계가 아닙니다. 승인 설정, 샌드박스, Hook, CI, 브랜치 보호를 함께
  사용합니다.

## 도구별 범위

| 도구 | 전역 | 프로젝트 | 로컬 |
|---|---|---|---|
| Codex | `~/.codex/AGENTS.md` | 저장소 루트 `AGENTS.md` | 작업 폴더에 가까운 중첩 `AGENTS.md` |
| Claude Code | `~/.claude/CLAUDE.md` | 루트 `CLAUDE.md` + `AGENTS.md` | 루트 `CLAUDE.local.md`(gitignore) |
| Gemini CLI | `~/.gemini/GEMINI.md` | 루트 `GEMINI.md` + `AGENTS.md` | 특정 하위 폴더의 `GEMINI.md`(JIT 로드) |

“로컬”은 제품마다 같은 개념이 아닙니다. Codex와 Gemini의 예시는 경로 범위가 좁은
하위 폴더 지침이며 팀과 공유할 수 있습니다. Claude의 예시는 현재 사용자만을 위한
프로젝트 로컬 파일입니다.

## 적용 순서

1. 사용할 도구 디렉터리의 `README.md`를 읽습니다.
2. `global/`의 파일에서 대괄호로 표시한 값을 바꾼 뒤 사용자 홈의 공식 경로에 둡니다.
3. `project/`의 파일을 저장소 루트에 복사하고 `[프로젝트에 맞게 변경]` 부분을 채웁니다.
4. 필요한 경우에만 `local/` 예시를 해당 위치에 둡니다.
5. 새 세션을 열어 실제 로딩된 지침을 확인합니다.
6. 지침만 믿지 말고 저장소 CI와 권한 설정으로 중요한 규칙을 강제합니다.

공식 경로는 2026-07-26 기준으로 확인했습니다. CLI를 업그레이드한 뒤에는 각 제품의
공식 문서와 실제 메모리/상태 화면에서 다시 확인하세요.
