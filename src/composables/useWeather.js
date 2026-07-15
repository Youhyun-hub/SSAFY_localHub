// Open-Meteo API 연동 (회원가입/API키 불필요, 비상업적 이용)
// 서울 좌표(광화문 부근): 위도 37.5665, 경도 126.9780
import { ref } from 'vue'

const SEOUL_LAT = 37.5665
const SEOUL_LON = 126.978

export function useWeather() {
  const weather = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchSeoulWeather() {
    loading.value = true
    error.value = null
    try {
      const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${SEOUL_LAT}&longitude=${SEOUL_LON}` +
        `&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,is_day` +
        `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max` +
        `&timezone=Asia%2FSeoul&forecast_days=1`

      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      weather.value = await res.json()
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return { weather, loading, error, fetchSeoulWeather }
}
