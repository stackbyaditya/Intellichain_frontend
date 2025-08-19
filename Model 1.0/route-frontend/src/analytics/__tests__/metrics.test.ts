import { fleetUtilization, maintenanceTrend, fuelEfficiency, onTimePercent, priceSensitivityIndex, routeEfficiencyScore, weatherDelayFactor, combinedETA, emissionsEstimate } from '../metrics';

describe('Analytics Metrics', () => {
  // Mock data for testing
  const mockVehicles = [
    { id: 'V001', status: 'in-transit', fuelConsumption: 50, distanceTraveled: 500, maintenanceCost: 100 },
    { id: 'V002', status: 'idle', fuelConsumption: 30, distanceTraveled: 300, maintenanceCost: 50 },
    { id: 'V003', status: 'maintenance', fuelConsumption: 0, distanceTraveled: 0, maintenanceCost: 200 },
  ];

  const mockDeliveries = [
    { id: 'D001', scheduledTime: 100, actualTime: 90, price: 25 },
    { id: 'D002', scheduledTime: 200, actualTime: 210, price: 30 },
    { id: 'D003', scheduledTime: 300, actualTime: 300, price: 20 },
  ];

  it('should calculate fleet utilization correctly', () => {
    expect(fleetUtilization(mockVehicles)).toBeCloseTo(33.33);
  });

  it('should determine maintenance trend correctly', () => {
    expect(maintenanceTrend([100, 110, 120])).toBe('Upward');
    expect(maintenanceTrend([120, 110, 100])).toBe('Downward');
    expect(maintenanceTrend([100, 100, 100])).toBe('Stable');
    expect(maintenanceTrend([100])).toBe('N/A');
  });

  it('should calculate fuel efficiency correctly', () => {
    expect(fuelEfficiency(mockVehicles, 'metric')).toBeCloseTo(9.375);
    expect(fuelEfficiency([], 'metric')).toBe(0);
  });

  it('should calculate on-time percentage correctly', () => {
    expect(onTimePercent(mockDeliveries)).toBeCloseTo(66.67);
    expect(onTimePercent([])).toBeNaN(); // No deliveries, so NaN is expected
  });

  it('should calculate price sensitivity index correctly', () => {
    expect(priceSensitivityIndex([10, 20], [15, 25])).toBeCloseTo(-0.1667);
    expect(priceSensitivityIndex([], [])).toBe(0);
  });

  it('should calculate route efficiency score correctly', () => {
    const route = { distance: 1000, duration: 60, optimizedDistance: 900, optimizedDuration: 50 };
    expect(routeEfficiencyScore(route)).toBeCloseTo(87.5);
  });

  it('should calculate weather delay factor correctly', () => {
    expect(weatherDelayFactor({ temperature: 20, windSpeed: 5, precipitation: 15, description: 'rain', icon: '' })).toBe(1.2);
    expect(weatherDelayFactor({ temperature: 20, windSpeed: 5, precipitation: 5, description: 'clear', icon: '' })).toBe(1.0);
  });

  it('should calculate combined ETA correctly', () => {
    const weather = { temperature: 20, windSpeed: 5, precipitation: 15, description: 'rain', icon: '' };
    expect(combinedETA(60, weather)).toBeCloseTo(72);
  });

  it('should estimate emissions correctly', () => {
    const aqiData = { aqi: 150, dominantPollutant: 'pm25' };
    expect(emissionsEstimate(aqiData, 100, 'metric')).toBeCloseTo(22.5);
    const aqiDataLow = { aqi: 50, dominantPollutant: 'o3' };
    expect(emissionsEstimate(aqiDataLow, 100, 'imperial')).toBeCloseTo(16);
  });
});
