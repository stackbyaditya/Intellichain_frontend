import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAlert } from '@/context/AlertContext';
import { useSettings } from '@/context/SettingsContext';
import { Card, CardContent, CardHeader, CardTitle, MetricCard, Button } from '@/components/ui';
import { LineChart } from '@/components/charts';
import { getVehiclePositions, decodePolyline } from '@/api/mapbox';
import { getCurrentWeather, normalizeWeatherData } from '@/api/openweather';
import { getAQI, normalizeAQIData } from '@/api/ambee';
import { combinedETA, weatherDelayFactor } from '@/analytics/metrics';
import { formatSpeed, formatTemperature } from '@/lib/units';
import Map from 'react-map-gl/maplibre';
import { Marker, Source, Layer } from 'react-map-gl/maplibre';
import 'mapbox-gl/dist/mapbox-gl.css';
import { socket } from '@/lib/socket';

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

interface VehiclePosition {
  vehicleId: string;
  lat: number;
  lon: number;
  timestamp: number;
}

function DriverDashboard() {
  const { userRole } = useAuth();
  const { showInfo, showError } = useAlert();
  const { unitSystem } = useSettings();

  const [mockMode, setMockMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentSpeed, setCurrentSpeed] = useState<string>('N/A');
  const [etaToNextStop, setEtaToNextStop] = useState<string>('N/A');
  const [fuelLevel, setFuelLevel] = useState<string>('N/A');
  const [weather, setWeather] = useState<string>('N/A');
  const [aqi, setAqi] = useState<string>('N/A');
  const [vehiclePosition, setVehiclePosition] = useState<VehiclePosition | null>(null);

  const mapRef = useRef<any>(null);

  // Mock planned route for visualization
  const plannedRoute = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: [
        [-118.2437, 34.0522], // Example start
        [-118.25, 34.06], // Example point
        [-118.26, 34.07], // Example end
      ],
    },
  };

  useEffect(() => {
    const fetchData = async (abortSignal: AbortSignal) => {
      setLoading(true);
      setError(null);
      try {
        // Simulate fetching vehicle data
        setCurrentSpeed(formatSpeed(60 + (Math.random() * 10 - 5), unitSystem));
        setFuelLevel((70 + Math.floor(Math.random() * 20)) + '%');

        // Fetch weather and AQI for current location (mocked or real)
        const lat = vehiclePosition?.lat || 34.0522;
        const lon = vehiclePosition?.lon || -118.2437;

        const weatherData = mockMode ? { rain: { '1h': 5 }, wind: { speed: 10, deg: 180 }, main: { temp: 25 } } as any : await getCurrentWeather(lat, lon, abortSignal);
        const normalizedWeather = normalizeWeatherData(weatherData);
        setWeather(`${formatTemperature(normalizedWeather.temperature, 'celsius')} (${normalizedWeather.description})`);

        const aqiData = mockMode ? { stations: [{ AQI: 75, dominant_pollutant: 'o3' }] } : await getAQI(lat, lon, abortSignal);
        const normalizedAqi = normalizeAQIData(aqiData);
        setAqi(`${normalizedAqi.aqi} (${normalizedAqi.dominantPollutant})`);

        // Simulate ETA calculation with weather factor
        const baseEta = 15; // minutes
        setEtaToNextStop(`${combinedETA(baseEta, normalizedWeather).toFixed(0)} min`);

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
  }, [mockMode, userRole, unitSystem, showInfo, showError, vehiclePosition]);

  // Subscribe to live vehicle position updates
  useEffect(() => {
    const handlePositionUpdate = (data: any) => {
      setVehiclePosition(data);
      if (mapRef.current) {
        mapRef.current.flyTo({ center: [data.lon, data.lat], zoom: 14 });
      }
    };

    const handleAlert = (data: any) => {
      showError(`Live Alert: ${data.message}`);
    };

    socket.subscribe('positionUpdate', handlePositionUpdate);
    socket.subscribe('alert', handleAlert);

    return () => {
      socket.unsubscribe('positionUpdate', handlePositionUpdate);
      socket.unsubscribe('alert', handleAlert);
    };
  }, [showError]);

  // Dummy data for alerts
  useEffect(() => {
    if (userRole === 'driver' || userRole === 'admin') {
      if (Math.random() > 0.8) { // Simulate a condition for alert
        showError('You are deviating from the planned route!');
      }
    }
  }, [userRole, showError]);

  if (!MAPBOX_ACCESS_TOKEN) {
    return <div className="p-6 text-red-500">Mapbox Access Token is not configured. Please set VITE_MAPBOX_ACCESS_TOKEN in your .env file.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Driver Dashboard</h1>

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
          <MetricCard title="Current Speed" value={currentSpeed} />
          <MetricCard title="ETA to Next Stop" value={etaToNextStop} />
          <MetricCard title="Fuel Level" value={fuelLevel} />
          <MetricCard title="Current Weather" value={weather} />
          <MetricCard title="AQI" value={aqi} />
        </div>
      )}

      {/* Map Panel */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current Location Map</CardTitle>
        </CardHeader>
        <CardContent className="h-96">
          <Map
            ref={mapRef}
            mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
            initialViewState={{
              longitude: vehiclePosition?.lon || -118.2437,
              latitude: vehiclePosition?.lat || 34.0522,
              zoom: 12,
            }}
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
          >
            {vehiclePosition && (
              <Marker longitude={vehiclePosition.lon} latitude={vehiclePosition.lat} anchor="bottom" >
                <div className="text-blue-600 text-2xl">📍</div>
              </Marker>
            )}
            <Source id="planned-route" type="geojson" data={plannedRoute}>
              <Layer
                id="planned-route-layer"
                type="line"
                source="planned-route"
                layout={{ 'line-join': 'round', 'line-cap': 'round' }}
                paint={{ 'line-color': '#888', 'line-width': 6 }}
              />
            </Source>
          </Map>
        </CardContent>
      </Card>

      {/* Time-series Chart (Placeholder for actual data) */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Speed Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart
            title="Live Speed"
            data={{
              labels: ['10s ago', '5s ago', 'Now'],
              datasets: [{ label: 'Speed (km/h)', data: [50, 55, 60], borderColor: 'green', fill: false }],
            }}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </CardContent>
      </Card>

      {/* Alerts/Notifications Pane */}
      <Card>
        <CardHeader>
          <CardTitle>Route Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Alerts will be displayed by AlertDisplay component globally.</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default DriverDashboard;
