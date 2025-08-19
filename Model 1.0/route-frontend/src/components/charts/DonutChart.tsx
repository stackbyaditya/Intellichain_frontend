import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import ChartWrapper from '@/components/ui/ChartWrapper';

interface DonutChartProps {
  data: any; // Chart.js data object
  options?: any; // Chart.js options object
  title?: string;
  loading?: boolean;
  error?: string;
}

const DonutChart: React.FC<DonutChartProps> = ({ data, options, title, loading, error }) => {
  return (
    <ChartWrapper title={title} loading={loading} error={error}>
      <Doughnut data={data} options={options} />
    </ChartWrapper>
  );
};

export default DonutChart;
