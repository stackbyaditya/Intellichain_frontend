import { fetchWithTimeout } from '@/lib/http';

const GRAPHHOPPER_API_KEY = import.meta.env.VITE_GRAPHHOPPER_API_KEY;
const GRAPHHOPPER_BASE_URL = 'https://graphhopper.com/api/1';

interface RouteOptimizationResponse {
  paths: Array<{
    distance: number;
    time: number;
    points: {
      type: string;
      coordinates: [number, number][];
    };
  }>;
}

export async function getOptimizedRoute(points: [number, number][], abortSignal?: AbortSignal): Promise<RouteOptimizationResponse> {
  if (!GRAPHHOPPER_API_KEY) {
    throw new Error('GraphHopper API key is not configured.');
  }

  const formattedPoints = points.map(p => `${p[1]},${p[0]}`).join('&');
  const url = `${GRAPHHOPPER_BASE_URL}/route?point=${formattedPoints}&vehicle=car&key=${GRAPHHOPPER_API_KEY}`;

  const response = await fetchWithTimeout(url, { signal: abortSignal });
  if (!response.ok) {
    throw new Error(`GraphHopper API error: ${response.statusText}`);
  }
  const data = await response.json();
  // In a real app, add schema validation here
  return data as RouteOptimizationResponse;
}

export function calculateCostEstimate(distance: number, time: number): number {
  // Placeholder for cost estimation logic
  // This would depend on fuel costs, vehicle wear, driver wages, etc.
  const fuelCostPerKm = 0.1; // Example
  const driverWagePerHour = 20; // Example

  const cost = (distance / 1000) * fuelCostPerKm + (time / 3600) * driverWagePerHour;
  return parseFloat(cost.toFixed(2));
}
