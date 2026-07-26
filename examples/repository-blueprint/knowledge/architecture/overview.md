---
type: Architecture Overview
title: Multi-agent repository architecture
description: Gemini CLI, Claude Code, Codex가 한 저장소의 규칙과 지식을 공유하면서 작업을 격리하는 구조.
tags: [ai-agents, repository, spec-kit, okf]
status: draft
generated:
  by: process:repository-blueprint
  at: 2026-07-26T00:00:00Z
stale_after: 2026-10-26
sources:
  - id: common-instructions
    resource: ../../AGENTS.md
    title: Repository working agreement
  - id: ai-asset-map
    resource: ../../.ai/README.md
    title: Shared AI asset management
  - id: spec-kit-docs
    resource: https://github.com/github/spec-kit/blob/main/docs/reference/integrations.md
    title: Spec Kit integrations
  - id: okf-spec
    resource: https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md
    title: Open Knowledge Format v0.2
---

# Context

세 코딩 AI는 지침 파일 이름, 설정 문법, Skill 위치가 서로 다르다. 같은 규칙을 각 제품 파일에 복제하면 수정 시점이 달라지고 모순이 생긴다. 또한 같은 checkout을 동시에 수정하면 파일을 덮어쓸 수 있다.

# Architecture

```text
사용자 요청
    │
    ├─ AGENTS.md ─────────────── 공용·지속 규칙
    │   ├─ CLAUDE.md import ──── Claude 전용 차이
    │   ├─ GEMINI.md import ──── Gemini 전용 차이
    │   └─ Codex 자동 탐색 ───── 추가 어댑터 불필요
    │
    ├─ specs/<feature>/ ───────── 현재 변경의 spec·plan·tasks
    ├─ knowledge/ ─────────────── 장기 아키텍처·정책·결정
    └─ .ai/skills/ ────────────── 공용 절차 원본
        ├─ .claude/skills/
        └─ .agents/skills/ ────── Gemini + Codex 공용 설치 사본
```

`AGENTS.md`는 모든 도구가 공유할 수 있는 검증 가능한 규칙만 가진다.[^common-instructions] `.ai/`는 제품이 자동 실행하는 곳이 아니라 복제본의 소유권을 명확히 하는 관리 원본이다.[^ai-asset-map]

Spec Kit는 feature 단위의 의도와 구현 순서를 관리하고, OKF는 feature가 끝난 뒤에도 유지할 지식의 출처·신뢰·신선도를 표현한다.[^spec-kit-docs][^okf-spec] 어느 것도 CLI의 권한 제어를 대신하지 않는다.

# Isolation and integration

- 작업 하나마다 별도 branch와 Git worktree를 사용한다.
- 한 worktree에는 한 AI만 쓰기 작업을 한다.
- 공용 파일의 소유권이 겹치면 순차 작업으로 전환한다.
- PR에서 spec, 코드, 테스트, 필요한 OKF 변경을 함께 검토한다.
- push, merge, release, deploy는 사람의 명시적 승인 단계로 남긴다.

# Change rules

- 공용 행동 규칙은 `AGENTS.md`에서만 바꾼다.
- 제품별 로딩 또는 권한 차이는 해당 어댑터/설정에서 바꾼다.
- Skill은 `.ai/skills/` 원본을 바꾸고 검사 스크립트로 사본을 동기화한다.
- 현재 feature의 세부사항은 OKF에 복제하지 않는다.
- 이 구조를 바꾸는 결정은 새 ADR로 기록한다.

[^common-instructions]: Repository working agreement
[^ai-asset-map]: Shared AI asset management
[^spec-kit-docs]: Spec Kit integrations
[^okf-spec]: Open Knowledge Format v0.2
