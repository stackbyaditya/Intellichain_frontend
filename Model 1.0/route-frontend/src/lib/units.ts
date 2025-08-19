export type UnitSystem = 'metric' | 'imperial';
export type Currency = 'USD' | 'INR';

export function convertDistance(value: number, from: UnitSystem, to: UnitSystem): number {
  if (from === to) return value;
  if (from === 'metric' && to === 'imperial') {
    return value * 0.621371; // km to miles
  } else if (from === 'imperial' && to === 'metric') {
    return value * 1.60934; // miles to km
  }
  return value;
}

export function formatDistance(value: number, unit: UnitSystem): string {
  return `${value.toFixed(2)} ${unit === 'metric' ? 'km' : 'miles'}`;
}

export function convertCurrency(value: number, from: Currency, to: Currency, exchangeRate: number = 83): number {
  if (from === to) return value;
  if (from === 'USD' && to === 'INR') {
    return value * exchangeRate; // USD to INR (example rate)
  } else if (from === 'INR' && to === 'USD') {
    return value / exchangeRate; // INR to USD (example rate)
  }
  return value;
}

export function formatCurrency(value: number, currency: Currency): string {
  return `${currency === 'INR' ? '₹' : '$'}${value.toFixed(2)}`;
}

export function convertTemperature(value: number, from: 'celsius' | 'fahrenheit', to: 'celsius' | 'fahrenheit'): number {
  if (from === to) return value;
  if (from === 'celsius' && to === 'fahrenheit') {
    return (value * 9/5) + 32;
  } else if (from === 'fahrenheit' && to === 'celsius') {
    return (value - 32) * 5/9;
  }
  return value;
}

export function formatTemperature(value: number, unit: 'celsius' | 'fahrenheit'): string {
  return `${value.toFixed(1)}°${unit === 'celsius' ? 'C' : 'F'}`;
}

export function convertSpeed(value: number, from: UnitSystem, to: UnitSystem): number {
  if (from === to) return value;
  if (from === 'metric' && to === 'imperial') {
    return value * 0.621371; // km/h to miles/h
  } else if (from === 'imperial' && to === 'metric') {
    return value * 1.60934; // miles/h to km/h
  }
  return value;
}

export function formatSpeed(value: number, unit: UnitSystem): string {
  return `${value.toFixed(2)} ${unit === 'metric' ? 'km/h' : 'mph'}`;
}
