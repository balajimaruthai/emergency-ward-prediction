import { memo } from 'react';
import { Bed, ArrowUp, ArrowDown, Percent } from 'lucide-react';
import { KpiCard } from '@/components/KpiCard';

interface KpiRowProps {
  totalBeds: number;
  occupied: number;
  available: number;
  occupancyRate: number;
  prevAvailable?: number;
  prevOccupied?: number;
}

export const KpiRow = memo(function KpiRow({
  totalBeds,
  occupied,
  available,
  occupancyRate: rate,
  prevAvailable,
  prevOccupied,
}: KpiRowProps) {
  const availableTrend =
    prevAvailable !== undefined && available !== prevAvailable
      ? `${available > prevAvailable ? '+' : ''}${available - prevAvailable} from last hour`
      : undefined;
  const availableDir = prevAvailable !== undefined && available > prevAvailable ? 'up' : prevAvailable !== undefined && available < prevAvailable ? 'down' : 'neutral';

  const occupiedTrend =
    prevOccupied !== undefined && occupied !== prevOccupied
      ? `${occupied > prevOccupied ? '+' : ''}${occupied - prevOccupied} from last hour`
      : undefined;
  const occupiedDir = prevOccupied !== undefined && occupied > prevOccupied ? 'up' : prevOccupied !== undefined && occupied < prevOccupied ? 'down' : 'neutral';

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        label="Total Beds"
        value={totalBeds}
        icon={Bed}
        trend="across all units"
        trendDirection="neutral"
      />
      <KpiCard
        label="Occupied"
        value={occupied}
        icon={ArrowUp}
        trend={occupiedTrend}
        trendDirection={occupiedDir}
        changed={occupiedTrend !== undefined}
      />
      <KpiCard
        label="Available Beds"
        value={available}
        icon={ArrowDown}
        trend={availableTrend}
        trendDirection={availableDir}
        emphasis
        changed={availableTrend !== undefined}
      />
      <KpiCard
        label="Occupancy"
        value={`${rate.toFixed(1)}%`}
        icon={Percent}
        trend={rate >= 80 ? 'High pressure' : rate >= 70 ? 'Moderate pressure' : 'Normal range'}
        trendDirection={rate >= 80 ? 'up' : 'neutral'}
      />
    </div>
  );
});
