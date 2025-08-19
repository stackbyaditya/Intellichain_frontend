import { fetchWithTimeout } from '@/lib/http';

const OPENWEATHERMAP_API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
const OPENWEATHERMAP_BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function getCurrentWeather(lat: number, lon: number, abortSignal?: AbortSignal) {
  if (!OPENWEATHERMAP_API_KEY) {
    throw new Error('OpenWeatherMap API key is not configured.');
  }

  const url = `${OPENWEATHERMAP_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;

  try {
    const response = await fetchWithTimeout(url, { signal: abortSignal });
    if (!response.ok) {
      throw new Error(`OpenWeatherMap API error: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching OpenWeatherMap data:', error);
    throw error;
  }
}

export function normalizeWeatherData(data: any) {
  return {
    temperature: data.main.temp,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    windSpeed: data.wind.speed,
    precipitation: data.rain ? data.rain['1h'] || 0 : 0, // '1h' for rain in last hour
  };
}