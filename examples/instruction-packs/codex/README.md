# Codex 지침 팩

## 폴더별로 무엇을 넣나

| 범위 | 대상 폴더와 파일 | 넣을 내용 | Git |
|---|---|---|---|
| 전역 | `~/.codex/AGENTS.md` | 선호 언어, 작업 전 확인, 개인 검증·보고 방식 | 공유하지 않음 |
| 프로젝트 | `repo/AGENTS.md` | 5계층 공통 계약, Spec Kit·OKF, 실제 검사 명령, 보안·완료 조건 | 커밋 |
| 하위 경로 | `repo/<component>/AGENTS.md` | 해당 폴더 수정 경계, 추가 검사, spec·ADR 링크 | 팀 규칙이면 커밋 |

전역 파일에는 프로젝트 고유 명령을 넣지 않고, 하위 파일에는 루트 규칙을 복제하거나
약화하는 내용을 넣지 않습니다. `AGENTS.override.md`는 같은 디렉터리의 `AGENTS.md`를
대체하므로 의도적인 긴급 override가 아니면 사용하지 않습니다.

## 설치

1. `global/AGENTS.md`를 `~/.codex/AGENTS.md`로 복사합니다.
2. 함께 들어 있는 `shared/AGENTS.md`를 저장소 루트의 `AGENTS.md`로 복사하고 프로젝트
   명령을 채웁니다.
3. 특정 하위 폴더에만 규칙이 필요할 때 `local/component/AGENTS.md`를 그 폴더에 복사합니다.
4. 새 세션에서 로딩된 지침 파일과 순서를 물어 실제 적용 상태를 확인합니다.

Codex는 전역 파일 뒤에 저장소 루트부터 현재 작업 폴더까지 발견한 `AGENTS.md`를
결합합니다. 같은 디렉터리의 `AGENTS.override.md`는 `AGENTS.md`를 대체하므로, 일상적인
개인 메모 용도로 사용하면 공용 규칙을 가릴 수 있습니다. 이 팩은 안전한 기본값으로 중첩
`AGENTS.md`를 사용합니다.

설정과 지침은 별개입니다. 개인 설정은 `~/.codex/config.toml`, 신뢰한 저장소의 프로젝트
설정은 `.codex/config.toml`에 두고, 승인·샌드박스·네트워크 제한은 설정과 CI로 시행하세요.
