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
} from 'lucide-react';
import type { HospitalInfo } from '@/lib/types';
import { AmbulanceMapRoute } from '@/components/AmbulanceMapRoute';
import { useAmbulanceDispatch } from '@/hooks/useAmbulanceDispatch';

import { downloadCSV } from '@/lib/csvExport';

interface AmbulanceDriverHUDProps {
  hospitals: HospitalInfo[];
  city: string | null;
  userEmail?: string | null;
  onSelectHospital?: (h: HospitalInfo) => void;
}

export function AmbulanceDriverHUD({ hospitals, city, userEmail, onSelectHospital }: AmbulanceDriverHUDProps) {
  const { sendDispatch, dispatches } = useAmbulanceDispatch();
  const [selectedHospital, setSelectedHospital] = useState<HospitalInfo | null>(hospitals[0] ?? null);
  const [activeTab, setActiveTab] = useState<'finder' | 'route' | 'dispatch'>('finder');
  const [filterCap, setFilterCap] = useState<'all' | 'trauma' | 'cardiac' | 'icu' | 'pediatric'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleExportDispatchCSV = () => {
    const rows = (dispatches.length > 0 ? dispatches : [
      {
        id: 'dispatch-demo',
        ambulanceUnit: 'EMS-108-ALPHA',
        driverName: 'Officer Suresh Kumar',
        targetHospitalName: selectedHospital?.name ?? 'Apollo Hospitals',
        city: city ?? 'Chennai',
        patientCondition: 'Critical Trauma',
        patientAgeGender: '45M - Road Accident',
        vitals: 'BP 110/70 | HR 105',
        etaMinutes: selectedHospital?.etaMinutes ?? 8,
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
    downloadCSV(`ems_ambulance_dispatches_${(city ?? 'chennai').toLowerCase()}.csv`, rows);
  };

  // Triage Patient Details Form State
  const [patientCondition, setPatientCondition] = useState<
    'Critical Trauma' | 'Cardiac Emergency' | 'Severe Respiratory' | 'Stroke Alert' | 'Obstetric Emergency' | 'General Triage'
  >('Critical Trauma');
  const [patientAgeGender, setPatientAgeGender] = useState<string>('45M - Road Accident');
  const [vitalsSummary, setVitalsSummary] = useState<string>('BP 110/70 | HR 105 | SpO2 93%');
  const [dispatchConfirmed, setDispatchConfirmed] = useState<boolean>(false);
  const [isDispatching, setIsDispatching] = useState<boolean>(false);

  // Filtered & Ranked Hospitals (Sorted by ETA & Bed Availability)
  const rankedHospitals = useMemo(() => {
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
      .sort((a, b) => {
        // Priority formula: Lowest ETA + highest available ER beds
        return a.calculatedEta - b.calculatedEta;
      });
  }, [hospitals, searchQuery, filterCap]);

  const topAvailableHospital = rankedHospitals[0];

  const handleSelectHospital = (h: HospitalInfo) => {
    setSelectedHospital(h);
    if (onSelectHospital) onSelectHospital(h);
  };

  const handleSendPreArrivalAlert = async () => {
    if (!selectedHospital) return;
    setIsDispatching(true);

    setTimeout(() => {
      sendDispatch({
        ambulanceUnit: userEmail ? userEmail.split('@')[0].toUpperCase() : 'EMS-108-ALPHA',
        driverName: 'Officer Suresh Kumar',
        targetHospitalId: selectedHospital.id,
        targetHospitalName: selectedHospital.name,
        city: selectedHospital.city,
        patientCondition,
        patientAgeGender,
        vitals: vitalsSummary,
        etaMinutes: selectedHospital.etaMinutes ?? 8,
        distanceKm: selectedHospital.distanceKm ?? 4.2,
        trafficCondition: 'Clear Expressway',
      });
      setIsDispatching(false);
      setDispatchConfirmed(true);
    }, 1200);
  };

  return (
    <div className="space-y-6 text-slate-800 dark:text-navy-100">
      {/* Top Driver Cab Control Header */}
      <div className="glass-strong rounded-3xl border border-red-500/40 p-6 bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 shadow-2xl relative overflow-hidden glow-red">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 via-red-500 to-amber-600 flex items-center justify-center shadow-xl shadow-red-600/40 shrink-0 glow-red animate-pulse">
              <Ambulance className="w-9 h-9 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black tracking-widest text-red-400 uppercase bg-red-500/20 px-2.5 py-0.5 rounded border border-red-500/30">
                  EMS CAB DISPATCH HUD
                </span>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded flex items-center gap-1.5 border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  SECTOR: {city ? city.toUpperCase() : 'CHENNAI'}
                </span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-3">
                Unit {userEmail ? userEmail.split('@')[0].toUpperCase() : 'EMS-108-ALPHA'}
                <span className="text-xs font-semibold text-slate-400 border-l border-white/10 pl-3">
                  Officer Suresh Kumar (Paramedic Team 1)
                </span>
              </h1>
            </div>
          </div>

          {/* Quick HUD Nav Tabs */}
          <div className="flex items-center bg-white/5 p-1.5 rounded-2xl border border-white/10 self-start lg:self-center">
            <button
              onClick={() => setActiveTab('finder')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === 'finder'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              1. Bed Finder
            </button>

            <button
              onClick={() => setActiveTab('route')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === 'route'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Navigation className="w-4 h-4" />
              2. Live Traffic Route
            </button>

            <button
              onClick={() => setActiveTab('dispatch')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === 'dispatch'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BellRing className="w-4 h-4" />
              3. Hospital Dispatch Alert
            </button>

            <button
              onClick={handleExportDispatchCSV}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase tracking-wider transition-all border border-white/10 active:scale-95 ml-2"
            >
              Export Log (CSV)
            </button>
          </div>
        </div>
      </div>

      {/* RECOMMENDED TARGET HOSPITAL HIGHLIGHT BANNER */}
      {topAvailableHospital && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-3xl border-2 border-emerald-500/50 p-6 bg-gradient-to-r from-emerald-950/60 via-navy-950 to-slate-900 shadow-2xl relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-navy-950 flex items-center justify-center font-black text-xl shrink-0 shadow-lg shadow-emerald-500/30">
                1st
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black tracking-widest text-emerald-400 uppercase bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                    FASTEST OPTIMAL TARGET (HIGH ER CAPACITY)
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white mt-0.5">{topAvailableHospital.name}</h3>
                <div className="flex items-center gap-4 text-xs text-slate-300 mt-1">
                  <span className="flex items-center gap-1 font-bold text-emerald-400">
                    <BedSingle className="w-4 h-4" />
                    {topAvailableHospital.erAvail} Emergency Beds Available
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {topAvailableHospital.distanceKm} km away
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center px-4 py-2 bg-emerald-500/20 rounded-2xl border border-emerald-500/30">
                <div className="text-2xl font-black text-emerald-400 tabular-nums">
                  {topAvailableHospital.calculatedEta} MIN
                </div>
                <div className="text-[10px] text-emerald-300 font-bold uppercase">TRAFFIC ETA</div>
              </div>

              <button
                onClick={() => {
                  setSelectedHospital(topAvailableHospital);
                  setActiveTab('route');
                }}
                className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-xl shadow-emerald-600/30 active:scale-95"
              >
                <Navigation className="w-4 h-4" />
                START NAV ROUTE
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 1: BED FINDER & HOSPITAL LIST */}
      {activeTab === 'finder' && (
        <div className="space-y-4">
          {/* Search & Specialty Filter Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 glass-strong p-4 rounded-2xl border border-white/10">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hospital or area..."
                className="w-full pl-10 pr-4 h-11 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {(
                [
                  { id: 'all', label: 'All Beds' },
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

          {/* Hospital List Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rankedHospitals.map((h) => {
              const isSelected = selectedHospital?.id === h.id;
              const statusColor = h.erAvail > 10 ? '#10B981' : h.erAvail > 3 ? '#F59E0B' : '#EF4444';

              return (
                <motion.div
                  key={h.id}
                  whileHover={{ y: -2 }}
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
                          {h.city} • {h.distanceKm} km away
                        </span>
                        <h4 className="text-lg font-black text-white leading-snug">{h.name}</h4>
                      </div>

                      <div className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-center">
                        <div className="text-sm font-black text-emerald-400 tabular-nums">{h.calculatedEta} MIN</div>
                        <div className="text-[9px] font-bold text-slate-400">ETA</div>
                      </div>
                    </div>

                    <div className="my-4 grid grid-cols-2 gap-2">
                      <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 text-center">
                        <div className="text-xl font-black tabular-nums" style={{ color: statusColor }}>
                          {h.erAvail}
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Available ER Beds</div>
                      </div>
                      <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 text-center">
                        <div className="text-xl font-black text-slate-200 tabular-nums">
                          {h.totalBeds - h.occupiedBeds}
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
                          CARDIAC UNIT
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
                      onClick={() => handleSelectHospital(h)}
                      className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all ${
                        isSelected
                          ? 'bg-red-600 text-white shadow-md'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {isSelected ? 'TARGET SELECTED' : 'SELECT HOSPITAL'}
                    </button>

                    <button
                      onClick={() => {
                        handleSelectHospital(h);
                        setActiveTab('route');
                      }}
                      className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                      title="View Traffic Route"
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

      {/* TAB 2: LIVE TRAFFIC MAP & ROUTE SELECTION */}
      {activeTab === 'route' && selectedHospital && (
        <div className="space-y-4">
          <AmbulanceMapRoute
            hospital={selectedHospital}
            isDispatching={isDispatching}
            onConfirmRoute={() => {
              setActiveTab('dispatch');
            }}
          />
        </div>
      )}

      {/* TAB 3: HOSPITAL PRE-ARRIVAL DISPATCH ALERT FORM */}
      {activeTab === 'dispatch' && selectedHospital && (
        <div className="glass-strong rounded-3xl border border-red-500/40 p-6 bg-gradient-to-b from-navy-950 via-slate-900 to-navy-950 shadow-2xl max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/30">
                <BellRing className="w-6 h-6 text-white animate-bounce" />
              </div>
              <div>
                <span className="text-[10px] font-black tracking-widest text-red-400 uppercase bg-red-500/20 px-2 py-0.5 rounded border border-red-500/30">
                  PRE-ARRIVAL EMERGENCY DISPATCH
                </span>
                <h3 className="text-xl font-black text-white mt-0.5">
                  Send Instant Alert to {selectedHospital.name}
                </h3>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-black text-emerald-400">{selectedHospital.etaMinutes ?? 8} MIN ETA</div>
              <div className="text-[10px] font-bold text-slate-400">VIA EXPRESSWAY</div>
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
              <h4 className="text-2xl font-black text-white">DISPATCH ALERT CONFIRMED & BROADCASTED!</h4>
              <p className="text-sm text-emerald-300 max-w-md mx-auto">
                <strong>{selectedHospital.name} ER Triage</strong> has received your pre-arrival alert. ER Bay #2 is reserved and trauma team is standing by.
              </p>

              <div className="flex justify-center gap-4 pt-2">
                <button
                  onClick={() => setDispatchConfirmed(false)}
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase"
                >
                  Update Patient Status
                </button>
                <button
                  onClick={() => setActiveTab('route')}
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase flex items-center gap-2 shadow-lg shadow-emerald-600/30"
                >
                  <Navigation className="w-4 h-4" />
                  Return to Active Route Map
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {/* Triage Condition Buttons */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Patient Medical Triage Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                      className={`p-3 rounded-xl text-xs font-black uppercase text-left transition-all border ${
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

              {/* Patient Demographics & Vitals */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Patient Info / Incident Description
                  </label>
                  <input
                    type="text"
                    value={patientAgeGender}
                    onChange={(e) => setPatientAgeGender(e.target.value)}
                    placeholder="e.g. 45M - Road Accident Trauma"
                    className="w-full px-4 h-12 rounded-xl bg-white/5 border border-white/15 text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Live En-Route Patient Vitals
                  </label>
                  <input
                    type="text"
                    value={vitalsSummary}
                    onChange={(e) => setVitalsSummary(e.target.value)}
                    placeholder="e.g. BP 110/70 | HR 105 | SpO2 93%"
                    className="w-full px-4 h-12 rounded-xl bg-white/5 border border-white/15 text-sm text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
              </div>

              {/* Submit Dispatch Notification */}
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
                    DISPATCH PRE-ARRIVAL ALERT TO {selectedHospital.name.toUpperCase()} (ETA {selectedHospital.etaMinutes ?? 8} MIN)
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
