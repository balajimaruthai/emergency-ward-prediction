export type UserRole = 'public' | 'hospital' | 'ambulance';

export type ConnectionStatus =
  | 'CONNECTED'
  | 'DELAYED'
  | 'STALE'
  | 'OFFLINE'
  | 'SIMULATION';

export type WardStatus = 'AVAILABLE' | 'MODERATE' | 'HIGH' | 'CRITICAL' | 'FULL';

export type WardIconKey = 'HeartPulse' | 'Activity' | 'Hospital' | 'ShieldAlert' | 'Baby';

export interface Ward {
  id: string;
  name: string;
  shortName: string;
  totalBeds: number;
  occupiedBeds: number;
  icon: WardIconKey;
  occupancyHistory: number[];
  arrivalsHistory: number[];
}

export interface PatientFlow {
  arrivals: number;
  admissions: number;
  discharges: number;
  transfers: number;
  arrivalsHistory: number[];
}

export interface ForecastPoint {
  hour: number;
  label: string;
  demand: number;
  risk: WardStatus;
}

export interface HospitalInfo {
  id: string;
  name: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  totalBeds: number;
  occupiedBeds: number;
  emergencyBeds: number;
  icuBeds: number;
  ventilators: number;
  ambulanceBay: boolean;
  traumaCenter: boolean;
  pediatric: boolean;
  cardiac: boolean;
  distanceKm?: number;
  etaMinutes?: number;
  wards: Ward[];
  lastUpdated: number;
}

export interface CityInfo {
  name: string;
  state: string;
  lat: number;
  lng: number;
}

export interface HospitalData {
  wards: Ward[];
  patientFlow: PatientFlow;
  forecast: ForecastPoint[];
  rushScore: number;
  lastUpdated: number;
  connectionStatus: ConnectionStatus;
}

export type WardFilter = 'ALL' | 'AVAILABLE' | 'MODERATE' | 'HIGH' | 'CRITICAL' | 'FULL';

export type SortMode = 'URGENCY' | 'ALPHABETICAL' | 'MOST_AVAILABLE';
