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

## 도구별 폴더·파일·작성 내용

`~`는 현재 사용자의 홈 폴더, `repo/`는 Git 저장소 루트입니다.

| 도구·범위 | 폴더 | 파일 | 넣어야 할 내용 | Git 공유 | 넣지 말아야 할 내용 |
|---|---|---|---|---|---|
| Codex 전역 | `~/.codex/` | `AGENTS.md` | 선호 언어, 작업 전 확인, 검증·보고 방식 같은 개인 기본값 | 아니요 | 특정 프로젝트 명령·아키텍처 |
| Codex 프로젝트 | `repo/` | `AGENTS.md` | 5계층 공통 계약, Spec Kit·OKF, 실제 검사 명령, 보안 경계, 완료 조건 | 예 | 개인 경로·토큰·Codex 전용 설정 |
| Codex 하위 경로 | `repo/<component>/` | `AGENTS.md` | 해당 폴더 수정 경계, 추가 검사, feature spec·ADR 링크 | 필요 시 | 루트 규칙 복제·약화 |
| Claude 전역 | `~/.claude/` | `CLAUDE.md` | 선호 언어, 개인 작업 습관, 모든 프로젝트의 기본 동작 | 아니요 | 프로젝트 명령·팀 결정 |
| Claude 프로젝트 | `repo/` | `AGENTS.md`, `CLAUDE.md` | 공통 계약과 `@AGENTS.md`를 사용하는 Claude 전용 어댑터 | 예 | 공통 계약 복사본·개인 권한 |
| Claude 개인 로컬 | `repo/` | `CLAUDE.local.md` | 비밀값 없는 sandbox URL, fixture, 개인 검증 메모 | 아니요·gitignore | 팀 표준·Spec·OKF·인증 정보 |
| Gemini 전역 | `~/.gemini/` | `GEMINI.md` | 선호 언어, 개인 작업 습관, 모든 workspace의 기본 동작 | 아니요 | 프로젝트 명령·팀 결정 |
| Gemini 프로젝트 | `repo/` | `AGENTS.md`, `GEMINI.md` | 공통 계약과 `@./AGENTS.md`를 사용하는 Gemini 전용 어댑터 | 예 | 공통 규칙 중복 로딩 구성 |
| Gemini 하위 JIT | `repo/<component>/` | `GEMINI.md` | 해당 경로의 작업 경계, 추가 검사, spec·ADR 링크 | 필요 시 | 개인 로컬 전용 정보 |

“로컬”은 제품마다 같은 개념이 아닙니다. Codex와 Gemini의 예시는 경로 범위가 좁은
하위 폴더 지침이며 팀과 공유할 수 있습니다. Claude의 예시는 현재 사용자만을 위한
프로젝트 로컬 파일입니다.

실행 설정은 자연어 지침과 분리합니다.

| 도구 | 사용자 설정 | 프로젝트 설정 | 개인 프로젝트 설정 |
|---|---|---|---|
| Codex | `~/.codex/config.toml` | `repo/.codex/config.toml` | 가까운 하위 `.codex/config.toml`은 팀 경로 설정이며 private local 전용이 아님 |
| Claude Code | `~/.claude/settings.json` | `repo/.claude/settings.json` | `repo/.claude/settings.local.json` |
| Gemini CLI | `~/.gemini/settings.json` | `repo/.gemini/settings.json` | 전용 private local settings 파일 없음 |

## 적용 순서

1. 사용할 도구 디렉터리의 `README.md`를 읽습니다.
2. `global/`의 파일에서 대괄호로 표시한 값을 바꾼 뒤 사용자 홈의 공식 경로에 둡니다.
3. `shared/AGENTS.md`를 저장소 루트 `AGENTS.md`로 복사하고 실제 프로젝트 명령을 채웁니다.
4. Claude 또는 Gemini를 사용하면 해당 `project/` 어댑터도 저장소 루트에 복사합니다.
5. 필요한 경우에만 `local/` 예시를 위 표의 정확한 위치에 둡니다.
6. 새 세션을 열어 실제 로딩된 지침을 확인합니다.
7. 지침만 믿지 말고 저장소 CI와 권한 설정으로 중요한 규칙을 강제합니다.

공식 경로는 2026-07-26 기준으로 확인했습니다. CLI를 업그레이드한 뒤에는 각 제품의
공식 문서와 실제 메모리/상태 화면에서 다시 확인하세요.
