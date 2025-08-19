import { fetchWithTimeout } from '@/lib/http';

const AMBEE_API_KEY = import.meta.env.VITE_AMBEE_API_KEY;
const AMBEE_BASE_URL = 'https://api.ambeedata.com';

interface AmbeeAQIResponse {
  stations: Array<{
    AQI: number;
    dominant_pollutant: string;
  }>;
}

export async function getAQI(latitude: number, longitude: number, abortSignal?: AbortSignal): Promise<AmbeeAQIResponse> {
  if (!AMBEE_API_KEY) {
    throw new Error('Ambee API key is not configured.');
  }
  const url = `${AMBEE_BASE_URL}/latest/by-lat-lng?lat=${latitude}&lng=${longitude}`;
  const response = await fetchWithTimeout(url, {
    signal: abortSignal,
    headers: {
      'x-api-key': AMBEE_API_KEY,
      'Content-type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error(`Ambee API error: ${response.statusText}`);
  }
  const data = await response.json();
  return data as AmbeeAQIResponse;
}

export function normalizeAQIData(data: AmbeeAQIResponse) {
  const aqi = data.stations[0]?.AQI || 0;
  const dominantPollutant = data.stations[0]?.dominant_pollutant || 'N/A';

  return {
    aqi,
    dominantPollutant,
  };
}
