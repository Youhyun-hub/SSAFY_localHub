<script setup>
import { onMounted, reactive, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { usePlaceData } from '@/composables/usePlaceData'
import { usePosts } from '@/composables/usePosts'
import PlaceCard from '@/components/PlaceCard.vue'
import WeatherWidget from '@/components/WeatherWidget.vue'
import SplashHero from '@/components/SplashHero.vue'

const { loading, loadAll, getSample } = usePlaceData()
const { getAll } = usePosts()

onMounted(loadAll)

const recentPosts = computed(() => getAll().slice(0, 5))

// 메인에는 관광지·축제·문화시설 위주로 노출 (쇼핑은 4,368건이라 홈에서는 생략)
const featuredCategories = ['관광지', '축제공연행사', '문화시설']
const PAGE_SIZE = 10 // 5열 x 2행

// 카테고리별로 각자 다른 페이지를 넘길 수 있도록 카테고리마다 별도 page 상태 유지
const pageByCategory = reactive(
  Object.fromEntries(featuredCategories.map((c) => [c, 0]))
)

function itemsFor(category) {
  // 카테고리당 최대 30개 정도만 가져와서 캐러셀로 넘겨봄 (전체를 다 가져올 필요는 없음)
  return getSample(category, 30)
}

function pagedItemsFor(category) {
  const items = itemsFor(category)
  const start = pageByCategory[category] * PAGE_SIZE
  return items.slice(start, start + PAGE_SIZE)
}

function totalPagesFor(category) {
  return Math.max(1, Math.ceil(itemsFor(category).length / PAGE_SIZE))
}

function prevPage(category) {
  if (pageByCategory[category] > 0) pageByCategory[category] -= 1
}

function nextPage(category) {
  if (pageByCategory[category] < totalPagesFor(category) - 1) pageByCategory[category] += 1
}
</script>

<template>
  <div class="home">
    <SplashHero />

    <WeatherWidget />

    <div id="categories" class="categories-anchor">
      <section v-if="loading" class="loading-msg">데이터를 불러오는 중이에요...</section>

      <section v-else v-for="category in featuredCategories" :key="category" class="category-section">
        <div class="category-header">
          <h2>{{ category }}</h2>
          <div class="carousel-controls">
            <button
              class="arrow-btn"
              :disabled="pageByCategory[category] === 0"
              aria-label="이전"
              @click="prevPage(category)"
            >
              ‹
            </button>
            <span class="page-count">{{ pageByCategory[category] + 1 }} / {{ totalPagesFor(category) }}</span>
            <button
              class="arrow-btn"
              :disabled="pageByCategory[category] >= totalPagesFor(category) - 1"
              aria-label="다음"
              @click="nextPage(category)"
            >
              ›
            </button>
          </div>
        </div>

        <div class="place-grid">
          <PlaceCard
            v-for="place in pagedItemsFor(category)"
            :key="place.contentid"
            :place="{ ...place, category }"
          />
        </div>
      </section>
    </div>

    <section class="recent-posts">
      <div class="section-header">
        <h2>💬 동네방네 최신 글</h2>
        <RouterLink to="/board" class="see-all">동네방네 바로가기 →</RouterLink>
      </div>
      <ul v-if="recentPosts.length" class="post-list">
        <li v-for="post in recentPosts" :key="post.id">
          <RouterLink :to="`/board/${post.id}`">{{ post.title }}</RouterLink>
          <span class="post-meta">조회 {{ post.views }} · 좋아요 {{ post.likes }}</span>
        </li>
      </ul>
      <p v-else class="empty-msg">아직 등록된 게시글이 없어요. 첫 글을 남겨보세요!</p>
    </section>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.categories-anchor {
  scroll-margin-top: 80px; /* 스티키 네비바에 가리지 않도록 */
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.loading-msg,
.empty-msg {
  color: var(--lh-muted);
  font-size: 14px;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.category-header h2 {
  font-size: 16px;
  margin: 0;
}

.carousel-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.arrow-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid var(--lh-line);
  background: var(--lh-surface);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  color: var(--lh-ink);
}

.arrow-btn:hover:not(:disabled) {
  border-color: var(--lh-accent);
  color: var(--lh-accent);
}

.arrow-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.page-count {
  font-size: 12px;
  color: var(--lh-muted);
  white-space: nowrap;
}

/* 5열 x 2행 고정 그리드 — 카드 8~10개가 균일하게 정렬되도록 */
.place-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

@media (max-width: 900px) {
  .place-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 560px) {
  .place-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.section-header h2 {
  font-size: 16px;
  margin: 0;
}

.see-all {
  font-size: 13px;
  color: var(--lh-accent);
  font-weight: 600;
}

.post-list {
  list-style: none;
  margin: 0;
  padding: 0;
  background: var(--lh-surface);
  border: 1px solid var(--lh-line);
  border-radius: 12px;
  overflow: hidden;
}

.post-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--lh-line);
  font-size: 14px;
}

.post-list li:last-child {
  border-bottom: none;
}

.post-meta {
  font-size: 12px;
  color: var(--lh-muted);
  white-space: nowrap;
}
</style>
