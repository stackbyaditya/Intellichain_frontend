import React from 'react';
import { Line } from 'react-chartjs-2';
import ChartWrapper from '@/components/ui/ChartWrapper';

interface LineChartProps {
  data: any; // Chart.js data object
  options?: any; // Chart.js options object
  title?: string;
  loading?: boolean;
  error?: string;
}

const LineChart: React.FC<LineChartProps> = ({ data, options, title, loading, error }) => {
  return (
    <ChartWrapper title={title} loading={loading} error={error}>
      <Line data={data} options={options} />
    </ChartWrapper>
  );
};

export default LineChart;
