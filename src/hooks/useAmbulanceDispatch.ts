import { useState, useEffect, useCallback } from 'react';

export interface AmbulanceDispatch {
  id: string;
  ambulanceUnit: string;
  driverName: string;
  paramedicName?: string;
  driverPhone?: string;
  targetHospitalId: string;
  targetHospitalName: string;
  city: string;
  patientCondition: 'Critical Trauma' | 'Cardiac Emergency' | 'Severe Respiratory' | 'Stroke Alert' | 'Obstetric Emergency' | 'General Triage';
  patientAgeGender: string;
  vitals: string;
  etaMinutes: number;
  distanceKm: number;
  trafficCondition: 'Clear Expressway' | 'Moderate Traffic' | 'Heavy Congestion';
  status: 'DISPATCHED' | 'EN_ROUTE' | 'ARRIVED' | 'COMPLETED';
  erBayAssigned?: string;
  timestamp: number;
}

const DISPATCH_STORAGE_KEY = 'ewi-active-ambulance-dispatches';
const DISPATCH_EVENT_NAME = 'ewi-dispatch-update';

export function useAmbulanceDispatch(hospitalIdFilter?: string) {
  const [dispatches, setDispatches] = useState<AmbulanceDispatch[]>(() => {
    try {
      const stored = localStorage.getItem(DISPATCH_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return getInitialDemoDispatches();
  });

  const saveAndBroadcast = (newList: AmbulanceDispatch[]) => {
    setDispatches(newList);
    localStorage.setItem(DISPATCH_STORAGE_KEY, JSON.stringify(newList));
    window.dispatchEvent(new CustomEvent(DISPATCH_EVENT_NAME, { detail: newList }));
  };

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<AmbulanceDispatch[]>;
      if (customEvent.detail) {
        setDispatches(customEvent.detail);
      }
    };
    window.addEventListener(DISPATCH_EVENT_NAME, handleUpdate);
    return () => window.removeEventListener(DISPATCH_EVENT_NAME, handleUpdate);
  }, []);

  const sendDispatch = useCallback((payload: Omit<AmbulanceDispatch, 'id' | 'timestamp' | 'status'>) => {
    const newDispatch: AmbulanceDispatch = {
      ...payload,
      id: `dispatch-${Date.now()}`,
      status: 'EN_ROUTE',
      timestamp: Date.now(),
      erBayAssigned: payload.erBayAssigned ?? `ER Bay #${Math.floor(Math.random() * 6) + 1}`,
    };

    setDispatches((prev) => {
      const updated = [newDispatch, ...prev.filter((d) => d.ambulanceUnit !== payload.ambulanceUnit)];
      localStorage.setItem(DISPATCH_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent(DISPATCH_EVENT_NAME, { detail: updated }));
      return updated;
    });

    return newDispatch;
  }, []);

  const acknowledgeDispatch = useCallback((dispatchId: string, erBay?: string) => {
    setDispatches((prev) => {
      const updated = prev.map((d) => {
        if (d.id === dispatchId) {
          return {
            ...d,
            status: 'EN_ROUTE' as const,
            erBayAssigned: erBay ?? d.erBayAssigned ?? 'ER Bay #1 Reserved',
          };
        }
        return d;
      });
      localStorage.setItem(DISPATCH_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent(DISPATCH_EVENT_NAME, { detail: updated }));
      return updated;
    });
  }, []);

  const completeDispatch = useCallback((dispatchId: string) => {
    setDispatches((prev) => {
      const updated = prev.filter((d) => d.id !== dispatchId);
      localStorage.setItem(DISPATCH_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent(DISPATCH_EVENT_NAME, { detail: updated }));
      return updated;
    });
  }, []);

  const filtered = hospitalIdFilter
    ? dispatches.filter((d) => d.targetHospitalId === hospitalIdFilter || d.targetHospitalName.toLowerCase().includes(hospitalIdFilter.toLowerCase()))
    : dispatches;

  return {
    dispatches: filtered,
    allDispatches: dispatches,
    sendDispatch,
    acknowledgeDispatch,
    completeDispatch,
  };
}

function getInitialDemoDispatches(): AmbulanceDispatch[] {
  return [
    {
      id: 'demo-dispatch-1',
      ambulanceUnit: 'EMS-108-ALPHA',
      driverName: 'Officer Suresh Kumar',
      paramedicName: 'R. Vignesh (Paramedic-1)',
      driverPhone: '+91 98401 22108',
      targetHospitalId: 'chennai-0',
      targetHospitalName: 'Apollo Hospitals',
      city: 'Chennai',
      patientCondition: 'Critical Trauma',
      patientAgeGender: '48M - Motor Accident',
      vitals: 'BP 105/70 | SpO2 94% | Pulse 110',
      etaMinutes: 7,
      distanceKm: 4.2,
      trafficCondition: 'Clear Expressway',
      status: 'EN_ROUTE',
      erBayAssigned: 'ER Bay #2 (Trauma Prep)',
      timestamp: Date.now() - 180000,
    },
  ];
}
