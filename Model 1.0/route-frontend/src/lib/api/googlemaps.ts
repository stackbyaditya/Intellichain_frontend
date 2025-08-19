// src/lib/api/googlemaps.ts
// Google Maps API is loaded via script tag in index.html.
// This file can contain helper functions for Google Maps specific features if needed.

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

if (!GOOGLE_MAPS_API_KEY) {
  console.error('Google Maps API key is not defined in .env.local');
}

export const loadGoogleMapsScript = () => {
  if (!GOOGLE_MAPS_API_KEY) {
    console.error('Google Maps API key is not available. Cannot load script.');
    return;
  }

  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);

  return new Promise((resolve) => {
    script.onload = () => {
      console.log('Google Maps script loaded.');
      resolve(true);
    };
    script.onerror = (error) => {
      console.error('Error loading Google Maps script:', error);
      resolve(false);
    };
  });
};

// Example helper function (can be expanded based on needs)
export const getGoogleMapsGeocode = async (address: string) => {
  // This would typically use the Google Maps Geocoding service after the script is loaded.
  // For now, it's a placeholder.
  console.log(`Mock: Google Maps Geocoding for ${address}`);
  return {
    latitude: 0,
    longitude: 0,
    formattedAddress: 'Mock Address',
  };
};
