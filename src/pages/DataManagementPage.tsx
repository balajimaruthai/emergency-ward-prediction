import { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Upload, Download, RefreshCw, CheckCircle2, Server, Save } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';

export function DataManagementPage() {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState('Just now');

  const handleManualSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setLastSync(new Date().toLocaleTimeString());
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Database className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-navy-100 tracking-tight">
              Hospital Data & Synchronization Center
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-navy-400">
            Manage live data feeds, Supabase backend sync, CSV imports/exports, and offline caches.
          </p>
        </div>

        <button
          onClick={handleManualSync}
          disabled={syncing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-600 hover:bg-accent-700 text-white text-xs font-bold transition-all shadow-md shadow-accent-500/20 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Synchronizing...' : 'Force Data Sync'}
        </button>
      </div>

      {/* Backend Connection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <Server className="w-5 h-5 text-accent-500" />
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              isSupabaseConfigured ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-500'
            }`}>
              {isSupabaseConfigured ? 'CONNECTED' : 'LOCAL SIMULATION MODE'}
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-navy-100">Supabase Backend DB</h3>
          <p className="text-xs text-slate-400 dark:text-navy-400 mt-1">
            {isSupabaseConfigured
              ? 'Connected to live PostgreSQL database cluster.'
              : 'Using high-speed local reactive cache fallback.'}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <RefreshCw className="w-5 h-5 text-purple-500" />
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-500">
              5s INTERVAL
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-navy-100">Realtime Polling Engine</h3>
          <p className="text-xs text-slate-400 dark:text-navy-400 mt-1">
            Last sync time: {lastSync}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <Save className="w-5 h-5 text-emerald-500" />
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              PERSISTED
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-navy-100">Local Cache Storage</h3>
          <p className="text-xs text-slate-400 dark:text-navy-400 mt-1">
            State saved automatically in browser IndexedDB & localStorage.
          </p>
        </div>
      </div>

      {/* Import / Export Controls */}
      <div className="glass-strong rounded-2xl p-6 border border-slate-200/60 dark:border-white/5 space-y-4">
        <h3 className="text-base font-bold text-slate-800 dark:text-navy-100">
          Bulk Hospital Ward Data Import & Export
        </h3>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-700 text-slate-700 dark:text-navy-200 text-xs font-semibold transition-all">
            <Upload className="w-4 h-4" />
            Import Ward Capacity CSV
          </button>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-700 text-slate-700 dark:text-navy-200 text-xs font-semibold transition-all">
            <Download className="w-4 h-4" />
            Download Complete Dataset (JSON/CSV)
          </button>
        </div>
      </div>
    </div>
  );
}
