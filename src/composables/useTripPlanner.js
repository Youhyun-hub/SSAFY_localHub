// 테마별 여행 코스를 JSON 데이터만으로 즉시 생성합니다 (별도 API 호출 없이 무료·즉시 응답).
// 필요하면 useChatbot과 연동해 "AI로 다시 짜기"도 가능하도록 설계했어요.
import { usePlaceData } from './usePlaceData'

export const THEMES = [
  {
    id: 'history',
    label: '역사·문화 탐방',
    emoji: '🏛️',
    desc: '고궁·박물관 위주로 서울의 역사를 느껴보는 코스',
    categories: ['관광지', '문화시설'],
  },
  {
    id: 'healing',
    label: '자연·힐링',
    emoji: '🌿',
    desc: '공원·산책로와 가벼운 액티비티로 여유를 즐기는 코스',
    categories: ['관광지', '레포츠'],
  },
  {
    id: 'festival',
    label: '축제·이벤트',
    emoji: '🎉',
    desc: '지금 서울에서 열리는 축제·공연 위주 코스',
    categories: ['축제공연행사', '관광지'],
  },
  {
    id: 'shopping',
    label: '쇼핑 나들이',
    emoji: '🛍️',
    desc: '쇼핑과 근처 숙소까지 이어지는 코스',
    categories: ['쇼핑', '숙박'],
  },
  {
    id: 'overnight',
    label: '1박 2일 코스',
    emoji: '🌙',
    desc: '관광 + 액티비티 + 숙박까지 이어지는 여유로운 1박 2일',
    categories: ['관광지', '레포츠', '숙박'],
  },
]

const TIME_SLOTS = ['오전 10:00', '오후 12:30', '오후 2:30', '오후 4:30', '오후 7:00']

// 간단한 시드 기반 셔플 — 같은 테마+구를 고르면 매번 결과가 바뀌지 않고 일관되게 나오도록
function seededShuffle(arr, seed) {
  const a = [...arr]
  let s = seed
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280
    const j = Math.floor((s / 233280) * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function hashString(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 1000000
  return h
}

export function useTripPlanner() {
  const { allData, getFiltered } = usePlaceData()

  // theme: THEMES 중 하나, district: '' 이면 전체
  function generatePlan(theme, district = '') {
    const pool = []
    for (const category of theme.categories) {
      const items = getFiltered(category, { district }).map((item) => ({ ...item, category }))
      pool.push(...items)
    }

    if (pool.length === 0) return { stops: [], theme }

    const seed = hashString(theme.id + district)
    const shuffled = seededShuffle(pool, seed)
    const picked = shuffled.slice(0, Math.min(5, shuffled.length))

    const stops = picked.map((item, idx) => ({
      time: TIME_SLOTS[idx] || '',
      ...item,
    }))

    return { theme, district, stops }
  }

  // AI 챗봇에게 넘길 프롬프트 텍스트 생성 (JSON 코스를 참고자료로 함께 전달)
  function buildAiPrompt(plan) {
    const stopList = plan.stops
      .map((s) => `- ${s.title} (${s.category}, ${s.addr1 || '주소 정보 없음'})`)
      .join('\n')
    return (
      `"${plan.theme.label}" 테마로 서울 반나절~하루 코스를 짜줘. ` +
      `참고로 아래 장소들을 활용해서 자연스러운 동선과 추천 이유를 덧붙여줘:\n${stopList}`
    )
  }

  return { allData, generatePlan, buildAiPrompt }
}
