---
name: verify-before-done
description: 구현, 버그 수정, 리팩터링 또는 AI 설정 변경에서 완료를 선언하기 전에 요구사항·테스트·diff·보안 증거를 확인할 때 사용한다.
---

# 완료 전 검증

1. 루트 `AGENTS.md`와 현재 작업에 적용되는 Spec Kit spec, plan, tasks를 확인한다.
2. 변경된 동작과 acceptance criteria를 연결한다.
3. 저장소가 문서화한 관련 테스트, lint, typecheck, build를 실행한다.
4. AI 설정 또는 Skill을 바꿨다면 `node scripts/verify-ai-config.mjs`를 실행한다.
5. `git status`와 diff를 읽어 범위 밖 변경, 생성물, 비밀값, 개인 경로가 없는지 확인한다.
6. 실행한 명령, 성공·실패 결과, 실행하지 못한 검증과 남은 위험을 보고한다.

검사를 실행하지 않았거나 실패했으면 “완료” 또는 “모두 통과”라고 표현하지 않는다. 실패를 무시하는 플래그, 테스트 삭제, 승인 우회로 통과 상태를 만들지 않는다.
