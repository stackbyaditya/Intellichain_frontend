export interface RouteResult {
  distance: number; // in meters
  duration: number; // in seconds
  geometry: {
    type: string; // e.g., "LineString"
    coordinates: [number, number][]; // [[lng, lat], ...]
  };
  score: number; // efficiency score, e.g., 0.0 to 1.0
}
