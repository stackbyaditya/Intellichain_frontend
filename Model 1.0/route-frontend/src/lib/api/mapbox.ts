// src/lib/api/mapbox.ts
import mapboxgl from 'mapbox-gl';

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

if (!MAPBOX_ACCESS_TOKEN) {
  console.error('Mapbox access token is not defined in .env.local');
}

// Thin wrapper for Mapbox Directions API
export const getMapboxDirections = async (coordinates: [number, number][]) => {
  if (!MAPBOX_ACCESS_TOKEN) {
    throw new Error('Mapbox access token is not available.');
  }

  const coordsString = coordinates.map(coord => `${coord[0]},${coord[1]}`).join(';');
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordsString}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Mapbox API error: ${response.statusText}`);
    }
    const data = await response.json();
    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      return {
        distance: route.distance, // in meters
        duration: route.duration, // in seconds
        geometry: route.geometry,
        score: 1.0, // Placeholder for efficiency score
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching Mapbox directions:', error);
    return null;
  }
};

// Function to initialize Mapbox GL JS map (if needed directly)
export const initializeMapboxMap = (container: HTMLElement, options?: mapboxgl.MapboxOptions) => {
  if (!MAPBOX_ACCESS_TOKEN) {
    console.error('Mapbox access token is not defined in .env.local');
    return null;
  }
  mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
  const map = new mapboxgl.Map({
    container,
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    center: [77.2090, 28.6139], // starting position [lng, lat]
    zoom: 9, // starting zoom
    ...options,
  });
  return map;
};
