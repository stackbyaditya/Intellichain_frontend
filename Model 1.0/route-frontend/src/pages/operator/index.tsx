import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAlert } from '@/context/AlertContext';
import { useSettings } from '@/context/SettingsContext';
import { Card, CardContent, CardHeader, CardTitle, MetricCard, Input, Button } from '@/components/ui';
import { LineChart, BarChart } from '@/components/charts';
import { getOptimizedRoute, calculateCostEstimate } from '@/api/graphhopper';
import { routeEfficiencyScore } from '@/analytics/metrics';
import { formatDistance, formatCurrency } from '@/lib/units';
import { socket } from '@/lib/socket';

interface RouteOptimizationRequest {
  id: string;
  points: [number, number][];
  status: 'pending' | 'completed' | 'failed';
  optimizedDistance?: number;
  optimizedDuration?: number;
  score?: number;
}

function OperatorHub() {
  const { userRole } = useAuth();
  const { showInfo, showError } = useAlert();
  const { unitSystem, currency } = useSettings();

  const [mockMode, setMockMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [totalRoutes, setTotalRoutes] = useState<string>('N/A');
  const [optimizedRoutes, setOptimizedRoutes] = useState<string>('N/A');
  const [avgOptimizationScore, setAvgOptimizationScore] = useState<string>('N/A');
  const [routeRequests, setRouteRequests] = useState<RouteOptimizationRequest[]>([]);

  useEffect(() => {
    const fetchData = async (abortSignal: AbortSignal) => {
      setLoading(true);
      setError(null);
      try {
        // Simulate fetching route optimization requests
        const mockRequests: RouteOptimizationRequest[] = [
          { id: 'R001', points: [[10.0, 20.0], [10.1, 20.1]], status: 'completed', optimizedDistance: 10000, optimizedDuration: 600, score: 90 },
          { id: 'R002', points: [[10.2, 20.2], [10.3, 20.3]], status: 'pending' },
        ];
        setRouteRequests(mockMode ? mockRequests : mockRequests); // Replace with actual API call

        setTotalRoutes(mockRequests.length.toString());
        setOptimizedRoutes(mockRequests.filter(r => r.status === 'completed').length.toString());
        const completedScores = mockRequests.filter(r => r.score !== undefined).map(r => r.score!); // Non-null assertion
        setAvgOptimizationScore(completedScores.length > 0 ? (completedScores.reduce((a, b) => a + b, 0) / completedScores.length).toFixed(2) + '%' : 'N/A');

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
  }, [mockMode, userRole, showInfo, showError]);

  const handleOptimizeRoute = async (request: RouteOptimizationRequest) => {
    showInfo(`Optimizing route ${request.id}...`);
    try {
      const optimizedData = await getOptimizedRoute(request.points);
      const distance = optimizedData.paths[0].distance;
      const duration = optimizedData.paths[0].time;
      const score = routeEfficiencyScore({ distance: request.points.length * 1000, duration: request.points.length * 60, optimizedDistance: distance, optimizedDuration: duration });

      setRouteRequests(prev => prev.map(req =>
        req.id === request.id ? { ...req, status: 'completed', optimizedDistance: distance, optimizedDuration: duration, score: score } : req
      ));
      showInfo(`Route ${request.id} optimized successfully! Score: ${score.toFixed(2)}%`);
    } catch (err: any) {
      showError(`Failed to optimize route ${request.id}: ${err.message}`);
      setRouteRequests(prev => prev.map(req =>
        req.id === request.id ? { ...req, status: 'failed' } : req
      ));
    }
  };

  // Subscribe to live alerts
  useEffect(() => {
    const handleAlert = (data: any) => {
      showInfo(`Live Alert: ${data.message}`);
    };

    socket.subscribe('alert', handleAlert);

    return () => {
      socket.unsubscribe('alert', handleAlert);
    };
  }, [showInfo]);

  // Dummy data for alerts
  useEffect(() => {
    if (userRole === 'operator' || userRole === 'admin') {
      if (Math.random() > 0.9) { // Simulate a condition for alert
        showInfo('New route optimization request received!');
      }
    }
  }, [userRole, showInfo]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Operator Hub</h1>

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
          <MetricCard title="Total Routes" value={totalRoutes} />
          <MetricCard title="Optimized Routes" value={optimizedRoutes} />
          <MetricCard title="Avg. Optimization Score" value={avgOptimizationScore} />
        </div>
      )}

      {/* Route Optimization Requests Table */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Route Optimization Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Distance</th>
                <th className="py-2 px-4 border-b">Duration</th>
                <th className="py-2 px-4 border-b">Score</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {routeRequests.map(req => (
                <tr key={req.id}>
                  <td className="py-2 px-4 border-b">{req.id}</td>
                  <td className="py-2 px-4 border-b">{req.status}</td>
                  <td className="py-2 px-4 border-b">{req.optimizedDistance ? formatDistance(req.optimizedDistance, unitSystem) : 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{req.optimizedDuration ? `${(req.optimizedDuration / 60).toFixed(0)} min` : 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{req.score ? `${req.score.toFixed(2)}%` : 'N/A'}</td>
                  <td className="py-2 px-4 border-b">
                    {req.status === 'pending' && (
                      <Button onClick={() => handleOptimizeRoute(req)} size="sm">Optimize</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Time-series Chart (Placeholder for actual data) */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Optimization Performance Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart
            title="Monthly Optimization Score"
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              datasets: [{ label: 'Score %', data: [70, 75, 80, 85, 82, 88], borderColor: 'purple', fill: false }],
            }}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </CardContent>
      </Card>

      {/* Alerts/Notifications Pane */}
      <Card>
        <CardHeader>
          <CardTitle>Optimization Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Alerts will be displayed by AlertDisplay component globally.</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default OperatorHub;
