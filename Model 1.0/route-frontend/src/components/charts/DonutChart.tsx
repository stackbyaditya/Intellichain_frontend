import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface DonutChartProps {
  title: string;
  data: any; // Replace with more specific type if needed
  options?: any; // Replace with more specific type if needed
  loading?: boolean;
  error?: string | null;
}

const DonutChart: React.FC<DonutChartProps> = ({ title, data, options, loading, error }) => {
  if (loading) {
    return <div className="text-center py-4">Loading chart data...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error loading chart: {error}</div>;
  }

  if (!data || !data.datasets || data.datasets.length === 0) {
    return <div className="text-center py-4 text-gray-500">No data available for {title}.</div>;
  }

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  return (
    <div style={{ height: '300px' }}> {/* Fixed height for responsiveness */}
      <Doughnut data={data} options={{ ...defaultOptions, ...options }} />
    </div>
  );
};

export default DonutChart;