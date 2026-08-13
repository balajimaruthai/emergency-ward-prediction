import { createContext, useContext } from 'react';
import type { HospitalData, ConnectionStatus } from '@/lib/types';
import { createInitialState } from '@/lib/simulation';

export interface RealtimeContextValue {
  data: HospitalData;
  status: ConnectionStatus;
  lastUpdated: number;
  changedWardIds: string[];
}

export const RealtimeContext = createContext<RealtimeContextValue | null>(null);

export function useRealtimeContext(): RealtimeContextValue {
  const ctx = useContext(RealtimeContext);
  if (!ctx) {
    const initial = createInitialState();
    return {
      data: initial,
      status: initial.connectionStatus,
      lastUpdated: initial.lastUpdated,
      changedWardIds: [],
    };
  }
  return ctx;
}
