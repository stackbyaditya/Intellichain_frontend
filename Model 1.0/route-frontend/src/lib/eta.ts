import { type WeatherData } from '@/types';

/**
 * Calculates an adjusted ETA based on base ETA and weather conditions.
 * This is a simplified example; real-world ETA adjustments would be more complex.
 * @param baseEtaMinutes The base estimated time of arrival in minutes.
 * @param weatherData Current weather data.
 * @returns Adjusted ETA in minutes.
 */
export function calculateEta(baseEtaMinutes: number, weatherData: WeatherData): number {
  let adjustedEta = baseEtaMinutes;

  // Example adjustments based on weather conditions
  // Heavy rain or snow might increase ETA
  if (weatherData.rain && ((weatherData.rain['1h'] !== undefined && weatherData.rain['1h'] > 2) || (weatherData.rain['3h'] !== undefined && weatherData.rain['3h'] > 5))) {
    adjustedEta *= 1.2; // Increase ETA by 20% for heavy rain
  }
  if (weatherData.weather.some(w => w.main === 'Snow')) {
    adjustedEta *= 1.3; // Increase ETA by 30% for snow
  }

  // Strong winds might affect certain vehicles or routes
  if (weatherData.wind && weatherData.wind.speed > 15) { // wind speed > 15 m/s
    adjustedEta *= 1.1; // Increase ETA by 10% for strong winds
  }

  // Extreme temperatures (very hot or very cold) might affect vehicle performance or driver breaks
  if (weatherData.main.temp < 0 || weatherData.main.temp > 35) { // Below 0°C or above 35°C
    adjustedEta *= 1.05; // Increase ETA by 5% for extreme temperatures
  }

  return Math.round(adjustedEta);
}
