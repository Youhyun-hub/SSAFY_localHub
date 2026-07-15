<script setup>
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

const otherRegions = ['대전·충청', '구미·경북', '광주·전라', '부산']
</script>

<template>
  <header class="navbar">
    <div class="navbar-inner">
      <RouterLink to="/" class="brand">
        <span class="brand-mark">●</span>
        LocalHub
        <span class="brand-region">서울</span>
      </RouterLink>

      <nav class="menu">
        <RouterLink to="/" class="menu-link" :class="{ active: route.path === '/' }">홈</RouterLink>
        <RouterLink to="/tour" class="menu-link" :class="{ active: route.path.startsWith('/tour') }">
          관광정보
        </RouterLink>
        <RouterLink to="/plan" class="menu-link" :class="{ active: route.path.startsWith('/plan') }">
          테마여행
        </RouterLink>
        <RouterLink to="/board" class="menu-link" :class="{ active: route.path.startsWith('/board') }">
          동네방네
        </RouterLink>
      </nav>

      <div class="region-indicator">
        <span class="region active">서울</span>
        <span
          v-for="r in otherRegions"
          :key="r"
          class="region disabled"
          title="서비스 준비 중이에요"
        >
          {{ r }}
          <span class="soon-badge">준비중</span>
        </span>
      </div>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 20;
  background: var(--lh-surface);
  border-bottom: 1px solid var(--lh-line);
}

.navbar-inner {
  max-width: 1040px;
  margin: 0 auto;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 28px;
  flex-wrap: wrap;
}

.brand {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 19px;
  font-weight: 800;
  color: var(--lh-ink);
  letter-spacing: -0.02em;
  white-space: nowrap;
}

.brand-mark {
  color: var(--lh-accent);
  font-size: 10px;
}

.brand-region {
  font-size: 11px;
  font-weight: 700;
  color: var(--lh-accent);
  background: var(--lh-accent-soft);
  padding: 2px 8px;
  border-radius: 999px;
  margin-left: 2px;
}

.menu {
  display: flex;
  gap: 4px;
}

.menu-link {
  font-size: 14px;
  font-weight: 600;
  color: var(--lh-muted);
  padding: 8px 14px;
  border-radius: 8px;
  transition: all 0.15s ease;
}

.menu-link:hover {
  background: var(--lh-bg);
  color: var(--lh-ink);
}

.menu-link.active {
  background: var(--lh-accent-soft);
  color: var(--lh-accent);
}

/* 지역 표시: 서울만 활성, 나머지는 "준비중" 뱃지가 hover 시 나타남.
   가로 스크롤(overflow-x)을 쓰지 않아 브라우저의 스크롤 화살표가 뜨지 않도록 함 */
.region-indicator {
  display: flex;
  gap: 10px;
  margin-left: auto;
  font-size: 12.5px;
  flex-wrap: wrap;
}

.region {
  white-space: nowrap;
  position: relative;
}

.region.active {
  color: var(--lh-accent);
  font-weight: 700;
}

.region.disabled {
  color: var(--lh-muted);
  cursor: default;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.soon-badge {
  font-size: 10px;
  font-weight: 700;
  color: var(--lh-muted);
  background: var(--lh-surface-hover);
  padding: 1px 6px;
  border-radius: 999px;
}

@media (max-width: 720px) {
  .navbar-inner {
    gap: 10px 20px;
  }
  .region-indicator {
    order: 3;
    width: 100%;
    margin-left: 0;
    padding-top: 8px;
    border-top: 1px solid var(--lh-line);
  }
}
</style>

