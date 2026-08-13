import { motion } from 'framer-motion';
import {
  BarChart3,
  Clock,
  CheckCircle2,
  TrendingUp,
  Activity,
  Users,
  PieChart,
  Download,
} from 'lucide-react';
import { useRealtimeContext } from '@/hooks/realtimeContext';

export function AnalyticsPage() {
  const { data } = useRealtimeContext();

  const totalBeds = data.wards.reduce((s, w) => s + w.totalBeds, 0);
  const occupied = data.wards.reduce((s, w) => s + w.occupiedBeds, 0);
  const occupancyPct = totalBeds > 0 ? ((occupied / totalBeds) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-navy-100 tracking-tight">
              Hospital Emergency Analytics
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-navy-400">
            Historical bed utilization, admission throughput, and ward bottleneck analysis.
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-600 hover:bg-accent-700 text-white text-xs font-bold transition-all shadow-md shadow-accent-500/20">
          <Download className="w-3.5 h-3.5" />
          Export Analytics Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <div className="text-xs text-slate-400 dark:text-navy-400 uppercase font-semibold">Avg Length of Stay</div>
          <div className="text-2xl font-extrabold text-slate-800 dark:text-navy-100 mt-2">2.4 Days</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">-0.3 days vs last week</div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <div className="text-xs text-slate-400 dark:text-navy-400 uppercase font-semibold">ER Triage Time</div>
          <div className="text-2xl font-extrabold text-slate-800 dark:text-navy-100 mt-2">14.2 Mins</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Within target threshold</div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <div className="text-xs text-slate-400 dark:text-navy-400 uppercase font-semibold">Overall Occupancy</div>
          <div className="text-2xl font-extrabold text-slate-800 dark:text-navy-100 mt-2">{occupancyPct}%</div>
          <div className="text-xs text-amber-500 mt-1">Optimal target 75%</div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <div className="text-xs text-slate-400 dark:text-navy-400 uppercase font-semibold">Discharge Rate</div>
          <div className="text-2xl font-extrabold text-slate-800 dark:text-navy-100 mt-2">88.5%</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">+4.2% daily turnaround</div>
        </div>
      </div>

      {/* Breakdown per ward */}
      <div className="glass-strong rounded-2xl p-6 border border-slate-200/60 dark:border-white/5">
        <h3 className="text-base font-bold text-slate-800 dark:text-navy-100 mb-4">
          Historical Utilization by Department
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-400 dark:text-navy-400 uppercase border-b border-slate-200/60 dark:border-white/5">
                <th className="text-left py-3 font-semibold">Ward</th>
                <th className="text-center py-3 font-semibold">Total Beds</th>
                <th className="text-center py-3 font-semibold">Occupied</th>
                <th className="text-center py-3 font-semibold">Utilisation %</th>
                <th className="text-center py-3 font-semibold">Peak Hour</th>
                <th className="text-right py-3 font-semibold">Turnover Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {data.wards.map((w) => {
                const util = Math.round((w.occupiedBeds / w.totalBeds) * 100);
                return (
                  <tr key={w.id} className="hover:bg-slate-50 dark:hover:bg-navy-800/40">
                    <td className="py-3 font-bold text-slate-700 dark:text-navy-200">{w.name}</td>
                    <td className="text-center py-3 text-slate-500 dark:text-navy-400">{w.totalBeds}</td>
                    <td className="text-center py-3 font-semibold text-slate-700 dark:text-navy-200">{w.occupiedBeds}</td>
                    <td className="text-center py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        util >= 85 ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {util}%
                      </span>
                    </td>
                    <td className="text-center py-3 text-slate-500 dark:text-navy-400">19:00 - 22:00</td>
                    <td className="text-right py-3 font-semibold text-slate-700 dark:text-navy-200">1.8 beds/day</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
