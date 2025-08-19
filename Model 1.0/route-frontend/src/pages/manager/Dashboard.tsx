import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { LineChart, BarChart, DonutChart } from '@/components/charts';
import { useSettings } from '@/context/SettingsContext';
import { formatCurrency } from '@/lib/units';

const ManagerDashboard: React.FC = () => {
  const { currency } = useSettings();

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

  const onTimeDeliveryData = {
    labels: ['On-Time', 'Delayed'],
    datasets: [
      {
        label: 'Deliveries',
        data: [85, 15],
        backgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manager Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(15000, currency)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>On-Time Delivery Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">92%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Cost per Delivery</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(15.50, currency)}</p>
          </CardContent>
        </Card>
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
          <BarChart data={onTimeDeliveryData} title="Delivery Status" />
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerDashboard;
