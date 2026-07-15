# 🚇 LocalHub — 서울 지역 정보 공유 커뮤니티

서울의 관광지·문화시설·축제·쇼핑·숙박·레포츠 정보를 한곳에 모으고, 회원가입 없이 자유롭게 묻고 나누는 **익명 지역 커뮤니티**예요.

별도 백엔드 서버 없이 **Vue.js 3 + Vite** 기반 프론트엔드 단일 구조(SPA)로 동작하며, 데이터는 브라우저의 `localStorage`에 저장돼요.

---

## 📸 어떤 서비스인가요

| 화면 | 설명 |
|------|------|
| **홈** | 서울 지하철 노선도 컨셉의 스플래시 배너 + 오늘 날씨 + 카테고리별(관광지/축제/문화시설) 인기 장소 미리보기 |
| **관광정보** | 7개 카테고리(관광지·문화시설·축제·쇼핑·숙박·레포츠·여행코스)를 구(區)별·검색어로 필터링해 둘러보는 페이지 |
| **관광지 상세** | 장소별 주소·전화번호 등 상세 정보, 사진 클릭 시 VisitKorea로 이동 |
| **테마여행** | 관심 테마(역사·문화 / 자연·힐링 / 축제 / 쇼핑 / 1박2일)를 고르면 JSON 데이터 기반으로 코스를 즉시 생성. "AI에게 다듬어달라기" 버튼으로 챗봇 연계도 가능 |
| **동네방네** (게시판) | 회원가입 없는 익명 게시판. 작성·조회·수정·삭제 + 검색·조회수·좋아요·북마크 |
| **챗봇** | 우측 하단 플로팅 버튼. 서울 데이터 기반으로 자연어 질의응답 |

