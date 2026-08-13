import { memo, useMemo } from 'react';
import { Eye, CheckCircle2 } from 'lucide-react';
import type { Ward } from '@/lib/types';
import { getWardStatus } from '@/lib/simulation';
import { occupancyRate } from '@/lib/format';

interface CapacityWatchPanelProps {
  wards: Ward[];
}

export const CapacityWatchPanel = memo(function CapacityWatchPanel({ wards }: CapacityWatchPanelProps) {
  const watchWards = useMemo(() => {
    return wards
      .map((w) => ({
        ward: w,
        rate: occupancyRate(w.occupiedBeds, w.totalBeds),
        available: w.totalBeds - w.occupiedBeds,
        status: getWardStatus(w.occupiedBeds, w.totalBeds),
      }))
      .filter((x) => x.status === 'HIGH' || x.status === 'CRITICAL' || x.status === 'FULL')
      .sort((a, b) => b.rate - a.rate);
  }, [wards]);

  return (
    <div className="glass rounded-2xl p-5 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Eye className="w-4 h-4 text-amber-500" />
        <h3 className="text-base font-semibold text-slate-800 dark:text-navy-100">
          Capacity Watch
        </h3>
      </div>

      <div className="space-y-3">
        {watchWards.length > 0 ? (
          watchWards.map(({ ward, rate, available, status }) => {
            const color =
              status === 'FULL' || status === 'CRITICAL' ? '#DC2626'
                : status === 'HIGH' ? '#D97706'
                : '#2563EB';
            return (
              <div
                key={ward.id}
                className="py-2.5 border-b border-slate-100 dark:border-white/5 last:border-0"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-600 dark:text-navy-300">
                    {ward.name}
                  </span>
                  <span
                    className="text-sm font-bold tabular-nums"
                    style={{ color }}
                  >
                    {rate.toFixed(0)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-navy-700/50 overflow-hidden mr-3">
                    <div
                      className="bar-fill h-full rounded-full"
                      style={{ width: `${rate}%`, backgroundColor: color }}
                    />
                  </div>
                  <span className="text-xs text-slate-400 dark:text-navy-400 shrink-0">
                    {available} beds remaining
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex items-center gap-2 py-4 text-sm text-slate-400 dark:text-navy-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            No critical capacity alerts
          </div>
        )}
      </div>
    </div>
  );
});
