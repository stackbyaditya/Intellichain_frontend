import { fetchWithTimeout } from '@/lib/http';

const MAPMYINDIA_API_KEY = import.meta.env.VITE_MAPMYINDIA_API_KEY;
const MAPMYINDIA_BASE_URL = 'https://apis.mapmyindia.com';

interface MapMyIndiaGeocodeResponse {
  results: Array<{
    lat: string;
    lng: string;
    formattedAddress: string;
  }>;
}

export async function geocodeAddress(query: string, abortSignal?: AbortSignal): Promise<MapMyIndiaGeocodeResponse> {
  if (!MAPMYINDIA_API_KEY) {
    throw new Error('MapMyIndia API key is not configured.');
  }
  const url = `${MAPMYINDIA_BASE_URL}/advancedmaps/v1/${MAPMYINDIA_API_KEY}/geocode?query=${encodeURIComponent(query)}`;
  const response = await fetchWithTimeout(url, { signal: abortSignal });
  if (!response.ok) {
    throw new Error(`MapMyIndia Geocoding API error: ${response.statusText}`);
  }
  const data = await response.json();
  return data as MapMyIndiaGeocodeResponse;
}

interface MapMyIndiaETAResponse {
  routes: Array<{
    distance: number;
    duration: number;
  }>;
}

export async function getETA(start: [number, number], end: [number, number], abortSignal?: AbortSignal): Promise<MapMyIndiaETAResponse> {
  if (!MAPMYINDIA_API_KEY) {
    throw new Error('MapMyIndia API key is not configured.');
  }
  const url = `${MAPMYINDIA_BASE_URL}/advancedmaps/v1/${MAPMYINDIA_API_KEY}/route?start=${start[1]},${start[0]}&end=${end[1]},${end[0]}`;
  const response = await fetchWithTimeout(url, { signal: abortSignal });
  if (!response.ok) {
    throw new Error(`MapMyIndia Route API error: ${response.statusText}`);
  }
  const data = await response.json();
  return data as MapMyIndiaETAResponse;
}
