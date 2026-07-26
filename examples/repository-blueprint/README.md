# Gemini CLI · Claude Code · Codex 공용 저장소 청사진

이 디렉터리는 세 코딩 AI가 **같은 GitHub 저장소에서 같은 팀 규칙을 읽고, 서로 다른 작업 폴더에서 안전하게 협업**하도록 만드는 복사 가능한 예시입니다. 2026-07-26에 각 제품의 공식 문서를 기준으로 작성했습니다.

> 이 청사진에는 Spec Kit가 만든 것처럼 보이는 가짜 `.specify/` 또는 `specs/` 산출물이 없습니다. 아래의 공식 `specify` 명령을 실제로 실행했을 때만 해당 파일을 생성하고 커밋하세요.

## 1. 먼저 이해할 일곱 가지

| 구성 요소 | 이 저장소에서 맡는 역할 | 사람에게 비유 |
|---|---|---|
| `AGENTS.md` | 세 AI가 함께 지킬 짧고 지속적인 규칙의 단일 원본 | 팀 개발 규칙 |
| `CLAUDE.md`, `GEMINI.md` | 공용 원본을 불러오고 도구 차이만 덧붙이는 어댑터 | 번역용 표지 |
| `.claude/`, `.gemini/`, `.codex/` | 승인, 샌드박스, MCP 같은 실행 설정 | 출입 통제 장치 |
| Skill | 특정 종류의 일을 반복하는 절차 | 작업 체크리스트 |
| MCP | 문서, 이슈, 데이터베이스 같은 외부 시스템 연결 | 안전한 어댑터 |
| Spec Kit | 이번 변경의 요구사항, 계획, 작업 목록 | 공사 설계도 |
| `knowledge/`의 OKF | 여러 변경에 걸쳐 남길 아키텍처, 정책, 결정 | 팀 지식 도서관 |

핵심 원칙은 **규칙은 한 번만 쓰고, 도구별 파일에는 차이만 둔다**는 것입니다. 같은 문장을 세 곳에 복사하면 어느 한 곳만 수정되어 규칙이 갈라지기 쉽습니다.

## 2. 파일 구조

```text
.
├─ AGENTS.md                         # 공용 지침의 단일 원본
├─ CLAUDE.md                         # @AGENTS.md + Claude 전용 차이
├─ GEMINI.md                         # @./AGENTS.md + Gemini 전용 차이
├─ .ai/
│  ├─ README.md                      # 동기화와 소유권 설명
│  ├─ versions.md                    # 팀이 검증한 CLI·런타임 조합
│  └─ skills/verify-before-done/
│     └─ SKILL.md                    # 공용 Skill 원본
├─ .agents/skills/verify-before-done/
│  └─ SKILL.md                       # Codex + Gemini 설치 사본
├─ .claude/
│  ├─ settings.json                  # 공유·제한 중심 설정
│  └─ skills/verify-before-done/
│     └─ SKILL.md                    # Claude 설치 사본
├─ .gemini/
│  └─ settings.json                  # 공유·기본 승인 설정
├─ .codex/
│  └─ config.toml.example            # 검토 후 활성화할 Codex 설정
├─ .mcp.json.example                 # 비밀값 없는 프로젝트 MCP 예시
├─ knowledge/                        # OKF v0.2 지식 번들
├─ scripts/verify-ai-config.mjs      # Windows/macOS/Linux 공용 검사
└─ .gitignore
```

`.agents/skills/`는 Codex와 Gemini CLI가 함께 읽는 설치 경로입니다. Gemini용
`.gemini/skills/` 사본을 추가하면 같은 이름의 Skill을 중복 발견할 수 있으므로 만들지
않습니다. 원본 하나와 설치 사본 두 개는 검사 스크립트가 동일한지 확인합니다.

## 3. 처음 적용하기

### 3.1 준비

- Git, Node.js 18 이상, 사용할 코딩 AI CLI를 설치합니다.
- `.ai/versions.md`의 `프로젝트에서 결정` 항목을 채우고, 런타임 버전 파일·lockfile·CI로
  실제 버전을 고정합니다.
- 저장소를 복제한 직후에는 AI를 실행하기 전에 `CLAUDE.md`, `GEMINI.md`, `.claude/settings.json`, `.gemini/settings.json`, Skill 및 MCP 예시를 사람이 먼저 읽습니다.
- 인증 토큰은 파일에 쓰지 않고 운영체제 환경 변수나 조직의 비밀 저장소에 둡니다.

### 3.2 청사진 검사

