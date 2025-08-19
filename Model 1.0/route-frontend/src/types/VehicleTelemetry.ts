export interface VehicleTelemetry {
  vehicleId: string;
  lat: number;
  lng: number;
  speed: number; // km/h
  heading: number; // degrees
  fuelLevel: number; // percentage
  status: 'idle' | 'in-transit' | 'parked' | 'maintenance';
  lastSeen: string; // ISO 8601 string
}
