// RFP가 제공한 서울 7개 카테고리 JSON을 프론트엔드에서 직접 로드합니다.
// (공공데이터: 한국관광공사 TourAPI 4.0, 공공누리 제3유형 — 출처 표시 필수, 변경 금지)
import { ref } from 'vue'

const CATEGORY_FILES = {
  관광지: '/data/서울_관광지.json',
  문화시설: '/data/서울_문화시설.json',
  축제공연행사: '/data/서울_축제공연행사.json',
  쇼핑: '/data/서울_쇼핑.json',
  숙박: '/data/서울_숙박.json',
  레포츠: '/data/서울_레포츠.json',
  여행코스: '/data/서울_여행코스.json',
}

// 모듈 스코프에 캐싱 — 여러 컴포넌트에서 usePlaceData()를 호출해도
// fetch가 매번 다시 일어나지 않도록 함
const allData = ref({})
const loading = ref(false)
const loaded = ref(false)

export function usePlaceData() {
  async function loadAll() {
    if (loaded.value) return // 이미 로드했으면 재요청 안 함
    loading.value = true
    try {
      const entries = await Promise.all(
        Object.entries(CATEGORY_FILES).map(async ([key, path]) => {
          const res = await fetch(path)
          const json = await res.json()
          return [key, json.items]
        })
      )
      allData.value = Object.fromEntries(entries)
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  // 카테고리별 상위 N개 (홈 화면 카드, 쇼핑처럼 건수 많은 카테고리 성능 보호용)
  function getSample(category, count = 8) {
    const items = allData.value[category] || []
    return items.filter((i) => i.firstimage).slice(0, count)
  }

  // 전체 카테고리 통합 검색 (제목/주소 기준)
  function searchPlaces(keyword) {
    if (!keyword?.trim()) return []
    const kw = keyword.trim()
    const results = []
    for (const [category, items] of Object.entries(allData.value)) {
      for (const item of items) {
        if (item.title?.includes(kw) || item.addr1?.includes(kw)) {
          results.push({ ...item, category })
        }
      }
    }
    return results
  }

  return { allData, loading, loaded, loadAll, getSample, searchPlaces }
}
