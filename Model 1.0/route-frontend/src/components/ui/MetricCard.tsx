import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  description?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, description }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
    </div>
  );
};

export { MetricCard };
