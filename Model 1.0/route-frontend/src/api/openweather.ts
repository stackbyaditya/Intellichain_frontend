import { fetchWithTimeout } from '@/lib/http';

const OPENWEATHERMAP_API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
const OPENWEATHERMAP_BASE_URL = 'https://api.openweathermap.org/data/2.5';

interface OpenWeatherMapResponse {
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  rain?: {
    '1h'?: number;
    '3h'?: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  name: string;
}

export async function getCurrentWeather(latitude: number, longitude: number, abortSignal?: AbortSignal): Promise<OpenWeatherMapResponse> {
  if (!OPENWEATHERMAP_API_KEY) {
    throw new Error('OpenWeatherMap API key is not configured.');
  }
  const url = `${OPENWEATHERMAP_BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;
  const response = await fetchWithTimeout(url, { signal: abortSignal });
  if (!response.ok) {
    throw new Error(`OpenWeatherMap API error: ${response.statusText}`);
  }
  const data = await response.json();
  return data as OpenWeatherMapResponse;
}

export function normalizeWeatherData(data: OpenWeatherMapResponse) {
  const precipitation = data.rain?.['1h'] || 0; // in mm
  const windSpeed = data.wind.speed; // in m/s
  const temperature = data.main.temp; // in Celsius

  return {
    temperature,
    windSpeed,
    precipitation,
    description: data.weather[0]?.description || 'N/A',
    icon: data.weather[0]?.icon || 'N/A',
  };
}
