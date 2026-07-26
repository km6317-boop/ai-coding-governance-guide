# 공용 AI 자산 관리

`.ai/`는 제품이 자동 탐색하는 실행 경로가 아니라 **사람이 관리하는 단일 원본 영역**이다.

## 소유권

- 공용 지침 원본: 루트 `AGENTS.md`
- 공용 Skill 원본: `.ai/skills/<name>/SKILL.md`
- 검증한 도구 조합: `.ai/versions.md`
- 장기 지식 원본: `knowledge/`
- 제품별 어댑터: `CLAUDE.md`, `GEMINI.md`, `.claude/`, `.gemini/`, `.codex/`

제품별 어댑터에는 그 제품에서만 필요한 차이만 둔다. 공용 규칙을 복사해 넣지 않는다.

`.ai/versions.md`는 설명용 기록이다. 실제 재현성은 Dev Container, 런타임 버전 파일,
패키지 lockfile, CI처럼 기계가 검사할 수 있는 수단과 함께 확보한다.

## Skill 갱신

1. `.ai/skills/verify-before-done/SKILL.md`를 수정한다.
2. 다음 명령으로 설치 사본을 갱신한다.

   ```sh
   node scripts/verify-ai-config.mjs --sync-skills
   ```

3. diff를 읽고 다음 검사를 실행한다.

   ```sh
   node scripts/verify-ai-config.mjs
   ```

4. Claude, Gemini, Codex에서 Skill을 각각 한 번 호출해 실제 호환성을 확인한다.

사본 경로:

| 제품 | 사본 |
|---|---|
| Claude Code | `.claude/skills/verify-before-done/SKILL.md` |
| Gemini CLI + Codex | `.agents/skills/verify-before-done/SKILL.md` |

공용 Skill에는 세 제품 모두 이해하는 최소 frontmatter(`name`, `description`)와 Markdown 절차만 사용한다. 특정 제품의 tool allowlist, 셸 삽입, subagent 옵션이 필요하면 공용 원본을 변형하지 말고 별도 제품 전용 Skill을 다른 이름으로 만든다.

## 변경 검토

- 새 Skill이 기존 Skill과 겹치는 trigger를 가지지 않는가?
- 스크립트가 추가되었다면 Windows, macOS, Linux에서 경로를 안전하게 처리하는가?
- 외부 네트워크, 쓰기, 배포를 암묵적으로 승인하지 않는가?
- 비밀값이나 개인 절대 경로가 없는가?
- README와 `knowledge/`의 설명이 실제 설정과 일치하는가?
