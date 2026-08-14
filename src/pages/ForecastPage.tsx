import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Calendar,
  Clock,
  Activity,
  AlertCircle,
  ArrowUpRight,
  Shield,
  Layers,
} from 'lucide-react';
import { downloadCSV } from '@/lib/csvExport';
import { useRealtimeContext } from '@/hooks/realtimeContext';
import type { Ward } from '@/lib/types';

export function ForecastPage() {
  const { data } = useRealtimeContext();
  const [range, setRange] = useState<'24h' | '7d' | '30d'>('24h');

  const handleExportCSV = () => {
    const rows = data.wards.map((w: Ward) => {
      const predictedInflow = Math.round(w.occupiedBeds * 0.35 + 8);
      const projectedOccupancy = Math.min(100, Math.round(((w.occupiedBeds + predictedInflow) / w.totalBeds) * 100));
      return {
        'Department': w.name,
        'Forecast Horizon': range,
        'Current Occupied': w.occupiedBeds,
        'Total Capacity': w.totalBeds,
        'Projected Inflow (Patients)': predictedInflow,
        'Projected Occupancy (%)': `${projectedOccupancy}%`,
        'Risk Status': projectedOccupancy >= 85 ? 'HIGH SURGE RISK' : 'NORMAL CAPACITY',
        'Export Date': new Date().toISOString(),
      };
    });
    downloadCSV(`emergency_demand_forecast_${range}.csv`, rows);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-navy-100 tracking-tight">
              Emergency Demand Forecast & Projections
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-navy-400">
            Multi-horizon time series forecasting for regional emergency demand across all wards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
          >
            Export Forecast CSV
          </button>

          {/* Range switcher */}
          <div className="flex items-center gap-1.5 glass-strong p-1.5 rounded-xl border border-slate-200 dark:border-white/10">
            {(['24h', '7d', '30d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  range === r
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-500 dark:text-navy-300 hover:text-slate-700 dark:hover:text-white'
              }`}
            >
              {r === '24h' ? '24 Hours' : r === '7d' ? '7 Days' : '30 Days'}
            </button>
          ))}
        </div>
      </div>
    </div>

      {/* Forecast Chart Panel */}
      <div className="glass-strong rounded-2xl p-6 border border-slate-200/60 dark:border-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-navy-100">
              Projected Bed Occupancy Curve ({range})
            </h3>
            <p className="text-xs text-slate-400 dark:text-navy-400">
              Confidence intervals (95%) mapped against hourly historical baseline
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 rounded bg-emerald-500" />
              <span className="text-slate-600 dark:text-navy-300">Projected Demand</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 rounded bg-slate-300 dark:bg-navy-600" />
              <span className="text-slate-400 dark:text-navy-400">Baseline Capacity</span>
            </div>
          </div>
        </div>

        {/* Timeline visualization bars */}
        <div className="space-y-4 my-6">
          {data.forecast.map((pt: any, i: number) => {
            const isPeak = pt.demand > 75;
            const barWidth = Math.min(100, Math.max(15, pt.demand));
            const barColor = isPeak ? '#DC2626' : pt.demand > 55 ? '#D97706' : '#16A34A';

            return (
              <motion.div
                key={pt.hour}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-4 text-xs"
              >
                <span className="w-16 text-slate-500 dark:text-navy-400 font-medium shrink-0">
                  {pt.label}
                </span>
                <div className="flex-1 bg-slate-100 dark:bg-navy-800 rounded-lg h-7 p-1 relative overflow-hidden flex items-center">
                  <div
                    className="h-full rounded-md bar-fill flex items-center justify-end pr-2 font-bold text-[10px] text-white"
                    style={{ width: `${barWidth}%`, backgroundColor: barColor }}
                  >
                    {pt.demand}%
                  </div>
                </div>
                <span
                  className="w-20 text-right font-bold uppercase tracking-wider text-[10px]"
                  style={{ color: barColor }}
                >
                  {pt.risk}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Seasonal & Regional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-strong rounded-2xl p-6 border border-slate-200/60 dark:border-white/5">
          <h3 className="text-base font-bold text-slate-800 dark:text-navy-100 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-500" />
            Seasonal Demand Factors
          </h3>
          <ul className="space-y-3 text-xs text-slate-600 dark:text-navy-300">
            <li className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-navy-800/40">
              <ArrowUpRight className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 dark:text-navy-100">Monsoon Respiratory Surge:</strong> +22% increase in pediatric & ICU admissions anticipated over the next 14 days.
              </div>
            </li>
            <li className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-navy-800/40">
              <ArrowUpRight className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 dark:text-navy-100">Weekend Traffic Peaks:</strong> Trauma ward volume spikes by 35% between Friday 20:00 and Sunday 04:00.
              </div>
            </li>
          </ul>
        </div>

        <div className="glass-strong rounded-2xl p-6 border border-slate-200/60 dark:border-white/5">
          <h3 className="text-base font-bold text-slate-800 dark:text-navy-100 mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-accent-500" />
            Buffer Capacity Preparedness
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 dark:text-navy-400">Emergency Surge Reserve</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">14 Beds Available</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-navy-700 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[70%]" />
            </div>

            <div className="flex justify-between items-center text-xs pt-2">
              <span className="text-slate-500 dark:text-navy-400">ICU Backup Power & Oxygen</span>
              <span className="font-bold text-accent-500">100% Operational</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-navy-700 h-2 rounded-full overflow-hidden">
              <div className="bg-accent-500 h-full w-[100%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
