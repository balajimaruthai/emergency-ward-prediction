import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Moon,
  Sun,
  Building2,
  Zap,
  CheckCircle2,
  Ambulance,
  Radio,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

interface AuthPageProps {
  onBack: () => void;
  onSignUp: () => void;
}

export function AuthPage({ onBack, onSignUp }: AuthPageProps) {
  const { signIn, signInAsRole, loading, error } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [authRole, setAuthRole] = useState<'hospital' | 'ambulance'>('hospital');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLocalError(null);

    if (authRole === 'ambulance') {
      const callsign = email.trim() || 'EMS-108-ALPHA';
      const res = await signInAsRole('ambulance', {
        email: `${callsign.toLowerCase()}@ems.health`,
        fullName: 'Officer Suresh Kumar',
        city: 'Chennai',
      });
      if (res?.error) setLocalError(res.error);
      return;
    }

    const emailToUse = email.trim() || 'staff@apollo.hospital.org';
    const passwordToUse = password || 'hospital123';

    const res = await signIn(emailToUse, passwordToUse);
    if (res?.error) {
      setLocalError(res.error);
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoName: string, hospitalName: string) => {
    setEmail(demoEmail);
    setPassword('demo1234');
    localStorage.setItem('ewi-hospital-details', JSON.stringify({
      fullName: demoName,
      hospitalName,
      department: 'Emergency Triage',
      role: 'Chief Administrator',
      city: 'Chennai',
    }));
    await signIn(demoEmail, 'demo1234');
  };

  const handleDemoDriverLogin = async (unit: string, name: string, city: string) => {
    await signInAsRole('ambulance', {
      email: `${unit.toLowerCase()}@ems.health`,
      fullName: name,
      city,
    });
  };

  const displayError = localError ?? error;

  return (
    <div className="min-h-screen text-slate-100 flex items-center justify-center p-6 relative overflow-hidden bg-cover bg-center transition-colors duration-300" style={{ backgroundImage: "url('/hospital_bg.jpg')" }}>
      {/* Dark overlay backdrop for crystal clear legibility */}
      <div className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm pointer-events-none" />

      {/* Glow backgrounds */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center shadow-lg shadow-accent-500/30 mb-4 glow-accent">
            <Activity className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">
            Emergency Ward Intelligence
          </h1>
          <p className="text-xs text-slate-400 dark:text-navy-400 mt-1 uppercase tracking-widest font-semibold">
            Hospital Staff Portal
          </p>
        </div>

        {/* Auth card */}
        <div className="glass-strong rounded-2xl border border-slate-200/60 dark:border-white/10 shadow-2xl p-8">
          {/* Role selector tab */}
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 mb-6">
            <button
              type="button"
              onClick={() => setAuthRole('hospital')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                authRole === 'hospital'
                  ? 'bg-accent-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Hospital Staff
            </button>

            <button
              type="button"
              onClick={() => setAuthRole('ambulance')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                authRole === 'ambulance'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Ambulance className="w-3.5 h-3.5 text-yellow-400" />
              Ambulance Driver
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
              {authRole === 'hospital' ? 'Hospital Staff Login' : 'Ambulance Driver Login'}
            </h2>
            <p className="text-xs text-navy-300 mt-1">
              {authRole === 'hospital'
                ? 'Enter your credentials to manage hospital ward capacity & AI predictions.'
                : 'Authenticate ambulance cab HUD for live traffic map routing & pre-arrival alerts.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email / Callsign */}
            <div>
              <label className="block text-xs font-bold text-navy-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                {authRole === 'hospital' ? (
                  <>
                    <Mail className="w-3.5 h-3.5 text-accent-400" /> Hospital Email
                  </>
                ) : (
                  <>
                    <Radio className="w-3.5 h-3.5 text-red-400" /> Ambulance Unit Callsign / Vehicle No.
                  </>
                )}
              </label>
              <div className="relative">
                {authRole === 'hospital' ? (
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
                ) : (
                  <Ambulance className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
                )}
                <input
                  type={authRole === 'hospital' ? 'email' : 'text'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={authRole === 'hospital' ? 'staff@apollo.hospital.org' : 'EMS-108-ALPHA'}
                  autoComplete={authRole === 'hospital' ? 'email' : 'username'}
                  className={`w-full pl-10 pr-4 h-11 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-navy-500 focus:outline-none transition-all ${
                    authRole === 'hospital'
                      ? 'focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20'
                      : 'focus:border-red-500 focus:ring-2 focus:ring-red-500/20 font-mono'
                  }`}
                />
              </div>
            </div>

            {/* Password / PIN */}
            <div>
              <label className="block text-xs font-bold text-navy-300 uppercase tracking-wider mb-2">
                {authRole === 'hospital' ? 'Password' : 'Paramedic Security PIN'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`w-full pl-10 pr-10 h-11 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-navy-500 focus:outline-none transition-all ${
                    authRole === 'hospital'
                      ? 'focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20'
                      : 'focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error message */}
            <AnimatePresence>
              {displayError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-start gap-2 px-3 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="text-xs font-medium">{displayError}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full h-11 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-60 ${
                authRole === 'hospital'
                  ? 'bg-accent-600 hover:bg-accent-500 shadow-accent-600/30'
                  : 'bg-red-600 hover:bg-red-500 shadow-red-600/30 animate-pulse'
              }`}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  {authRole === 'hospital' ? 'Sign In to Hospital Dashboard' : 'Sign In to Ambulance Driver Cab'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login (Role Dependent) */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <span className="block text-[11px] font-bold text-navy-400 uppercase tracking-wider mb-3 text-center">
              {authRole === 'hospital' ? 'Instant Hospital Staff Demo Login' : 'Instant Ambulance Driver Demo Login'}
            </span>
            <div className="space-y-2">
              {authRole === 'hospital' ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('dr.apollo@hospital.org', 'Dr. Rajesh Kumar', 'Apollo Hospitals')}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-left transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Building2 className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div className="font-bold text-white group-hover:text-accent-400 transition-colors">Apollo Hospitals Staff</div>
                        <div className="text-[10px] text-navy-400">Dr. Rajesh Kumar (Emergency Chief)</div>
                      </div>
                    </div>
                    <Zap className="w-3.5 h-3.5 text-accent-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoLogin('ggh.admin@hospital.org', 'Dr. Anita Sharma', 'Government General Hospital')}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-left transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Building2 className="w-4 h-4 text-purple-400" />
                      <div>
                        <div className="font-bold text-white group-hover:text-accent-400 transition-colors">Govt General Hospital Staff</div>
                        <div className="text-[10px] text-navy-400">Dr. Anita Sharma (ICU Operations)</div>
                      </div>
                    </div>
                    <Zap className="w-3.5 h-3.5 text-accent-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleDemoDriverLogin('EMS-108-ALPHA', 'Officer Suresh Kumar', 'Chennai')}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-left transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Ambulance className="w-4 h-4 text-red-400" />
                      <div>
                        <div className="font-bold text-white group-hover:text-red-400 transition-colors">Unit 108-ALPHA (Chennai)</div>
                        <div className="text-[10px] text-navy-400">Officer Suresh Kumar (EMS Lead)</div>
                      </div>
                    </div>
                    <Zap className="w-3.5 h-3.5 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoDriverLogin('EMS-102-BRAVO', 'Officer Priya Sharma', 'Bengaluru')}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-left transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Ambulance className="w-4 h-4 text-amber-400" />
                      <div>
                        <div className="font-bold text-white group-hover:text-amber-400 transition-colors">Unit 102-BRAVO (Bengaluru)</div>
                        <div className="text-[10px] text-navy-400">Officer Priya Sharma (EMS Lead)</div>
                      </div>
                    </div>
                    <Zap className="w-3.5 h-3.5 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Footer links */}
          <div className="mt-6 flex items-center justify-between text-xs pt-4 border-t border-white/5">
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-navy-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
            <span className="text-navy-400">
              New facility?{' '}
              <button
                onClick={onSignUp}
                className="text-accent-400 font-bold hover:underline"
              >
                Register hospital
              </button>
            </span>
          </div>
        </div>

        {/* Security badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-navy-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Encrypted Medical Network Access</span>
        </div>

        <button
          onClick={toggleTheme}
          className="absolute top-0 right-0 w-9 h-9 rounded-xl flex items-center justify-center text-navy-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
