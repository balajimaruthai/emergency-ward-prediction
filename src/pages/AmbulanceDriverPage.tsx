import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ambulance,
  Navigation,
  Building2,
  BedSingle,
  Clock,
  Activity,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Radio,
  Zap,
  PhoneCall,
  Search,
  SlidersHorizontal,
  BellRing,
  HeartPulse,
  ShieldAlert,
  Baby,
  Stethoscope,
  X,
  Send,
  User,
  ArrowLeft,
  Moon,
  Sun,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useAuth, getSelectedCity, setSelectedCity } from '@/hooks/useAuth';
import { getHospitalsForCity, CITIES } from '@/lib/hospitalData';
import type { HospitalInfo } from '@/lib/types';
import { AmbulanceMapRoute } from '@/components/AmbulanceMapRoute';
import { useAmbulanceDispatch } from '@/hooks/useAmbulanceDispatch';
import { AmbulanceLoginModal } from '@/components/AmbulanceLoginModal';
import { CitySelector } from '@/components/CitySelector';

import { downloadCSV } from '@/lib/csvExport';

export interface RankedHospital extends HospitalInfo {
  erAvail: number;
  totalAvail: number;
  calculatedEta: number;
}

interface AmbulanceDriverPageProps {
  onBackToMain: () => void;
}

