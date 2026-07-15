<template>
  <section class="map-view">
    <header class="map-view__header">
      <h1>서울 관광지 지도</h1>
      <div class="map-view__filters">
        <label>
          카테고리
          <select v-model="selectedCategory">
            <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
          </select>
        </label>

        <label>
          구(區)
          <select v-model="selectedDistrict">
            <option value="">전체</option>
            <option v-for="d in districtOptions" :key="d" :value="d">{{ d }}</option>
          </select>
        </label>

        <label>
          검색
          <input type="text" v-model="placeKeyword" placeholder="장소명 또는 주소 검색" />
        </label>
      </div>
    </header>

    <PlaceMap :places="filteredPlaces" :center="defaultCenter" :zoom="11" :visible="true" />
  </section>
</template>

<script setup>
import { onMounted, computed, watch } from 'vue'
import PlaceMap from '@/components/PlaceMap.vue'
import { usePlaceData } from '@/composables/usePlaceData'

const {
  loadAll, categories, selectedCategory, selectedDistrict, placeKeyword, filteredPlaces, getDistricts,
} = usePlaceData()

const districtOptions = computed(() => getDistricts(selectedCategory.value))
const defaultCenter = { lat: 37.5665, lng: 126.9780 }

watch(selectedCategory, () => { selectedDistrict.value = '' })

onMounted(() => { loadAll() })
</script>

<style scoped>
.map-view { padding: 1rem; }
.map-view__filters { display:flex; gap:1rem; flex-wrap:wrap; margin-top:8px; }
.map-view__filters label { display:flex; flex-direction:column; gap:.4rem; }
</style>