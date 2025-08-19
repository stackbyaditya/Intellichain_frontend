// src/lib/api/mapmyindia.ts
const MAPMYINDIA_API_KEY = import.meta.env.VITE_MAPMYINDIA_API_KEY;

if (!MAPMYINDIA_API_KEY) {
  console.error('MapMyIndia API key is not defined in .env.local');
}

// Thin wrapper for MapMyIndia Geocoding API (example)
export const geocodeAddressMapMyIndia = async (address: string) => {
  if (!MAPMYINDIA_API_KEY) {
    throw new Error('MapMyIndia API key is not available.');
  }

  const url = `https://apis.mapmyindia.com/advancedmaps/v1/${MAPMYINDIA_API_KEY}/geocode?query=${encodeURIComponent(address)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`MapMyIndia API error: ${response.statusText}`);
    }
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      return {
        latitude: result.lat,
        longitude: result.lng,
        formattedAddress: result.formatted_address,
      };
    }
    return null;
  } catch (error) {
    console.error('Error geocoding address with MapMyIndia:', error);
    return null;
  }
};

// Thin wrapper for MapMyIndia ETA verification (example - assuming a similar API structure)
export const verifyEtaMapMyIndia = async (origin: [number, number], destination: [number, number]) => {
  if (!MAPMYINDIA_API_KEY) {
    throw new Error('MapMyIndia API key is not available.');
  }

  // This is a simplified example. Actual MapMyIndia routing API might be different.
  const url = `https://apis.mapmyindia.com/advancedmaps/v1/${MAPMYINDIA_API_KEY}/route?start=${origin[0]},${origin[1]}&end=${destination[0]},${destination[1]}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`MapMyIndia API error: ${response.statusText}`);
    }
    const data = await response.json();
    // Assuming data contains duration and distance
    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      return {
        distance: route.distance, // in meters
        duration: route.duration, // in seconds
        accuracy: 'high', // Placeholder
      };
    }
    return null;
  } catch (error) {
    console.error('Error verifying ETA with MapMyIndia:', error);
    return null;
  }
};
