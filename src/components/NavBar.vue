<script setup>
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <header class="navbar">
    <div class="navbar-inner">
      <RouterLink to="/" class="brand">
        <span class="brand-mark">●</span>
        LocalHub
      </RouterLink>

      <nav class="menu">
        <RouterLink to="/" class="menu-link" :class="{ active: route.path === '/' }">홈</RouterLink>
        <RouterLink to="/board" class="menu-link" :class="{ active: route.path.startsWith('/board') }">
          게시판
        </RouterLink>
      </nav>

      <nav class="region-nav">
        <span class="region active">서울</span>
        <span class="region disabled">대전·충청</span>
        <span class="region disabled">구미·경북</span>
        <span class="region disabled">광주·전라</span>
        <span class="region disabled">부산</span>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 20;
  background: #fff;
  border-bottom: 1px solid var(--lh-line);
}

.navbar-inner {
  max-width: 1040px;
  margin: 0 auto;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 28px;
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
  background: #eaf1fd;
  color: var(--lh-accent);
}

.region-nav {
  display: flex;
  gap: 14px;
  margin-left: auto;
  font-size: 13px;
  overflow-x: auto;
}

.region {
  white-space: nowrap;
}

.region.active {
  color: var(--lh-accent);
  font-weight: 700;
  position: relative;
}

.region.active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -13px;
  height: 2px;
  background: var(--lh-accent);
}

.region.disabled {
  color: #c3ccd6;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .navbar-inner {
    flex-wrap: wrap;
    gap: 10px 20px;
  }
  .region-nav {
    order: 3;
    width: 100%;
    margin-left: 0;
    padding-top: 8px;
    border-top: 1px solid var(--lh-line);
  }
}
</style>
