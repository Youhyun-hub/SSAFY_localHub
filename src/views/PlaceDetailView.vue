<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PlaceMap from '@/components/PlaceMap.vue'
import { usePlaceData } from '@/composables/usePlaceData'

const props = defineProps({
  category: { type: String, required: true },
  id: { type: String, required: true },
})

const router = useRouter()
const { loaded, loadAll, getItem, getDetailLink } = usePlaceData()

// 탭 상태
const activeTab = ref('info')

onMounted(async () => {
  if (!loaded.value) await loadAll()
})

// 기존 place 계산 속성
const place = computed(() => getItem(props.category, props.id))
const externalLink = computed(() => (place.value ? getDetailLink(place.value) : '#'))

// 템플릿에서 사용되는 값들 정의 (없어서 경고 발생)
const placeWithCategory = computed(() => {
  if (!place.value) return null
  return { ...place.value, category: props.category }
})

const mapCenter = computed(() => {
  if (!place.value) return { lat: 37.5665, lng: 126.9780 }
  return {
    lat: Number(place.value.mapy) || 37.5665,
    lng: Number(place.value.mapx) || 126.9780,
  }
})

function goBack() {
  router.back()
}
</script>

<template>
  <div v-if="place" class="place-detail">
    <button class="back-btn" @click="goBack">‹ 목록으로</button>

    <!-- 사진 클릭 시 VisitKorea(대한민국 구석구석) 검색 결과로 이동 -->
    <div class="detail-tabs">
      <button
        type="button"
        :class="{ active: activeTab === 'info' }"
        @click="activeTab = 'info'"
      >
        정보
      </button>
      <button
        type="button"
        :class="{ active: activeTab === 'map' }"
        @click="activeTab = 'map'"
      >
        지도
      </button>
    </div>

    <div v-if="activeTab === 'info'">
      <a
        v-if="place.firstimage"
        :href="externalLink"
        target="_blank"
        rel="noopener noreferrer"
        class="photo-link"
        title="VisitKorea에서 자세히 보기"
      >
        <img :src="place.firstimage" :alt="place.title" />
        <span class="photo-overlay">📷 VisitKorea에서 자세히 보기 ↗</span>
      </a>
      <div v-else class="photo-placeholder">🖼️ 등록된 사진이 없어요</div>

      <div class="detail-body">
        <span class="category-badge">{{ category }}</span>
        <h1>{{ place.title }}</h1>

        <ul class="info-list">
          <li v-if="place.addr1">
            <span class="info-label">주소</span>
            <span>{{ place.addr1 }}{{ place.addr2 ? ` ${place.addr2}` : '' }}</span>
          </li>
          <li v-if="place.tel">
            <span class="info-label">전화</span>
            <span>{{ place.tel }}</span>
          </li>
          <li v-if="place.zipcode">
            <span class="info-label">우편번호</span>
            <span>{{ place.zipcode }}</span>
          </li>
        </ul>

        <a :href="externalLink" target="_blank" rel="noopener noreferrer" class="visitkorea-btn">
          VisitKorea에서 상세정보 보기 ↗
        </a>

        <p class="source-note">
          본 정보는 한국관광공사 Tour API(TourAPI 4.0) 데이터를 기반으로 하며,
          정확한 최신 정보와 사진은 VisitKorea(대한민국 구석구석)에서 확인하실 수 있어요.
        </p>
      </div>
    </div>

    <div v-else class="detail-map">
      <PlaceMap
        v-if="placeWithCategory"
        :places="[placeWithCategory]"
        :center="mapCenter"
        :zoom="15"
      />
      <p v-else>로딩 중...</p>
    </div>
  </div>

  <div v-else class="not-found">
    <p>해당 정보를 찾을 수 없어요.</p>
    <button class="back-btn" @click="goBack">‹ 목록으로 돌아가기</button>
  </div>
</template>

<style scoped>
.place-detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-tabs {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.detail-tabs button {
  border: 1px solid var(--lh-line);
  background: var(--lh-surface);
  color: var(--lh-muted);
  padding: 8px 16px;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.detail-tabs button.active {
  background: var(--lh-accent);
  color: #fff;
  border-color: var(--lh-accent);
}

.detail-map {
  min-height: 520px;
}

.back-btn {
  align-self: flex-start;
  border: 1px solid var(--lh-line);
  background: var(--lh-surface);
  color: var(--lh-muted);
  font-size: 13px;
  font-weight: 600;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
}

.back-btn:hover {
  border-color: var(--lh-accent);
  color: var(--lh-accent);
}

.photo-link {
  position: relative;
  display: block;
  border-radius: 16px;
  overflow: hidden;
}

.photo-link img {
  width: 100%;
  max-height: 360px;
  object-fit: cover;
  display: block;
  transition: transform 0.25s ease;
}

.photo-link:hover img {
  transform: scale(1.03);
}

.photo-overlay {
  position: absolute;
  right: 12px;
  bottom: 12px;
  background: rgba(15, 25, 40, 0.72);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  padding: 7px 12px;
  border-radius: 999px;
}

.photo-placeholder {
  background: var(--lh-bg);
  border: 1px dashed var(--lh-line);
  border-radius: 16px;
  padding: 60px 0;
  text-align: center;
  color: var(--lh-muted);
  font-size: 14px;
}

.detail-body {
  background: var(--lh-surface);
  border: 1px solid var(--lh-line);
  border-radius: 16px;
  padding: 24px;
}

.category-badge {
  font-size: 12px;
  font-weight: 700;
  color: var(--lh-accent);
  background: var(--lh-accent-soft);
  padding: 4px 10px;
  border-radius: 999px;
}

.detail-body h1 {
  font-size: 22px;
  margin: 10px 0 16px;
}

.info-list {
  list-style: none;
  margin: 0 0 20px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
}

.info-list li {
  display: flex;
  gap: 10px;
}

.info-label {
  flex: 0 0 70px;
  color: var(--lh-muted);
  font-weight: 600;
}

.visitkorea-btn {
  display: inline-block;
  background: var(--lh-accent);
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  padding: 12px 22px;
  border-radius: 10px;
}

.source-note {
  margin: 16px 0 0;
  font-size: 12px;
  color: var(--lh-muted);
  line-height: 1.6;
}

.not-found {
  text-align: center;
  padding: 60px 0;
  color: var(--lh-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
</style>
