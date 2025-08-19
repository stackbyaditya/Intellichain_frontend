import { fetchWithTimeout } from '@/lib/http';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:3000';

// Example DTOs (Data Transfer Objects) from backend
interface VehicleDTO {
  vehicleId: string;
  currentLat: number;
  currentLon: number;
  status: string;
  fuelLevel: number;
}

interface RouteDTO {
  routeId: string;
  distance: number;
  duration: number;
}

// Example View Models (transformed DTOs for frontend use)
export interface Vehicle {
  id: string;
  latitude: number;
  longitude: number;
  status: 'idle' | 'in-transit' | 'maintenance';
  fuel: number;
}

export interface Route {
  id: string;
  distanceKm: number;
  durationMinutes: number;
}

// Adapters to transform DTOs to View Models
function adaptVehicle(dto: VehicleDTO): Vehicle {
  return {
    id: dto.vehicleId,
    latitude: dto.currentLat,
    longitude: dto.currentLon,
    status: dto.status as Vehicle['status'], // Type assertion, ideally map explicitly
    fuel: dto.fuelLevel,
  };
}

function adaptRoute(dto: RouteDTO): Route {
  return {
    id: dto.routeId,
    distanceKm: dto.distance,
    durationMinutes: dto.duration,
  };
}

export async function fetchVehicles(abortSignal?: AbortSignal): Promise<Vehicle[]> {
  const response = await fetchWithTimeout(`${BACKEND_BASE_URL}/vehicles`, { signal: abortSignal });
  if (!response.ok) {
    throw new Error(`Failed to fetch vehicles: ${response.statusText}`);
  }
  const data: VehicleDTO[] = await response.json();
  return data.map(adaptVehicle);
}

export async function fetchRoutes(abortSignal?: AbortSignal): Promise<Route[]> {
  const response = await fetchWithTimeout(`${BACKEND_BASE_URL}/routes`, { signal: abortSignal });
  if (!response.ok) {
    throw new Error(`Failed to fetch routes: ${response.statusText}`);
  }
  const data: RouteDTO[] = await response.json();
  return data.map(adaptRoute);
}

// Feature flag for mock data (for local development)
export const USE_MOCK_BACKEND = import.meta.env.VITE_USE_MOCK_BACKEND === 'true';
