import { motion } from 'framer-motion';
import {
  Boxes,
  HeartPulse,
  Wind,
  BedSingle,
  Ambulance,
  Activity,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { useRealtimeContext } from '@/hooks/realtimeContext';

export function ResourcesPage() {
  const { data } = useRealtimeContext();

  const totalBeds = data.wards.reduce((s, w) => s + w.totalBeds, 0);
  const icuWard = data.wards.find((w) => w.id.endsWith('-w1') || w.name === 'ICU');
  const icuBeds = icuWard ? icuWard.totalBeds : 24;
  const icuOccupied = icuWard ? icuWard.occupiedBeds : 18;
  const ventilators = Math.round(icuBeds * 0.65);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <Boxes className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-navy-100 tracking-tight">
              Critical Emergency Resource Management
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-navy-400">
            Real-time status of ICU equipment, ventilator supply, oxygen reserves, and trauma staff.
          </p>
        </div>
      </div>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
              <Wind className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              OPERATIONAL
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-navy-100">Mechanical Ventilators</h3>
          <div className="text-3xl font-extrabold text-slate-800 dark:text-navy-100 my-2">{ventilators} Total</div>
          <p className="text-xs text-slate-400 dark:text-navy-400">
            {ventilators - Math.round(ventilators * 0.7)} Available · 70% Currently in active use
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
              <HeartPulse className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full">
              HIGH DEMAND
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-navy-100">ICU Care Units</h3>
          <div className="text-3xl font-extrabold text-slate-800 dark:text-navy-100 my-2">{icuBeds} Units</div>
          <p className="text-xs text-slate-400 dark:text-navy-400">
            {icuBeds - icuOccupied} Free beds · {icuOccupied} Occupied
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              98.4% CAPACITY
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-navy-100">Liquid Oxygen Tank Reserve</h3>
          <div className="text-3xl font-extrabold text-slate-800 dark:text-navy-100 my-2">14,200 L</div>
          <p className="text-xs text-slate-400 dark:text-navy-400">
            Autonomy: 78 hours at peak consumption rate
          </p>
        </motion.div>
      </div>

      {/* Staff & Fleet Table */}
      <div className="glass-strong rounded-2xl p-6 border border-slate-200/60 dark:border-white/5">
        <h3 className="text-base font-bold text-slate-800 dark:text-navy-100 mb-4">
          On-Duty Staff & Fleet Readiness
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-800/40 border border-slate-200/40 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Ambulance className="w-5 h-5 text-red-500" />
              <div>
                <div className="font-bold text-slate-800 dark:text-navy-100 text-sm">Ambulance Fleet Status</div>
                <div className="text-slate-400 dark:text-navy-400">8 Units On-Call · 2 Dispatched</div>
              </div>
            </div>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">READY</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-800/40 border border-slate-200/40 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-cyan-500" />
              <div>
                <div className="font-bold text-slate-800 dark:text-navy-100 text-sm">Trauma Nursing Ratio</div>
                <div className="text-slate-400 dark:text-navy-400">1:2 Nurse-to-Patient Ratio</div>
              </div>
            </div>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">OPTIMAL</span>
          </div>
        </div>
      </div>
    </div>
  );
}
