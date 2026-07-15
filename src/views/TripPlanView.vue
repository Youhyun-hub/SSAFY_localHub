<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePlaceData } from '@/composables/usePlaceData'
import { useTripPlanner, THEMES } from '@/composables/useTripPlanner'
import { useChatbot } from '@/composables/useChatbot'
import { useChatbotPanel } from '@/composables/useChatbotPanel'

const { loadAll, getDistricts } = usePlaceData()
const { generatePlan, buildAiPrompt } = useTripPlanner()
const { sendMessage } = useChatbot()
const { open: openChatPanel } = useChatbotPanel()

onMounted(loadAll)

const activeTheme = ref(THEMES[0])
const activeDistrict = ref('')
const plan = ref(null)
const asking = ref(false)

// 테마의 대표 카테고리 기준으로 구 목록 제공 (완벽하진 않지만 필터 참고용)
const districts = computed(() => getDistricts(activeTheme.value.categories[0]))

function selectTheme(theme) {
  activeTheme.value = theme
  activeDistrict.value = ''
  plan.value = null
}

function handleGenerate() {
  plan.value = generatePlan(activeTheme.value, activeDistrict.value)
}

async function handleAskAI() {
  if (!plan.value || asking.value) return
  asking.value = true
  openChatPanel()
  const prompt = buildAiPrompt(plan.value)
  await sendMessage(prompt, {}) // allData는 useChatbot 내부에서 요약하지 않고, 프롬프트에 이미 장소를 담아 보냄
  asking.value = false
}
</script>

<template>
  <div class="trip-plan">
    <header class="page-header">
      <h1>🗺️ 테마별 여행 코스</h1>
      <p class="page-desc">관심 있는 테마를 고르면 서울 데이터 기반으로 코스를 바로 짜드려요.</p>
    </header>

    <section class="theme-grid">
      <button
        v-for="theme in THEMES"
        :key="theme.id"
        class="theme-card"
        :class="{ active: theme.id === activeTheme.id }"
        @click="selectTheme(theme)"
      >
        <span class="theme-emoji">{{ theme.emoji }}</span>
        <span class="theme-label">{{ theme.label }}</span>
        <span class="theme-desc">{{ theme.desc }}</span>
      </button>
    </section>

    <section class="filter-row">
      <select v-model="activeDistrict" class="district-select">
        <option value="">서울 전체</option>
        <option v-for="gu in districts" :key="gu" :value="gu">{{ gu }}</option>
      </select>
      <button class="generate-btn" @click="handleGenerate">코스 짜기</button>
    </section>

    <section v-if="plan && plan.stops.length" class="itinerary">
      <div class="itinerary-header">
        <h2>{{ plan.theme.emoji }} {{ plan.theme.label }} 코스</h2>
        <button class="ai-btn" :disabled="asking" @click="handleAskAI">
          {{ asking ? 'AI에게 물어보는 중...' : '🤖 AI에게 코스 다듬어달라고 하기' }}
        </button>
      </div>

      <ol class="stop-list">
        <li v-for="stop in plan.stops" :key="stop.contentid" class="stop">
          <div class="stop-time">{{ stop.time }}</div>
          <img v-if="stop.firstimage" :src="stop.firstimage2 || stop.firstimage" :alt="stop.title" />
          <div class="stop-info">
            <span class="stop-category">{{ stop.category }}</span>
            <h3>{{ stop.title }}</h3>
            <p>{{ stop.addr1 || '주소 정보 없음' }}</p>
          </div>
        </li>
      </ol>

      <p class="ai-hint">
        💡 "AI에게 코스 다듬어달라고 하기"를 누르면 우측 하단 챗봇이 열리고, 이 코스를 참고해 이동 동선과 추천 이유를 설명해줘요.
      </p>
    </section>

    <section v-else-if="plan" class="empty-state">
      선택한 조건에 맞는 장소가 부족해요. 구를 "서울 전체"로 바꿔보세요.
    </section>
  </div>
</template>

<style scoped>
.trip-plan {
  display: flex;
  flex-direction: column;
  gap: 20px;
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

.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
}

.theme-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  text-align: left;
  background: var(--lh-surface);
  border: 1.5px solid var(--lh-line);
  border-radius: 14px;
  padding: 14px 16px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.theme-card:hover {
  border-color: var(--lh-accent);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(20, 40, 70, 0.08);
}

.theme-card.active {
  border-color: var(--lh-accent);
  background: var(--lh-accent-soft);
}

.theme-emoji {
  font-size: 22px;
}

.theme-label {
  font-size: 14px;
  font-weight: 700;
  color: var(--lh-ink);
}

.theme-desc {
  font-size: 12px;
  color: var(--lh-muted);
  line-height: 1.4;
}

.filter-row {
  display: flex;
  gap: 8px;
}

.district-select {
  flex: 1;
  border: 1px solid var(--lh-line);
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 13px;
  background: var(--lh-surface);
}

.generate-btn {
  background: var(--lh-accent);
  color: #fff;
  border: none;
  font-weight: 700;
  font-size: 14px;
  padding: 10px 22px;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
}

.itinerary {
  background: var(--lh-surface);
  border: 1px solid var(--lh-line);
  border-radius: 16px;
  padding: 20px;
}

.itinerary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.itinerary-header h2 {
  font-size: 17px;
  margin: 0;
}

.ai-btn {
  background: var(--lh-surface);
  border: 1.5px solid var(--lh-accent);
  color: var(--lh-accent);
  font-weight: 700;
  font-size: 13px;
  padding: 8px 14px;
  border-radius: 999px;
  cursor: pointer;
  white-space: nowrap;
}

.ai-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.stop-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stop {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px;
  border-radius: 10px;
  background: var(--lh-bg);
}

.stop-time {
  flex: 0 0 78px;
  font-size: 12px;
  font-weight: 700;
  color: var(--lh-accent);
}

.stop img {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 10px;
  flex: 0 0 auto;
}

.stop-info h3 {
  font-size: 14px;
  margin: 2px 0;
}

.stop-category {
  font-size: 11px;
  font-weight: 700;
  color: var(--lh-accent);
}

.stop-info p {
  font-size: 12px;
  color: var(--lh-muted);
  margin: 0;
}

.ai-hint {
  margin: 16px 0 0;
  font-size: 12px;
  color: var(--lh-muted);
  background: var(--lh-bg);
  border-radius: 8px;
  padding: 10px 12px;
}

.empty-state {
  color: var(--lh-muted);
  font-size: 14px;
  text-align: center;
  padding: 40px 0;
}
</style>
