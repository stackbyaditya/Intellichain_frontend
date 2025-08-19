import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAlert } from '@/context/AlertContext';
import { useSettings } from '@/context/SettingsContext';
import { Card, CardContent, CardHeader, CardTitle, MetricCard, Button, Input } from '@/components/ui';
import { LineChart, BarChart } from '@/components/charts';
import { socket } from '@/lib/socket';
import { formatCurrency } from '@/lib/units';

// Dummy data for demonstration
const MOCK_USERS = 1200;
const MOCK_ACTIVE_VEHICLES = 80;
const MOCK_SYSTEM_HEALTH = 'Good';

function AdminDashboard() {
  const { userRole } = useAuth();
  const { showError, showInfo } = useAlert();
  const { currency } = useSettings();

  const [mockMode, setMockMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [totalUsers, setTotalUsers] = useState<string>('N/A');
  const [activeVehicles, setActiveVehicles] = useState<string>('N/A');
  const [systemHealth, setSystemHealth] = useState<string>('N/A');

  // Dummy data for filters
  const [dateRange, setDateRange] = useState('last 30 days');
  const [userType, setUserType] = useState('all');
  const [systemModule, setSystemModule] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate fetching data from backend
        setTotalUsers(MOCK_USERS.toLocaleString());
        setActiveVehicles(MOCK_ACTIVE_VEHICLES.toString());
        setSystemHealth(MOCK_SYSTEM_HEALTH);

      } catch (err: any) {
        setError(err.message);
        showError(`Failed to load dashboard data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mockMode, userRole, showError]);

  const handleFilterChange = () => {
    showInfo(`Filters applied: Date Range - ${dateRange}, User Type - ${userType}, System Module - ${systemModule}`);
  };

  // Subscribe to live alerts
  useEffect(() => {
    const handleAlert = (data: any) => {
      showError(`System Alert: ${data.message}`);
    };

    socket.subscribe('alert', handleAlert);

    return () => {
      socket.unsubscribe('alert', handleAlert);
    };
  }, [showError]);

  // Dummy data for alerts
  useEffect(() => {
    if (userRole === 'admin') {
      if (Math.random() > 0.95) { // Simulate a condition for alert
        showError('Critical system error detected!');
      }
    }
  }, [userRole, showError]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

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
          <MetricCard title="Total Users" value={totalUsers} />
          <MetricCard title="Active Vehicles" value={activeVehicles} />
          <MetricCard title="System Health" value={systemHealth} />
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 p-4 border rounded-lg shadow-sm bg-white">
        <h2 className="text-lg font-semibold mb-3">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="date-range" className="block text-sm font-medium text-gray-700">Date Range</label>
            <select id="date-range" value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
              <option value="last 7 days">Last 7 Days</option>
              <option value="last 30 days">Last 30 Days</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div>
            <label htmlFor="user-type" className="block text-sm font-medium text-gray-700">User Type</label>
            <select id="user-type" value={userType} onChange={(e) => setUserType(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
              <option value="all">All</option>
              <option value="owner">Owner</option>
              <option value="customer">Customer</option>
              <option value="driver">Driver</option>
              <option value="operator">Operator</option>
            </select>
          </div>
          <div>
            <label htmlFor="system-module" className="block text-sm font-medium text-gray-700">System Module</label>
            <select id="system-module" value={systemModule} onChange={(e) => setSystemModule(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
              <option value="all">All</option>
              <option value="routing">Routing</option>
              <option value="tracking">Tracking</option>
              <option value="alerts">Alerts</option>
            </select>
          </div>
        </div>
        <button onClick={handleFilterChange} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Apply Filters</button>
      </div>

      {/* Time-series Chart (Placeholder for actual data) */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>System Performance Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart
            title="Daily Active Users"
            data={{
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
              datasets: [{ label: 'Active Users', data: [1000, 1050, 980, 1100, 1150], borderColor: 'green', fill: false }],
            }}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </CardContent>
      </Card>

      {/* Alerts/Notifications Pane */}
      <Card>
        <CardHeader>
          <CardTitle>System Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Alerts will be displayed by AlertDisplay component globally.</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminDashboard;
