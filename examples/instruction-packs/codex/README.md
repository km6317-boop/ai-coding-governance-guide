# Codex 지침 팩

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
