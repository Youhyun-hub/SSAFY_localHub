<template>
  <div class="place-map" ref="mapContainer"></div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import L from 'leaflet'

const props = defineProps({
  places: { type: Array, default: () => [] },
  center: { type: Object, default: () => ({ lat: 37.5665, lng: 126.9780 }) },
  zoom: { type: Number, default: 11 },
  visible: { type: Boolean, default: true },
})

const mapContainer = ref(null)
const router = useRouter()
let map = null
let markerLayer = null

function createMarker(item) {
  const lat = Number(item.mapy)
  const lng = Number(item.mapx)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return
  const marker = L.marker([lat, lng]).addTo(markerLayer)
  marker.bindPopup(`<strong>${item.title || '장소'}</strong><br/>${item.addr1 || ''}`)
  marker.on('click', () => {
    const category = item.category || item?.category || undefined
    if (item.contentid) {
      router.push({ name: 'place-detail', params: { category: category || '관광지', id: item.contentid } })
    }
  })
}

function renderMarkers() {
  if (!markerLayer || !map) return
  markerLayer.clearLayers()
  const valid = props.places.filter(p => p && p.mapx && p.mapy && Number.isFinite(Number(p.mapx)) && Number.isFinite(Number(p.mapy)))
  valid.forEach(createMarker)
  if (valid.length) {
    const bounds = L.latLngBounds(valid.map(p => [Number(p.mapy), Number(p.mapx)]))
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [40, 40] })
  } else {
    map.setView([props.center.lat, props.center.lng], props.zoom)
  }
  nextTick(() => {
    try { map.invalidateSize({ animate: false }) } catch {}
  })
}

onMounted(() => {
  map = L.map(mapContainer.value, { zoomControl: true }).setView([props.center.lat, props.center.lng], props.zoom)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map)
  markerLayer = L.layerGroup().addTo(map)
  renderMarkers()
  // 보이는 상태로 전환될 때를 대비한 초기 invalidate
  setTimeout(() => { try { map.invalidateSize({ animate: false }) } catch {} }, 0)
})

watch(() => props.places, () => { renderMarkers() }, { deep: true })

watch(() => props.visible, async (v) => {
  if (v && map) {
    await nextTick()
    try { map.invalidateSize({ animate: false }) } catch {}
    renderMarkers()
  }
})

onBeforeUnmount(() => {
  map?.remove()
})
</script>

<style scoped>
.place-map { width: 100%; min-height: 360px; }
</style>