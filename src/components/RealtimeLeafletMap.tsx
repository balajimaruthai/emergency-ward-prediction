import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ShieldAlert, Navigation, Radio, CheckCircle2, Siren, Zap, AlertTriangle } from 'lucide-react';
import { useTrafficPoliceDispatch } from '@/hooks/useTrafficPoliceDispatch';
import { getLiveGpsLocation, fetchOsrmRoute, getTrafficSignalJunctions } from '@/services/realtimeTrafficService';
import type { TrafficSignalJunction } from '@/services/realtimeTrafficService';

interface RealtimeLeafletMapProps {
  hospitalName?: string;
  hospitalLat?: number;
  hospitalLng?: number;
  city?: string;
  ambulanceUnit?: string;
  driverName?: string;
  patientCondition?: string;
}

export function RealtimeLeafletMap({
  hospitalName = 'Apollo Emergency Hospital',
  hospitalLat = 13.0604,
  hospitalLng = 80.2496,
  city = 'Chennai',
  ambulanceUnit = 'EMS-108-ALPHA',
  driverName = 'Officer Suresh Kumar',
  patientCondition = 'Critical Cardiac Emergency',
}: RealtimeLeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const ambulanceMarkerRef = useRef<L.Marker | null>(null);
  const signalMarkersRef = useRef<L.Marker[]>([]);

  const { activeCorridorAlert, sendPoliceEmergencyAlert } = useTrafficPoliceDispatch();

  // State
  const [currentLat, setCurrentLat] = useState<number>(hospitalLat - 0.025);
  const [currentLng, setCurrentLng] = useState<number>(hospitalLng - 0.025);
  const [address, setAddress] = useState<string>(`Live Emergency Sector (${city})`);
  const [speedKmH, setSpeedKmH] = useState<number>(54);
  const [isGpsActive, setIsGpsActive] = useState<boolean>(false);
  const [useDeviceGps, setUseDeviceGps] = useState<boolean>(false);
  const [routeInfo, setRouteInfo] = useState<{ distanceKm: number; durationMins: number } | null>(null);
  const [signals, setSignals] = useState<TrafficSignalJunction[]>([]);
  const [isDispatchingPoliceAlert, setIsDispatchingPoliceAlert] = useState<boolean>(false);

  // Sync state whenever target hospital lat/lng changes
  useEffect(() => {
    if (!useDeviceGps) {
      setCurrentLat(hospitalLat - 0.025);
      setCurrentLng(hospitalLng - 0.025);
      setAddress(`Live Emergency Sector (${city})`);
    }
  }, [hospitalLat, hospitalLng, city, useDeviceGps]);

  // Acquire real GPS
  useEffect(() => {
    const watchId = getLiveGpsLocation(
      (loc) => {
        // Calculate distance from hospital
        const latDiff = Math.abs(loc.lat - hospitalLat);
        const lngDiff = Math.abs(loc.lng - hospitalLng);
        // If device GPS is within ~80km of target hospital, use real GPS
        if (latDiff < 0.8 && lngDiff < 0.8) {
          setCurrentLat(loc.lat);
          setCurrentLng(loc.lng);
          setAddress(loc.address);
          setSpeedKmH(loc.speedKmH);
          setIsGpsActive(true);
          setUseDeviceGps(true);
        } else {
          // Device GPS is in another city/state, use local sector EMS location in selected hospital city
          setIsGpsActive(true);
        }
      },
      (err) => {
        console.warn('GPS notice:', err);
      }
    );

    return () => {
      if (watchId !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [hospitalLat, hospitalLng]);

  // Update signals list when position changes
  useEffect(() => {
    const initialSignals = getTrafficSignalJunctions(currentLat, currentLng, hospitalLat, hospitalLng);
    setSignals(initialSignals);
  }, [currentLat, currentLng, hospitalLat, hospitalLng]);

  // When active police alert status changes to CORRIDOR_CLEARED, update signal status to GREEN
  useEffect(() => {
    if (activeCorridorAlert?.status === 'CORRIDOR_CLEARED') {
      setSignals((prev) =>
        prev.map((s) => ({
          ...s,
          status: 'POLICE_CLEARED',
          waitTimeSeconds: 0,
        }))
      );
    }
  }, [activeCorridorAlert]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [currentLat, currentLng],
        zoom: 13,
        zoomControl: true,
      });

      // CartoDB Dark Matter tiles for ultra-modern high contrast traffic rendering
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Hospital Custom Icon
    const hospitalIcon = L.divIcon({
      className: 'custom-hospital-marker',
      html: `
        <div class="relative flex items-center justify-center w-10 h-10 bg-red-600 text-white font-black rounded-2xl shadow-xl border-2 border-white animate-pulse">
          🏥
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    L.marker([hospitalLat, hospitalLng], { icon: hospitalIcon })
      .addTo(map)
      .bindPopup(`<b>${hospitalName}</b><br/>Emergency Destination Hub`);

    return () => {
      // Cleanup map on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [hospitalLat, hospitalLng, hospitalName]);

  // Update Ambulance Marker & OSRM Route line
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Ambulance Custom Icon
    const ambulanceIcon = L.divIcon({
      className: 'custom-ambulance-marker',
      html: `
        <div class="relative flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full shadow-2xl border-2 border-white ring-4 ring-blue-500/40">
          🚑
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    if (ambulanceMarkerRef.current) {
      ambulanceMarkerRef.current.setLatLng([currentLat, currentLng]);
    } else {
      ambulanceMarkerRef.current = L.marker([currentLat, currentLng], { icon: ambulanceIcon })
        .addTo(map)
        .bindPopup(`<b>Ambulance Unit: ${ambulanceUnit}</b><br/>Driver: ${driverName}`);
    }

    // Clear old signal markers
    signalMarkersRef.current.forEach((m) => m.remove());
    signalMarkersRef.current = [];

    // Render traffic signal markers
    signals.forEach((sig) => {
      const isCleared = sig.status === 'POLICE_CLEARED';
      const sigColor = isCleared ? 'bg-emerald-500' : sig.status === 'RED' ? 'bg-red-500' : 'bg-amber-500';
      const sigIcon = L.divIcon({
        className: 'custom-signal-marker',
        html: `
          <div class="flex items-center gap-1 px-2 py-1 ${sigColor} text-white font-extrabold text-[10px] rounded-lg shadow-lg border border-white">
            🚦 ${isCleared ? 'GREEN CORRIDOR' : sig.name}
          </div>
        `,
        iconSize: [120, 24],
        iconAnchor: [60, 12],
      });
      const marker = L.marker([sig.lat, sig.lng], { icon: sigIcon }).addTo(map);
      signalMarkersRef.current.push(marker);
    });

    // Fetch real OSRM route
    fetchOsrmRoute(currentLat, currentLng, hospitalLat, hospitalLng).then((res) => {
      if (!res || !mapInstanceRef.current) return;

      setRouteInfo({
        distanceKm: res.distanceKm,
        durationMins: res.durationMins,
      });

      if (routePolylineRef.current) {
        routePolylineRef.current.setLatLngs(res.geometryCoordinates);
      } else {
        routePolylineRef.current = L.polyline(res.geometryCoordinates, {
          color: '#0EA5E9',
          weight: 6,
          opacity: 0.85,
          lineJoin: 'round',
        }).addTo(map);
      }

      map.fitBounds(L.latLngBounds([currentLat, currentLng], [hospitalLat, hospitalLng]), {
        padding: [50, 50],
      });
    });
  }, [currentLat, currentLng, hospitalLat, hospitalLng, ambulanceUnit, driverName, signals]);

  const handlePoliceAlertClick = () => {
    setIsDispatchingPoliceAlert(true);
    sendPoliceEmergencyAlert({
      ambulanceUnit,
      driverName,
      targetHospital: hospitalName,
      city,
      patientCondition,
      currentLat,
      currentLng,
    });
  };

  return (
    <div className="space-y-4">
      {/* Map Header Status Banner */}
      <div className="glass-strong rounded-2xl p-4 border border-slate-200/60 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-500 flex items-center justify-center font-black">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-800 dark:text-navy-100">
                Real-Time Traffic & GPS Navigation System
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                isGpsActive ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/20 text-amber-500'
              }`}>
                {isGpsActive ? 'LIVE GPS ONLINE' : 'ESTIMATED SATELLITE MODE'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-navy-400 mt-0.5">
              {address} • Current Speed: <span className="font-bold text-sky-400">{speedKmH} km/h</span>
            </p>
          </div>
        </div>

        {/* Dispatch Emergency Alert to Traffic Police Button */}
        <button
          onClick={handlePoliceAlertClick}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-red-600/40 active:scale-95 transition-all shrink-0"
        >
          <Siren className="w-4 h-4 animate-bounce" />
          Alert Traffic Police Control
        </button>
      </div>

      {/* Police Emergency Broadcast Response Alert Box */}
      {activeCorridorAlert && (
        <div className={`p-4 rounded-2xl border text-xs font-bold transition-all ${
          activeCorridorAlert.status === 'CORRIDOR_CLEARED'
            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-300'
            : 'bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-300'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              <span className="uppercase font-black tracking-wider">
                TRAFFIC POLICE DISPATCH BROADCAST: {activeCorridorAlert.status}
              </span>
            </div>
            <span className="text-[10px] opacity-75">{new Date(activeCorridorAlert.timestamp).toLocaleTimeString()}</span>
          </div>
          <p className="text-xs font-medium">{activeCorridorAlert.policeNote}</p>
        </div>
      )}

      {/* LEAFLET MAP CONTAINER */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl h-[480px]">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Live Floating Route Overlay */}
        {routeInfo && (
          <div className="absolute top-4 left-4 z-10 glass-strong p-3.5 rounded-2xl border border-white/20 shadow-xl max-w-xs space-y-1">
            <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800 dark:text-navy-100">
              <Navigation className="w-4 h-4 text-sky-500" />
              <span>OSRM Real-Time Route</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-black text-emerald-500 tabular-nums">{routeInfo.durationMins} MIN</span>
              <span className="text-xs font-bold text-slate-400 tabular-nums">({routeInfo.distanceKm} km)</span>
            </div>
            <p className="text-[11px] text-slate-400">Target: {hospitalName}</p>
          </div>
        )}

        {/* Live Traffic Signal Junctions Status Legend */}
        <div className="absolute bottom-4 right-4 z-10 glass-strong p-3 rounded-2xl border border-white/20 shadow-xl max-w-sm space-y-2 text-xs">
          <div className="font-extrabold text-slate-800 dark:text-navy-100 flex items-center justify-between">
            <span>Route Signals & Congestion</span>
            <span className="text-[10px] text-sky-400">3 Intersections</span>
          </div>
          <div className="space-y-1.5">
            {signals.map((sig) => (
              <div key={sig.id} className="flex items-center justify-between gap-3 text-[11px] bg-slate-100 dark:bg-navy-900/60 p-2 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    sig.status === 'POLICE_CLEARED' ? 'bg-emerald-500 animate-ping' : sig.status === 'RED' ? 'bg-red-500' : 'bg-amber-500'
                  }`} />
                  <span className="font-bold text-slate-700 dark:text-navy-200">{sig.name}</span>
                </div>
                <span className="font-extrabold text-slate-500 dark:text-navy-300">
                  {sig.status === 'POLICE_CLEARED' ? '🟢 FORCED GREEN' : `${sig.waitTimeSeconds}s WAIT`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
