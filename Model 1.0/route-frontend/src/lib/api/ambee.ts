// src/lib/api/ambee.ts
// This client helper calls a server-side proxy for Ambee API.

export const getAmbeeData = async (lat: number, lon: number) => {
  try {
    const response = await fetch('/api/proxy/ambee', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lat, lon }),
    });

    if (!response.ok) {
      throw new Error(`Ambee proxy error: ${response.statusText}`);
    }

    const data = await response.json();
    // Assuming the proxy returns data in a useful format for AQI and emissions
    return data;
  } catch (error) {
    console.error('Error fetching Ambee data from proxy:', error);
    return null;
  }
};
