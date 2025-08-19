// src/lib/api/graphhopper.ts
// This client helper calls a server-side proxy for GraphHopper API.

export const getGraphHopperRoute = async (points: [number, number][]) => {
  try {
    const response = await fetch('/api/proxy/graphhopper/route', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ points }),
    });

    if (!response.ok) {
      throw new Error(`GraphHopper proxy error: ${response.statusText}`);
    }

    const data = await response.json();
    // Assuming the proxy returns data in the specified format:
    // {"distance":12345,"duration":1800,"geometry":{"type":"LineString","coordinates":[[lng,lat],...]},"score":0.79}
    return data;
  } catch (error) {
    console.error('Error fetching GraphHopper route from proxy:', error);
    return null;
  }
};
