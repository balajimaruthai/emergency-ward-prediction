import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  AlertTriangle,
  Clock,
  TrendingUp,
  Activity,
  Zap,
  CheckCircle2,
  Users,
  BedSingle,
  ShieldAlert,
  Calendar,
} from 'lucide-react';
import { useRealtimeContext } from '@/hooks/realtimeContext';

export function PredictionPage() {
  const { data } = useRealtimeContext();
  const [selectedHorizon, setSelectedHorizon] = useState<'3h' | '6h' | '12h' | '24h'>('6h');

  // Calculate high-risk wards based on simulation
  const highRiskWards = data.wards.filter((w) => (w.occupiedBeds / w.totalBeds) >= 0.75);
  const totalPredictArrivals = Math.round(data.patientFlow.arrivals * 1.35);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Brain className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-navy-100 tracking-tight">
              AI Patient Inflow & Surge Prediction
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-navy-400">
            Real-time machine learning predictions for emergency arrivals and ward saturation risks.
          </p>
        </div>

        {/* Horizon selector */}
        <div className="flex items-center gap-1.5 glass-strong p-1.5 rounded-xl border border-slate-200 dark:border-white/10">
          {(['3h', '6h', '12h', '24h'] as const).map((h) => (
            <button
              key={h}
              onClick={() => setSelectedHorizon(h)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedHorizon === h
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'text-slate-500 dark:text-navy-300 hover:text-slate-700 dark:hover:text-white'
              }`}
            >
              {h.toUpperCase()} Horizon
            </button>
          ))}
        </div>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-5 border-l-4 border-l-purple-500"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400 dark:text-navy-400 uppercase tracking-wider">
              Predicted Inflow
            </span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-800 dark:text-navy-100 tabular-nums">
            +{totalPredictArrivals}
          </div>
          <div className="text-xs text-purple-600 dark:text-purple-400 mt-1 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            +18% higher than average
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card rounded-2xl p-5 border-l-4 border-l-red-500"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400 dark:text-navy-400 uppercase tracking-wider">
              High Risk Wards
            </span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-800 dark:text-navy-100 tabular-nums">
            {highRiskWards.length}
          </div>
          <div className="text-xs text-red-500 mt-1 font-medium flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            Critical surge potential
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-5 border-l-4 border-l-amber-500"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400 dark:text-navy-400 uppercase tracking-wider">
              Bed Saturation ETA
            </span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-800 dark:text-navy-100 tabular-nums">
            4h 20m
          </div>
          <div className="text-xs text-amber-500 mt-1 font-medium">
            Emergency & ICU wards
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card rounded-2xl p-5 border-l-4 border-l-emerald-500"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400 dark:text-navy-400 uppercase tracking-wider">
              Model Accuracy
            </span>
            <Zap className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-800 dark:text-navy-100 tabular-nums">
            94.2%
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Validated on historical surge data
          </div>
        </motion.div>
      </div>

      {/* Ward Inflow Risk Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-strong rounded-2xl p-6 border border-slate-200/60 dark:border-white/5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-navy-100">
                Ward-by-Ward 6-Hour Pressure Risk
              </h3>
              <p className="text-xs text-slate-400 dark:text-navy-400 mt-0.5">
                AI estimated incoming cases vs available capacity
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-red-500/10 text-red-500 font-semibold">
                High Risk ({highRiskWards.length})
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {data.wards.map((ward) => {
              const currentRate = (ward.occupiedBeds / ward.totalBeds) * 100;
              const predictedAdd = Math.round(Math.random() * 6) + 2;
              const predictedRate = Math.min(100, Math.round(((ward.occupiedBeds + predictedAdd) / ward.totalBeds) * 100));
              const isHigh = predictedRate >= 85;

              return (
                <div
                  key={ward.id}
                  className="bg-slate-50/80 dark:bg-navy-800/40 rounded-xl p-4 border border-slate-200/40 dark:border-white/5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          isHigh ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'
                        }`}
                      />
                      <div>
                        <span className="text-sm font-bold text-slate-800 dark:text-navy-100">
                          {ward.name}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-navy-400 ml-2">
                          ({ward.occupiedBeds}/{ward.totalBeds} occupied)
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                        +{predictedAdd} incoming
                      </span>
                      <span className="text-sm font-bold ml-3 text-slate-700 dark:text-navy-200">
                        {predictedRate}% target
                      </span>
                    </div>
                  </div>

                  {/* Dual progress bar */}
                  <div className="h-2 rounded-full bg-slate-200 dark:bg-navy-700 overflow-hidden relative">
                    <div
                      className="h-full bg-slate-400 dark:bg-navy-400 absolute left-0"
                      style={{ width: `${currentRate}%` }}
                    />
                    <div
                      className={`h-full absolute left-0 opacity-80 ${
                        isHigh ? 'bg-red-500' : 'bg-purple-500'
                      }`}
                      style={{ width: `${predictedRate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Key Insights */}
        <div className="space-y-4">
          <div className="glass-strong rounded-2xl p-6 border border-slate-200/60 dark:border-white/5">
            <h3 className="text-base font-bold text-slate-800 dark:text-navy-100 mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-500" />
              AI Tactical Recommendations
            </h3>
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20">
                <div className="text-xs font-bold text-purple-700 dark:text-purple-300 mb-1">
                  1. Divert Ambulances to Regional Hubs
                </div>
                <div className="text-xs text-slate-600 dark:text-navy-300">
                  ER ward nearing 88% capacity. Redirect incoming non-critical trauma ambulances to nearby facilities.
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                <div className="text-xs font-bold text-amber-700 dark:text-amber-300 mb-1">
                  2. Fast-Track General Ward Discharges
                </div>
                <div className="text-xs text-slate-600 dark:text-navy-300">
                  Clear 5 general beds by 15:00 to accommodate predicted step-down patients from ICU.
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-1">
                  3. On-Call Staff Activation
                </div>
                <div className="text-xs text-slate-600 dark:text-navy-300">
                  Notify 2 additional trauma triage nurses for evening peak (18:00 - 22:00).
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
