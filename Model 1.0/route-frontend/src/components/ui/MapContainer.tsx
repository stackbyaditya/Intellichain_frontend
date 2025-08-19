import React from 'react';

interface MapContainerProps {
  children?: React.ReactNode;
}

const MapContainer: React.FC<MapContainerProps> = ({ children }) => {
  return (
    <div className="h-96 bg-gray-200 flex items-center justify-center rounded-lg">
      {children || <p className="text-gray-500">Map Placeholder</p>}
    </div>
  );
};

export { MapContainer };
