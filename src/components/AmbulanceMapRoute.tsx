import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Navigation,
  Clock,
  Zap,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Volume2,
  VolumeX,
  MapPin,
  Building2,
  RefreshCw,
  Compass,
  CornerUpRight,
  ArrowRight,
  Activity,
  Layers,
} from 'lucide-react';
import { RealtimeLeafletMap } from '@/components/RealtimeLeafletMap';
import type { HospitalInfo } from '@/lib/types';

interface RouteOption {
  id: string;
  name: string;
  distanceKm: number;
  etaMinutes: number;
  trafficLevel: 'LOW' | 'MODERATE' | 'HEAVY';
  trafficColor: string;
  badge: string;
  description: string;
  pathD: string;
  trafficSegments: Array<{ x: number; y: number; status: 'clear' | 'moderate' | 'heavy' }>;
}

interface AmbulanceMapRouteProps {
  hospital: HospitalInfo;
  onConfirmRoute?: (route: RouteOption) => void;
  isDispatching?: boolean;
}

export function AmbulanceMapRoute({ hospital, onConfirmRoute, isDispatching }: AmbulanceMapRouteProps) {
  const [selectedRouteId, setSelectedRouteId] = useState<string>('expressway');
  const [sirenActive, setSirenActive] = useState<boolean>(true);
  const [gpsProgress, setGpsProgress] = useState<number>(15);
  const [trafficViewMode, setTrafficViewMode] = useState<'traffic' | 'satellite' | 'hud'>('traffic');
  const [trafficIncident, setTrafficIncident] = useState<string | null>(
    'Main St Flyover Congested (+6m delay avoided via Expressway)'
  );

  // Animated vehicle progress along active route
  useEffect(() => {
    const timer = setInterval(() => {
      setGpsProgress((prev) => (prev >= 92 ? 15 : prev + 2));
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  // Pre-configured realistic route options
  const routes: RouteOption[] = [
    {
      id: 'expressway',
      name: 'Expressway Priority EMS Route',
      distanceKm: Math.max(2.5, Number((hospital.distanceKm ?? 4.2).toFixed(1))),
      etaMinutes: Math.max(5, (hospital.etaMinutes ?? 8) - 2),
      trafficLevel: 'LOW',
      trafficColor: '#10B981',
      badge: 'FASTEST (EMS CLEARANCE)',
      description: 'Dedicated Emergency Corridor via Highway Flyover. Traffic signals synchronized.',
      pathD: 'M 60,320 C 120,310 180,240 260,200 C 340,160 420,150 520,110 C 600,80 660,70 720,65',
      trafficSegments: [
        { x: 120, y: 310, status: 'clear' },
        { x: 260, y: 200, status: 'clear' },
        { x: 420, y: 150, status: 'clear' },
        { x: 600, y: 80, status: 'moderate' },
      ],
    },
    {
      id: 'bypass',
      name: 'Outer Ring Bypass Corridor',
      distanceKm: Number(((hospital.distanceKm ?? 4.2) + 1.8).toFixed(1)),
      etaMinutes: (hospital.etaMinutes ?? 8) + 3,
      trafficLevel: 'MODERATE',
      trafficColor: '#F59E0B',
      badge: 'SMOOTH FLOW',
      description: 'Bypasses downtown bottleneck. Slight distance increase but consistent 50 km/h speed.',
      pathD: 'M 60,320 C 100,380 240,410 400,380 C 560,350 680,220 720,65',
      trafficSegments: [
        { x: 100, y: 380, status: 'clear' },
        { x: 400, y: 380, status: 'moderate' },
        { x: 560, y: 350, status: 'clear' },
      ],
    },
    {
      id: 'city',
      name: 'Direct City Arterial Road',
      distanceKm: Number(((hospital.distanceKm ?? 4.2) - 0.6).toFixed(1)),
      etaMinutes: (hospital.etaMinutes ?? 8) + 9,
      trafficLevel: 'HEAVY',
      trafficColor: '#EF4444',
      badge: 'CONGESTED (NOT RECOMMENDED)',
      description: 'Shortest geographical distance but heavy traffic gridlock near central market.',
      pathD: 'M 60,320 C 200,320 300,280 420,280 C 540,280 620,140 720,65',
      trafficSegments: [
        { x: 200, y: 320, status: 'moderate' },
        { x: 420, y: 280, status: 'heavy' },
        { x: 620, y: 140, status: 'heavy' },
      ],
    },
  ];

  const activeRoute = routes.find((r) => r.id === selectedRouteId) ?? routes[0];

  return (
    <div className="space-y-4">
      {/* HUD Header Bar */}
      <div className="glass-strong rounded-2xl border border-red-500/30 p-4 bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/40 shrink-0 animate-pulse">
            <Navigation className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black tracking-widest text-red-400 uppercase bg-red-500/20 px-2 py-0.5 rounded border border-red-500/30">
                LIVE EMS NAVIGATION HUD
              </span>
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                TRAFFIC RADAR ONLINE
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-0.5 tracking-tight flex items-center gap-2">
              Target: {hospital.name}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-center">
          {/* Siren toggle */}
          <button
            onClick={() => setSirenActive((v) => !v)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
              sirenActive
                ? 'bg-red-600 text-white border-red-400 shadow-lg shadow-red-600/40 animate-pulse'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
            }`}
          >
            {sirenActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            {sirenActive ? 'EMS SIREN ACTIVE' : 'SIREN OFF'}
          </button>

          {/* Map view mode toggle */}
          <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setTrafficViewMode('traffic')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                trafficViewMode === 'traffic' ? 'bg-accent-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Traffic Map
            </button>
            <button
              onClick={() => setTrafficViewMode('hud')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                trafficViewMode === 'hud' ? 'bg-accent-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Driver HUD
            </button>
          </div>
        </div>
      </div>

      {/* Traffic incident alert ticker */}
      {trafficIncident && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs font-medium">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
            <span><strong>Live Traffic Alert:</strong> {trafficIncident}</span>
          </div>
          <button
            onClick={() => setTrafficIncident(null)}
            className="text-[11px] underline hover:text-white text-amber-400"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Map Box & Route Controls Grid */}
      {trafficViewMode === 'traffic' ? (
        <RealtimeLeafletMap
          hospitalName={hospital.name}
          hospitalLat={hospital.lat}
          hospitalLng={hospital.lng}
          city={hospital.city}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Interactive Map Visualizer */}
          <div className="lg:col-span-8 glass-strong rounded-2xl border border-white/10 bg-navy-950/90 overflow-hidden relative min-h-[420px] flex flex-col justify-between shadow-2xl">
          {/* Map Graphic Overlay SVG */}
          <div className="absolute inset-0 z-0">
            <svg className="w-full h-full" viewBox="0 0 800 450" preserveAspectRatio="none">
              {/* Grid Background lines */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                </pattern>
                <linearGradient id="routeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#3B82F6" stopOpacity="1" />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity="0.9" />
                </linearGradient>
              </defs>

              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Secondary city street lines */}
              <path d="M 0,100 L 800,100" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
              <path d="M 0,250 L 800,250" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
              <path d="M 0,380 L 800,380" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
              <path d="M 200,0 L 200,450" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
              <path d="M 450,0 L 450,450" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
              <path d="M 680,0 L 680,450" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />

              {/* All Route paths background */}
              {routes.map((r) => (
                <path
                  key={r.id}
                  d={r.pathD}
                  fill="none"
                  stroke={r.id === selectedRouteId ? r.trafficColor : 'rgba(255,255,255,0.12)'}
                  strokeWidth={r.id === selectedRouteId ? 8 : 4}
                  strokeDasharray={r.id === selectedRouteId ? 'none' : '6 6'}
                  className="transition-all duration-300"
                />
              ))}

              {/* Animated active route pulsing glow line */}
              <path
                d={activeRoute.pathD}
                fill="none"
                stroke="url(#routeGlow)"
                strokeWidth="10"
                strokeOpacity="0.4"
                strokeLinecap="round"
                className="animate-pulse"
              />

              {/* Traffic Condition Segments */}
              {activeRoute.trafficSegments.map((seg, idx) => (
                <g key={idx} transform={`translate(${seg.x}, ${seg.y})`}>
                  <circle
                    r="12"
                    fill={seg.status === 'clear' ? 'rgba(16, 185, 129, 0.25)' : seg.status === 'moderate' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(239, 68, 68, 0.35)'}
                    className="animate-ping"
                  />
                  <circle
                    r="6"
                    fill={seg.status === 'clear' ? '#10B981' : seg.status === 'moderate' ? '#F59E0B' : '#EF4444'}
                  />
                </g>
              ))}

              {/* START MARKER (AMBULANCE CURRENT POSITION) */}
              <g transform="translate(60, 320)">
                <circle r="22" fill="rgba(239, 68, 68, 0.3)" className="animate-ping" />
                <circle r="14" fill="#DC2626" stroke="#FFFFFF" strokeWidth="2.5" />
                <text x="0" y="4" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">EMS</text>
              </g>

              {/* END MARKER (TARGET HOSPITAL POSITION) */}
              <g transform="translate(720, 65)">
                <circle r="26" fill="rgba(16, 185, 129, 0.25)" className="animate-pulse" />
                <rect x="-16" y="-16" width="32" height="32" rx="8" fill="#10B981" stroke="#FFFFFF" strokeWidth="2.5" />
                <text x="0" y="5" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="black">H</text>
              </g>
            </svg>
          </div>

          {/* Map Top Floating Overlay Info */}
          <div className="relative z-10 p-4 flex items-center justify-between bg-gradient-to-b from-navy-950/90 to-transparent">
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs">
              <Compass className="w-4 h-4 text-accent-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span className="text-white font-bold">LIVE GPS: EN ROUTE VIA {activeRoute.name.toUpperCase()}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/30 text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-emerald-400 font-extrabold">{activeRoute.badge}</span>
              </div>
            </div>
          </div>

          {/* Map Bottom Turn-by-Turn Guidance Bar */}
          <div className="relative z-10 p-4 bg-gradient-to-t from-navy-950 via-navy-950/95 to-transparent flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-600 flex items-center justify-center text-white shrink-0 shadow-md">
                <CornerUpRight className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-accent-400 uppercase tracking-wider">NEXT TURN IN 350 METERS</div>
                <div className="text-sm font-extrabold text-white">Merge onto Highway Corridor #4 towards {hospital.name} ER Bay</div>
              </div>
            </div>

            <div className="flex items-center gap-6 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
              <div className="text-center">
                <div className="text-xs text-slate-400 uppercase font-bold">Distance</div>
                <div className="text-base font-black text-white tabular-nums">{activeRoute.distanceKm} km</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <div className="text-xs text-slate-400 uppercase font-bold">Est. Arrival</div>
                <div className="text-xl font-black text-emerald-400 tabular-nums flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {activeRoute.etaMinutes} MIN
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Route Selector & Dispatch Side Panel */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 flex items-center justify-between">
            <span>Select Optimal Traffic Route</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <Zap className="w-3 h-3" /> Live Traffic
            </span>
          </div>

          {routes.map((r) => {
            const isSelected = r.id === selectedRouteId;
            return (
              <motion.button
                key={r.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSelectedRouteId(r.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all relative overflow-hidden ${
                  isSelected
                    ? 'glass-strong border-accent-500 bg-gradient-to-r from-accent-950/60 to-navy-900 shadow-xl glow-accent'
                    : 'bg-navy-900/60 border-white/10 hover:border-white/20'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 px-3 py-0.5 bg-accent-600 text-white text-[9px] font-black rounded-bl-xl uppercase tracking-wider">
                    ACTIVE ROUTE
                  </div>
                )}

                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.trafficColor }} />
                      {r.name}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">{r.description}</div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-white tabular-nums">{r.distanceKm} km</span>
                    <span className="text-slate-500">•</span>
                    <span className="font-extrabold text-emerald-400 tabular-nums">{r.etaMinutes} mins</span>
                  </div>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded uppercase"
                    style={{ backgroundColor: `${r.trafficColor}20`, color: r.trafficColor }}
                  >
                    {r.trafficLevel} TRAFFIC
                  </span>
                </div>
              </motion.button>
            );
          })}

          {/* Confirm Route / Dispatch Action */}
          {onConfirmRoute && (
            <button
              onClick={() => onConfirmRoute(activeRoute)}
              disabled={isDispatching}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-emerald-600 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-red-600/30 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isDispatching ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  DISPATCHING PRE-ARRIVAL ALERT...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  CONFIRM ROUTE & DISPATCH ALERT ({activeRoute.etaMinutes} MIN ETA)
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
      )}
    </div>
  );
}
