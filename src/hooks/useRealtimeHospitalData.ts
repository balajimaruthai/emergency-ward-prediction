import { useEffect, useRef, useState } from 'react';
import type { HospitalData, ConnectionStatus } from '@/lib/types';
import { createInitialState, stepSimulation } from '@/lib/simulation';

const POLL_INTERVAL = 2000;

interface RealtimeState {
  data: HospitalData;
  status: ConnectionStatus;
  lastUpdated: number;
  changedWardIds: string[];
}

export function useRealtimeHospitalData(): RealtimeState {
  const [state, setState] = useState<RealtimeState>(() => {
    const initial = createInitialState();
    return {
      data: initial,
      status: initial.connectionStatus,
      lastUpdated: initial.lastUpdated,
      changedWardIds: [],
    };
  });

  const tickRef = useRef(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Prevent duplicate polling — clear any existing interval first.
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(() => {
      tickRef.current += 1;
      const tick = tickRef.current;
      setState((prev) => {
        const next = stepSimulation(prev.data, tick);
        const changedWardIds = next.wards
          .filter((w, i) => w.occupiedBeds !== prev.data.wards[i].occupiedBeds)
          .map((w) => w.id);
        return {
          data: next,
          status: next.connectionStatus,
          lastUpdated: next.lastUpdated,
          changedWardIds,
        };
      });
    }, POLL_INTERVAL);

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return state;
}
