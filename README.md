# LocalHub — 서울 지역 정보 공유 커뮤니티

공공데이터 기반 지역 정보 공유 익명 커뮤니티 (서울 권역). Vue.js 3 + Vite 기반 SPA, 별도 백엔드 없이 localStorage로 동작합니다.

## 시작하기

```bash
npm install
cp .env.example .env   # .env 파일 생성 후 OpenAI API 키 입력
npm run dev
```

`.env` 파일을 열어 `VITE_OPENAI_API_KEY`에 실제 발급받은 키를 넣어주세요.

## 빌드 & 배포

```bash
npm run build   # dist/ 폴더 생성
```

Netlify에 배포할 때는 **Environment Variables**에 `VITE_OPENAI_API_KEY`를 반드시 별도 등록해야 합니다. 로컬 `.env`는 배포 서버에 자동으로 올라가지 않습니다.

## 폴더 구조

```
data/                RFP가 제공한 5개 권역 원본 데이터 (서울·부산·대전충청·구미경북·광주전라)
                     각 권역 SCHEMA.md/SOURCE.md 포함 — 참고·백업용, 앱이 직접 읽지는 않음
public/data/         data/서울/*.json을 복사해온 것 — 실제로 앱이 fetch()하는 경로
                     (Vite는 public/ 아래 파일만 런타임에 정적 URL로 서빙하기 때문)
src/views/           화면 5개 (홈/게시판목록/상세/작성/수정)
src/components/      ChatBot(챗봇 위젯), WeatherWidget(날씨), PlaceCard(장소 카드)
src/composables/     usePosts(게시판 CRUD+검색+조회수+좋아요+북마크), usePlaceData(JSON 로드+검색),
                      useChatbot(OpenAI 연동), useWeather(Open-Meteo 연동)
src/utils/           weatherCode.js (날씨코드→아이콘/여행적합도 매핑)
```

⚠️ 다른 권역(부산/대전충청/구미경북/광주전라)으로 확장하려면 해당 권역 JSON도 `public/data/`에 복사하고 `usePlaceData.js`의 `CATEGORY_FILES` 경로를 수정해야 합니다.

## 구현된 기능

**필수**
- 서울 7개 카테고리 JSON 데이터 프론트엔드 연동
- 게시판 CRUD (작성/목록/상세/수정/삭제), 수정용 비밀번호 확인
- OpenAI 기반 챗봇 (대화 히스토리 유지, 모바일 전체화면 대응)

**선택 (커뮤니티 게시판 추가기능)**
- 게시글 검색(제목·내용)
- 조회수 표시
- 좋아요
- 북마크
- 날씨 정보 연동 (Open-Meteo, 여행 적합 여부 표시)

## 데이터 출처 및 라이선스

- 관광 데이터: 한국관광공사 Tour API(TourAPI 4.0), 공공누리 제3유형(출처 표시, 변경 금지), https://www.data.go.kr/data/15101578/openapi.do
- 날씨 데이터: Open-Meteo (비상업적 이용, API 키 불필요), https://open-meteo.com

## 주의사항

- `.env` 파일은 절대 커밋하지 마세요 (`.gitignore`에 이미 등록됨).
- 게시글 비밀번호는 교육 목적으로 평문 저장됩니다 (RFP 요구사항에 따른 의도된 설계).
- localStorage 특성상 게시글은 작성한 브라우저(기기)에만 저장되며 다른 사용자와 공유되지 않습니다.
