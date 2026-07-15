<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { usePlaceData } from '@/composables/usePlaceData'
import PlaceCard from '@/components/PlaceCard.vue'

const { allData, loading, loaded, loadAll, categories, getDistricts, getFiltered } = usePlaceData()

onMounted(loadAll)

// 홈 화면에서 노출하던 3개 카테고리를 기본값으로 하되, 전체 카테고리를 탭으로 제공
const activeCategory = ref('관광지')
const activeDistrict = ref('') // '' = 전체
const keyword = ref('')
const page = ref(0)
const pageSize = 8

const districts = computed(() => (loaded.value ? getDistricts(activeCategory.value) : []))

const filtered = computed(() => {
  if (!loaded.value) return []
  return getFiltered(activeCategory.value, {
    district: activeDistrict.value,
    keyword: keyword.value.trim(),
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize)))

const pagedItems = computed(() => {
  const start = page.value * pageSize
  return filtered.value.slice(start, start + pageSize)
})

// 카테고리·구·검색어가 바뀌면 첫 페이지로 초기화
watch([activeCategory, activeDistrict, keyword], () => {
  page.value = 0
})

function selectCategory(cat) {
  activeCategory.value = cat
  activeDistrict.value = ''
}

function prevPage() {
  if (page.value > 0) page.value -= 1
}

function nextPage() {
  if (page.value < totalPages.value - 1) page.value += 1
}
</script>

<template>
  <div class="tour-info">
    <header class="page-header">
      <h1>관광정보</h1>
      <p class="page-desc">
        서울 5개 자치구별 관광지·문화시설·축제 정보를 구별로 골라볼 수 있어요.
      </p>
    </header>

    <nav class="category-tabs">
      <button
        v-for="cat in categories"
        :key="cat"
        class="tab"
        :class="{ active: cat === activeCategory }"
        @click="selectCategory(cat)"
      >
        {{ cat }}
      </button>
    </nav>

    <div class="filter-row">
      <select v-model="activeDistrict" class="district-select">
        <option value="">전체 구</option>
        <option v-for="gu in districts" :key="gu" :value="gu">{{ gu }}</option>
      </select>

      <input
        v-model="keyword"
        type="text"
        class="keyword-input"
        placeholder="이름으로 검색"
      />
    </div>

    <p class="month-note">
      ℹ️ 제공된 데이터에는 축제·행사의 정확한 시작일·종료일 정보가 포함되어 있지 않아,
      월별 필터는 아직 제공하지 않아요. 구별 필터와 검색으로 원하는 정보를 찾아보세요.
    </p>

    <section v-if="loading" class="loading-msg">데이터를 불러오는 중이에요...</section>

    <section v-else class="carousel">
      <button
        class="carousel-arrow prev"
        :disabled="page === 0"
        aria-label="이전"
        @click="prevPage"
      >
        ‹
      </button>

      <div class="place-grid">
        <PlaceCard
          v-for="place in pagedItems"
          :key="place.contentid"
          :place="{ ...place, category: activeCategory }"
        />
        <p v-if="!pagedItems.length" class="empty-msg">조건에 맞는 정보가 없어요.</p>
      </div>

      <button
        class="carousel-arrow next"
        :disabled="page >= totalPages - 1"
        aria-label="다음"
        @click="nextPage"
      >
        ›
      </button>
    </section>

    <p v-if="!loading && filtered.length" class="page-indicator">
      {{ page + 1 }} / {{ totalPages }} 페이지 · 총 {{ filtered.length }}건
    </p>
  </div>
</template>

<style scoped>
.tour-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-header h1 {
  font-size: 22px;
  margin: 0 0 4px;
}

.page-desc {
  color: var(--lh-muted);
  font-size: 13px;
  margin: 0;
}

.category-tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tab {
  border: 1px solid var(--lh-line);
  background: #fff;
  color: var(--lh-muted);
  font-size: 13px;
  font-weight: 600;
  padding: 8px 14px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.tab:hover {
  border-color: var(--lh-accent);
}

.tab.active {
  background: var(--lh-accent);
  border-color: var(--lh-accent);
  color: #fff;
}

.filter-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.district-select,
.keyword-input {
  border: 1px solid var(--lh-line);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 13px;
  background: #fff;
}

.keyword-input {
  flex: 1;
  min-width: 160px;
}

.month-note {
  font-size: 12px;
  color: var(--lh-muted);
  background: #f1f5fb;
  border: 1px solid var(--lh-line);
  border-radius: 8px;
  padding: 10px 12px;
  margin: 0;
}

.loading-msg,
.empty-msg {
  color: var(--lh-muted);
  font-size: 14px;
}

.carousel {
  display: flex;
  align-items: center;
  gap: 8px;
}

.carousel-arrow {
  flex: 0 0 auto;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--lh-line);
  background: #fff;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  color: var(--lh-ink);
}

.carousel-arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.place-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}

.page-indicator {
  text-align: center;
  font-size: 12px;
  color: var(--lh-muted);
  margin: 0;
}

@media (max-width: 640px) {
  .filter-row {
    flex-direction: column;
  }
}
</style>
