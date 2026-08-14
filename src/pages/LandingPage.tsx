import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Radio,
  Brain,
  TrendingUp,
  BarChart3,
  ShieldCheck,
  Clock,
  ArrowRight,
  CheckCircle2,
  Stethoscope,
  Eye,
  Moon,
  Sun,
  MapPin,
  Ambulance,
  Building2,
  Navigation,
  Search,
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { CITIES, searchCities } from '@/lib/hospitalData';
import type { UserRole } from '@/lib/types';
import { AmbulanceLoginModal } from '@/components/AmbulanceLoginModal';

interface LandingPageProps {
  onSelectRole: (role: UserRole, city?: string) => void;
  onSignIn?: () => void;
  onOpenAmbulancePortal?: () => void;
}

const ROLE_CARDS = [
  {
    role: 'public' as UserRole,
    icon: Eye,
    title: 'Public',
    description: 'Find available emergency beds near you. Search by city, see real-time hospital capacity, and locate the nearest open facility.',
    color: '#0EA5E9',
    features: ['Search hospitals by city', 'Real-time bed availability', 'Distance & directions', 'No account needed'],
  },
  {
    role: 'hospital' as UserRole,
    icon: Building2,
    title: 'Hospital Staff',
    description: 'Manage your hospital\'s ward capacity, update bed counts, monitor patient flow, and view AI demand predictions for your facility.',
    color: '#16A34A',
    features: ['Ward-by-ward bed management', 'Live capacity monitoring', 'AI demand predictions', 'Patient flow tracking'],
  },
  {
    role: 'ambulance' as UserRole,
    icon: Ambulance,
    title: 'Ambulance Driver',
    description: 'Find the nearest hospital with available emergency beds. Get turn-by-turn routing, ETA, and live capacity updates en route.',
    color: '#DC2626',
    features: ['Nearest available hospital', 'Live ETA & routing', 'Bed availability alerts', 'Trauma center locator'],
  },
];

const FEATURES = [
  { icon: Radio, title: 'Live Monitoring', description: 'Real-time ward-by-ward bed tracking across all hospitals in your city.', color: '#0EA5E9' },
  { icon: Brain, title: 'AI Predictions', description: 'Machine learning models predict patient inflow and ward pressure hours ahead.', color: '#8B5CF6' },
  { icon: TrendingUp, title: 'Demand Forecasting', description: '24-hour and 7-day forecasts for emergency demand across all of India.', color: '#16A34A' },
  { icon: BarChart3, title: 'Analytics', description: 'Historical analysis and occupancy trends across every monitored hospital.', color: '#D97706' },
  { icon: Navigation, title: 'Smart Routing', description: 'Ambulance drivers get instant routing to the nearest available facility.', color: '#DC2626' },
  { icon: ShieldCheck, title: 'Explainability', description: 'Full model transparency with feature importance and prediction reasoning.', color: '#7C3AED' },
];

const STATS = [
  { label: 'Hospitals Monitored', value: '70+' },
  { label: 'Cities Covered', value: '24' },
  { label: 'Total Beds Tracked', value: '50K+' },
  { label: 'Prediction Accuracy', value: '94%' },
];

