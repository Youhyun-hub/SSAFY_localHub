// RFP가 제공한 서울 7개 카테고리 JSON을 프론트엔드에서 직접 로드합니다.
// (공공데이터: 한국관광공사 TourAPI 4.0, 공공누리 제3유형 — 출처 표시 필수, 변경 금지)
import { ref, computed } from "vue";

const CATEGORY_FILES = {
  관광지: "/data/서울_관광지.json",
  문화시설: "/data/서울_문화시설.json",
  축제공연행사: "/data/서울_축제공연행사.json",
  쇼핑: "/data/서울_쇼핑.json",
  숙박: "/data/서울_숙박.json",
  레포츠: "/data/서울_레포츠.json",
  여행코스: "/data/서울_여행코스.json",
};

// 모듈 스코프에 캐싱 — 여러 컴포넌트에서 usePlaceData()를 호출해도
// fetch가 매번 다시 일어나지 않도록 함
const allData = ref({});
const loading = ref(false);
const loaded = ref(false);
const selectedCategory = ref("관광지");
const selectedDistrict = ref("");
const placeKeyword = ref("");

// TourInfoView의 카테고리 탭에서 사용
const categories = Object.keys(CATEGORY_FILES);

// addr1은 "서울특별시 영등포구 노들로 221 (당산동)" 형태 — 구 이름만 뽑아냄
function extractDistrict(addr1) {
  if (!addr1) return "";
  const match = addr1.match(/서울특별시\s+(\S+?(?:구|군))/);
  return match ? match[1] : "";
}

export function usePlaceData() {
  async function loadAll() {
    if (loaded.value) return; // 이미 로드했으면 재요청 안 함
    loading.value = true;
    try {
      const entries = await Promise.all(
        Object.entries(CATEGORY_FILES).map(async ([key, path]) => {
          const res = await fetch(path);
          const json = await res.json();
          return [key, json.items];
        }),
      );
      allData.value = Object.fromEntries(entries);
      loaded.value = true;
    } finally {
      loading.value = false;
    }
  }

  // 카테고리별 상위 N개 (홈 화면 카드, 쇼핑처럼 건수 많은 카테고리 성능 보호용)
  function getSample(category, count = 8) {
    const items = allData.value[category] || [];
    return items.filter((i) => i.firstimage).slice(0, count);
  }

  // 전체 카테고리 통합 검색 (제목/주소 기준)
  function searchPlaces(keyword) {
    if (!keyword?.trim()) return [];
    const kw = keyword.trim();
    const results = [];
    for (const [category, items] of Object.entries(allData.value)) {
      for (const item of items) {
        if (item.title?.includes(kw) || item.addr1?.includes(kw)) {
          results.push({ ...item, category });
        }
      }
    }
    return results;
  }

  // 카테고리 내 존재하는 구(區) 목록 (필터 셀렉트박스용)
  function getDistricts(category) {
    const items = allData.value[category] || [];
    const set = new Set();
    for (const item of items) {
      const gu = extractDistrict(item.addr1);
      if (gu) set.add(gu);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, "ko"));
  }

  // YYYYMMDD 문자열에서 월(1~12)만 추출
  function getEventMonth(item) {
    if (!item.eventstartdate) return null;
    const month = item.eventstartdate.slice(4, 6);
    return parseInt(month, 10);
  }

  // 관광정보 페이지: 구/검색어로 필터링된 목록 (이미지 있는 항목만 — 카드에 이미지 필수)
  function getFiltered(
    category,
    { district = "", keyword = "", month = "" } = {},
  ) {
    const items = allData.value[category] || [];
    return items.filter((item) => {
      if (!item.firstimage) return false;
      if (district && extractDistrict(item.addr1) !== district) return false;
      if (
        keyword &&
        !(item.title?.includes(keyword) || item.addr1?.includes(keyword))
      )
        return false;
      if (month && category === "축제공연행사") {
        const itemMonth = getEventMonth(item);
        if (itemMonth !== parseInt(month, 10)) return false;
      }
      return true;
    });
  }

  // 카드 클릭 시 이동할 외부 링크.
  // ⚠️ TourAPI의 contentid는 VisitKorea 사이트 내부 ID(cotid, UUID 형식)와 다르기 때문에
  // 항목별 상세페이지로 직접 연결할 수 없음 — 대신 이름으로 VisitKorea 검색 결과 페이지로 연결
  function getDetailLink(item) {
    const keyword = encodeURIComponent(item?.title || "");
    return `https://korean.visitkorea.or.kr/search/search_list.do?keyword=${keyword}`;
  }

  // 관광정보 상세 페이지(/tour/place/:category/:id)에서 사용 — 카테고리+contentid로 단일 항목 조회
  function getItem(category, contentid) {
    const items = allData.value[category] || [];
    return items.find((i) => i.contentid === contentid) || null;
  }

  const filteredPlaces = computed(() => {
    return getFiltered(selectedCategory.value, {
      district: selectedDistrict.value,
      keyword: placeKeyword.value,
    });
  });

  return {
    allData,
    loading,
    loaded,
    loadAll,
    getSample,
    searchPlaces,
    categories,
    getDistricts,
    getFiltered,
    getDetailLink,
    getItem,
    getEventMonth,
    selectedCategory,
    selectedDistrict,
    placeKeyword,
    filteredPlaces,
  };
}
