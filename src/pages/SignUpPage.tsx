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
  Stethoscope,
  UserCircle,
  Phone,
  MapPin,
  BedSingle,
  CheckCircle2,
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface HospitalDetails {
  hospitalName: string;
  department: string;
  role: string;
  fullName: string;
  phone: string;
  city: string;
  totalBeds: string;
}

interface SignUpPageProps {
  onBack: () => void;
  onSignIn?: () => void;
  onSignedUp: (email: string, password: string, details: HospitalDetails) => Promise<void>;
}

const DEPARTMENTS = [
  'Emergency Medicine',
  'Intensive Care (ICU)',
  'Cardiology',
  'Pediatrics',
  'General Surgery',
  'Internal Medicine',
  'Orthopedics',
  'Neurology',
  'Obstetrics & Gynecology',
  'Hospital Administration',
];

const ROLES = [
  'Hospital Administrator',
  'Department Head',
  'Charge Nurse',
  'Physician',
  'Operations Manager',
  'IT / Systems Admin',
];

export function SignUpPage({ onBack, onSignIn, onSignedUp }: SignUpPageProps) {
  const { theme, toggleTheme } = useTheme();
  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Step 1: Account
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 2: Hospital details
  const [hospitalName, setHospitalName] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [totalBeds, setTotalBeds] = useState('');

  const validateStep1 = () => {
    if (!email.trim()) return 'Please enter your email.';
    if (!email.includes('@')) return 'Please enter a valid email address.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const validateStep2 = () => {
    if (!hospitalName.trim()) return 'Please enter your hospital name.';
    if (!department) return 'Please select your department.';
    if (!role) return 'Please select your role.';
    if (!fullName.trim()) return 'Please enter your full name.';
    return null;
  };

  const handleNext = () => {
    const err = validateStep1();
    if (err) {
      setLocalError(err);
      return;
    }
    setLocalError(null);
    setStep(2);
  };

  const handleSubmit = async () => {
    const err = validateStep2();
    if (err) {
      setLocalError(err);
      return;
    }
    setLocalError(null);
    setLoading(true);

    const details: HospitalDetails = { hospitalName, department, role, fullName, phone, city, totalBeds };
    localStorage.setItem('ewi-hospital-details', JSON.stringify(details));

    await onSignedUp(email.trim(), password, details);
    setLoading(false);
  };

  const displayError = localError;

  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-navy-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center shadow-lg shadow-accent-500/20 mb-4">
            <Activity className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-navy-100 tracking-tight">
            Emergency Ward Intelligence
          </h1>
          <p className="text-sm text-slate-400 dark:text-navy-400 mt-1">
            Create your account
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step >= 1
                  ? 'bg-accent-600 text-white'
                  : 'bg-slate-200 dark:bg-navy-700 text-slate-400'
              }`}
            >
              1
            </div>
            <span className="text-xs font-medium text-slate-500 dark:text-navy-300">
              Account
            </span>
          </div>
          <div className="w-8 h-px bg-slate-200 dark:bg-navy-700" />
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step >= 2
                  ? 'bg-accent-600 text-white'
                  : 'bg-slate-200 dark:bg-navy-700 text-slate-400'
              }`}
            >
              2
            </div>
            <span className="text-xs font-medium text-slate-500 dark:text-navy-300">
              Hospital Details
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="glass-strong rounded-2xl shadow-float p-8">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-lg font-semibold text-slate-800 dark:text-navy-100 mb-1">
                  Create your account
                </h2>
                <p className="text-sm text-slate-400 dark:text-navy-400 mb-6">
                  Start with your email and password.
                </p>

                <div className="space-y-4">
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-navy-400 uppercase tracking-wider mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-navy-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@hospital.org"
                        autoComplete="email"
                        className="w-full pl-10 pr-4 h-11 rounded-lg bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/10 text-sm text-slate-800 dark:text-navy-100 placeholder-slate-400 dark:placeholder-navy-500 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/15 transition-all"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-navy-400 uppercase tracking-wider mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-navy-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        autoComplete="new-password"
                        className="w-full pl-10 pr-10 h-11 rounded-lg bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/10 text-sm text-slate-800 dark:text-navy-100 placeholder-slate-400 dark:placeholder-navy-500 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/15 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-navy-200 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm password */}
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-navy-400 uppercase tracking-wider mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-navy-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter your password"
                        autoComplete="new-password"
                        className="w-full pl-10 pr-4 h-11 rounded-lg bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/10 text-sm text-slate-800 dark:text-navy-100 placeholder-slate-400 dark:placeholder-navy-500 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/15 transition-all"
                      />
                    </div>
                  </div>

                  {/* Error */}
                  <AnimatePresence>
                    {displayError && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex items-start gap-2 px-3 py-2.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg">
                          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                          <span className="text-sm text-red-600 dark:text-red-400">{displayError}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Next button */}
                  <button
                    onClick={handleNext}
                    className="w-full h-11 rounded-lg bg-accent-600 hover:bg-accent-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Back + sign in */}
                <div className="mt-5 flex items-center justify-between text-sm">
                  <button
                    onClick={onBack}
                    className="flex items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-navy-200 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back
                  </button>
                  <span className="text-slate-400 dark:text-navy-400">
                    Already registered?{' '}
                    <button
                      onClick={onSignIn ?? onBack}
                      className="text-accent-600 dark:text-accent-400 font-bold hover:underline"
                    >
                      Sign in here
                    </button>
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-lg font-semibold text-slate-800 dark:text-navy-100 mb-1">
                  Hospital Details
                </h2>
                <p className="text-sm text-slate-400 dark:text-navy-400 mb-6">
                  Tell us about your facility to customize your dashboard.
                </p>

                <div className="space-y-4">
                  {/* Hospital name */}
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-navy-400 uppercase tracking-wider mb-2">
                      Hospital Name
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-navy-400" />
                      <input
                        type="text"
                        value={hospitalName}
                        onChange={(e) => setHospitalName(e.target.value)}
                        placeholder="e.g. General Medical Center"
                        className="w-full pl-10 pr-4 h-11 rounded-lg bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/10 text-sm text-slate-800 dark:text-navy-100 placeholder-slate-400 dark:placeholder-navy-500 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/15 transition-all"
                      />
                    </div>
                  </div>

                  {/* Full name */}
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-navy-400 uppercase tracking-wider mb-2">
                      Your Full Name
                    </label>
                    <div className="relative">
                      <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-navy-400" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Dr. Jane Smith"
                        className="w-full pl-10 pr-4 h-11 rounded-lg bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/10 text-sm text-slate-800 dark:text-navy-100 placeholder-slate-400 dark:placeholder-navy-500 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/15 transition-all"
                      />
                    </div>
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-navy-400 uppercase tracking-wider mb-2">
                      Department
                    </label>
                    <div className="relative">
                      <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-navy-400" />
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full pl-10 pr-4 h-11 rounded-lg bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/10 text-sm text-slate-800 dark:text-navy-100 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/15 transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Select department...</option>
                        {DEPARTMENTS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-navy-400 uppercase tracking-wider mb-2">
                      Your Role
                    </label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-navy-400" />
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full pl-10 pr-4 h-11 rounded-lg bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/10 text-sm text-slate-800 dark:text-navy-100 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/15 transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Select role...</option>
                        {ROLES.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* City + Phone */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 dark:text-navy-400 uppercase tracking-wider mb-2">
                        City
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-navy-400" />
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="City"
                          className="w-full pl-10 pr-3 h-11 rounded-lg bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/10 text-sm text-slate-800 dark:text-navy-100 placeholder-slate-400 dark:placeholder-navy-500 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/15 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 dark:text-navy-400 uppercase tracking-wider mb-2">
                        Phone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-navy-400" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Optional"
                          className="w-full pl-10 pr-3 h-11 rounded-lg bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/10 text-sm text-slate-800 dark:text-navy-100 placeholder-slate-400 dark:placeholder-navy-500 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/15 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Total beds */}
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-navy-400 uppercase tracking-wider mb-2">
                      Total Hospital Beds
                    </label>
                    <div className="relative">
                      <BedSingle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-navy-400" />
                      <input
                        type="number"
                        value={totalBeds}
                        onChange={(e) => setTotalBeds(e.target.value)}
                        placeholder="e.g. 200"
                        min="0"
                        className="w-full pl-10 pr-4 h-11 rounded-lg bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/10 text-sm text-slate-800 dark:text-navy-100 placeholder-slate-400 dark:placeholder-navy-500 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/15 transition-all"
                      />
                    </div>
                  </div>

                  {/* Error */}
                  <AnimatePresence>
                    {displayError && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex items-start gap-2 px-3 py-2.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg">
                          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                          <span className="text-sm text-red-600 dark:text-red-400">{displayError}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full h-11 rounded-lg bg-accent-600 hover:bg-accent-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Create Account
                      </>
                    )}
                  </button>
                </div>

                {/* Back */}
                <div className="mt-5">
                  <button
                    onClick={() => {
                      setLocalError(null);
                      setStep(1);
                    }}
                    className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-navy-200 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to account details
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-navy-500">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Secure authentication powered by Supabase</span>
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="absolute top-0 right-0 w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-navy-200 hover:bg-white/60 dark:hover:bg-navy-700/60 transition-colors"
        >
          {theme === 'light' ? <Moon /> : <Sun />}
        </button>
      </div>
    </div>
  );
}
