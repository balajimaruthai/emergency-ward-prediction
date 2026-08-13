import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Shield, Moon, Sun, MapPin, Save, CheckCircle2 } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { getSelectedCity, setSelectedCity } from '@/hooks/useAuth';
import { CITIES } from '@/lib/hospitalData';

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [city, setCity] = useState(getSelectedCity() ?? 'Chennai');
  const [threshold, setThreshold] = useState('85');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSelectedCity(city);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <div className="w-8 h-8 rounded-xl bg-slate-500/10 flex items-center justify-center text-slate-600 dark:text-slate-300">
          <Settings className="w-4 h-4" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-navy-100 tracking-tight">
            System & Notification Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-navy-400">
            Configure regional alerts, capacity alert thresholds, and UI preferences.
          </p>
        </div>
      </div>

      <div className="glass-strong rounded-2xl p-6 border border-slate-200/60 dark:border-white/5 space-y-6">
        {/* City selection */}
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-navy-400 uppercase tracking-wider mb-2">
            Default City Region
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full max-w-xs h-11 px-4 rounded-xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/10 text-sm text-slate-800 dark:text-navy-100 focus:outline-none focus:border-accent-500"
          >
            {CITIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name} ({c.state})
              </option>
            ))}
          </select>
        </div>

        {/* Alert threshold */}
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-navy-400 uppercase tracking-wider mb-2">
            Critical Surge Alert Threshold (%)
          </label>
          <input
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            className="w-full max-w-xs h-11 px-4 rounded-xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/10 text-sm text-slate-800 dark:text-navy-100 focus:outline-none focus:border-accent-500"
            min="50"
            max="98"
          />
          <p className="text-xs text-slate-400 dark:text-navy-400 mt-1">
            Trigger visual and alert banners when ward occupancy exceeds this percentage.
          </p>
        </div>

        {/* Theme mode */}
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-navy-400 uppercase tracking-wider mb-2">
            Interface Theme
          </label>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-navy-200 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-navy-700 transition-all"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode
          </button>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-white/5 flex items-center gap-4">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-600 hover:bg-accent-700 text-white font-bold text-xs transition-all shadow-md shadow-accent-500/20"
          >
            <Save className="w-4 h-4" />
            Save Preferences
          </button>

          {saved && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              Settings saved!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