export function LandingPage({ onSelectRole, onSignIn, onOpenAmbulancePortal }: LandingPageProps) {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [cityQuery, setCityQuery] = useState('');
  const [cityResults, setCityResults] = useState<typeof CITIES>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [showAmbulanceModal, setShowAmbulanceModal] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setCityResults(searchCities(cityQuery).slice(0, 8));
  }, [cityQuery]);

  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);
    setCityQuery(cityName);
    setShowResults(false);
  };

  return (
    <div
      className="min-h-screen text-slate-100 relative bg-cover bg-center bg-fixed transition-colors duration-300"
      style={{ backgroundImage: "linear-gradient(rgba(10, 18, 38, 0.88), rgba(10, 18, 38, 0.92)), url('/hospital_bg.jpg')" }}
    >
      {/* Nav */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-strong shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center shadow-md shadow-accent-500/20">
              <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-bold tracking-tight">Emergency Ward Intelligence</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAmbulancePortal ?? (() => setShowAmbulanceModal(true))}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:brightness-110 text-white text-xs font-bold transition-all shadow-md shadow-red-600/30 animate-pulse"
            >
              <Ambulance className="w-3.5 h-3.5" />
              Ambulance Driver Portal
            </button>
            {onSignIn && (
              <button
                onClick={onSignIn}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-accent-600 hover:bg-accent-700 text-white text-xs font-bold transition-all shadow-md shadow-accent-500/20"
              >
                <Building2 className="w-3.5 h-3.5" />
                Hospital Login
              </button>
            )}
            <button onClick={toggleTheme} className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-navy-200 hover:bg-slate-100 dark:hover:bg-navy-700/60 transition-colors">
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-50 dark:bg-accent-500/10 border border-accent-200 dark:border-accent-500/20 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-accent-700 dark:text-accent-300">
              India's Real-Time Emergency Bed Intelligence Network
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.1]"
          >
            Every emergency bed.
            <br />
            <span className="bg-gradient-to-r from-accent-500 to-accent-700 bg-clip-text text-transparent">
              Every city. In real time.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-500 dark:text-navy-300 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Search any city in India to see live emergency ward availability.
            For citizens, hospital staff, and ambulance drivers — one platform,
            complete visibility.
          </motion.p>

          {/* City search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-lg mx-auto relative"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={cityQuery}
                onChange={(e) => {
                  setCityQuery(e.target.value);
                  setShowResults(true);
                  setSelectedCity(null);
                }}
                onFocus={() => setShowResults(true)}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
                placeholder="Search your city — Chennai, Coimbatore, Mumbai..."
                className="w-full pl-12 pr-4 h-14 rounded-2xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/10 text-sm text-slate-800 dark:text-navy-100 placeholder-slate-400 dark:placeholder-navy-500 focus:outline-none focus:border-accent-500 focus:ring-4 focus:ring-accent-500/15 shadow-md transition-all"
              />
            </div>

            {showResults && cityResults.length > 0 && !selectedCity && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-navy-800 rounded-xl shadow-float border border-slate-200 dark:border-white/10 overflow-hidden z-20"
              >
                {cityResults.map((city) => (
                  <button
                    key={city.name}
                    onClick={() => handleCitySelect(city.name)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-navy-700/50 transition-colors text-left"
                  >
                    <MapPin className="w-4 h-4 text-accent-500 shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-slate-700 dark:text-navy-200">{city.name}</div>
                      <div className="text-xs text-slate-400 dark:text-navy-400">{city.state}</div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}

            {selectedCity && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 flex items-center justify-center gap-2 text-sm text-emerald-600 dark:text-emerald-400"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Showing hospitals in <strong>{selectedCity}</strong> and nearby areas</span>
              </motion.div>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-slate-800 dark:text-white tabular-nums">{stat.value}</div>
                <div className="text-xs text-slate-400 dark:text-navy-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Role selection */}
      <section className="px-6 lg:px-8 py-16 bg-white dark:bg-navy-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
              Choose how you want to use EWI
            </h2>
            <p className="text-lg text-slate-500 dark:text-navy-300">
              Three tailored experiences. Pick the one that fits you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ROLE_CARDS.map((card, i) => (
              <motion.div
                key={card.role}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group bg-slate-50 dark:bg-navy-700/30 rounded-2xl p-6 border border-slate-200/60 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 hover:shadow-lg transition-all"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${card.color}15` }}
                >
                  <card.icon className="w-6 h-6" style={{ color: card.color }} />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-navy-100 mb-2">{card.title}</h3>
                <p className="text-sm text-slate-500 dark:text-navy-400 leading-relaxed mb-4">
                  {card.description}
                </p>
                <ul className="space-y-1.5 mb-6">
                  {card.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-slate-500 dark:text-navy-300">
                      <CheckCircle2 className="w-3.5 h-3.5" style={{ color: card.color }} />
                      {f}
                    </li>
                  ))}
                </ul>
                {card.role === 'hospital' ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => onSelectRole('hospital', selectedCity ?? undefined)}
                      className="group w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all"
                      style={{
                        backgroundColor: `${card.color}15`,
                        color: card.color,
                      }}
                    >
                      Register New Hospital
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    {onSignIn && (
                      <button
                        onClick={onSignIn}
                        className="w-full text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline py-1"
                      >
                        Already registered? Sign In
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => onSelectRole(card.role, selectedCity ?? undefined)}
                    className="group w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all"
                    style={{
                      backgroundColor: `${card.color}10`,
                      color: card.color,
                    }}
                  >
                    Continue as {card.title}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>

          {!selectedCity && (
            <p className="text-center text-sm text-slate-400 dark:text-navy-400 mt-6">
              <MapPin className="w-4 h-4 inline mr-1" />
              Search and select your city above for location-specific results
            </p>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
              Complete emergency intelligence platform
            </h2>
            <p className="text-lg text-slate-500 dark:text-navy-300 max-w-2xl mx-auto">
              From real-time bed monitoring to AI-driven demand forecasting and
              ambulance routing — EWI covers every aspect of emergency care logistics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group bg-white dark:bg-navy-800 rounded-2xl p-6 border border-slate-200/60 dark:border-white/5 hover:shadow-md transition-all"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <feature.icon className="w-5 h-5" style={{ color: feature.color }} />
                </div>
                <h3 className="text-base font-semibold text-slate-800 dark:text-navy-100 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 dark:text-navy-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto bg-gradient-to-br from-accent-600 to-accent-800 rounded-3xl p-10 md:p-14 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
          <div className="relative z-10">
            <Stethoscope className="w-10 h-10 text-white/80 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
              Ready to find emergency care near you?
            </h2>
            <p className="text-accent-100 text-lg mb-8 max-w-xl mx-auto">
              Search your city, choose your role, and get instant access to
              live hospital bed availability across India.
            </p>
            <button
              onClick={() => onSelectRole('public', selectedCity ?? undefined)}
              className="group inline-flex items-center gap-2 bg-white text-accent-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-accent-50 transition-all shadow-lg"
            >
              Get Started Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-8 py-10 border-t border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold text-slate-600 dark:text-navy-300">Emergency Ward Intelligence</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-slate-400 dark:text-navy-400">
            <span>Covering 24+ cities across India</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Real-time monitoring
            </span>
          </div>
        </div>
      </footer>

      <AmbulanceLoginModal
        isOpen={showAmbulanceModal}
        onClose={() => setShowAmbulanceModal(false)}
      />
    </div>
  );
}
