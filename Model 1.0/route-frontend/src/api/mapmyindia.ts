import { fetchWithTimeout } from '@/lib/http';

const MAPMYINDIA_API_KEY = import.meta.env.VITE_MAPMYINDIA_API_KEY;
const MAPMYINDIA_BASE_URL = 'https://apis.mapmyindia.com/advancedmaps/v1';

export async function getETA(startCoords: [number, number], endCoords: [number, number], abortSignal?: AbortSignal) {
  if (!MAPMYINDIA_API_KEY) {
    throw new Error('MapMyIndia API key is not configured.');
  }

  const url = `${MAPMYINDIA_BASE_URL}/${MAPMYINDIA_API_KEY}/route_adv/driving/${startCoords[0]},${startCoords[1]};${endCoords[0]},${endCoords[1]}?steps=false&alternatives=false`;

  try {
    const response = await fetchWithTimeout(url, { signal: abortSignal });
    if (!response.ok) {
      throw new Error(`MapMyIndia API error: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching MapMyIndia ETA:', error);
    throw error;
  }
}