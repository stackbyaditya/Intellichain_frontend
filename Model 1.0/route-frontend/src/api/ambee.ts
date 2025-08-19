import { fetchWithTimeout } from '@/lib/http';

const AMBEE_API_KEY = import.meta.env.VITE_AMBEE_API_KEY;
const AMBEE_BASE_URL = 'https://api.ambeedata.com';

export async function getAQI(lat: number, lon: number, abortSignal?: AbortSignal) {
  if (!AMBEE_API_KEY) {
    throw new Error('Ambee API key is not configured.');
  }

  const url = `${AMBEE_BASE_URL}/latest/by-lat-lng?lat=${lat}&lng=${lon}`;

  try {
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
    return data;
  } catch (error) {
    console.error('Error fetching Ambee AQI data:', error);
    throw error;
  }
}

export function normalizeAQIData(data: any) {
  // Assuming data structure from Ambee API
  const latestData = data.stations[0]; // Get the first station's data
  return {
    aqi: latestData.AQI,
    dominantPollutant: latestData.dominant_pollutant,
    // Add other pollutants if needed
  };
}