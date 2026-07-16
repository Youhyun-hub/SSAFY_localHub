<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  places: {
    type: Array,
    default: () => [],
  },
  center: {
    type: Object,
    default: () => ({ lat: 37.5665, lng: 126.978 }),
  },
  zoom: {
    type: Number,
    default: 8,
  },
  height: {
    type: String,
    default: "360px",
  },
});

const mapContainer = ref(null);
const map = ref(null);
const markers = ref([]);
const isReady = ref(false);
const apiKey = import.meta.env.VITE_KAKAO_MAP_KEY || "";

function loadScript() {
  return new Promise((resolve, reject) => {
    if (window.kakao?.maps) {
      resolve();
      return;
    }

    if (document.getElementById("kakao-map-script")) {
      const check = setInterval(() => {
        if (window.kakao?.maps) {
          clearInterval(check);
          resolve();
        }
      }, 100);
      return;
    }

    const script = document.createElement("script");
    script.id = "kakao-map-script";
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Kakao Maps SDK 로드 실패"));
    document.head.appendChild(script);
  });
}

async function initMap() {
  if (!mapContainer.value || !apiKey) return;

  try {
    await loadScript();

    window.kakao.maps.load(() => {
      isReady.value = true;
      map.value = new window.kakao.maps.Map(mapContainer.value, {
        center: new window.kakao.maps.LatLng(
          props.center.lat,
          props.center.lng,
        ),
        level: props.zoom,
      });

      // 지도 생성 시점엔 컨테이너의 실제 레이아웃이 아직 확정 안 됐을 수 있어서
      // 한 프레임 뒤에 relayout()으로 크기를 다시 계산시키고, 중심도 재확정함
      requestAnimationFrame(() => {
        map.value.relayout();
        map.value.setCenter(
          new window.kakao.maps.LatLng(props.center.lat, props.center.lng),
        );
        renderMarkers();
      });
    });
  } catch (err) {
    console.error(err);
  }
}

function renderMarkers() {
  if (!map.value || !window.kakao?.maps) return;

  markers.value.forEach((marker) => marker.setMap(null));
  markers.value = [];

  if (!props.places.length) return;

  const bounds = new window.kakao.maps.LatLngBounds();

  props.places.forEach((place) => {
    const lat = Number(place.mapy);
    const lng = Number(place.mapx);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    // 한국 영토를 크게 벗어나는 이상치 좌표 방어 (TourAPI 원본 데이터 오류로
    // 위도 19~20대, 경도 117~118대 같은 완전히 엉뚱한 값이 섞여 있는 경우가 있음)
    if (lat < 33 || lat > 39 || lng < 124 || lng > 132) return;
    const position = new window.kakao.maps.LatLng(lat, lng);
    const marker = new window.kakao.maps.Marker({
      position,
      title: place.title,
    });

    marker.setMap(map.value);
    markers.value.push(marker);
    bounds.extend(position);
  });

  if (props.places.length) {
    map.value.setBounds(bounds);
  }
}

watch(
  () => props.places,
  () => {
    if (isReady.value) {
      requestAnimationFrame(() => {
        map.value.relayout();
        renderMarkers();
      });
    }
  },
  { deep: true },
);

watch(
  () => props.center,
  () => {
    if (map.value && window.kakao?.maps) {
      map.value.setCenter(
        new window.kakao.maps.LatLng(props.center.lat, props.center.lng),
      );
    }
  },
  { deep: true },
);

onMounted(() => {
  initMap();
});

onBeforeUnmount(() => {
  markers.value.forEach((marker) => marker.setMap(null));
});
</script>

<template>
  <div class="kakao-map-wrap">
    <div v-if="!apiKey" class="map-empty">
      카카오 지도 API 키를 등록해주세요.
    </div>
    <div v-else ref="mapContainer" class="kakao-map" :style="{ height }"></div>
  </div>
</template>

<style scoped>
.kakao-map-wrap {
  width: 100%;
}

.kakao-map {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--lh-line);
}

.map-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 360px;
  border: 1px dashed var(--lh-line);
  border-radius: 12px;
  color: var(--lh-muted);
  background: var(--lh-bg);
  font-size: 14px;
}
</style>