저장소 루트에서 다음 명령을 실행합니다.

```sh
node scripts/verify-ai-config.mjs
```

Skill 공용 원본을 수정했다면 사본을 갱신한 뒤 다시 검사합니다.

```sh
node scripts/verify-ai-config.mjs --sync-skills
node scripts/verify-ai-config.mjs
```

첫 번째 명령은 `.ai/skills/verify-before-done/SKILL.md`를
`.agents/skills/`와 `.claude/skills/`의 두 설치 경로로 복사합니다. Gemini와 Codex는
첫 번째 사본을 공유합니다. 항상 diff를 검토한 뒤 커밋하세요.

### 3.3 도구별 시작

#### Claude Code

`CLAUDE.md`는 `@AGENTS.md`를 가져옵니다. `.claude/settings.json`은 외부 상태를 바꾸는 push, merge, release, deploy 명령에 매번 질문하도록 하고 비밀 파일 읽기를 거부합니다.

```sh
claude
```

실행 후 `/memory`에서 로딩된 지침을, `/permissions`에서 실제 권한 출처를 확인합니다. 개인 설정은 `.claude/settings.local.json`에 두며 이 파일은 커밋하지 않습니다.

#### Gemini CLI

`GEMINI.md`는 `@./AGENTS.md`를 가져옵니다. `.gemini/settings.json`의 `context.fileName`은 `GEMINI.md` 하나만 지정하여 `AGENTS.md`를 다시 직접 로딩하는 중복을 피합니다.

```sh
gemini
```

실행 후 `/memory show`로 합쳐진 지침을 확인합니다. 프로젝트 설정, Hook, MCP는 코드를 실행할 수 있으므로 사용자 설정 `~/.gemini/settings.json`에서 Folder Trust를 켜고, 첫 신뢰 대화상자에서 내용을 검토합니다. 이 저장소 설정에도 방어적 기본값이 있지만, 신뢰하기 전에는 프로젝트 설정이 무시될 수 있습니다.

```json
{
  "security": {
    "folderTrust": { "enabled": true }
  }
}
```

위 설정은 프로젝트 파일이 아니라 각 개발자의 사용자 설정에 둡니다. Folder Trust가
활성화된 상태에서 workspace가 untrusted이면 Gemini는 사용자 범위를 포함한 어떤 MCP
서버에도 연결을 시도하지 않습니다.

#### Codex

Codex는 루트 `AGENTS.md`를 자동으로 읽습니다. 프로젝트 설정은 의도치 않게 활성화하지 않도록 예시 파일로 둡니다. 팀이 검토한 뒤 다음처럼 실제 이름으로 복사하고 커밋할 수 있습니다.

```sh
node -e "require('node:fs').copyFileSync('.codex/config.toml.example','.codex/config.toml')"
codex
```

예시는 `workspace-write`, 요청 시 승인, 명령 네트워크 차단을 사용합니다. Codex는 신뢰한 프로젝트에서만 `.codex/config.toml` 계층을 로드합니다. `/status` 또는 해당 화면의 권한 표시에서 실제 적용 상태를 확인하세요.

## 4. 지침과 설정의 우선순위

플랫폼의 시스템·관리자 정책과 사용자의 현재 요청은 저장소 문서보다 우선합니다. 저장소 내부에서는 충돌을 만들지 않는 것이 가장 중요합니다.

| 도구 | 지침 로딩 핵심 | 설정 우선순위 핵심(높음 → 낮음) | 확인 방법 |
|---|---|---|---|
| Claude Code | 상위 디렉터리부터 현재 디렉터리까지 `CLAUDE.md`와 `CLAUDE.local.md`를 이어 붙이며, 같은 위치의 local이 뒤에 옴 | 관리 설정 → CLI 인수 → `.claude/settings.local.json` → `.claude/settings.json` → 사용자 설정 | `/memory`, `/permissions` |
| Gemini CLI | 사용자·작업공간 컨텍스트를 합치며, 접근한 하위 경로의 컨텍스트도 필요할 때 로드 | CLI/환경 오버라이드와 시스템 강제 설정이 프로젝트·사용자 설정보다 우선 | `/memory show`, `/settings` |
| Codex | 전역 파일 뒤에 저장소 루트부터 현재 디렉터리까지 `AGENTS.md`를 합치며 가까운 지침이 나중에 옴 | CLI → 가장 가까운 프로젝트 config → 프로필 → 사용자 → 시스템 → 기본값 | 새 세션에서 지침 요약 요청, `/status` |

