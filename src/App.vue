<script setup>
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import ChatBot from '@/components/ChatBot.vue'
</script>

<template>
  <div class="app-shell">
    <NavBar />

    <main class="content">
      <RouterView />
    </main>

    <footer class="footer">
      <p>
        본 서비스는 한국관광공사 Tour API(TourAPI 4.0) 데이터를 활용하였습니다.
        출처: 한국관광공사 (공공누리 제3유형) · 날씨 정보: Open-Meteo
      </p>
    </footer>

    <!-- 챗봇은 모든 화면에서 떠 있어야 하므로 App.vue 최상단에 배치 -->
    <ChatBot />
  </div>
</template>

<style>
:root {
  /* 서울 심벌마크 컬러 기반 테마 (실제 심벌 이미지에서 추출한 값) */
  --lh-ink: #2a241e;           /* 기본 텍스트 — 완전 검정 대신 따뜻한 다크브라운 */
  --lh-bg: #f7f1e4;            /* 페이지 배경 — 한지(hanji) 느낌의 따뜻한 크림톤 */
  --lh-surface: #fffdf8;       /* 카드·패널 배경 — 배경보다 살짝 밝은 아이보리 */
  --lh-surface-hover: #f1ead9; /* 카드 hover, 인풋 포커스 등 */
  --lh-accent: #2872b3;        /* 서울 심벌 블루 — 메인 액션·링크 */
  --lh-accent-soft: rgba(40, 114, 179, 0.1); /* 배지·칩 배경 */
  --lh-red: #c2001f;           /* 서울 심벌 레드 — 강조·알림·삭제 */
  --lh-red-soft: rgba(194, 0, 31, 0.1);
  --lh-green: #308027;         /* 서울 심벌 그린 — 좋음 상태·자연 관련 */
  --lh-green-soft: rgba(48, 128, 39, 0.1);
  --lh-line: #e3d8c3;          /* 구분선·테두리 — 따뜻한 베이지 */
  --lh-muted: #7c6f61;         /* 보조 텍스트 */
}

* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: -apple-system, "Pretendard", "Apple SD Gothic Neo", sans-serif;
  background: var(--lh-bg);
  color: var(--lh-ink);
}

a { text-decoration: none; color: inherit; }

/* 폼 요소는 브라우저 기본값을 쓰기 때문에 전역으로 테마를 맞춰줌.
   각 컴포넌트의 개별 border 지정은 그대로 유지되고 배경/글자색만 여기서 통일함 */
input, select, textarea, button {
  font-family: inherit;
  color: var(--lh-ink);
}

input, select, textarea {
  background: var(--lh-surface);
  accent-color: var(--lh-accent);
}

input::placeholder, textarea::placeholder {
  color: var(--lh-muted);
  opacity: 0.8;
}

select option {
  background: var(--lh-surface);
  color: var(--lh-ink);
}

.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  max-width: 1040px;
  width: 100%;
  margin: 0 auto;
  padding: 24px 16px 60px;
}

.footer {
  text-align: center;
  font-size: 12px;
  color: var(--lh-muted);
  padding: 20px 16px;
  border-top: 1px solid var(--lh-line);
}
</style>

