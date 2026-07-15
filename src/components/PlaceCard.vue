<script setup>
import { computed } from "vue";
import { usePlaceData } from "@/composables/usePlaceData";

const props = defineProps({
  place: {
    type: Object,
    required: true,
    // 기대하는 필드: title, addr1, firstimage, category
  },
});

const { getDetailLink } = usePlaceData();

// 제공 JSON의 contentid는 VisitKorea 사이트 내부 ID와 달라 상세페이지로 바로 연결할 수
// 없어서, 장소명으로 VisitKorea(대한민국 구석구석) 검색 결과 페이지로 연결함
const link = computed(() => getDetailLink(props.place));
</script>

<template>
  <a
    v-if="place.firstimage"
    :href="link"
    class="place-card"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img :src="place.firstimage2 || place.firstimage" :alt="place.title" />
    <div class="place-info">
      <span class="place-category" v-if="place.category">{{
        place.category
      }}</span>
      <h3>{{ place.title }}</h3>
      <p>{{ place.addr1 }}</p>
    </div>
  </a>
</template>

<style scoped>
.place-card {
  display: block;
  border: 1px solid var(--lh-line);
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  transition: box-shadow 0.15s ease;
}

.place-card:hover {
  box-shadow: 0 4px 16px rgba(20, 40, 70, 0.1);
}

.place-card img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
  background: var(--lh-bg);
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

.place-link-hint {
  display: block;
  margin-top: 6px;
  font-size: 11px;
  font-weight: 600;
  color: var(--lh-accent);
}
</style>
