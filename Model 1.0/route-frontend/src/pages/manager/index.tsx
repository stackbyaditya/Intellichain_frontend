import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, MetricCard } from '@/components/ui';
import { LineChart, BarChart, DonutChart } from '@/components/charts';
import { useSettings } from '@/context/SettingsContext';
import { formatCurrency } from '@/lib/units';
import { onTimePercent } from '@/analytics/metrics';

// Dummy data for demonstration
const MOCK_DELIVERIES = [
  { id: 'D001', scheduledTime: Date.now() - 3600000, actualTime: Date.now() - 3500000, price: 25 },
  { id: 'D002', scheduledTime: Date.now() - 7200000, actualTime: Date.now() - 7000000, price: 30 },
  { id: 'D003', scheduledTime: Date.now() - 10800000, actualTime: Date.now() - 11000000, price: 20 },
];

const ManagerDashboard: React.FC = () => {
  const { currency } = useSettings();

  // Calculate on-time percentage
  const onTimePercentage = onTimePercent(MOCK_DELIVERIES);

  // Dummy data for charts
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [1200, 1900, 3000, 5000, 2300, 3400],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const costBreakdownData = {
    labels: ['Fuel', 'Maintenance', 'Wages', 'Other'],
    datasets: [
      {
        label: 'Cost',
        data: [300, 150, 400, 100],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  const onTimeDeliveryChartData = {
    labels: ['On-Time', 'Delayed'],
    datasets: [
      {
        label: 'Deliveries',
        data: [onTimePercentage, 100 - onTimePercentage],
        backgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manager Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <MetricCard title="Total Revenue" value={formatCurrency(15000, currency)} />
        <MetricCard title="On-Time Delivery Rate" value={`${onTimePercentage.toFixed(2)}%`} />
        <MetricCard title="Average Cost per Delivery" value={formatCurrency(15.50, currency)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart data={revenueData} title="Monthly Revenue" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart data={costBreakdownData} title="Operational Costs" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>On-Time Delivery Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart data={onTimeDeliveryChartData} title="Delivery Status" />
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerDashboard;
