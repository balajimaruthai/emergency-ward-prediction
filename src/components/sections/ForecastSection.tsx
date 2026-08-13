import { memo } from 'react';
import { Brain, Clock, TrendingUp } from 'lucide-react';
import type { ForecastPoint, WardStatus } from '@/lib/types';
import { ForecastChart } from '@/components/ForecastChart';
import { StatusBadge } from '@/components/StatusBadge';

interface ForecastSectionProps {
  forecast: ForecastPoint[];
}

export const ForecastSection = memo(function ForecastSection({ forecast }: ForecastSectionProps) {
  // Find the next peak period
  let peakStart = 14;
  let peakEnd = 16;
  let peakDemand = 0;
  for (let i = 0; i < forecast.length; i++) {
    if (forecast[i].demand > peakDemand) {
      peakDemand = forecast[i].demand;
      peakStart = forecast[i].hour;
      peakEnd = forecast[i].hour + 2;
    }
  }
  const peakRisk = peakDemand >= 40 ? 'HIGH' : peakDemand >= 30 ? 'MODERATE' : 'AVAILABLE';

  return (
    <div className="bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/8 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-5">
        <Brain className="w-4 h-4 text-accent-500" />
        <h3 className="text-base font-semibold text-slate-800 dark:text-navy-100">
          Emergency Demand Forecast
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-5">
        <ForecastStat
          icon={Clock}
          label="Next Peak"
          value={`${peakStart.toString().padStart(2, '0')}:00 – ${peakEnd.toString().padStart(2, '0')}:00`}
        />
        <ForecastStat
          icon={TrendingUp}
          label="Expected Demand"
          value={`${peakDemand} patients`}
        />
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-slate-400 dark:text-navy-400 uppercase tracking-wider">
            Risk
          </span>
          <StatusBadge status={peakRisk as WardStatus} size="md" />
        </div>
      </div>

      <div>
        <div className="text-xs text-slate-400 dark:text-navy-400 mb-2">
          24-Hour Forecast
        </div>
        <ForecastChart data={forecast} height={140} />
        <div className="flex justify-between mt-2 text-[10px] text-slate-300 dark:text-navy-500 tabular-nums">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>24:00</span>
        </div>
      </div>
    </div>
  );
});

function ForecastStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-navy-400 uppercase tracking-wider">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <span className="text-lg font-bold text-slate-700 dark:text-navy-200">{value}</span>
    </div>
  );
}
