<script setup>
import { computed } from "vue";

const props = defineProps({
  place: {
    type: Object,
    required: true,
    // 기대하는 필드: title, addr1, firstimage, category, contentid
  },
});

// 카드 자체는 내부 상세 페이지로 이동. 실제 VisitKorea 외부 링크는
// 상세 페이지에서 "사진 클릭 시"에만 연결됨 (요구사항 11번)
const detailRoute = computed(() => ({
  name: "place-detail",
  params: { category: props.place.category, id: props.place.contentid },
}));
</script>

<template>
  <RouterLink v-if="place.firstimage" :to="detailRoute" class="place-card">
    <div class="image-wrap">
      <img :src="place.firstimage2 || place.firstimage" :alt="place.title" />
      <span class="hover-hint">자세히 보기 →</span>
    </div>
    <div class="place-info">
      <span class="place-category" v-if="place.category">{{
        place.category
      }}</span>
      <h3>{{ place.title }}</h3>
      <p>{{ place.addr1 }}</p>
    </div>
  </RouterLink>
</template>

<style scoped>
.place-card {
  display: block;
  border: 1px solid var(--lh-line);
  border-radius: 12px;
  overflow: hidden;
  background: var(--lh-surface);
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}

.place-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 24px rgba(20, 40, 70, 0.14);
  border-color: var(--lh-accent);
}

.image-wrap {
  position: relative;
  overflow: hidden;
}

.place-card img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
  background: var(--lh-bg);
  transition: transform 0.25s ease;
}

.place-card:hover img {
  transform: scale(1.08);
}

.hover-hint {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 25, 40, 0.45);
  color: #fff;
  font-size: 12.5px;
  font-weight: 700;
  opacity: 0;
  transition: opacity 0.18s ease;
}

.place-card:hover .hover-hint {
  opacity: 1;
}

.place-info {
  padding: 10px 12px;
}

.place-category {
  font-size: 11px;
  font-weight: 700;
  color: var(--lh-accent);
}

.place-info h3 {
  font-size: 14px;
  margin: 4px 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.place-info p {
  font-size: 12px;
  color: var(--lh-muted);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
