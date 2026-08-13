import { memo } from 'react';
import type { WardStatus } from '@/lib/types';
import { getStatusColor } from '@/lib/format';

interface OccupancyBarProps {
  occupied: number;
  total: number;
  status: WardStatus;
}

export const OccupancyBar = memo(function OccupancyBar({
  occupied,
  total,
  status,
}: OccupancyBarProps) {
  const rate = total > 0 ? (occupied / total) * 100 : 0;
  const colors = getStatusColor(status);
  const fillColor = colors.dot;

  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1 h-2.5 rounded-full bg-slate-100 dark:bg-navy-700/50 overflow-hidden relative">
        <div
          className="bar-fill h-full rounded-full"
          style={{
            width: `${rate}%`,
            backgroundColor: fillColor,
          }}
        />
      </div>
      <span className="text-sm font-semibold tabular-nums text-slate-600 dark:text-navy-300 min-w-[48px] text-right">
        {rate.toFixed(1)}%
      </span>
    </div>
  );
});
