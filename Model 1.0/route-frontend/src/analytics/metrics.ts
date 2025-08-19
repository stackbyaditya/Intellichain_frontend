import { normalizeWeatherData } from '@/api/openweather';
import { normalizeAQIData } from '@/api/ambee';
import { UnitSystem } from '@/lib/units';

// Placeholder types for raw data
interface VehicleData {
  id: string;
  status: 'idle' | 'in-transit' | 'maintenance';
  fuelConsumption: number; // liters or gallons
  distanceTraveled: number; // km or miles
  maintenanceCost: number; // currency
}

interface RouteData {
  distance: number; // km
  duration: number; // seconds
  optimizedDistance?: number; // km
  optimizedDuration?: number; // seconds
}

interface DeliveryData {
  scheduledTime: number; // timestamp
  actualTime: number; // timestamp
  price: number; // currency
}

// Pure functions for analytics metrics

export function fleetUtilization(vehicles: VehicleData[]): number {
  const inTransit = vehicles.filter(v => v.status === 'in-transit').length;
  return (inTransit / vehicles.length) * 100;
}

export function maintenanceTrend(historicalCosts: number[]): string {
  if (historicalCosts.length < 2) return 'N/A';
  const lastTwo = historicalCosts.slice(-2);
  if (lastTwo[1] > lastTwo[0]) return 'Upward';
  if (lastTwo[1] < lastTwo[0]) return 'Downward';
  return 'Stable';
}

export function fuelEfficiency(vehicles: VehicleData[], unitSystem: UnitSystem): number {
  const totalDistance = vehicles.reduce((sum, v) => sum + v.distanceTraveled, 0);
  const totalFuel = vehicles.reduce((sum, v) => sum + v.fuelConsumption, 0);
  if (totalFuel === 0) return 0;
  // Assuming fuelConsumption is in liters and distance in km for metric, or gallons and miles for imperial
  return totalDistance / totalFuel;
}

export function onTimePercent(deliveries: DeliveryData[]): number {
  const onTime = deliveries.filter(d => d.actualTime <= d.scheduledTime).length;
  return (onTime / deliveries.length) * 100;
}

export function priceSensitivityIndex(historicalPrices: number[], marketPrices: number[]): number {
  // Placeholder for a more complex calculation
  if (historicalPrices.length === 0 || marketPrices.length === 0) return 0;
  const avgHistorical = historicalPrices.reduce((a, b) => a + b, 0) / historicalPrices.length;
  const avgMarket = marketPrices.reduce((a, b) => a + b, 0) / marketPrices.length;
  return (avgHistorical - avgMarket) / avgMarket;
}

export function routeEfficiencyScore(route: RouteData): number {
  if (!route.optimizedDistance || !route.optimizedDuration) return 0;
  const distanceEfficiency = route.optimizedDistance / route.distance;
  const timeEfficiency = route.optimizedDuration / route.duration;
  return ((distanceEfficiency + timeEfficiency) / 2) * 100; // Average of distance and time efficiency
}

export function weatherDelayFactor(weatherData: ReturnType<typeof normalizeWeatherData>): number {
  return weatherData.precipitation > 10 ? 1.2 : 1.0; // 20% delay if precipitation > 10mm
}

export function combinedETA(baseETA: number, weatherData: ReturnType<typeof normalizeWeatherData>): number {
  return baseETA * weatherDelayFactor(weatherData);
}

export function emissionsEstimate(aqiData: ReturnType<typeof normalizeAQIData>, distance: number, unitSystem: UnitSystem): number {
  // Simplified estimation: higher AQI means more emissions impact per distance
  const baseEmissionFactor = unitSystem === 'metric' ? 0.1 : 0.16; // kg CO2 per km or mile
  return aqiData.aqi > 100 ? distance * baseEmissionFactor * 1.5 : distance * baseEmissionFactor;
}
