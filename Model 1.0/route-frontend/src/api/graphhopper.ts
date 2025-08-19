import { fetchWithTimeout } from '@/lib/http';

const GRAPHHOPPER_API_KEY = import.meta.env.VITE_GRAPHHOPPER_API_KEY;
const GRAPHHOPPER_BASE_URL = 'https://graphhopper.com/api/1';

export async function getOptimizedRoute(points: [number, number][], abortSignal?: AbortSignal) {
  if (!GRAPHHOPPER_API_KEY) {
    throw new Error('GraphHopper API key is not configured.');
  }

  const coordinates = points.map(p => `${p[0]},${p[1]}`).join(';');
  const url = `${GRAPHHOPPER_BASE_URL}/route?point=${coordinates}&vehicle=car&key=${GRAPHHOPPER_API_KEY}`;

  try {
    const response = await fetchWithTimeout(url, { signal: abortSignal });
    if (!response.ok) {
      throw new Error(`GraphHopper API error: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching GraphHopper route:', error);
    throw error;
  }
}

export function calculateCostEstimate(distance: number, duration: number): number {
  // Dummy cost calculation based on distance and duration
  // Replace with actual logic based on vehicle type, fuel cost, etc.
  const fuelCostPerKm = 0.1; // Example: $0.1 per km
  const timeCostPerHour = 10; // Example: $10 per hour

  const cost = (distance / 1000) * fuelCostPerKm + (duration / 3600) * timeCostPerHour;
  return cost;
}