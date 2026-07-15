<script setup>
import { onMounted } from 'vue'
import { useWeather } from '@/composables/useWeather'
import { getWeatherInfo, getTravelSuitability } from '@/utils/weatherCode'

const { weather, loading, error, fetchSeoulWeather } = useWeather()

onMounted(fetchSeoulWeather)
</script>

<template>
  <div class="weather-widget">
    <p v-if="loading" class="weather-status">날씨 정보를 불러오는 중...</p>
    <p v-else-if="error" class="weather-status error">
      날씨 정보를 가져오지 못했어요 ({{ error }})
    </p>

    <template v-else-if="weather">
      <div class="weather-main">
        <span class="weather-icon">{{ getWeatherInfo(weather.current.weather_code).icon }}</span>
        <div>
          <div class="weather-temp">{{ Math.round(weather.current.temperature_2m) }}°C</div>
          <div class="weather-desc">
            {{ getWeatherInfo(weather.current.weather_code).label }} · 체감
            {{ Math.round(weather.current.apparent_temperature) }}°C
          </div>
        </div>
      </div>

      <div
        class="suitability"
        :class="
          getTravelSuitability(
            weather.daily.precipitation_probability_max[0],
            weather.current.weather_code,
            weather.daily.uv_index_max[0]
          ).level
        "
      >
        {{
          getTravelSuitability(
            weather.daily.precipitation_probability_max[0],
            weather.current.weather_code,
            weather.daily.uv_index_max[0]
          ).text
        }}
      </div>
    </template>
  </div>
</template>

<style scoped>
.weather-widget {
  background: var(--lh-surface);
  border: 1px solid var(--lh-line);
  border-radius: 14px;
  padding: 16px 20px;
}

.weather-status {
  font-size: 13px;
  color: var(--lh-muted);
  margin: 0;
}

.weather-status.error {
  color: var(--lh-red);
}

.weather-main {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 10px;
}

.weather-icon {
  font-size: 36px;
  line-height: 1;
}

.weather-temp {
  font-size: 26px;
  font-weight: 800;
}

.weather-desc {
  font-size: 13px;
  color: var(--lh-muted);
}

.suitability {
  font-size: 13px;
  font-weight: 600;
  padding: 8px 12px;
  border-radius: 8px;
}

.suitability.good { background: var(--lh-green-soft); color: var(--lh-green); }
.suitability.caution { background: rgba(194, 130, 0, 0.12); color: #a06800; }
.suitability.bad { background: var(--lh-red-soft); color: var(--lh-red); }
</style>
