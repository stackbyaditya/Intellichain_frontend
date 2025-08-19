import { fetchWithTimeout } from '@/lib/http';

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const MAPBOX_BASE_URL = 'https://api.mapbox.com';

interface MapboxReverseGeocodeResponse {
  features: Array<{
    place_name: string;
    center: [number, number];
  }>;
}

export async function reverseGeocode(longitude: number, latitude: number, abortSignal?: AbortSignal): Promise<MapboxReverseGeocodeResponse> {
  if (!MAPBOX_ACCESS_TOKEN) {
    throw new Error('Mapbox access token is not configured.');
  }
  const url = `${MAPBOX_BASE_URL}/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_ACCESS_TOKEN}`;
  const response = await fetchWithTimeout(url, { signal: abortSignal });
  if (!response.ok) {
    throw new Error(`Mapbox Geocoding API error: ${response.statusText}`);
  }
  const data = await response.json();
  return data as MapboxReverseGeocodeResponse;
}

export function decodePolyline(encodedPolyline: string, precision: number = 5): [number, number][] {
  // Simplified polyline decoding (for illustration)
  // In a real app, use a dedicated library like 'polyline-encoded'
  const points: [number, number][] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;
  const factor = Math.pow(10, precision);

  while (index < encodedPolyline.length) {
    let b;
    let shift = 0;
    let result = 0;
    do {
      b = encodedPolyline.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encodedPolyline.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    points.push([lat / factor, lng / factor]);
  }
  return points;
}

// Placeholder for live tracking helpers (e.g., fetching vehicle positions)
export async function getVehiclePositions(vehicleId: string, abortSignal?: AbortSignal): Promise<any> {
  // This would typically involve a real-time API or WebSocket
  console.log(`Fetching live position for vehicle ${vehicleId}`);
  return new Promise(resolve => setTimeout(() => {
    resolve({
      latitude: 34.0522,
      longitude: -118.2437,
      timestamp: Date.now(),
    });
  }, 1000));
}
