import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAlert } from '@/context/AlertContext';
import { useSettings } from '@/context/SettingsContext';
import { Card, CardContent, CardHeader, CardTitle, MetricCard, Input, Button } from '@/components/ui';
import { LineChart, BarChart } from '@/components/charts';
import { getETA } from '@/api/mapmyindia';
import { getAQI, normalizeAQIData } from '@/api/ambee';
import { getCurrentWeather, normalizeWeatherData } from '@/api/openweather';
import { onTimePercent, priceSensitivityIndex, combinedETA, weatherDelayFactor } from '@/analytics/metrics';
import { formatCurrency } from '@/lib/units';
import Map from 'react-map-gl/maplibre';
import { Marker } from 'react-map-gl/maplibre';
import 'mapbox-gl/dist/mapbox-gl.css';
import { socket } from '@/lib/socket';

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

// Dummy data for deliveries and historical prices (replace with actual backend data)
const MOCK_DELIVERIES = [
  { id: 'D001', scheduledTime: Date.now() - 3600000, actualTime: Date.now() - 3500000, price: 25 },
  { id: 'D002', scheduledTime: Date.now() - 7200000, actualTime: Date.now() - 7000000, price: 30 },
  { id: 'D003', scheduledTime: Date.now() - 10800000, actualTime: Date.now() - 11000000, price: 20 },
];
const MOCK_HISTORICAL_PRICES = [20, 22, 18, 25, 23];
const MOCK_MARKET_PRICES = [21, 20, 19, 24, 22];

function CustomerDashboard() {
  const { userRole } = useAuth();
  const { showInfo, showError } = useAlert();
  const { unitSystem, currency } = useSettings();

  const [mockMode, setMockMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [deliveryReliability, setDeliveryReliability] = useState<string>('N/A');
  const [satisfactionTrends, setSatisfactionTrends] = useState<string>('N/A');
  const [priceSensitivity, setPriceSensitivity] = useState<string>('N/A');
  const [liveEta, setLiveEta] = useState<string>('N/A');
  const [weather, setWeather] = useState<string>('N/A');
  const [aqi, setAqi] = useState<string>('N/A');
  const [deliveryLocation, setDeliveryLocation] = useState<{ lat: number; lon: number } | null>(null);

  const mapRef = useRef<any>(null);

  useEffect(() => {
    const fetchData = async (abortSignal: AbortSignal) => {
      setLoading(true);
      setError(null);
      try {
        // Simulate fetching delivery data
        const deliveries = mockMode ? MOCK_DELIVERIES : MOCK_DELIVERIES; // Replace with actual API call
        setDeliveryReliability(onTimePercent(deliveries).toFixed(2) + '%');
        setSatisfactionTrends('Upward'); // Placeholder
        setPriceSensitivity(priceSensitivityIndex(MOCK_HISTORICAL_PRICES, MOCK_MARKET_PRICES).toFixed(2));

        // Simulate live ETA, weather, and AQI for a dummy delivery
        const startCoords: [number, number] = [-118.2437, 34.0522]; // Example start (lon, lat)
        const endCoords: [number, number] = [-118.25, 34.06]; // Example end (lon, lat)

        const etaData = mockMode ? { routes: [{ duration: 900 }] } : await getETA(startCoords, endCoords, abortSignal);
        const baseEta = etaData.routes[0].duration / 60; // minutes

        const weatherData = mockMode ? { rain: { '1h': 2 }, wind: { speed: 5, deg: 90 }, main: { temp: 20 } } as any : await getCurrentWeather(endCoords[1], endCoords[0], abortSignal);
        const normalizedWeather = normalizeWeatherData(weatherData);
        setWeather(`${normalizedWeather.temperature.toFixed(1)}°C (${normalizedWeather.description})`);

        const aqiData = mockMode ? { stations: [{ AQI: 55, dominant_pollutant: 'pm25' }] } : await getAQI(endCoords[1], endCoords[0], abortSignal);
        const normalizedAqi = normalizeAQIData(aqiData);
        setAqi(`${normalizedAqi.aqi} (${normalizedAqi.dominantPollutant})`);

        setLiveEta(`${combinedETA(baseEta, normalizedWeather).toFixed(0)} min`);
        setDeliveryLocation({ lat: endCoords[1], lon: endCoords[0] });

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

  // Subscribe to live delivery updates (e.g., vehicle position)
  useEffect(() => {
    const handlePositionUpdate = (data: any) => {
      // Update delivery location based on live vehicle position
      setDeliveryLocation({ lat: data.lat, lon: data.lon });
      if (mapRef.current) {
        mapRef.current.flyTo({ center: [data.lon, data.lat], zoom: 14 });
      }
    };

    const handleAlert = (data: any) => {
      showInfo(`Live Notification: ${data.message}`);
    };

    socket.subscribe('positionUpdate', handlePositionUpdate);
    socket.subscribe('alert', handleAlert);

    return () => {
      socket.unsubscribe('positionUpdate', handlePositionUpdate);
      socket.unsubscribe('alert', handleAlert);
    };
  }, [showInfo]);

  // Dummy data for alerts
  useEffect(() => {
    if (userRole === 'customer' || userRole === 'admin') {
      if (Math.random() > 0.7) { // Simulate a condition for alert
        showInfo('Your delivery is delayed by approximately 15 minutes due to traffic.');
      }
    }
  }, [userRole, showInfo]);

  if (!MAPBOX_ACCESS_TOKEN) {
    return <div className="p-6 text-red-500">Mapbox Access Token is not configured. Please set VITE_MAPBOX_ACCESS_TOKEN in your .env file.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Customer Dashboard</h1>

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
          <MetricCard title="Delivery Reliability" value={deliveryReliability} />
          <MetricCard title="Satisfaction Trends" value={satisfactionTrends} />
          <MetricCard title="Price Sensitivity" value={priceSensitivity} />
          <MetricCard title="Live ETA" value={liveEta} />
          <MetricCard title="Current Weather" value={weather} />
          <MetricCard title="AQI" value={aqi} />
        </div>
      )}

      {/* Map Panel */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Live Delivery Tracking</CardTitle>
        </CardHeader>
        <CardContent className="h-96">
          <Map
            ref={mapRef}
            mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
            initialViewState={{
              longitude: deliveryLocation?.lon || -118.2437,
              latitude: deliveryLocation?.lat || 34.0522,
              zoom: 12,
            }}
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
          >
            {deliveryLocation && (
              <Marker longitude={deliveryLocation.lon} latitude={deliveryLocation.lat} anchor="bottom" >
                <div className="text-red-600 text-2xl">📦</div>
              </Marker>
            )}
          </Map>
        </CardContent>
      </Card>

      {/* Time-series Chart (Placeholder for actual data) */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Delivery Reliability Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart
            title="Daily Deliveries"
            data={{
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
              datasets: [{ label: 'On-Time %', data: [90, 92, 88, 95, 93], borderColor: 'blue', fill: false }],
            }}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </CardContent>
      </Card>

      {/* Alerts/Notifications Pane */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Notifications will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default CustomerDashboard;
