# Gemini CLI 지침 팩

## 설치

1. `global/GEMINI.md`를 `~/.gemini/GEMINI.md`로 복사합니다.
2. 함께 들어 있는 `shared/AGENTS.md`를 저장소 루트의 `AGENTS.md`로 복사하고,
   `project/GEMINI.md`도 루트에 복사합니다.
3. 특정 하위 폴더에만 규칙이 필요하면 `local/component/GEMINI.md`를 그 폴더에 둡니다.
4. `/memory show`로 결합된 문맥을 확인하고, 변경 후에는 `/memory reload`를 실행합니다.

Gemini CLI의 “로컬” 예시는 개인 비공개 파일이 아니라, 도구가 해당 경로에 접근할 때
JIT로 로드되는 하위 폴더 지침입니다. 개인 기본값은 전역 파일에 두고, 기기별 값과 비밀은
지침 파일이 아닌 안전한 사용자 설정·환경 변수에 둡니다.

프로젝트 `GEMINI.md`가 `@./AGENTS.md`를 가져오므로 `context.fileName`에 두 파일을 함께
등록하지 마세요. 동일한 공용 규칙이 중복 로드될 수 있습니다. Workspace 설정은 신뢰한
폴더에서만 활성화하고 승인·샌드박스는 `.gemini/settings.json`과 CI로 시행하세요.