Claude와 Gemini의 컨텍스트 파일은 일반적으로 “설정 키처럼 깔끔하게 덮어쓰기”보다 **이어 붙이기**에 가깝습니다. 서로 모순되는 규칙을 여러 파일에 쓰면 결과가 불안정해집니다. 이 청사진이 어댑터 파일을 짧게 유지하는 이유입니다.

Codex는 각 디렉터리에서 `AGENTS.override.md`를 `AGENTS.md`보다 먼저 선택할 수 있습니다. 임시 override가 남아 공용 원본을 가리지 않는지 점검하세요.

## 5. Skill을 공용으로 관리하기

Skill은 “항상 지킬 규칙”이 아니라 “특정 작업 때 불러올 절차”입니다.

| 대상 | 저장소 경로 | 개인 전역 경로 |
|---|---|---|
| Claude Code | `.claude/skills/<name>/SKILL.md` | `~/.claude/skills/<name>/SKILL.md` |
| Gemini CLI | `.agents/skills/<name>/SKILL.md` | `~/.gemini/skills/` 또는 `~/.agents/skills/` |
| Codex | `.agents/skills/<name>/SKILL.md` | `~/.agents/skills/<name>/SKILL.md` |

공용 Skill 작성 순서:

1. `.ai/skills/<name>/SKILL.md`만 편집합니다.
2. `name`과 구체적인 `description`을 YAML frontmatter에 둡니다.
3. 자동 실행, 도구 권한, 셸 삽입처럼 특정 제품만 아는 필드는 공용 Skill에 넣지 않습니다.
4. `node scripts/verify-ai-config.mjs --sync-skills`로 사본을 갱신합니다.
5. 세 CLI에서 Skill 목록을 확인하고 대표 작업으로 시험합니다.

Claude는 `/verify-before-done`, Gemini는 `/skills list`, Codex는 `/skills` 또는 `$verify-before-done` 방식으로 발견 여부를 확인할 수 있습니다. 버전에 따라 표시 UI가 달라질 수 있으므로 CLI 자체 목록을 최종 기준으로 삼습니다.

외부 Skill에는 실행 스크립트가 포함될 수 있습니다. 설치 전에 `SKILL.md`, `scripts/`, 참조 파일을 모두 검토하고 커밋 SHA나 버전을 고정하세요.

## 6. MCP를 같은 의도로 연결하기

MCP 설정 문법은 공통 표준이 아니라 각 호스트의 어댑터입니다.

| 도구 | 프로젝트 설정 위치 | 이 예시의 상태 |
|---|---|---|
| Claude Code | 루트 `.mcp.json` | `.mcp.json.example`만 제공, 비활성 |
| Gemini CLI | `.gemini/settings.json`의 `mcpServers` | 서버 정의는 있으나 `mcp.excluded`로 비활성 |
| Codex | `.codex/config.toml`의 `[mcp_servers.<name>]` | 예시에서 `enabled = false` |

세 예시는 인증 정보가 필요 없는 OpenAI Developer Docs MCP 주소를 사용합니다. 활성화 절차:

1. 서버 운영 주체, URL, 제공 도구, 읽기/쓰기 여부를 검토합니다.
2. Claude는 `.mcp.json.example`을 `.mcp.json`으로 복사합니다.
3. Gemini는 `mcp.excluded`에서 서버 이름을 제거합니다.
4. Codex는 활성 config에서 해당 서버의 `enabled = true`로 바꿉니다.
5. 각 CLI의 MCP 목록에서 실제 도구 스키마를 확인합니다.
6. 쓰기 도구는 최소 allowlist와 승인 규칙을 추가하기 전까지 사용하지 않습니다.

토큰이 필요한 서버는 다음 원칙을 따릅니다.

```json
{
  "env": {
    "SERVICE_TOKEN": "${SERVICE_TOKEN}"
  }
}
```

위 예시는 **값이 아니라 변수 이름만** 공유하는 패턴입니다. 실제 토큰, OAuth 캐시, 개인 경로는 커밋하지 않습니다. MCP 응답과 원격 문서도 신뢰할 수 없는 입력으로 취급합니다.

## 7. Plugin 또는 Extension은 언제 쓰나

이 저장소에만 필요한 규칙과 Skill은 지금 구조가 가장 단순합니다. 여러 저장소나 조직에 버전이 있는 묶음으로 배포할 때 Plugin/Extension으로 승격합니다.

