import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAlert } from '@/context/AlertContext';
import { useSettings } from '@/context/SettingsContext';
import { Card, CardContent, CardHeader, CardTitle, MetricCard, MapContainer, Input, Button } from '@/components/ui';
import { LineChart, BarChart, DonutChart } from '@/components/charts';
import { getOptimizedRoute, calculateCostEstimate } from '@/api/graphhopper';
import { getAQI, normalizeAQIData } from '@/api/ambee';
import { getCurrentWeather, normalizeWeatherData } from '@/api/openweather';
import { fleetUtilization, maintenanceTrend, fuelEfficiency, routeEfficiencyScore, emissionsEstimate } from '@/analytics/metrics';
import { convertDistance, formatDistance, convertCurrency, formatCurrency } from '@/lib/units';

// Dummy data for vehicles and historical costs (replace with actual backend data)
const MOCK_VEHICLES = [
  { id: 'V001', status: 'in-transit', fuelConsumption: 50, distanceTraveled: 500, maintenanceCost: 100 },
  { id: 'V002', status: 'idle', fuelConsumption: 30, distanceTraveled: 300, maintenanceCost: 50 },
  { id: 'V003', status: 'maintenance', fuelConsumption: 0, distanceTraveled: 0, maintenanceCost: 200 },
];
const MOCK_HISTORICAL_MAINTENANCE_COSTS = [1000, 1200, 1100, 1300, 1400];

function OwnerDashboard() {
  const { userRole } = useAuth();
  const { showInfo, showError } = useAlert();
  const { unitSystem, currency } = useSettings();

  const [mockMode, setMockMode] = useState(true); // State for Mock vs Live toggle
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fleetUtil, setFleetUtil] = useState<string>('N/A');
  const [maintTrend, setMaintTrend] = useState<string>('N/A');
  const [fuelEff, setFuelEff] = useState<string>('N/A');
  const [routeEffScore, setRouteEffScore] = useState<string>('N/A');
  const [emissions, setEmissions] = useState<string>('N/A');
  const [totalFuelCost, setTotalFuelCost] = useState<string>('N/A');

  useEffect(() => {
    const fetchData = async (abortSignal: AbortSignal) => {
      setLoading(true);
      setError(null);
      try {
        // Simulate fetching vehicle data
        const vehicles = mockMode ? MOCK_VEHICLES : MOCK_VEHICLES; // Replace with actual API call
        setFleetUtil(fleetUtilization(vehicles).toFixed(2) + '%');
        setMaintTrend(maintenanceTrend(MOCK_HISTORICAL_MAINTENANCE_COSTS));
        setFuelEff(fuelEfficiency(vehicles, unitSystem).toFixed(2) + (unitSystem === 'metric' ? ' km/L' : ' miles/gallon'));

        // Simulate route optimization and cost estimate
        const dummyRoutePoints: [number, number][] = [[10.0, 20.0], [10.1, 20.1]];
        const routeData = mockMode ? { paths: [{ distance: 10000, time: 600, points: { type: 'LineString', coordinates: [] } }] } : await getOptimizedRoute(dummyRoutePoints, abortSignal);
        const optimizedDistance = routeData.paths[0].distance;
        const optimizedDuration = routeData.paths[0].time;
        setRouteEffScore(routeEfficiencyScore({ distance: 12000, duration: 700, optimizedDistance, optimizedDuration }).toFixed(2) + '%');
        setTotalFuelCost(formatCurrency(convertCurrency(calculateCostEstimate(optimizedDistance, optimizedDuration), 'USD', currency), currency));

        // Simulate environmental data
        const dummyLat = 34.0522;
        const dummyLon = -118.2437;
        const aqiData = mockMode ? { stations: [{ AQI: 75, dominant_pollutant: 'o3' }] } : await getAQI(dummyLat, dummyLon, abortSignal);
        const weatherData = mockMode ? { rain: { '1h': 5 }, wind: { speed: 10, deg: 180 }, main: { temp: 25 } } as any : await getCurrentWeather(dummyLat, dummyLon, abortSignal);

        const normalizedAqi = normalizeAQIData(aqiData);
        const normalizedWeather = normalizeWeatherData(weatherData);
        setEmissions(emissionsEstimate(normalizedAqi, 100, unitSystem).toFixed(2) + ' kg CO2');

      } catch (err: any) {
        setError(err.message);
        showError(`Failed to load dashboard data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    const controller = new AbortController();
    fetchData(controller.signal);

    return () => {
      controller.abort();
    };
  }, [mockMode, userRole, unitSystem, currency, showInfo, showError]);

  // Dummy data for alerts
  useEffect(() => {
    if (userRole === 'owner' || userRole === 'admin') {
      if (Math.random() > 0.7) { // Simulate a condition for alert
        showInfo('Maintenance required for Vehicle V101!');
      }
    }
  }, [userRole, showInfo]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Owner Dashboard</h1>

      {/* Mock vs Live Toggle */}
      <div className="mb-6 flex items-center space-x-2">
        <span className="text-gray-700">Data Mode:</span>
        <Button
          onClick={() => setMockMode(!mockMode)}
          variant={mockMode ? "default" : "outline"}
          size="sm"
        >
          {mockMode ? "Mock Data" : "Live Data"}
        </Button>
      </div>

      {loading && <p>Loading dashboard...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <MetricCard title="Fleet Utilization" value={fleetUtil} />
          <MetricCard title="Maintenance Trend" value={maintTrend} />
          <MetricCard title="Fuel Efficiency" value={fuelEff} />
          <MetricCard title="Route Efficiency Score" value={routeEffScore} />
          <MetricCard title="Emissions Estimate" value={emissions} />
          <MetricCard title="Total Fuel Cost" value={totalFuelCost} />
        </div>
      )}

      {/* Time-series Chart (Placeholder for actual data) */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Fleet Performance Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart
            title="Daily Utilization"
            data={{
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
              datasets: [{ label: 'Utilization %', data: [80, 82, 78, 85, 83], borderColor: 'blue', fill: false }],
            }}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </CardContent>
      </Card>

      {/* Map Panel */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Live Vehicle Map</CardTitle>
        </CardHeader>
        <CardContent>
          <MapContainer /> {/* Use MapContainer component */}
        </CardContent>
      </Card>

      {/* Alerts/Notifications Pane */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Alerts will be displayed by AlertDisplay component globally.</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default OwnerDashboard;
