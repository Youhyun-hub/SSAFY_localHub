// Open-Meteo가 반환하는 WMO 날씨 코드를 아이콘/한글 설명으로 매핑
const WEATHER_CODE_MAP = {
  0: { icon: '☀️', label: '맑음' },
  1: { icon: '🌤️', label: '대체로 맑음' },
  2: { icon: '⛅', label: '구름 조금' },
  3: { icon: '☁️', label: '흐림' },
  45: { icon: '🌫️', label: '안개' },
  48: { icon: '🌫️', label: '짙은 안개' },
  51: { icon: '🌦️', label: '약한 이슬비' },
  53: { icon: '🌦️', label: '이슬비' },
  55: { icon: '🌧️', label: '강한 이슬비' },
  61: { icon: '🌧️', label: '약한 비' },
  63: { icon: '🌧️', label: '비' },
  65: { icon: '🌧️', label: '강한 비' },
  71: { icon: '🌨️', label: '약한 눈' },
  73: { icon: '🌨️', label: '눈' },
  75: { icon: '❄️', label: '강한 눈' },
  80: { icon: '🌦️', label: '소나기' },
  81: { icon: '🌧️', label: '강한 소나기' },
  82: { icon: '⛈️', label: '매우 강한 소나기' },
  95: { icon: '⛈️', label: '뇌우' },
  96: { icon: '⛈️', label: '우박 동반 뇌우' },
  99: { icon: '⛈️', label: '강한 우박 동반 뇌우' },
}

export function getWeatherInfo(code) {
  return WEATHER_CODE_MAP[code] || { icon: '🌡️', label: '정보 없음' }
}

const RAIN_CODES = [61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 95, 96, 99]

export function getTravelSuitability(rainChance, code, uvIndex) {
  if (rainChance > 60 || RAIN_CODES.includes(code)) {
    return { level: 'bad', text: '☔ 비 예상 — 실내 명소(문화시설·쇼핑) 위주로 추천' }
  }
  if (uvIndex >= 8) {
    return { level: 'caution', text: '☀️ 자외선 매우 강함 — 자외선 차단제 필수' }
  }
  if (rainChance > 30) {
    return { level: 'caution', text: '🌦️ 비 올 가능성 있음 — 우산을 챙기세요' }
  }
  return { level: 'good', text: '✅ 야외 나들이 하기 좋은 날씨예요' }
}
