export interface WeatherData {
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number; // Celsius
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind?: {
    speed: number; // m/s
    deg: number;
  };
  rain?: {
    '1h'?: number; // mm
    '3h'?: number; // mm
  };
  clouds?: {
    all: number; // %
  };
  dt: number; // Time of data calculation, Unix, UTC
  name: string; // City name
}
