import { fetchWithTimeout } from '@/lib/http';

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const MAPBOX_BASE_URL = 'https://api.mapbox.com';

export async function getVehiclePositions(vehicleId: string, abortSignal?: AbortSignal) {
  if (!MAPBOX_ACCESS_TOKEN) {
    throw new Error('Mapbox Access Token is not configured.');
  }
  // This is a placeholder. Real-time vehicle positions would typically come from a backend service
  // that integrates with a telematics provider, not directly from Mapbox APIs.
  // Mapbox APIs are more for static data, geocoding, routing, and map display.
  // For demonstration, we'll return mock data.
  return {
    vehicleId,
    lat: 34.0522 + (Math.random() - 0.5) * 0.01,
    lon: -118.2437 + (Math.random() - 0.5) * 0.01,
    timestamp: Date.now(),
  };
}

export function decodePolyline(encoded: string): [number, number][] {
  // This is a simplified polyline decoder. For a robust solution, use a library.
  let index = 0,
    len = encoded.length,
    lat = 0,
    lng = 0,
    array: [number, number][] = [];

  while (index < len) {
    let b,
      shift = 0,
      result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = (result & 1) ? ~(result >> 1) : (result >> 1);
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = (result & 1) ? ~(result >> 1) : (result >> 1);
    lng += dlng;

    array.push([lng / 1e5, lat / 1e5]);
  }
  return array;
}