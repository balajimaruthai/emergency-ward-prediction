import { memo, useMemo } from 'react';
import { Bed, CheckCircle2 } from 'lucide-react';
import type { Ward } from '@/lib/types';
import { WardIcon } from '@/components/WardIcon';

interface AvailableNowPanelProps {
  wards: Ward[];
}

export const AvailableNowPanel = memo(function AvailableNowPanel({ wards }: AvailableNowPanelProps) {
  const withAvailability = useMemo(() => {
    return wards
      .map((w) => ({ ward: w, available: w.totalBeds - w.occupiedBeds }))
      .filter((x) => x.available > 0)
      .sort((a, b) => b.available - a.available);
  }, [wards]);

  const totalAvailable = wards.reduce((s, w) => s + (w.totalBeds - w.occupiedBeds), 0);

  return (
    <div className="glass rounded-2xl p-5 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Bed className="w-4 h-4 text-emerald-500" />
        <h3 className="text-base font-semibold text-slate-800 dark:text-navy-100">
          Available Now
        </h3>
      </div>

      <div className="space-y-3">
        {withAvailability.length > 0 ? (
          withAvailability.map(({ ward, available }) => (
            <div
              key={ward.id}
              className="flex items-center justify-between gap-3 py-2.5 border-b border-slate-100 dark:border-white/5 last:border-0"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <WardIcon
                  iconKey={ward.icon}
                  className="w-4 h-4 text-slate-400 dark:text-navy-400 shrink-0"
                />
                <span className="text-sm font-medium text-slate-600 dark:text-navy-300 truncate">
                  {ward.name}
                </span>
              </div>
              <div className="flex items-baseline gap-1 shrink-0">
                <span className="text-lg font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                  {available}
                </span>
                <span className="text-xs text-slate-400 dark:text-navy-400">beds</span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center gap-2 py-4 text-sm text-slate-400 dark:text-navy-400">
            <CheckCircle2 className="w-4 h-4" />
            No beds currently available.
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tabular-nums text-slate-800 dark:text-navy-100">
            {totalAvailable}
          </span>
          <span className="text-sm text-slate-400 dark:text-navy-400">
            beds available across emergency units
          </span>
        </div>
      </div>
    </div>
  );
});
