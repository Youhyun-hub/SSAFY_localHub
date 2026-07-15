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

// 반짝이는 장식용 별 위치 (고정 배치 — 랜덤이면 매 렌더마다 튀어서 부자연스러움)
const sparkles = [
  { x: '8%', y: '18%', size: 14, delay: '0s' },
  { x: '92%', y: '24%', size: 10, delay: '0.6s' },
  { x: '18%', y: '78%', size: 8, delay: '1.2s' },
  { x: '85%', y: '70%', size: 12, delay: '1.8s' },
  { x: '48%', y: '10%', size: 9, delay: '0.9s' },
]
</script>

<template>
  <section class="splash">
    <!-- 배경 글로우 — 서울 심벌마크의 실제 3색(빨강·초록·파랑)을 그대로 사용 -->
    <div class="glow glow-red" aria-hidden="true"></div>
    <div class="glow glow-green" aria-hidden="true"></div>
    <div class="glow glow-blue" aria-hidden="true"></div>

    <!-- 반짝이는 장식 -->
    <span
      v-for="(s, idx) in sparkles"
      :key="idx"
      class="sparkle"
      :style="{ left: s.x, top: s.y, fontSize: s.size + 'px', animationDelay: s.delay }"
      aria-hidden="true"
      >✨</span
    >

    <div class="splash-text">
      <p class="eyebrow">🚇 SEOUL LOCAL COMMUNITY</p>
      <h1>서울을 한 노선에,<br />동네를 한 정거장에</h1>
      <p class="tagline">
        관광지·축제·맛집·숙소까지 흩어진 서울 정보를 한곳에 모으고,
        회원가입 없이 자유롭게 묻고 나누는 익명 지역 커뮤니티예요.
      </p>
      <div class="cta-row">
        <RouterLink to="/board" class="cta-primary">✨ 동네방네 구경하기</RouterLink>
        <RouterLink to="/tour" class="cta-secondary">관광정보 전체보기</RouterLink>
        <RouterLink to="/plan" class="cta-secondary">🗺️ 테마여행 코스 받기</RouterLink>
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
      <line :x1="startX" :y1="trackY" :x2="endX" :y2="trackY" stroke="var(--lh-line)" stroke-width="10" stroke-linecap="round" />

      <!-- 달리는 전철 (귀여운 전철 이모지가 노선을 따라 이동) -->
      <text font-size="26" text-anchor="middle">
        🚈
        <animateMotion
          :path="`M${startX},${trackY} L${endX},${trackY} L${startX},${trackY}`"
          dur="9s"
          repeatCount="indefinite"
          rotate="0"
        />
      </text>

      <!-- 역(카테고리) -->
      <g v-for="(s, idx) in stations" :key="s.line">
        <circle
          :cx="startX + step * idx"
          :cy="trackY"
          r="22"
          :fill="s.color"
          opacity="0.18"
        />
        <circle
          :cx="startX + step * idx"
          :cy="trackY"
          r="17"
          :fill="s.color"
          stroke="var(--lh-surface)"
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
  position: relative;
  overflow: hidden;
  background: linear-gradient(160deg, #fffdf8 0%, #f7f1e4 60%, #f3ead6 100%);
  border: 1px solid var(--lh-line);
  border-radius: 24px;
  padding: 48px 32px 28px;
  text-align: center;
}

.glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.22;
  pointer-events: none;
}

.glow-red {
  width: 260px;
  height: 260px;
  background: var(--lh-red);
  top: -90px;
  left: -50px;
}

.glow-green {
  width: 240px;
  height: 240px;
  background: var(--lh-green);
  bottom: -100px;
  right: -30px;
}

.glow-blue {
  width: 260px;
  height: 260px;
  background: var(--lh-accent);
  top: 35%;
  left: 42%;
  opacity: 0.16;
}

.sparkle {
  position: absolute;
  animation: twinkle 2.6s ease-in-out infinite;
  pointer-events: none;
  filter: drop-shadow(0 0 3px rgba(194, 0, 31, 0.25));
}

@keyframes twinkle {
  0%, 100% { opacity: 0.2; transform: scale(0.8) rotate(0deg); }
  50% { opacity: 1; transform: scale(1.15) rotate(15deg); }
}

.splash-text {
  position: relative;
  z-index: 1;
}

.eyebrow {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--lh-accent);
  margin: 0 0 12px;
}

h1 {
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.3;
  margin: 0 0 14px;
  color: var(--lh-ink);
}

.tagline {
  font-size: 14.5px;
  color: var(--lh-muted);
  line-height: 1.7;
  max-width: 480px;
  margin: 0 auto 24px;
}

.cta-row {
  position: relative;
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.cta-primary {
  background: var(--lh-accent);
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  padding: 12px 24px;
  border-radius: 12px;
  box-shadow: 0 0 0 0 rgba(40, 114, 179, 0.5);
  animation: pulse-glow 2.4s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(40, 114, 179, 0.45); }
  50% { box-shadow: 0 0 0 10px rgba(40, 114, 179, 0); }
}

.cta-secondary {
  color: var(--lh-ink);
  font-weight: 600;
  font-size: 14px;
  padding: 12px 18px;
  border-radius: 12px;
  border: 1px solid var(--lh-line);
  background: var(--lh-surface);
}

.cta-secondary:hover {
  background: var(--lh-surface-hover);
}

.line-map {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 780px;
  height: auto;
  margin: 0 auto;
  display: block;
}

@media (max-width: 640px) {
  h1 { font-size: 24px; }
  .splash { padding: 36px 16px 20px; }
}
</style>
