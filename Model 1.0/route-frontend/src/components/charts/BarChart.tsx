import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartWrapper from '@/components/ui/ChartWrapper';

interface BarChartProps {
  data: any; // Chart.js data object
  options?: any; // Chart.js options object
  title?: string;
  loading?: boolean;
  error?: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, options, title, loading, error }) => {
  return (
    <ChartWrapper title={title} loading={loading} error={error}>
      <Bar data={data} options={options} />
    </ChartWrapper>
  );
};

export default BarChart;
