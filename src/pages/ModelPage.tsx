import { motion } from 'framer-motion';
import { Cpu, Zap, CheckCircle2, ShieldCheck, Database, Sliders, RefreshCw } from 'lucide-react';

export function ModelPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Cpu className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-navy-100 tracking-tight">
              AI Demand Model & Architecture
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-navy-400">
            Specifications, ensemble model hyperparameters, and automated drift monitoring.
          </p>
        </div>
      </div>

      {/* Model Spec Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <div className="text-xs text-slate-400 dark:text-navy-400 uppercase font-semibold">Model Architecture</div>
          <div className="text-lg font-bold text-purple-600 dark:text-purple-400 mt-2">Temporal Fusion Transformer + XGBoost</div>
          <div className="text-xs text-slate-500 dark:text-navy-400 mt-1">Ensemble Classifier</div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <div className="text-xs text-slate-400 dark:text-navy-400 uppercase font-semibold">Validation Accuracy</div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">94.2%</div>
          <div className="text-xs text-slate-500 dark:text-navy-400 mt-1">MAPE: 4.8%</div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <div className="text-xs text-slate-400 dark:text-navy-400 uppercase font-semibold">Inference Latency</div>
          <div className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-400 mt-2">12ms</div>
          <div className="text-xs text-slate-500 dark:text-navy-400 mt-1">Real-time API response</div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <div className="text-xs text-slate-400 dark:text-navy-400 uppercase font-semibold">Data Drift Status</div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">NORMAL</div>
          <div className="text-xs text-slate-500 dark:text-navy-400 mt-1">PSI &lt; 0.05</div>
        </div>
      </div>

      {/* Deep Model Info */}
      <div className="glass-strong rounded-2xl p-6 border border-slate-200/60 dark:border-white/5 space-y-4">
        <h3 className="text-base font-bold text-slate-800 dark:text-navy-100">
          Model Feature Inputs & Pipeline Weights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-800/40 border border-slate-200/40 dark:border-white/5">
            <span className="font-bold text-slate-800 dark:text-navy-100 block mb-1">Temporal Signals (Weight: 35%)</span>
            Hour of day, day of week, seasonal flu cycles, public holidays, regional festivals.
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-800/40 border border-slate-200/40 dark:border-white/5">
            <span className="font-bold text-slate-800 dark:text-navy-100 block mb-1">Environmental & Traffic (Weight: 25%)</span>
            Weather alerts, rainfall intensity, ambient temperature, highway congestion indices.
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-800/40 border border-slate-200/40 dark:border-white/5">
            <span className="font-bold text-slate-800 dark:text-navy-100 block mb-1">Real-time Ward Discharges (Weight: 25%)</span>
            Recent 1-hour to 6-hour admission vs discharge velocity.
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-800/40 border border-slate-200/40 dark:border-white/5">
            <span className="font-bold text-slate-800 dark:text-navy-100 block mb-1">Ambulance Telemetry (Weight: 15%)</span>
            En-route emergency calls, GPS triage signals, trauma dispatch codes.
          </div>
        </div>
      </div>
    </div>
  );
}