export function AmbulanceDriverPage({ onBackToMain }: AmbulanceDriverPageProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, signInAsRole, signOut } = useAuth();
  const { sendDispatch, dispatches } = useAmbulanceDispatch();

  const [currentCity, setCurrentCity] = useState<string>(getSelectedCity() ?? 'Chennai');
  const [selectedHospital, setSelectedHospital] = useState<RankedHospital | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'finder' | 'dispatch'>('map');
  const [filterCap, setFilterCap] = useState<'all' | 'trauma' | 'cardiac' | 'icu' | 'pediatric'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  const handleExportDispatchCSV = () => {
    const rows = (dispatches.length > 0 ? dispatches : [
      {
        id: 'dispatch-demo',
        ambulanceUnit: user?.email ? user.email.split('@')[0].toUpperCase() : 'EMS-108-ALPHA',
        driverName: 'Officer Suresh Kumar',
        targetHospitalName: selectedHospital?.name ?? 'Apollo Hospitals',
        city: currentCity,
        patientCondition: 'Critical Trauma',
        patientAgeGender: '42M - Road Accident',
        vitals: 'BP 105/70 | HR 112',
        etaMinutes: selectedHospital?.calculatedEta ?? 7,
        status: 'EN_ROUTE',
        timestamp: Date.now(),
      }
    ]).map((d) => ({
      'Dispatch ID': d.id,
      'Ambulance Unit': d.ambulanceUnit,
      'Driver Name': d.driverName,
      'Target Hospital': d.targetHospitalName,
      'Sector City': d.city,
      'Patient Triage Condition': d.patientCondition,
      'Demographics': d.patientAgeGender,
      'Vitals': d.vitals,
      'ETA (Minutes)': d.etaMinutes,
      'Status': d.status,
      'Dispatched Time': new Date(d.timestamp).toISOString(),
    }));
    downloadCSV(`ems_ambulance_dispatches_${currentCity.toLowerCase()}.csv`, rows);
  };

  // Patient Triage State
  const [patientCondition, setPatientCondition] = useState<
    'Critical Trauma' | 'Cardiac Emergency' | 'Severe Respiratory' | 'Stroke Alert' | 'Obstetric Emergency' | 'General Triage'
  >('Critical Trauma');
  const [patientAgeGender, setPatientAgeGender] = useState<string>('42M - Severe Road Accident');
  const [vitalsSummary, setVitalsSummary] = useState<string>('BP 105/70 | HR 112 | SpO2 93%');
  const [dispatchConfirmed, setDispatchConfirmed] = useState<boolean>(false);
  const [isDispatching, setIsDispatching] = useState<boolean>(false);

  const hospitals = useMemo(() => {
    return getHospitalsForCity(currentCity, true);
  }, [currentCity]);

  // Ranked Hospitals by Traffic ETA and ER Bed Availability
  const rankedHospitals = useMemo<RankedHospital[]>(() => {
    return hospitals
      .filter((h) => {
        if (!searchQuery.trim()) return true;
        return h.name.toLowerCase().includes(searchQuery.toLowerCase()) || h.city.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .filter((h) => {
        if (filterCap === 'trauma') return h.traumaCenter;
        if (filterCap === 'cardiac') return h.cardiac;
        if (filterCap === 'pediatric') return h.pediatric;
        if (filterCap === 'icu') {
          const icuWard = h.wards.find((w) => w.shortName === 'ICU');
          return icuWard && (icuWard.totalBeds - icuWard.occupiedBeds) > 0;
        }
        return true;
      })
      .map((h) => {
        const erWard = h.wards.find((w) => w.name === 'Emergency');
        const erAvail = erWard ? Math.max(0, erWard.totalBeds - erWard.occupiedBeds) : 0;
        const totalAvail = Math.max(0, h.totalBeds - h.occupiedBeds);
        const eta = h.etaMinutes ?? Math.round((h.distanceKm ?? 3.5) * 2.2);
        return {
          ...h,
          erAvail,
          totalAvail,
          calculatedEta: eta,
        };
      })
      .sort((a, b) => a.calculatedEta - b.calculatedEta);
  }, [hospitals, searchQuery, filterCap]);

  const targetHospital = selectedHospital ?? rankedHospitals[0] ?? null;

  const handleCityChange = (newCity: string) => {
    setCurrentCity(newCity);
    setSelectedCity(newCity);
    setSelectedHospital(null);
  };

  const handleSendPreArrivalAlert = () => {
    if (!targetHospital) return;
    setIsDispatching(true);

    setTimeout(() => {
      sendDispatch({
        ambulanceUnit: user?.email ? user.email.split('@')[0].toUpperCase() : 'EMS-108-ALPHA',
        driverName: 'Officer Suresh Kumar',
        targetHospitalId: targetHospital.id,
        targetHospitalName: targetHospital.name,
        city: targetHospital.city,
        patientCondition,
        patientAgeGender,
        vitals: vitalsSummary,
        etaMinutes: targetHospital.calculatedEta ?? 7,
        distanceKm: targetHospital.distanceKm ?? 4.2,
        trafficCondition: 'Clear Expressway',
      });
      setIsDispatching(false);
      setDispatchConfirmed(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col font-sans selection:bg-red-500 selection:text-white relative overflow-x-hidden">
      {/* Background Neon Grid Glows */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none" />

      {/* TOP EMS NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 glass-strong border-b border-red-500/30 bg-navy-950/90 h-18 px-6 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToMain}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-all border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            Main Network
          </button>

          <div className="w-px h-6 bg-white/10 hidden sm:block" />

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white shadow-lg shadow-red-600/40 glow-red animate-pulse">
              <Ambulance className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-widest text-red-400 uppercase bg-red-500/20 px-2 py-0.5 rounded border border-red-500/30">
                  STANDALONE EMS DRIVER PORTAL
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  LIVE SIREN GPS
                </span>
              </div>
              <h1 className="text-base font-black text-white tracking-tight leading-tight">
                Emergency Dispatch & Live Traffic Radar
              </h1>
            </div>
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-3">
          <CitySelector selectedCity={currentCity} onSelectCity={handleCityChange} />

          {!user ? (
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 hover:brightness-110 transition-all flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Driver Login
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
              <div className="w-6 h-6 rounded-full bg-red-600 text-white text-[11px] font-black flex items-center justify-center">
                108
              </div>
              <span className="text-xs font-bold text-slate-200">
                {user.email ? user.email.split('@')[0].toUpperCase() : 'UNIT-108'}
              </span>
              <button
                onClick={() => signOut()}
                className="text-[10px] text-red-400 hover:underline ml-1 font-bold"
              >
                Sign Out
              </button>
            </div>
          )}

          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors border border-white/10"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* MAIN DRIVER CAB DASHBOARD BODY */}
      <main className="flex-1 px-4 md:px-8 py-6 max-w-[1600px] mx-auto w-full space-y-6">
        {/* DRIVER HUD NAV BAR TABS */}
        <div className="glass-strong rounded-2xl p-2 border border-white/10 bg-navy-950/80 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === 'map'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/40'
                  : 'text-slate-400 hover:text-white bg-white/5'
              }`}
            >
              <Navigation className="w-4 h-4" />
              1. Real-Time Traffic Map & Navigation
            </button>

            <button
              onClick={() => setActiveTab('finder')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === 'finder'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/40'
                  : 'text-slate-400 hover:text-white bg-white/5'
              }`}
            >
              <Building2 className="w-4 h-4" />
              2. Hospital Bed Capacity Finder ({rankedHospitals.length})
            </button>

            <button
              onClick={() => setActiveTab('dispatch')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === 'dispatch'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/40'
                  : 'text-slate-400 hover:text-white bg-white/5'
              }`}
            >
              <BellRing className="w-4 h-4 animate-bounce" />
              3. Dispatch Pre-Arrival Alert
            </button>

            <button
              onClick={handleExportDispatchCSV}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase tracking-wider transition-all border border-white/10 active:scale-95 ml-2"
            >
              Export Log (CSV)
            </button>
          </div>

          {targetHospital && (
            <div className="flex items-center gap-3 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/30 text-xs">
              <span className="text-slate-400 uppercase font-bold">Target Hospital:</span>
              <span className="text-white font-extrabold">{targetHospital.name}</span>
              <span className="text-emerald-400 font-black tabular-nums">
                ({targetHospital.calculatedEta} MIN ETA • {targetHospital.erAvail} ER Beds Free)
              </span>
            </div>
          )}
        </div>

        {/* TAB 1: INTERACTIVE REAL-TIME MAP & TRAFFIC ROUTING */}
        {activeTab === 'map' && targetHospital && (
          <div className="space-y-4">
            <AmbulanceMapRoute
              hospital={targetHospital}
              isDispatching={isDispatching}
              onConfirmRoute={() => {
                setActiveTab('dispatch');
              }}
            />
          </div>
        )}

        {/* TAB 2: NEARBY BED AVAILABLE HOSPITALS */}
        {activeTab === 'finder' && (
          <div className="space-y-4">
            {/* Search & Capability Filter Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 glass-strong p-4 rounded-2xl border border-white/10">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search hospital or specialty..."
                  className="w-full pl-10 pr-4 h-11 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                {(
                  [
                    { id: 'all', label: 'All Hospitals' },
                    { id: 'trauma', label: 'Trauma Unit' },
                    { id: 'cardiac', label: 'Cardiac Care' },
                    { id: 'icu', label: 'ICU Beds' },
                    { id: 'pediatric', label: 'Pediatric' },
                  ] as const
                ).map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilterCap(f.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                      filterCap === f.id
                        ? 'bg-red-600 text-white border-red-500 shadow-md'
                        : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid of Hospitals */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rankedHospitals.map((h, i) => {
                const isSelected = targetHospital?.id === h.id;
                const statusColor = h.erAvail > 10 ? '#10B981' : h.erAvail > 3 ? '#F59E0B' : '#EF4444';

                return (
                  <motion.div
                    key={h.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={`glass-strong rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-red-500 bg-gradient-to-b from-red-950/40 via-navy-950 to-slate-900 shadow-xl glow-red'
                        : 'border-white/10 hover:border-white/20 bg-navy-950/80'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Rank #{i + 1} • {h.city} ({h.distanceKm} km)
                          </span>
                          <h4 className="text-lg font-black text-white leading-snug">{h.name}</h4>
                        </div>

                        <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-center">
                          <div className="text-sm font-black text-emerald-400 tabular-nums">{h.calculatedEta} MIN</div>
                          <div className="text-[9px] font-bold text-emerald-300 uppercase">TRAFFIC ETA</div>
                        </div>
                      </div>

                      <div className="my-4 grid grid-cols-2 gap-2">
                        <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 text-center">
                          <div className="text-2xl font-black tabular-nums" style={{ color: statusColor }}>
                            {h.erAvail}
                          </div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Free ER Beds</div>
                        </div>

                        <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 text-center">
                          <div className="text-2xl font-black text-slate-200 tabular-nums">
                            {h.totalAvail}
                          </div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Total Free Beds</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {h.traumaCenter && (
                          <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold">
                            TRAUMA CENTER
                          </span>
                        )}
                        {h.cardiac && (
                          <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-400 border border-pink-500/30 text-[10px] font-bold">
                            CARDIAC CARE
                          </span>
                        )}
                        {h.pediatric && (
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                            PEDIATRIC
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                      <button
                        onClick={() => {
                          setSelectedHospital(h);
                        }}
                        className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all ${
                          isSelected
                            ? 'bg-red-600 text-white shadow-md'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        {isSelected ? 'SELECTED TARGET' : 'SELECT HOSPITAL'}
                      </button>

                      <button
                        onClick={() => {
                          setSelectedHospital(h);
                          setActiveTab('map');
                        }}
                        className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                        title="View Live Map Route"
                      >
                        <Navigation className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: DISPATCH PRE-ARRIVAL ALERT FORM */}
        {activeTab === 'dispatch' && targetHospital && (
          <div className="glass-strong rounded-3xl border border-red-500/40 p-6 md:p-8 bg-gradient-to-b from-navy-950 via-slate-900 to-navy-950 shadow-2xl max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-red-600/30">
                  <BellRing className="w-6 h-6 text-white animate-bounce" />
                </div>
                <div>
                  <span className="text-[10px] font-black tracking-widest text-red-400 uppercase bg-red-500/20 px-2 py-0.5 rounded border border-red-500/30">
                    STANDALONE EMS PRE-ARRIVAL DISPATCH
                  </span>
                  <h3 className="text-xl font-black text-white mt-0.5">
                    Pre-Arrival Alert → {targetHospital.name}
                  </h3>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-black text-emerald-400">{targetHospital.calculatedEta} MIN ETA</div>
                <div className="text-[10px] font-bold text-slate-400">EXPRESSWAY CLEARANCE</div>
              </div>
            </div>

            {dispatchConfirmed ? (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-emerald-500/10 border-2 border-emerald-500/40 p-6 rounded-2xl text-center space-y-4 glow-emerald"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500 text-navy-950 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/40">
                  <CheckCircle2 className="w-10 h-10" strokeWidth={3} />
                </div>
                <h4 className="text-2xl font-black text-white">DISPATCH ALERT CONFIRMED & SENT!</h4>
                <p className="text-sm text-emerald-300 max-w-md mx-auto">
                  <strong>{targetHospital.name} ER Triage</strong> has received your pre-arrival alert notification. ER Bay #2 is reserved and trauma team is standing by.
                </p>

                <div className="flex justify-center gap-4 pt-2">
                  <button
                    onClick={() => setDispatchConfirmed(false)}
                    className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase"
                  >
                    Update Patient Vitals
                  </button>
                  <button
                    onClick={() => setActiveTab('map')}
                    className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase flex items-center gap-2 shadow-lg shadow-emerald-600/30"
                  >
                    <Navigation className="w-4 h-4" />
                    Back to Active Traffic Map
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-5">
                {/* Triage Category buttons */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Select Patient Medical Triage Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {(
                      [
                        'Critical Trauma',
                        'Cardiac Emergency',
                        'Severe Respiratory',
                        'Stroke Alert',
                        'Obstetric Emergency',
                        'General Triage',
                      ] as const
                    ).map((cond) => (
                      <button
                        key={cond}
                        type="button"
                        onClick={() => setPatientCondition(cond)}
                        className={`p-3.5 rounded-xl text-xs font-black uppercase text-left transition-all border ${
                          patientCondition === cond
                            ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/30'
                            : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                        }`}
                      >
                        {cond}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Patient Info & Vitals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Patient Demographics / Incident Info
                    </label>
                    <input
                      type="text"
                      value={patientAgeGender}
                      onChange={(e) => setPatientAgeGender(e.target.value)}
                      placeholder="e.g. 42M - Severe Road Accident"
                      className="w-full px-4 h-12 rounded-xl bg-white/5 border border-white/15 text-sm text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Live En-Route Patient Vitals Summary
                    </label>
                    <input
                      type="text"
                      value={vitalsSummary}
                      onChange={(e) => setVitalsSummary(e.target.value)}
                      placeholder="e.g. BP 105/70 | HR 112 | SpO2 93%"
                      className="w-full px-4 h-12 rounded-xl bg-white/5 border border-white/15 text-sm text-white focus:outline-none focus:border-red-500 font-mono"
                    />
                  </div>
                </div>

                {/* Send Alert Action Button */}
                <button
                  type="button"
                  onClick={handleSendPreArrivalAlert}
                  disabled={isDispatching}
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-emerald-600 hover:brightness-110 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-red-600/40 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {isDispatching ? (
                    <>
                      <Activity className="w-5 h-5 animate-spin" />
                      BROADCASTING DISPATCH SIGNAL TO ER...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      DISPATCH PRE-ARRIVAL ALERT TO {targetHospital.name.toUpperCase()} (ETA {targetHospital.calculatedEta} MIN)
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Driver Login Modal */}
      <AmbulanceLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}
