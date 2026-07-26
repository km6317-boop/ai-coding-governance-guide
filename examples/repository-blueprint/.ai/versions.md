# 검증한 도구 버전

이 파일은 설치 프로그램이 아니라 **팀이 실제로 검증한 조합의 기록**이다. 새 프로젝트에
청사진을 복사한 뒤 `프로젝트에서 결정` 항목을 채우고, 가능하면 Dev Container,
`.tool-versions`, `mise.toml`, `packageManager`, lockfile처럼 실행 가능한 버전 고정 수단도
함께 둔다.

| 구성 요소 | 팀 기준 | 확인 명령 | 메모 |
|---|---|---|---|
| Git | 프로젝트에서 결정 | `git --version` | 모든 개발자와 CI에서 같은 주 버전을 권장 |
| Node.js | 프로젝트에서 결정 | `node --version` | 애플리케이션이 요구하는 LTS를 고정 |
| 패키지 관리자 | 프로젝트에서 결정 | `npm --version` 등 | lockfile 하나만 커밋 |
| Spec Kit | `v0.14.2` | `specify version` | 설치 source도 release tag로 고정 |
| Gemini CLI | `v0.52.0`을 기준으로 문서 검증 | `gemini --version` | 지원 계정인지 먼저 확인 |
| Claude Code | 프로젝트에서 결정 | `claude --version` | 팀이 시험한 버전을 기록 |
| Codex CLI | 프로젝트에서 결정 | `codex --version` | 팀이 시험한 버전을 기록 |

## 변경 규칙

1. 버전 변경은 기능 구현과 분리한 도구 업그레이드 PR에서 수행한다.
2. 세 AI에서 지침 로딩, Skill 발견, MCP 비활성 기본값을 다시 확인한다.
3. `node scripts/verify-ai-config.mjs`와 프로젝트 CI가 모두 통과해야 한다.
4. 성공한 날짜, 운영체제, 알려진 제약은 PR과 `knowledge/log.md`에 남긴다.

Gemini CLI의 무료 및 Google AI Pro/Ultra 터미널 경로는 2026-06-18부터 Antigravity
CLI로 전환되었다. Code Assist Standard/Enterprise, Google Cloud 또는 유료 API 키 사용
환경에서 Gemini CLI를 계속 사용하는 경우에만 위 버전을 팀 기준으로 채택한다.
