# Scope Guard — Figma 변경 범위 추적 플러그인

기획팀이 Hotfix로 시작한 수정이 본인도 모르게 범위를 넘어서는 순간을 감지하고,  
개발팀·QA팀과의 혼선을 사전에 방지합니다.

---

## 왜 만들었나

기획팀과 개발팀이 Figma를 함께 운영할 때 반복되는 문제가 있습니다.

- 버튼 하나 고치러 들어갔다가 WIP 화면까지 반영되어 전체 플로우가 바뀜
- 변경 범위가 얼마나 큰지 개발팀에 사전 공유가 안 됨
- Figma 수정 후 Teams 공지가 누락됨

Scope Guard는 이 세 가지 문제를 하나의 플러그인으로 지원합니다.

---

## 주요 기능

| 기능 | 설명 |
|---|---|
| 작업 종류 선택 | Hotfix / 버전 업데이트 중 선택하고 시작 |
| 실시간 변경 추적 | 변경된 최상위 화면(프레임) 수, 컴포넌트 인스턴스 수를 실시간 집계 |
| 임계값 초과 알림 | 설정 임계값 초과 시 소프트 알림 표시 (기본: 화면 2개, 컴포넌트 5개) |
| [확정] 페이지 감지 | 페이지 이름이 [확정]으로 바뀔 때 배너 알림 |
| 공지 텍스트 자동 생성 | 변경 화면 목록이 포함된 Teams/Slack 공지 포맷 자동 완성 + 클립보드 복사 |
| 임계값 설정 | 팀 상황에 맞게 임계값을 설정 화면에서 직접 조정 가능 (영구 저장) |

---

## 사용 방법

### 기본 흐름

1. Figma 파일을 열고 플러그인 실행
2. **Hotfix** 또는 **버전 업데이트** 선택
3. Figma에서 수정 작업 진행
4. 화면/컴포넌트 변경이 임계값을 넘으면 주황색 알림 배너 표시
5. 작업 완료 후 **공지 생성** 버튼 클릭 → Teams/Slack에 붙여넣기
6. 다음 작업 시작 전 **세션 초기화**

### 공지 포맷 예시

**Hotfix 완료 시:**
```
[Hotfix] 변경 완료

변경 화면 (1개):
• 로그인 화면

영향 범위: 위 화면만

반영 시각: 2026. 4. 3. 오전 10:30
```

**버전 업데이트 완료 시:**
```
[버전 업데이트] 변경 완료 — 개발팀 확인 필요

변경 화면 (3개):
• 로그인 화면
• 메인 화면
• 설정 화면

변경 컴포넌트 (6개):
• Button/Primary
• Input/Text
...

⚠ 영향 범위: 확인 필요. 개발팀 리드에게 공유 예정

반영 시각: 2026. 4. 3. 오전 10:30
```

---

## 설정

플러그인 우측 상단 ⚙ 아이콘 → 설정 화면

| 항목 | 기본값 | 설명 |
|---|---|---|
| 화면 임계값 | 2개 | 최상위 프레임 변경 수 기준 |
| 컴포넌트 임계값 | 5개 | 컴포넌트 인스턴스 변경 수 기준 |

설정값은 `figma.clientStorage`에 저장되어 플러그인을 닫아도 유지됩니다.

---

## 개발 환경 설정

### 사전 요구사항

- [Node.js](https://nodejs.org/en/download/) 18 이상

### 설치 및 실행

```bash
cd figma_management
npm install
npm run build
```

watch 모드 (수정 시 자동 빌드):

```bash
npm run watch
```

### Figma에 로드

1. Figma 데스크탑 앱 → **Plugins → Development → Import plugin from manifest**
2. `figma_management/manifest.json` 선택

### 파일 구조

```
figma_management/
├── code.ts        # 플러그인 로직 소스 (수정은 여기서)
├── code.js        # 빌드 결과물 (Figma가 실행하는 파일, 직접 수정 금지)
├── ui.html        # 플러그인 UI
├── manifest.json  # 플러그인 메타정보
├── tsconfig.json  # TypeScript 설정 (target: es2017)
└── package.json
```

> `code.ts`를 수정한 후 반드시 `npm run build`를 실행해야 변경사항이 반영됩니다.

---

## 팀 배포

**Organization/Team 플러그인으로 배포 (권장):**

1. Figma 데스크탑 앱 → **Plugins → Manage plugins → Publish**
2. "Publish to your organization/team" 선택
3. 이름·설명 입력 후 Publish
4. 팀원은 **Plugins → Your organization** 탭에서 설치

업데이트 시 Publish를 다시 누르면 팀원에게 자동 반영됩니다.

---

## 기술 참고

- Figma Plugin API `documentchange` 이벤트 사용
- `documentAccess: "dynamic-page"` 모드이므로 핸들러 등록 전 `figma.loadAllPagesAsync()` 필수 호출
- TypeScript target `es2017` — Figma sandbox(QuickJS)의 ES2017 제한 대응
- 설정값 영구 저장: `figma.clientStorage`
