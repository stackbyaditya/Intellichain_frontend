import { http, HttpResponse } from 'msw';

interface GraphHopperRequestBody {
  points: [number, number][];
}

interface AmbeeRequestBody {
  lat: number;
  lon: number;
}

export const handlers = [
  // Mock Mapbox Directions API
  http.get('https://api.mapbox.com/directions/v5/mapbox/driving/:coordinates', ({ params }) => {
    const { coordinates } = params;
    console.log(`MSW: Intercepted Mapbox Directions request for ${coordinates}`);
    return HttpResponse.json({
      routes: [
        {
          distance: 1000, // meters
          duration: 60, // seconds
          geometry: {
            type: 'LineString',
            coordinates: [[0, 0], [0.01, 0.01]], // Simplified geometry
          },
        },
      ],
    });
  }),

  // Mock GraphHopper proxy
  http.post('/api/proxy/graphhopper/route', async ({ request }) => {
    const { points } = await request.json() as GraphHopperRequestBody;
    console.log(`MSW: Intercepted GraphHopper proxy request for points: ${JSON.stringify(points)}`);
    return HttpResponse.json({
      distance: 2000,
      duration: 120,
      geometry: {
        type: 'LineString',
        coordinates: [[1, 1], [1.01, 1.01]],
      },
      score: 0.8,
    });
  }),

  // Mock OpenWeatherMap API
  http.get('https://api.openweathermap.org/data/2.5/weather', ({ request }) => {
    const url = new URL(request.url);
    const lat = url.searchParams.get('lat');
    const lon = url.searchParams.get('lon');
    console.log(`MSW: Intercepted OpenWeatherMap request for lat: ${lat}, lon: ${lon}`);
    return HttpResponse.json({
      weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
      main: { temp: 298.15, feels_like: 298.15, temp_min: 298.15, temp_max: 298.15, pressure: 1012, humidity: 70 },
      wind: { speed: 5, deg: 180 },
      rain: { '1h': 0 },
      clouds: { all: 0 },
      dt: Date.now() / 1000,
      name: 'Mock City',
    });
  }),

  // Mock Ambee proxy
  http.post('/api/proxy/ambee', async ({ request }) => {
    const { lat, lon } = await request.json() as AmbeeRequestBody;
    console.log(`MSW: Intercepted Ambee proxy request for lat: ${lat}, lon: ${lon}`);
    return HttpResponse.json({
      stations: [
        {
          AQI: 50,
          dominant_pollutant: 'o3',
        },
      ],
    });
  }),

  // Mock MapMyIndia Geocoding API
  http.get('https://apis.mapmyindia.com/advancedmaps/v1/:apiKey/geocode', ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('query');
    console.log(`MSW: Intercepted MapMyIndia Geocode request for query: ${query}`);
    return HttpResponse.json({
      results: [
        {
          lat: 28.7041,
          lng: 77.1025,
          formattedAddress: `Mocked Address for ${query}`,
        },
      ],
    });
  }),

  // Mock MapMyIndia Route API (simplified)
  http.get('https://apis.mapmyindia.com/advancedmaps/v1/:apiKey/route', ({ request }) => {
    const url = new URL(request.url);
    const start = url.searchParams.get('start');
    const end = url.searchParams.get('end');
    console.log(`MSW: Intercepted MapMyIndia Route request for start: ${start}, end: ${end}`);
    return HttpResponse.json({
      routes: [
        {
          distance: 5000, // meters
          duration: 300, // seconds
        },
      ],
    });
  }),
];