| 제품 | 배포 단위 | 최소 핵심 |
|---|---|---|
| Claude Code | Plugin | `.claude-plugin/plugin.json`과 루트 `skills/`, 필요 시 `.mcp.json`·hooks |
| Gemini CLI | Extension | `gemini-extension.json`과 context, commands, skills, MCP, hooks |
| Codex | Plugin | `.codex-plugin/plugin.json`과 `skills/`, 필요 시 등록된/bundled MCP |

공통적인 안전 절차는 같습니다.

1. 저장소 안에서 Skill만 먼저 시험합니다.
2. 패키지의 manifest, 스크립트, MCP 도구, Hook, 권한 확대를 사람이 검토합니다.
3. 버전을 고정하고 작은 사용자 그룹에서 설치합니다.
4. 새 세션에서 동작을 검증합니다.
5. 배포·push 도구는 기본 비활성 또는 매번 승인으로 둡니다.

제품별 패키징 형식은 서로 호환되지 않습니다. **공용 Skill 원본과 정책 의미**를 공유하고, manifest는 제품별로 생성하는 것이 안전합니다.

## 8. Spec Kit를 실제로 설치하기

Spec Kit는 이 청사진에 미리 생성해 두지 않았습니다. 설치 전 변경을 커밋하거나 백업하고, 설치된 CLI의 기능을 확인합니다.

```sh
specify version
specify integration list
```

현재 저장소에 첫 통합을 초기화합니다. 아래는 Claude를 기본 통합으로 삼는 예입니다.

```sh
specify init --here --integration claude
```

비어 있지 않은 저장소에서 CLI가 병합 확인을 요구할 수 있습니다. `--force`는 기존 파일과의 충돌 및 diff를 검토하고 백업한 뒤에만 사용하세요.

그다음 같은 프로젝트에 나머지 통합을 설치합니다.

```sh
specify integration install codex
specify integration install gemini
specify integration status
```

Spec Kit의 현재 공식 통합 표에서 `claude`, `codex`, `gemini`는 multi-install safe로 선언되어 있습니다. 그래도 설치 전후 diff를 검토해야 합니다. 설치가 안전하지 않다고 표시되면 무조건 `--force`를 붙이지 말고 CLI 버전과 `specify integration status`를 먼저 확인하세요. 제어된 multi-install은 Spec Kit 0.8.5부터 제공됩니다.

정확한 생성 위치를 구분하세요.

- `specify init`가 `.specify/`의 공용 스크립트, 템플릿, constitution 기반 구조와 통합 manifest를 생성합니다.
- `/speckit.specify` 또는 해당 Skill이 저장소 루트의 `specs/<feature>/` 아래에 실제 feature spec을 생성합니다.
- 표준 경로는 `.specify/specs/`가 아닙니다. `.specify/`와 `specs/`는 서로 다른 형제 디렉터리입니다.
- 이 청사진의 `knowledge/`는 Spec Kit 산출물이 아니며 Spec Kit가 자동 관리하지 않습니다.

권장 흐름:

1. `/speckit.constitution`으로 팀 원칙을 정합니다.
2. `/speckit.specify`로 무엇을 왜 만드는지 적습니다.
3. `/speckit.clarify`로 모호함을 줄입니다.
4. `/speckit.plan`으로 기술 계획을 만듭니다.
5. `/speckit.tasks`로 검증 가능한 작업을 나눕니다.
6. `/speckit.analyze`로 산출물 일관성을 검사합니다.
7. 한 worktree에서 한 AI가 할당된 작업만 구현합니다.
8. `verify-before-done` Skill과 CI로 검증합니다.

Codex 통합은 현재 skills 방식이므로 명령이 `$speckit-constitution`, `$speckit-specify`처럼 보일 수 있습니다. Claude와 Gemini 통합은 `/speckit...` 형태를 사용할 수 있습니다. 생성된 통합 파일과 해당 CLI의 목록이 실제 호출 이름의 기준입니다.

Spec Kit를 업그레이드한 뒤에는 init을 반복하기보다 먼저 manifest-aware 명령을 사용합니다.

```sh
specify self check
specify self upgrade --tag vX.Y.Z
specify version
specify integration status
specify integration upgrade claude
specify integration upgrade codex
specify integration upgrade gemini
```

`self check`는 업데이트를 설치하지 않습니다. 목표 release tag로 CLI를 먼저 올린 뒤
integration 템플릿을 갱신하고 diff를 검토합니다.

## 9. OKF v0.2 지식 관리

