import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { ChartProps } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartWrapperProps extends ChartProps {
  title?: string;
  loading?: boolean;
  error?: string;
  children: React.ReactNode;
}

const ChartWrapper: React.FC<ChartWrapperProps> = ({ title, loading, error, children }) => {
  return (
    <div className="relative p-4 bg-white rounded-lg shadow">
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
          <p>Loading chart data...</p>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-100 bg-opacity-75 z-10 text-red-700">
          <p>Error: {error}</p>
        </div>
      )}
      <div className={loading || error ? 'opacity-50' : ''}>
        {children}
      </div>
    </div>
  );
};

export default ChartWrapper;
