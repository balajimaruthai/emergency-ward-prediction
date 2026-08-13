import type {
  HospitalData,
  Ward,
  WardStatus,
  PatientFlow,
  ForecastPoint,
} from './types';

interface WardConfig {
  id: string;
  name: string;
  shortName: string;
  totalBeds: number;
  baseRate: number;
  icon: Ward['icon'];
  initialOccupied: number;
}

const WARDS_CONFIG: WardConfig[] = [
  { id: 'er', name: 'Emergency Ward', shortName: 'ER', totalBeds: 35, baseRate: 0.64, icon: 'HeartPulse', initialOccupied: 22 },
  { id: 'icu', name: 'Intensive Care Unit', shortName: 'ICU', totalBeds: 20, baseRate: 0.85, icon: 'Activity', initialOccupied: 17 },
  { id: 'general', name: 'General Emergency', shortName: 'GEN', totalBeds: 30, baseRate: 0.66, icon: 'Hospital', initialOccupied: 21 },
  { id: 'trauma', name: 'Trauma & Resuscitation', shortName: 'TRM', totalBeds: 15, baseRate: 0.90, icon: 'ShieldAlert', initialOccupied: 14 },
  { id: 'pediatric', name: 'Pediatric Emergency', shortName: 'PED', totalBeds: 18, baseRate: 0.70, icon: 'Baby', initialOccupied: 13 },
];

// Deterministic PRNG — no Math.random() in the data path.
function mulberry32(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function getWardStatus(occupied: number, total: number): WardStatus {
  const rate = total > 0 ? occupied / total : 0;
  if (rate >= 1) return 'FULL';
  if (rate >= 0.95) return 'CRITICAL';
  if (rate >= 0.8) return 'HIGH';
  if (rate >= 0.7) return 'MODERATE';
  return 'AVAILABLE';
}

export const STATUS_PRIORITY: Record<WardStatus, number> = {
  FULL: 0,
  CRITICAL: 1,
  HIGH: 2,
  MODERATE: 3,
  AVAILABLE: 4,
};

// Time-of-day demand multiplier — busier midday through evening.
function demandCurve(hour: number): number {
  const morning = Math.exp(-((hour - 10) ** 2) / 6);
  const afternoon = Math.exp(-((hour - 15) ** 2) / 8);
  return 0.55 + 0.3 * afternoon + 0.15 * morning;
}

function buildForecast(seed: number): ForecastPoint[] {
  const rng = mulberry32(seed);
  const points: ForecastPoint[] = [];
  for (let h = 0; h < 24; h++) {
    const base = 22;
    const peak = 20 * Math.exp(-((h - 15) ** 2) / 8);
    const morning = 8 * Math.exp(-((h - 10) ** 2) / 6);
    const noise = (rng() - 0.5) * 3;
    const demand = Math.max(8, Math.round(base + peak + morning + noise));
    const risk = getWardStatus(demand, 48);
    const label = `${h.toString().padStart(2, '0')}:00`;
    points.push({ hour: h, label, demand, risk });
  }
  return points;
}

function initialWards(): Ward[] {
  return WARDS_CONFIG.map((c) => {
    const occ = c.initialOccupied;
    const history = Array.from({ length: 40 }, () => occ / c.totalBeds);
    const arrivals = Array.from({ length: 30 }, (_, i) => {
      const rng = mulberry32(1000 + i * 7);
      return Math.round(2 + rng() * 4);
    });
    return {
      id: c.id,
      name: c.name,
      shortName: c.shortName,
      totalBeds: c.totalBeds,
      occupiedBeds: occ,
      icon: c.icon,
      occupancyHistory: history,
      arrivalsHistory: arrivals,
    };
  });
}

function initialFlow(): PatientFlow {
  const arrivalsHistory = Array.from({ length: 30 }, (_, i) => {
    const rng = mulberry32(500 + i * 11);
    return Math.round(2 + rng() * 5);
  });
  return {
    arrivals: arrivalsHistory[arrivalsHistory.length - 1],
    admissions: 9,
    discharges: 6,
    transfers: 3,
    arrivalsHistory,
  };
}

export function createInitialState(): HospitalData {
  return {
    wards: initialWards(),
    patientFlow: initialFlow(),
    forecast: buildForecast(42),
    rushScore: computeRushScore(initialWards()),
    lastUpdated: Date.now(),
    connectionStatus: 'SIMULATION',
  };
}

function computeRushScore(wards: Ward[]): number {
  const totalBeds = wards.reduce((s, w) => s + w.totalBeds, 0);
  const occupied = wards.reduce((s, w) => s + w.occupiedBeds, 0);
  const rate = totalBeds > 0 ? occupied / totalBeds : 0;
  // Weighted: occupancy drives most of the score, with a small deterministic jitter.
  const score = Math.round(rate * 100);
  return Math.min(100, Math.max(0, score));
}

function rushLabel(score: number): WardStatus {
  if (score >= 90) return 'FULL';
  if (score >= 80) return 'CRITICAL';
  if (score >= 70) return 'HIGH';
  if (score >= 50) return 'MODERATE';
  return 'AVAILABLE';
}

export function rushStatus(score: number): WardStatus {
  return rushLabel(score);
}

// Evolve the simulation one tick. Deterministic given the tick index.
export function stepSimulation(prev: HospitalData, tick: number): HospitalData {
  const rng = mulberry32(2024 + tick * 31);
  const hour = new Date().getHours();
  const demand = demandCurve(hour);

  const wards: Ward[] = prev.wards.map((w) => {
    const cfg = WARDS_CONFIG.find((c) => c.id === w.id)!;
    const target = Math.round(cfg.totalBeds * Math.min(1, cfg.baseRate * demand + 0.05));
    let next = w.occupiedBeds;
    const r = rng();
    if (r < 0.32 && next < cfg.totalBeds) {
      next += 1;
    } else if (r < 0.64 && next > 0) {
      next -= 1;
    } else if (next < target && rng() < 0.4) {
      next += 1;
    } else if (next > target && rng() < 0.4) {
      next -= 1;
    }
    next = Math.max(0, Math.min(cfg.totalBeds, next));

    const newOcc = next / cfg.totalBeds;
    const occupancyHistory = [...w.occupancyHistory.slice(-39), newOcc];
    const lastArr = w.arrivalsHistory[w.arrivalsHistory.length - 1];
    const arrDelta = Math.round((rng() - 0.45) * 4);
    const newArr = Math.max(0, Math.min(12, lastArr + arrDelta));
    const arrivalsHistory = [...w.arrivalsHistory.slice(-29), newArr];

    return { ...w, occupiedBeds: next, occupancyHistory, arrivalsHistory };
  });

  const lastFlow = prev.patientFlow;
  const arrivals = Math.max(0, lastFlow.arrivals + Math.round((rng() - 0.45) * 4));
  const admissions = Math.max(0, lastFlow.admissions + Math.round((rng() - 0.5) * 3));
  const discharges = Math.max(0, lastFlow.discharges + Math.round((rng() - 0.5) * 3));
  const transfers = Math.max(0, lastFlow.transfers + Math.round((rng() - 0.5) * 2));
  const arrivalsHistory = [...lastFlow.arrivalsHistory.slice(-29), arrivals];

  const patientFlow: PatientFlow = {
    arrivals: Math.min(12, arrivals),
    admissions,
    discharges,
    transfers,
    arrivalsHistory,
  };

  const rushScore = computeRushScore(wards);

  return {
    wards,
    patientFlow,
    forecast: prev.forecast,
    rushScore,
    lastUpdated: Date.now(),
    connectionStatus: 'SIMULATION',
  };
}
