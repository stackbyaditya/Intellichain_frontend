import { normalizeAQIData } from '@/api/ambee';
import { normalizeWeatherData } from '@/api/openweather';
import { UnitSystem } from '@/lib/units';

// Dummy data types for demonstration
interface Vehicle {
  id: string;
  status: 'in-transit' | 'idle' | 'maintenance';
  fuelConsumption: number; // in Liters or Gallons
  distanceTraveled: number; // in km or miles
  maintenanceCost: number; // in currency units
}

interface Delivery {
  id: string;
  scheduledTime: number; // timestamp
  actualTime: number; // timestamp
  price: number; // currency
}

interface WeatherData {
  precipitation: number; // mm or inches
  windSpeed: number; // km/h or mph
  temperature: number; // Celsius or Fahrenheit
}

interface AQIData {
  aqi: number;
  dominantPollutant: string;
}

export function fleetUtilization(vehicles: Vehicle[]): number {
  const inTransitVehicles = vehicles.filter(v => v.status === 'in-transit').length;
  return (inTransitVehicles / vehicles.length) * 100;
}

export function maintenanceTrend(historicalCosts: number[]): string {
  if (historicalCosts.length < 2) return 'N/A';
  const lastTwo = historicalCosts.slice(-2);
  if (lastTwo[1] > lastTwo[0]) return 'Upward';
  if (lastTwo[1] < lastTwo[0]) return 'Downward';
  return 'Stable';
}

export function fuelEfficiency(vehicles: Vehicle[], unitSystem: UnitSystem): number {
  const totalFuel = vehicles.reduce((sum, v) => sum + v.fuelConsumption, 0);
  const totalDistance = vehicles.reduce((sum, v) => sum + v.distanceTraveled, 0);

  if (totalFuel === 0) return 0;

  // Assuming fuelConsumption is in Liters and distance in km for metric
  // For imperial, assuming gallons and miles
  if (unitSystem === 'metric') {
    return totalDistance / totalFuel; // km/L
  } else {
    return totalDistance / totalFuel; // miles/gallon
  }
}

export function onTimePercent(deliveries: Delivery[]): number {
  if (deliveries.length === 0) return 0;
  const onTimeDeliveries = deliveries.filter(d => d.actualTime <= d.scheduledTime).length;
  return (onTimeDeliveries / deliveries.length) * 100;
}

export function priceSensitivityIndex(historicalPrices: number[], marketPrices: number[]): number {
  if (historicalPrices.length === 0 || marketPrices.length === 0) return 0;
  const avgHistorical = historicalPrices.reduce((a, b) => a + b, 0) / historicalPrices.length;
  const avgMarket = marketPrices.reduce((a, b) => a + b, 0) / marketPrices.length;

  if (avgMarket === 0) return 0;
  return ((avgHistorical - avgMarket) / avgMarket) * 100;
}

export function routeEfficiencyScore(data: { distance: number; duration: number; optimizedDistance: number; optimizedDuration: number }): number {
  const distanceEfficiency = (data.distance - data.optimizedDistance) / data.distance;
  const durationEfficiency = (data.duration - data.optimizedDuration) / data.duration;
  return ((distanceEfficiency + durationEfficiency) / 2) * 100;
}

export function weatherDelayFactor(weather: WeatherData): number {
  // Example: significant precipitation adds a delay factor
  if (weather.precipitation > 5) return 1.2; // 20% delay
  if (weather.windSpeed > 30) return 1.1; // 10% delay for strong winds
  return 1.0;
}

export function combinedETA(baseETA: number, weather: WeatherData): number {
  return baseETA * weatherDelayFactor(weather);
}

export function emissionsEstimate(aqiData: AQIData, distanceKm: number, unitSystem: UnitSystem): number {
  // This is a highly simplified estimation. Real emissions depend on vehicle type, fuel, speed, etc.
  // Assuming a base emission factor and adjusting based on AQI (as a proxy for pollution levels)
  const baseEmissionFactorKgPerKm = 0.15; // Example: 0.15 kg CO2 per km
  const aqiImpactFactor = aqiData.aqi / 100; // Scale AQI to a factor

  let distance = distanceKm;
  if (unitSystem === 'imperial') {
    distance = distanceKm * 1.60934; // Convert miles to km for calculation
  }

  return baseEmissionFactorKgPerKm * distance * (1 + aqiImpactFactor);
}