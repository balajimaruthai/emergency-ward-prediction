import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  MapPin,
  Building2,
  BedSingle,
  HeartPulse,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Navigation,
  Ambulance,
  Wind,
  X,
  Moon,
  Sun,
  LogOut,
  Eye,
  ShieldAlert,
  Baby,
} from 'lucide-react';
import { Sidebar, type NavPage } from '@/components/Sidebar';
import { CitySelector } from '@/components/CitySelector';
import { useTheme } from '@/hooks/useTheme';
import { getHospitalsForCity } from '@/lib/hospitalData';
import type { HospitalInfo, UserRole } from '@/lib/types';
import { useRealtimeHospitalData } from '@/hooks/useRealtimeHospitalData';
import { RealtimeContext } from '@/hooks/realtimeContext';
import { OverviewPage } from '@/pages/OverviewPage';
import { LiveMonitoringPage } from '@/pages/LiveMonitoringPage';
import { PredictionPage } from '@/pages/PredictionPage';
import { ForecastPage } from '@/pages/ForecastPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { ResourcesPage } from '@/pages/ResourcesPage';
import { ModelPage } from '@/pages/ModelPage';
import { ExplainabilityPage } from '@/pages/ExplainabilityPage';
import { DataManagementPage } from '@/pages/DataManagementPage';
import { SystemHealthPage } from '@/pages/SystemHealthPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { AmbulanceDriverHUD } from '@/components/AmbulanceDriverHUD';
import { useAmbulanceDispatch } from '@/hooks/useAmbulanceDispatch';

interface DashboardShellProps {
  role: UserRole;
  userEmail?: string | null;
  onSignOut: () => void;
  initialCity?: string | null;
}

export function DashboardShell({ role, userEmail, onSignOut, initialCity }: DashboardShellProps) {
  const { theme, toggleTheme } = useTheme();
  const [selectedCity, setSelectedCity] = useState<string | null>(initialCity ?? 'Chennai');
  const [selectedHospital, setSelectedHospital] = useState<HospitalInfo | null>(null);
  const [activePage, setActivePage] = useState<NavPage>('Overview');
  const [tick, setTick] = useState(0);

  const realtimeData = useRealtimeHospitalData();

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  const hospitals = useMemo(() => {
    if (!selectedCity) return [];
    return getHospitalsForCity(selectedCity, true);
  }, [selectedCity, tick]);

  const roleConfig = {
    public: { label: 'Public View', icon: Eye, color: '#0EA5E9' },
    hospital: { label: 'Hospital Management', icon: Building2, color: '#16A34A' },
    ambulance: { label: 'Ambulance Routing', icon: Ambulance, color: '#DC2626' },
  };
  const config = roleConfig[role];
  const RoleIcon = config.icon;

  const showSidebar = role === 'hospital';

  return (
    <RealtimeContext.Provider value={realtimeData}>
      <div className="min-h-screen bg-slate-50 dark:bg-navy-900 text-slate-800 dark:text-navy-100 bg-cyber-grid relative transition-colors duration-300">
        {/* Background glowing gradients */}
        <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-accent-500/5 dark:bg-accent-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Sidebar for hospital staff */}
        {showSidebar && (
          <Sidebar current={activePage} onNavigate={setActivePage} />
        )}

        <div className={`transition-all duration-300 ${showSidebar ? 'pl-[72px]' : ''}`}>
          {/* Top Header */}
          <header className="sticky top-0 z-20 glass-strong border-b border-slate-200/60 dark:border-white/10 h-16 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              {!showSidebar && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center shadow-lg shadow-accent-500/20">
                    <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-sm font-bold text-slate-800 dark:text-white leading-tight">EWI</div>
                    <div className="text-[10px] text-slate-400 dark:text-navy-400 leading-tight">Emergency Ward Intelligence</div>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/10">
                <RoleIcon className="w-4 h-4" style={{ color: config.color }} />
                <span className="text-xs font-semibold text-slate-700 dark:text-navy-100">{config.label}</span>
              </div>
              <div className="hidden md:block w-px h-6 bg-slate-200 dark:bg-white/10" />
              <CitySelector selectedCity={selectedCity} onSelectCity={setSelectedCity} />
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">LIVE FEED</span>
              </div>

              <button
                onClick={toggleTheme}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:text-navy-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>

              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-white/10">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                  {userEmail ? userEmail[0].toUpperCase() : 'U'}
                </div>
                <button
                  onClick={onSignOut}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="px-6 lg:px-8 py-8 max-w-[1600px] mx-auto">
            {role === 'public' && (
              <PublicDashboard hospitals={hospitals} city={selectedCity} onSelectHospital={setSelectedHospital} />
            )}

            {role === 'ambulance' && (
              <AmbulanceDriverHUD
                hospitals={hospitals}
                city={selectedCity}
                userEmail={userEmail}
                onSelectHospital={setSelectedHospital}
              />
            )}

            {role === 'hospital' && (
              <div className="space-y-6">
                <HospitalIncomingDispatchesBanner />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activePage === 'Overview' && <OverviewPage />}
                    {activePage === 'Live Monitoring' && <LiveMonitoringPage />}
                    {activePage === 'Prediction' && <PredictionPage />}
                    {activePage === 'Forecast' && <ForecastPage />}
                    {activePage === 'Analytics' && <AnalyticsPage />}
                    {activePage === 'Resources' && <ResourcesPage />}
                    {activePage === 'Model' && <ModelPage />}
                    {activePage === 'Reports' && <AnalyticsPage />}
                    {activePage === 'Explainability' && <ExplainabilityPage />}
                    {activePage === 'Data Management' && <DataManagementPage />}
                    {activePage === 'System Health' && <SystemHealthPage />}
                    {activePage === 'Settings' && <SettingsPage />}
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </main>
        </div>

        {/* Hospital detail drawer */}
        <AnimatePresence>
          {selectedHospital && (
            <HospitalDetailDrawer hospital={selectedHospital} onClose={() => setSelectedHospital(null)} role={role} />
          )}
        </AnimatePresence>
      </div>
    </RealtimeContext.Provider>
  );
}

