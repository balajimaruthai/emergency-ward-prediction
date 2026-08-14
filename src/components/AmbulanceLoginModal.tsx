import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ambulance,
  ShieldCheck,
  Zap,
  MapPin,
  X,
  User,
  Lock,
  ArrowRight,
  Loader2,
  AlertCircle,
  Radio,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { CITIES } from '@/lib/hospitalData';

interface AmbulanceLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AmbulanceLoginModal({ isOpen, onClose, onSuccess }: AmbulanceLoginModalProps) {
  const { signInAsRole, loading, error } = useAuth();
  const [callsign, setCallsign] = useState('EMS-108-ALPHA');
  const [driverName, setDriverName] = useState('Officer Suresh Kumar');
  const [badgePin, setBadgePin] = useState('10899');
  const [selectedCity, setSelectedCity] = useState('Chennai');
  const [localError, setLocalError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLocalError(null);

    const callsignToUse = callsign.trim() || 'EMS-108-ALPHA';
    const driverNameToUse = driverName.trim() || 'Officer Suresh Kumar';

    const res = await signInAsRole('ambulance', {
      email: `${callsignToUse.toLowerCase()}@ems.health`,
      fullName: driverNameToUse,
      city: selectedCity,
    });

    if (res?.error) {
      setLocalError(res.error);
    } else {
      if (onSuccess) onSuccess();
      onClose();
    }
  };

  const handleQuickDemoLogin = async (unit: string, name: string, city: string) => {
    setCallsign(unit);
    setDriverName(name);
    setSelectedCity(city);
    const res = await signInAsRole('ambulance', {
      email: `${unit.toLowerCase()}@ems.health`,
      fullName: name,
      city,
    });
    if (!res?.error) {
      if (onSuccess) onSuccess();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          style={{ backgroundImage: "linear-gradient(rgba(10, 15, 30, 0.92), rgba(10, 15, 30, 0.94)), url('/hospital_bg.jpg')" }}
          className="relative z-10 w-full max-w-lg glass-strong rounded-3xl border border-red-500/40 bg-cover bg-center p-6 md:p-8 shadow-2xl overflow-hidden glow-red"
        >
          {/* Top Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-lg shadow-red-600/40 shrink-0 glow-red animate-pulse">
              <Ambulance className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-widest text-red-400 uppercase bg-red-500/20 px-2 py-0.5 rounded border border-red-500/30">
                  EMS EMERGENCY AUTH
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  DISPATCH ACTIVE
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
                Ambulance Driver Login
              </h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Unit Callsign */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-red-400" />
                Ambulance Unit Callsign / Vehicle No.
              </label>
              <input
                type="text"
                value={callsign}
                onChange={(e) => setCallsign(e.target.value)}
                placeholder="e.g. EMS-108-ALPHA"
                required
                className="w-full px-4 h-12 rounded-xl bg-white/5 border border-white/15 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition-all"
              />
            </div>

            {/* Driver Name & Badge PIN Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-red-400" />
                  Driver / Officer Name
                </label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="e.g. Officer Suresh"
                  required
                  className="w-full px-4 h-12 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-red-400" />
                  Paramedic Badge PIN
                </label>
                <input
                  type="password"
                  value={badgePin}
                  onChange={(e) => setBadgePin(e.target.value)}
                  placeholder="•••••"
                  required
                  className="w-full px-4 h-12 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition-all"
                />
              </div>
            </div>

            {/* Sector / City */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                Emergency Response Sector (City)
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-4 h-12 rounded-xl bg-navy-900 border border-white/15 text-sm text-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition-all"
              >
                {CITIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.state})
                  </option>
                ))}
              </select>
            </div>

            {/* Error Message */}
            {(localError || error) && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{localError || error}</span>
              </div>
            )}

            {/* Submit Action */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-13 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-amber-600 hover:brightness-110 text-white font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl shadow-red-600/40 active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Zap className="w-5 h-5 text-yellow-300" />
                  AUTHENTICATE EMS DRIVER HUD
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo EMS Logins */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <span className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 text-center">
              INSTANT DEMO EMS UNITS (1-TAP ACCESS)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('EMS-108-ALPHA', 'Officer Suresh Kumar', 'Chennai')}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all group flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-xs shrink-0">
                  108A
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white group-hover:text-red-400 truncate">
                    Unit 108-ALPHA
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">Chennai Sector • Officer Suresh</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('EMS-102-BRAVO', 'Officer Priya Sharma', 'Bengaluru')}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all group flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                  102B
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white group-hover:text-amber-400 truncate">
                    Unit 102-BRAVO
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">Bengaluru Sector • Officer Priya</div>
                </div>
              </button>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>National Emergency Medical Command Network Encryption</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
