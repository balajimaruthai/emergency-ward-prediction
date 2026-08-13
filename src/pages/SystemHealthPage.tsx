import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Cpu, HardDrive, Wifi, Server, CheckCircle2 } from 'lucide-react';

export function SystemHealthPage() {
  const nodes = [
    { name: 'Realtime WebSocket Feed', latency: '14ms', status: 'HEALTHY', color: '#16A34A' },
    { name: 'AI Demand Prediction Engine', latency: '42ms', status: 'HEALTHY', color: '#16A34A' },
    { name: 'Hospital Database Cluster', latency: '8ms', status: 'HEALTHY', color: '#16A34A' },
    { name: 'Ambulance GPS Routing Gateway', latency: '21ms', status: 'HEALTHY', color: '#16A34A' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Activity className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-navy-100 tracking-tight">
              EWI System Health & Architecture Monitor
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-navy-400">
            Node status, API latencies, server load metrics, and infrastructure health.
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <div className="text-xs text-slate-400 dark:text-navy-400 uppercase font-semibold">Uptime</div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">99.99%</div>
          <div className="text-xs text-slate-500 dark:text-navy-400 mt-1">Last 30 days</div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <div className="text-xs text-slate-400 dark:text-navy-400 uppercase font-semibold">Avg Latency</div>
          <div className="text-2xl font-extrabold text-slate-800 dark:text-navy-100 mt-2">18ms</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Ultra-low response</div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <div className="text-xs text-slate-400 dark:text-navy-400 uppercase font-semibold">Memory Usage</div>
          <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-2">34.2%</div>
          <div className="text-xs text-slate-500 dark:text-navy-400 mt-1">1.2 GB / 3.5 GB</div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <div className="text-xs text-slate-400 dark:text-navy-400 uppercase font-semibold">Realtime Clients</div>
          <div className="text-2xl font-extrabold text-accent-500 mt-2">1,248</div>
          <div className="text-xs text-slate-500 dark:text-navy-400 mt-1">Active WebSocket sessions</div>
        </div>
      </div>

      {/* Node Status Table */}
      <div className="glass-strong rounded-2xl p-6 border border-slate-200/60 dark:border-white/5 space-y-4">
        <h3 className="text-base font-bold text-slate-800 dark:text-navy-100">
          Infrastructure Service Nodes
        </h3>
        <div className="space-y-3">
          {nodes.map((node) => (
            <div key={node.name} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-navy-800/40 text-xs">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-slate-800 dark:text-navy-100">{node.name}</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-slate-400 dark:text-navy-400">Latency: <strong className="text-slate-700 dark:text-navy-200">{node.latency}</strong></span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                  {node.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
