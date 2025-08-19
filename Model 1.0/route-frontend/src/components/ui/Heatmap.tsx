import React from 'react';

interface HeatmapProps {
  title: string;
  data: unknown; // Placeholder for heatmap data structure
  options: unknown; // Placeholder for heatmap options structure
}

const Heatmap: React.FC<HeatmapProps> = ({ title }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
      <div className="h-64 flex items-center justify-center bg-gray-100 rounded-md">
        <p className="text-gray-500">Heatmap Placeholder</p>
      </div>
    </div>
  );
};

export { Heatmap };
