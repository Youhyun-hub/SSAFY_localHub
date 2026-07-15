<script setup>
import { RouterLink } from 'vue-router'

// 서울 지하철 실제 노선 색상을 그대로 가져와, 우리 서비스의 7개 데이터 카테고리에 매핑
// (숫자와 색은 장식이 아니라 "몇 번째 카테고리인지"를 실제로 알려주는 정보)
const stations = [
  { line: '1', color: '#0D3692', label: '관광지' },
  { line: '2', color: '#00A84D', label: '문화시설' },
  { line: '3', color: '#EF7C1C', label: '축제·공연' },
  { line: '4', color: '#00A5DE', label: '쇼핑' },
  { line: '5', color: '#996CAC', label: '숙박' },
  { line: '6', color: '#CD7C2F', label: '레포츠' },
  { line: '7', color: '#747F00', label: '여행코스' },
]

const trackY = 100
const startX = 70
const endX = 830
const step = (endX - startX) / (stations.length - 1)
</script>

<template>
  <section class="splash">
    <div class="splash-text">
      <p class="eyebrow">서울 · 익명 지역정보 커뮤니티</p>
      <h1>우리 동네, 한 정거장 안에</h1>
      <p class="tagline">
        관광지부터 축제, 맛집, 숙소까지 — 흩어진 서울의 정보를 한 노선에 담았어요.
        회원가입 없이 자유롭게 묻고 공유하세요.
      </p>
      <div class="cta-row">
        <RouterLink to="/board" class="cta-primary">게시판 구경하기</RouterLink>
        <a href="#categories" class="cta-secondary">무슨 정보가 있나요?</a>
      </div>
    </div>

    <svg
      class="line-map"
      viewBox="0 0 900 190"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="서울 지역정보 카테고리를 지하철 노선도 형태로 표현한 그림"
    >
      <!-- 배경 트랙 -->
      <line :x1="startX" :y1="trackY" :x2="endX" :y2="trackY" stroke="#dbe3ee" stroke-width="10" stroke-linecap="round" />

      <!-- 움직이는 열차 (은은한 장식용 애니메이션) -->
      <circle r="5" fill="#ffffff" stroke="var(--lh-accent)" stroke-width="3">
        <animate attributeName="cx" :values="`${startX};${endX};${startX}`" dur="7s" repeatCount="indefinite" />
        <animate attributeName="cy" :values="`${trackY};${trackY};${trackY}`" dur="7s" repeatCount="indefinite" />
      </circle>

      <!-- 역(카테고리) -->
      <g v-for="(s, idx) in stations" :key="s.line">
        <circle
          :cx="startX + step * idx"
          :cy="trackY"
          r="17"
          :fill="s.color"
          stroke="#fff"
          stroke-width="4"
        />
        <text
          :x="startX + step * idx"
          :y="trackY + 5"
          text-anchor="middle"
          font-size="14"
          font-weight="800"
          fill="#fff"
        >
          {{ s.line }}
        </text>
        <text
          :x="startX + step * idx"
          :y="trackY + 42"
          text-anchor="middle"
          font-size="14"
          font-weight="700"
          fill="var(--lh-ink)"
        >
          {{ s.label }}
        </text>
      </g>
    </svg>
  </section>
</template>

<style scoped>
.splash {
  background: linear-gradient(180deg, #f3f7fd 0%, #ffffff 100%);
  border: 1px solid var(--lh-line);
  border-radius: 20px;
  padding: 40px 32px 24px;
  text-align: center;
}

.eyebrow {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--lh-accent);
  margin: 0 0 10px;
  text-transform: uppercase;
}

h1 {
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin: 0 0 12px;
  color: var(--lh-ink);
}

.tagline {
  font-size: 14.5px;
  color: var(--lh-muted);
  line-height: 1.7;
  max-width: 480px;
  margin: 0 auto 22px;
}

.cta-row {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.cta-primary {
  background: var(--lh-accent);
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  padding: 11px 22px;
  border-radius: 10px;
}

.cta-secondary {
  color: var(--lh-muted);
  font-weight: 600;
  font-size: 14px;
  padding: 11px 18px;
  border-radius: 10px;
  border: 1px solid var(--lh-line);
}

.line-map {
  width: 100%;
  max-width: 780px;
  height: auto;
  margin: 0 auto;
  display: block;
}

@media (max-width: 640px) {
  h1 { font-size: 24px; }
  .splash { padding: 28px 16px 16px; }
}
</style>
