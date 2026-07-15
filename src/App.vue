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
  --lh-ink: #1c2b3a;
  --lh-bg: #f7fafd;
  --lh-accent: #2f6fed;
  --lh-line: #d6e0ec;
  --lh-muted: #5b6b7c;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: -apple-system, "Pretendard", "Apple SD Gothic Neo", sans-serif;
  background: var(--lh-bg);
  color: var(--lh-ink);
}

a { text-decoration: none; color: inherit; }

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

