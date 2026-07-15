<script setup>
import { onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { usePlaceData } from '@/composables/usePlaceData'
import { usePosts } from '@/composables/usePosts'
import PlaceCard from '@/components/PlaceCard.vue'
import WeatherWidget from '@/components/WeatherWidget.vue'
import SplashHero from '@/components/SplashHero.vue'

const { allData, loading, loadAll, getSample } = usePlaceData()
const { getAll } = usePosts()

onMounted(loadAll)

const recentPosts = computed(() => getAll().slice(0, 5))

// 메인에는 관광지·축제·문화시설 위주로 노출 (쇼핑은 4,368건이라 홈에서는 생략)
const featuredCategories = ['관광지', '축제공연행사', '문화시설']
</script>

<template>
  <div class="home">
    <SplashHero />

    <WeatherWidget />

    <div id="categories" class="categories-anchor">
      <section v-if="loading" class="loading-msg">데이터를 불러오는 중이에요...</section>

      <section v-else v-for="category in featuredCategories" :key="category" class="category-section">
        <h2>{{ category }}</h2>
        <div class="place-grid">
          <PlaceCard
            v-for="place in getSample(category, 4)"
            :key="place.contentid"
            :place="{ ...place, category }"
          />
        </div>
      </section>
    </div>

    <section class="recent-posts">
      <div class="section-header">
        <h2>최근 게시글</h2>
        <RouterLink to="/board" class="see-all">게시판 바로가기 →</RouterLink>
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
  gap: 24px;
}

.loading-msg,
.empty-msg {
  color: var(--lh-muted);
  font-size: 14px;
}


.category-section h2 {
  font-size: 16px;
  margin: 0 0 10px;
}

.place-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
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
  background: #fff;
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
