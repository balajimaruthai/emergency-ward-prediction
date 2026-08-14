import { useState, useEffect } from 'react';

export interface TrafficPoliceAlert {
  id: string;
  ambulanceUnit: string;
  driverName: string;
  targetHospital: string;
  city: string;
  patientCondition: string;
  currentLat: number;
  currentLng: number;
  signalsToOverride: string[];
  status: 'PENDING' | 'POLICE_ACKNOWLEDGED' | 'CORRIDOR_CLEARED' | 'COMPLETED';
  timestamp: number;
  policeNote?: string;
}

const TRAFFIC_ALERT_KEY = 'ewi_traffic_police_alerts';
const TRAFFIC_EVENT = 'ewi_traffic_police_event';

export function useTrafficPoliceDispatch() {
  const [alerts, setAlerts] = useState<TrafficPoliceAlert[]>(() => {
    try {
      const saved = localStorage.getItem(TRAFFIC_ALERT_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeCorridorAlert, setActiveCorridorAlert] = useState<TrafficPoliceAlert | null>(null);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === TRAFFIC_ALERT_KEY && e.newValue) {
        try {
          setAlerts(JSON.parse(e.newValue));
        } catch (err) {
          console.warn('Failed to parse traffic alerts:', err);
        }
      }
    };

    const handleCustom = (e: CustomEvent<TrafficPoliceAlert[]>) => {
      setAlerts(e.detail);
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(TRAFFIC_EVENT as any, handleCustom as any);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(TRAFFIC_EVENT as any, handleCustom as any);
    };
  }, []);

  const sendPoliceEmergencyAlert = (params: {
    ambulanceUnit: string;
    driverName: string;
    targetHospital: string;
    city: string;
    patientCondition: string;
    currentLat: number;
    currentLng: number;
  }): TrafficPoliceAlert => {
    const newAlert: TrafficPoliceAlert = {
      id: `POLICE-ALERT-${Date.now()}`,
      ambulanceUnit: params.ambulanceUnit,
      driverName: params.driverName,
      targetHospital: params.targetHospital,
      city: params.city,
      patientCondition: params.patientCondition,
      currentLat: params.currentLat,
      currentLng: params.currentLng,
      signalsToOverride: ['Junction #1 Flyover', 'Junction #14 Central', 'Hospital Ramp Entrance'],
      status: 'PENDING',
      timestamp: Date.now(),
      policeNote: 'Dispatch Alert broadcast to Traffic Control Room. Awaiting signal override...',
    };

    const updated = [newAlert, ...alerts.slice(0, 19)];
    setAlerts(updated);
    setActiveCorridorAlert(newAlert);

    try {
      localStorage.setItem(TRAFFIC_ALERT_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent(TRAFFIC_EVENT, { detail: updated }));
    } catch (err) {
      console.warn('Failed to persist traffic police alert:', err);
    }

    // Simulate real police station response sequence after 2 seconds
    setTimeout(() => {
      const ackAlert: TrafficPoliceAlert = {
        ...newAlert,
        status: 'POLICE_ACKNOWLEDGED',
        policeNote: '🚨 TRAFFIC POLICE HQ ACKNOWLEDGED: Officer Patrol Squad #4 deployed to clear Main Expressway bottleneck.',
      };
      setAlerts((prev) => prev.map((a) => (a.id === newAlert.id ? ackAlert : a)));
      setActiveCorridorAlert(ackAlert);

      // Simulate full corridor clearance after 4 seconds
      setTimeout(() => {
        const clearedAlert: TrafficPoliceAlert = {
          ...ackAlert,
          status: 'CORRIDOR_CLEARED',
          policeNote: '🟢 GREEN CORRIDOR ACTIVATED: All 3 traffic signals forced GREEN. High-speed emergency passage clear!',
        };
        setAlerts((prev) => prev.map((a) => (a.id === newAlert.id ? clearedAlert : a)));
        setActiveCorridorAlert(clearedAlert);
      }, 3000);
    }, 2000);

    return newAlert;
  };

  return {
    alerts,
    activeCorridorAlert,
    sendPoliceEmergencyAlert,
  };
}