/* ===================== PUBLIC DASHBOARD ===================== */

function PublicDashboard({ hospitals, city, onSelectHospital }: { hospitals: HospitalInfo[]; city: string | null; onSelectHospital: (h: HospitalInfo) => void }) {
  const totalBeds = hospitals.reduce((s, h) => s + h.totalBeds, 0);
  const availableBeds = hospitals.reduce((s, h) => s + (h.totalBeds - h.occupiedBeds), 0);
  const criticalHospitals = hospitals.filter((h) => (h.occupiedBeds / h.totalBeds) >= 0.85).length;
  const availableHospitals = hospitals.filter((h) => (h.occupiedBeds / h.totalBeds) < 0.7).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-slate-500 dark:text-navy-300">
        <MapPin className="w-4 h-4 text-accent-500" />
        <span className="text-sm">
          Showing <strong className="text-slate-800 dark:text-white">{hospitals.length} hospitals</strong>
          {city && <> in <strong className="text-slate-800 dark:text-white">{city}</strong> and nearby areas</>}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard icon={Building2} label="Hospitals" value={hospitals.length} color="#0EA5E9" />
        <KpiCard icon={BedSingle} label="Total Beds" value={totalBeds} color="#3B82F6" />
        <KpiCard icon={CheckCircle2} label="Available Beds" value={availableBeds} color="#10B981" />
        <KpiCard icon={AlertTriangle} label="Near Capacity" value={criticalHospitals} color="#EF4444" />
      </div>

      <div className="glass-strong rounded-2xl border border-slate-200/60 dark:border-white/10 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200/60 dark:border-white/10 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Hospitals Near You</h3>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{availableHospitals} with immediate capacity</span>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-white/5">
          {hospitals.map((h, i) => {
            const avail = h.totalBeds - h.occupiedBeds;
            const rate = h.occupiedBeds / h.totalBeds;
            const statusColor = rate >= 0.9 ? '#EF4444' : rate >= 0.75 ? '#F59E0B' : rate >= 0.5 ? '#3B82F6' : '#10B981';
            const statusLabel = rate >= 0.9 ? 'CRITICAL' : rate >= 0.75 ? 'HIGH' : rate >= 0.5 ? 'MODERATE' : 'AVAILABLE';
            return (
              <motion.button
                key={h.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                onClick={() => onSelectHospital(h)}
                className="w-full flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left group"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${statusColor}20` }}>
                  <Building2 className="w-5 h-5" style={{ color: statusColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-accent-500 transition-colors truncate">{h.name}</div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-navy-400 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-accent-500" />
                      {h.city}
                    </span>
                    {h.distanceKm && (
                      <span className="flex items-center gap-1">
                        <Navigation className="w-3 h-3 text-slate-400" />
                        {h.distanceKm} km away
                      </span>
                    )}
                    {h.traumaCenter && <span className="text-red-500 font-semibold">Trauma Center</span>}
                    {h.cardiac && <span className="text-pink-500">Cardiac</span>}
                    {h.pediatric && <span className="text-amber-500">Pediatric</span>}
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-xl font-bold tabular-nums" style={{ color: statusColor }}>{avail}</div>
                    <div className="text-[10px] text-slate-400 dark:text-navy-400 uppercase">Available</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold tabular-nums text-slate-600 dark:text-navy-200">{h.totalBeds}</div>
                    <div className="text-[10px] text-slate-400 dark:text-navy-400 uppercase">Total</div>
                  </div>
                </div>
                <div className="w-24 text-right">
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-navy-800 overflow-hidden mb-1">
                    <div className="h-full rounded-full bar-fill" style={{ width: `${rate * 100}%`, backgroundColor: statusColor }} />
                  </div>
                  <span className="text-[10px] font-bold tracking-wider" style={{ color: statusColor }}>{statusLabel}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ===================== AMBULANCE DASHBOARD ===================== */

function AmbulanceDashboard({ hospitals, city, onSelectHospital }: { hospitals: HospitalInfo[]; city: string | null; onSelectHospital: (h: HospitalInfo) => void }) {
  const [filter, setFilter] = useState<'all' | 'trauma' | 'cardiac' | 'pediatric'>('all');

  const filtered = hospitals
    .filter((h) => {
      if (filter === 'trauma') return h.traumaCenter;
      if (filter === 'cardiac') return h.cardiac;
      if (filter === 'pediatric') return h.pediatric;
      return true;
    })
    .filter((h) => {
      const erWard = h.wards.find((w) => w.name === 'Emergency');
      const avail = erWard ? erWard.totalBeds - erWard.occupiedBeds : 0;
      return avail > 0;
    })
    .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));

  const nearestWithBeds = filtered[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-slate-500 dark:text-navy-300">
        <Ambulance className="w-4 h-4 text-red-500 animate-pulse" />
        <span className="text-sm">
          Emergency Ambulance Routing{city && <> for <strong className="text-slate-800 dark:text-white">{city}</strong> sector</>}
        </span>
      </div>

      {nearestWithBeds && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-strong rounded-2xl border border-red-500/30 p-6 bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent glow-red"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/30">
                <Ambulance className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xs font-bold tracking-widest text-red-500 dark:text-red-400 uppercase">RECOMMENDED TARGET HOSPITAL</span>
                <div className="text-xl font-extrabold text-slate-800 dark:text-white">{nearestWithBeds.name}</div>
              </div>
            </div>
            {nearestWithBeds.etaMinutes && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500 text-white text-xs font-bold shadow-md shadow-red-500/30">
                <Clock className="w-3.5 h-3.5" />
                ETA {nearestWithBeds.etaMinutes} MIN
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-navy-300">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-accent-500" />
                {nearestWithBeds.city} ({nearestWithBeds.distanceKm} km)
              </span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                <BedSingle className="w-3.5 h-3.5" />
                {nearestWithBeds.totalBeds - nearestWithBeds.occupiedBeds} ER Beds Available
              </span>
            </div>
            <button
              onClick={() => onSelectHospital(nearestWithBeds)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-red-600/30"
            >
              <Navigation className="w-4 h-4" />
              Start Navigation
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ===================== HOSPITAL DETAIL DRAWER ===================== */

function HospitalDetailDrawer({ hospital, onClose, role }: { hospital: HospitalInfo; onClose: () => void; role: UserRole }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
      />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-[#0F172A] border-l border-slate-200 dark:border-white/10 z-50 overflow-y-auto p-6 shadow-2xl space-y-6"
      >
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-white">{hospital.name}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:text-navy-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="text-xs text-slate-500 dark:text-navy-300 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-accent-500" />
            {hospital.city}, {hospital.state} · {hospital.distanceKm ?? 0} km away
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-3 text-center border border-slate-200/60 dark:border-white/5">
              <div className="text-lg font-bold text-slate-800 dark:text-white">{hospital.totalBeds}</div>
              <div className="text-[10px] text-slate-400 dark:text-navy-400 uppercase">Total Beds</div>
            </div>
            <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-3 text-center border border-slate-200/60 dark:border-white/5">
              <div className="text-lg font-bold text-amber-600 dark:text-amber-400">{hospital.occupiedBeds}</div>
              <div className="text-[10px] text-slate-400 dark:text-navy-400 uppercase">Occupied</div>
            </div>
            <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-3 text-center border border-slate-200/60 dark:border-white/5">
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{hospital.totalBeds - hospital.occupiedBeds}</div>
              <div className="text-[10px] text-slate-400 dark:text-navy-400 uppercase">Available</div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-500 dark:text-navy-400 uppercase tracking-wider mb-3">Ward Breakdown</h4>
            <div className="space-y-2">
              {hospital.wards.map((ward) => {
                const avail = ward.totalBeds - ward.occupiedBeds;
                const rate = ward.occupiedBeds / ward.totalBeds;
                const statusColor = rate >= 0.85 ? '#EF4444' : rate >= 0.7 ? '#F59E0B' : '#10B981';
                return (
                  <div key={ward.id} className="bg-slate-50 dark:bg-white/5 rounded-xl p-3 border border-slate-200/60 dark:border-white/5">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-800 dark:text-white">{ward.name}</span>
                      <span style={{ color: statusColor }} className="font-bold">{avail} Free</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-200 dark:bg-navy-800 overflow-hidden">
                      <div className="h-full rounded-full bar-fill" style={{ width: `${rate * 100}%`, backgroundColor: statusColor }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

/* ===================== KPI CARD ===================== */

function KpiCard({ icon: Icon, label, value, color }: { icon: typeof Activity; label: string; value: number; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-5 border border-slate-200/60 dark:border-white/10"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div>
          <div className="text-2xl font-extrabold text-slate-800 dark:text-white tabular-nums">{value.toLocaleString()}</div>
          <div className="text-xs text-slate-400 dark:text-navy-400 font-medium">{label}</div>
        </div>
      </div>
    </motion.div>
  );
}

/* ===================== HOSPITAL INCOMING DISPATCHES BANNER ===================== */

function HospitalIncomingDispatchesBanner() {
  const { dispatches, acknowledgeDispatch, completeDispatch } = useAmbulanceDispatch();

  if (!dispatches || dispatches.length === 0) return null;

  return (
    <div className="space-y-3">
      {dispatches.map((d) => (
        <motion.div
          key={d.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-2xl border-2 border-red-500/50 p-4 bg-gradient-to-r from-red-950/80 via-navy-950 to-slate-900 shadow-2xl relative overflow-hidden glow-red flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-red-600/40 animate-pulse">
              <Ambulance className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-widest text-red-400 uppercase bg-red-500/20 px-2 py-0.5 rounded border border-red-500/30">
                  INCOMING EMERGENCY AMBULANCE PRE-ARRIVAL
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  ETA: {d.etaMinutes} MINS ({d.distanceKm} km)
                </span>
              </div>

              <h4 className="text-lg font-black text-white mt-1">
                {d.ambulanceUnit} ({d.driverName}) → {d.targetHospitalName}
              </h4>
              <div className="text-xs text-slate-300 mt-0.5 flex flex-wrap items-center gap-3">
                <span className="font-bold text-red-400">Condition: {d.patientCondition}</span>
                <span>•</span>
                <span>Patient: {d.patientAgeGender}</span>
                <span>•</span>
                <span className="font-mono text-emerald-400">Vitals: {d.vitals}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-center">
            <div className="px-3 py-1.5 rounded-xl bg-white/10 text-xs font-bold text-emerald-400 border border-white/10">
              {d.erBayAssigned ?? 'ER Bay Reserved'}
            </div>
            <button
              onClick={() => acknowledgeDispatch(d.id)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase shadow-md transition-all"
            >
              Acknowledge & Reserve Bay
            </button>
            <button
              onClick={() => completeDispatch(d.id)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Clear Notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