사용자 요청의 “Google OFK”는 공식 명칭상 **OKF(Open Knowledge Format)**로 해석했습니다. OKF는 Markdown과 YAML frontmatter로 장기 지식을 교환하는 형식이지, AI 지침·Skill·Plugin 실행 규격은 아닙니다.

이 예시의 `knowledge/`는 다음 원칙을 사용합니다.

- 루트 `index.md`만 `okf_version: "0.2"`를 가집니다.
- 일반 concept 문서는 최소 `type`을 가집니다.
- `generated`, `sources`, `status`, `stale_after`로 출처와 신선도를 표현합니다.
- 사람 검토가 끝나기 전에는 `verified`를 꾸며 넣지 않습니다.
- `log.md`는 ISO 날짜 제목을 사용하고 최신 항목을 위에 둡니다.
- 아키텍처, 정책, ADR처럼 여러 feature에 재사용할 지식만 넣습니다.
- 이번 feature의 요구사항과 할 일은 `specs/`에 두며 `knowledge/`에 복제하지 않습니다.

`verified`는 신뢰 신호일 뿐 접근 권한이나 보안 통제가 아닙니다. 실제 통제는 CLI 설정, 샌드박스, 승인, Hook, CI, 브랜치 보호로 시행합니다.

## 10. 같은 저장소에서 동시에 일하는 방법

세 AI가 같은 디렉터리를 동시에 고치면 변경을 덮어쓸 수 있습니다. **이슈 하나당 브랜치 하나, AI 작업 하나당 Git worktree 하나**를 사용합니다.

```text
main checkout          → 사람이 통합·리뷰
worktree claude-123    → ai/claude/issue-123
worktree gemini-124    → ai/gemini/issue-124
worktree codex-125     → ai/codex/issue-125
```

worktree 생성, 원격 fetch, push는 저장소 권한을 가진 사람이 수행합니다. 각 AI에는 다음 정보를 함께 줍니다.

- 이슈/Spec Kit task 번호
- 수정 가능한 경로
- 수정하면 안 되는 경로
- 완료 조건과 실행할 테스트
- 기준 브랜치와 다른 AI가 담당한 경계

두 작업이 같은 파일을 수정해야 하면 병렬 실행하지 말고 순서를 정합니다. 합칠 때는 각 PR에서 spec, 코드, 테스트, 필요한 OKF 변경을 함께 검토합니다.

## 11. 완료 전 체크리스트

- [ ] 직접 요청과 활성 Spec Kit 산출물의 범위를 만족했다.
- [ ] 관련 테스트, lint, 타입 검사, 빌드를 실행하고 결과를 기록했다.
- [ ] `git diff`에 의도하지 않은 파일, 생성물, 비밀값이 없다.
- [ ] `node scripts/verify-ai-config.mjs`가 통과한다.
- [ ] 공용 Skill 사본이 원본과 같다.
- [ ] 장기 지식이 바뀌었다면 OKF source와 `stale_after`를 갱신했다.
- [ ] push, merge, release, deploy는 사람이 명시적으로 승인하기 전까지 실행하지 않았다.

## 12. 공식 자료

- [GitHub Spec Kit](https://github.com/github/spec-kit)
- [Spec Kit integrations와 multi-install](https://github.com/github/spec-kit/blob/main/docs/reference/integrations.md)
- [Spec Kit core commands](https://github.github.com/spec-kit/reference/core.html)
- [Google Cloud OKF v0.2 사양](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)
- [Gemini CLI의 GEMINI.md](https://geminicli.com/docs/cli/gemini-md/)
- [Gemini CLI 설정](https://geminicli.com/docs/get-started/configuration-v1/)
- [Gemini CLI Skills](https://geminicli.com/docs/cli/using-agent-skills/)
- [Gemini CLI MCP](https://geminicli.com/docs/tools/mcp-server/)
- [Claude Code의 프로젝트 메모리와 AGENTS.md import](https://code.claude.com/docs/en/memory)
- [Claude Code 설정](https://code.claude.com/docs/en/settings)
- [Claude Code Skills](https://code.claude.com/docs/en/skills)
- [Claude Code MCP](https://code.claude.com/docs/en/mcp)
- [Codex AGENTS.md 안내](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
- [Codex config 기본](https://learn.chatgpt.com/docs/config-file/config-basic)
- [Codex MCP](https://learn.chatgpt.com/docs/extend/mcp)

제품은 빠르게 바뀝니다. 새 저장소에 적용할 때에는 위 공식 문서와 설치된 CLI의 `version`, 도움말, schema를 다시 확인하세요.
