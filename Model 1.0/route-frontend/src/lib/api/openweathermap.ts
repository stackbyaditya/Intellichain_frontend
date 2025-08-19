// src/lib/api/openweathermap.ts
const OPENWEATHERMAP_API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

if (!OPENWEATHERMAP_API_KEY) {
  console.error('OpenWeatherMap API key is not defined in .env.local');
}

export const getOpenWeather = async (lat: number, lon: number) => {
  if (!OPENWEATHERMAP_API_KEY) {
    throw new Error('OpenWeatherMap API key is not available.');
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`OpenWeatherMap API error: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching OpenWeather data:', error);
    return null;
  }
};