전체적으로 **서울시 공식 심벌마크 컬러**(빨강 #C2001F · 초록 #308027 · 파랑 #2872B3)를 반영한 따뜻한 톤의 라이트 테마로 디자인되어 있어요.

---

## ▶️ 실행 방법

### 1. 폴더 준비

압축을 풀면 아래처럼 폴더 구조가 나와야 해요. **`package.json`이 최상위에 바로 보이는지 먼저 확인**하세요 (압축을 두 번 풀거나 폴더 안에 폴더가 중첩되는 경우가 종종 있어요).

```
localhub/
├── package.json   ← 이 파일이 폴더 열자마자 바로 보여야 정상
├── src/
├── public/
└── ...
```

터미널에서 확인하려면:
```bash
find . -name "package.json"
```
결과로 나온 경로가 있는 폴더로 이동한 뒤 아래 단계를 진행하세요.

### 2. 패키지 설치

```bash
cd localhub
npm install
```

### 3. 환경변수 설정 (챗봇 사용에 필요)

```bash
cp .env.example .env
```

`.env` 파일을 열어서 아래처럼 실제 발급받은 **OpenAI API 키**를 입력하세요.

```
VITE_OPENAI_API_KEY=sk-여기에-실제-키-입력
```

> ⚠️ 반드시 **사용량 제한이 걸린 키**를 쓰고 결제 한도를 낮게 설정하세요. 이 프로젝트는 백엔드가 없어서 키가 브라우저 코드에 그대로 노출돼요.

### 4. 개발 서버 실행

```bash
npm run dev
```

터미널에 뜨는 주소(예: `http://localhost:5173`)를 브라우저로 열면 바로 확인할 수 있어요.

### 5. 배포용 빌드 (Netlify에 올릴 때)

```bash
npm run build
```

`dist/` 폴더가 생성돼요. Netlify에 올릴 때는 대시보드의 **Environment Variables**에도 `VITE_OPENAI_API_KEY`를 반드시 별도 등록해야 해요. 로컬 `.env`는 배포 서버에 자동으로 올라가지 않아요.

---

## 📁 폴더 구조

```
data/                RFP가 제공한 5개 권역 원본 데이터 (서울·부산·대전충청·구미경북·광주전라)
                     각 권역 SCHEMA.md/SOURCE.md 포함 — 참고·백업용, 앱이 직접 읽지는 않음
public/data/         data/서울/*.json을 복사해온 것 — 실제로 앱이 fetch()하는 경로
                     (Vite는 public/ 아래 파일만 런타임에 정적 URL로 서빙하기 때문)

src/
├── views/           화면 8개
│   ├── HomeView.vue           홈
│   ├── TourInfoView.vue       관광정보 (필터·검색·페이지네이션)
│   ├── PlaceDetailView.vue    관광지 상세
│   ├── TripPlanView.vue       테마여행 코스 생성
│   ├── BoardListView.vue      동네방네 목록
│   ├── BoardDetailView.vue    동네방네 상세
│   ├── BoardWriteView.vue     글쓰기
│   └── BoardEditView.vue      글수정
│
├── components/
│   ├── NavBar.vue        상단 메뉴바 (홈/관광정보/테마여행/동네방네 + 지역 표시)
│   ├── SplashHero.vue    홈 화면 스플래시 배너 (지하철 노선도 컨셉)
│   ├── ChatBot.vue       플로팅 챗봇 위젯
│   ├── WeatherWidget.vue 날씨 위젯
│   └── PlaceCard.vue     장소 카드 (홈·관광정보 공용)
│
├── composables/     비즈니스 로직 (화면과 분리되어 있어 재사용·테스트 쉬움)
│   ├── usePosts.js         게시글 CRUD + 검색·조회수·좋아요·북마크
│   ├── usePlaceData.js     JSON 데이터 로드·필터·검색·상세조회
│   ├── useChatbot.js       OpenAI API 연동 (모듈 싱글턴 — 어느 화면에서 호출해도 대화 히스토리 공유)
│   ├── useChatbotPanel.js  챗봇 위젯 열림/닫힘 상태 공유
│   ├── useWeather.js       Open-Meteo API 연동
│   └── useTripPlanner.js   테마별 코스 생성 로직 (API 호출 없이 JSON만으로 즉시 생성)
│
└── utils/
    └── weatherCode.js  날씨코드 → 아이콘/여행적합도 매핑
```

⚠️ 다른 권역(부산/대전충청/구미경북/광주전라)으로 확장하려면 해당 권역 JSON도 `public/data/`에 복사하고 `usePlaceData.js`의 `CATEGORY_FILES` 경로를 수정해야 해요.

---

## ✅ 구현된 기능

**필수**
- 서울 7개 카테고리 JSON 데이터 프론트엔드 연동
- 게시판(동네방네) CRUD — 작성/목록/상세/수정/삭제, 수정용 비밀번호 확인
- OpenAI 기반 챗봇 — 대화 히스토리 유지, 모바일 전체화면 대응

**선택**
- 게시글 검색(제목·내용) / 조회수 / 좋아요 / 북마크
- 날씨 정보 연동 (Open-Meteo, 여행 적합 여부 표시)
- 관광정보 상세 페이지 + VisitKorea 연계
- 테마별 여행 코스 생성 (JSON 기반 + AI 다듬기)

---

## 🛠 기술 스택

- **프레임워크**: Vue.js 3 (Composition API, `<script setup>`) + Vite
- **라우팅**: Vue Router 4
- **데이터 저장**: 브라우저 `localStorage` (백엔드 없음)
- **외부 API**: OpenAI Chat Completions API (챗봇), Open-Meteo (날씨, 키 불필요)
- **배포**: Netlify

---

## 📊 데이터 출처 및 라이선스

- 관광 데이터: 한국관광공사 Tour API(TourAPI 4.0), 공공누리 제3유형(출처 표시, 변경 금지)
  https://www.data.go.kr/data/15101578/openapi.do
- 날씨 데이터: Open-Meteo (비상업적 이용, API 키 불필요) — https://open-meteo.com

---

## ⚠️ 알아두면 좋은 것들

- `.env` 파일은 절대 커밋하지 마세요 (`.gitignore`에 이미 등록되어 있어요).
- 게시글 비밀번호는 교육 목적으로 **평문 저장**됩니다 (RFP 요구사항에 따른 의도된 설계이며 실제 서비스에는 부적합해요).
- `localStorage` 특성상 게시글은 **작성한 브라우저(기기)에만** 저장되고 다른 사용자·다른 기기와 공유되지 않아요. (팀원마다 각자 브라우저에 다른 게시글이 쌓여요 — 병합 시 참고!)
- 챗봇은 매 대화마다 카테고리별 상위 30건 요약본을 함께 전송해요. 전체 JSON(특히 쇼핑 4,368건)을 통째로 넘기면 토큰이 초과되기 때문이에요.

---

## 🩹 자주 발생하는 문제

**`npm install` 시 `package.json`을 못 찾는다는 에러가 나요**
→ 압축을 두 번 풀었거나 폴더 안에 폴더가 중첩된 경우예요. `find . -name "package.json"`으로 실제 위치를 찾아 그 폴더로 이동한 뒤 다시 시도하세요.

**챗봇이 응답하지 않아요**
→ `.env` 파일에 `VITE_OPENAI_API_KEY`가 제대로 입력됐는지, 그리고 `.env` 수정 후 개발 서버를 껐다 다시 켰는지(`npm run dev` 재시작) 확인하세요. Vite는 `.env` 변경을 자동으로 감지하지 못할 때가 있어요.

**날씨가 안 떠요**
→ Open-Meteo는 키가 필요 없어서 대부분 바로 되지만, 회사·학교 네트워크 방화벽이 외부 API 호출을 막는 경우가 있어요. 브라우저 개발자도구(F12) → Network 탭에서 `api.open-meteo.com` 요청이 실패하는지 확인해보세요.

**Netlify에 배포했는데 챗봇이 안 돼요**
→ 로컬 `.env`는 배포 서버에 자동으로 올라가지 않아요. Netlify 대시보드 → Site settings → Environment variables에 `VITE_OPENAI_API_KEY`를 별도로 등록하고 재배포하세요.
