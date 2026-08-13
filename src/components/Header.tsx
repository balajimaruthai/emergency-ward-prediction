import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Settings, Moon, Sun, ChevronDown, X, AlertTriangle, Info, CheckCircle2, AlertCircle, LogOut, User as UserIcon } from 'lucide-react';
import type { ConnectionStatus, Ward } from '@/lib/types';
import { getWardStatus } from '@/lib/simulation';
import { formatRelativeTime } from '@/lib/format';
import { useTick } from '@/hooks/useTick';

interface HeaderProps {
  pageTitle: string;
  lastUpdated: number;
  status: ConnectionStatus;
  wards: Ward[];
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  userEmail?: string | null;
  onSignOut: () => void;
}

interface Alert {
  id: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
  title: string;
  message: string;
  timestamp: number;
}

export function Header({ pageTitle, lastUpdated, status, wards, theme, onToggleTheme, userEmail, onSignOut }: HeaderProps) {
  const now = useTick(1000);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const alerts = generateAlerts(wards, lastUpdated);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const statusConfig = getStatusConfig(status, now, lastUpdated);

  return (
    <header className="sticky top-0 z-20 glass border-b border-slate-200/60 dark:border-white/5 px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="hidden lg:block">
          <div className="text-sm font-bold text-slate-800 dark:text-navy-100 leading-tight">
            Emergency Ward Intelligence
          </div>
          <div className="text-[11px] text-slate-400 dark:text-navy-400 leading-tight">
            Emergency Operations Center
          </div>
        </div>
        <div className="hidden lg:block w-px h-8 bg-slate-200 dark:bg-white/10" />
        <div className="text-base font-semibold text-slate-700 dark:text-navy-200 truncate">
          {pageTitle}
        </div>
      </div>

      {/* Right: Status + Actions */}
      <div className="flex items-center gap-3">
        {/* Live indicator */}
        <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-navy-700/40 border border-slate-200/60 dark:border-white/5">
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: statusConfig.color }}
            />
            <span className="text-xs font-semibold" style={{ color: statusConfig.color }}>
              {statusConfig.label}
            </span>
          </div>
          <span className="text-xs text-slate-400 dark:text-navy-400 tabular-nums">
            {statusConfig.time}
          </span>
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-navy-200 hover:bg-slate-100 dark:hover:bg-navy-700/60 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {alerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-navy-800" />
            )}
          </button>
          <AnimatePresence>
            {notifOpen && (
              <NotificationCenter alerts={alerts} onClose={() => setNotifOpen(false)} />
            )}
          </AnimatePresence>
        </div>

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-navy-200 hover:bg-slate-100 dark:hover:bg-navy-700/60 transition-colors"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        {/* Settings */}
        <button className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-navy-200 hover:bg-slate-100 dark:hover:bg-navy-700/60 transition-colors">
          <Settings className="w-5 h-5" />
        </button>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2 pl-1 pr-2 h-9 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-700/60 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white text-xs font-bold">
              {userEmail ? userEmail[0].toUpperCase() : 'U'}
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 hidden sm:block transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-12 w-64 glass-strong rounded-xl shadow-float overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-700 dark:text-navy-200 truncate">
                      {userEmail ?? 'User'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={onSignOut}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

function getStatusConfig(status: ConnectionStatus, now: number, lastUpdated: number) {
  const relTime = formatRelativeTime(lastUpdated, now);
  switch (status) {
    case 'CONNECTED':
      return { label: 'LIVE', color: '#16A34A', time: `Updated ${relTime}` };
    case 'SIMULATION':
      return { label: 'SIMULATION', color: '#D97706', time: `Updated ${relTime}` };
    case 'DELAYED':
      return { label: 'DELAYED', color: '#D97706', time: `Updated ${relTime}` };
    case 'STALE':
      return { label: 'STALE', color: '#DC2626', time: `Last update ${relTime}` };
    case 'OFFLINE':
      return { label: 'OFFLINE', color: '#DC2626', time: `Last update ${relTime}` };
  }
}

function generateAlerts(wards: Ward[], lastUpdated: number): Alert[] {
  const alerts: Alert[] = [];
  for (const ward of wards) {
    const status = getWardStatus(ward.occupiedBeds, ward.totalBeds);
    const available = ward.totalBeds - ward.occupiedBeds;
    if (status === 'FULL') {
      alerts.push({
        id: `full-${ward.id}`,
        severity: 'critical',
        title: 'Capacity Alert',
        message: `${ward.name} is currently full. 0 beds available.`,
        timestamp: lastUpdated,
      });
    } else if (status === 'CRITICAL') {
      alerts.push({
        id: `critical-${ward.id}`,
        severity: 'critical',
        title: 'Critical Capacity',
        message: `${ward.name} has reached ${Math.round((ward.occupiedBeds / ward.totalBeds) * 100)}%. ${available} beds remaining.`,
        timestamp: lastUpdated,
      });
    } else if (status === 'HIGH') {
      alerts.push({
        id: `high-${ward.id}`,
        severity: 'warning',
        title: 'High Occupancy',
        message: `${ward.name} is at ${Math.round((ward.occupiedBeds / ward.totalBeds) * 100)}%. ${available} beds remaining.`,
        timestamp: lastUpdated,
      });
    }
  }
  if (alerts.length === 0) {
    alerts.push({
      id: 'all-ok',
      severity: 'success',
      title: 'All Clear',
      message: 'No critical capacity alerts. All wards are operating normally.',
      timestamp: lastUpdated,
    });
  }
  return alerts;
}

function NotificationCenter({ alerts, onClose }: { alerts: Alert[]; onClose: () => void }) {
  const severityConfig = {
    info: { icon: Info, color: '#2563EB', bg: '#EFF6FF' },
    warning: { icon: AlertTriangle, color: '#D97706', bg: '#FFFBEB' },
    critical: { icon: AlertCircle, color: '#DC2626', bg: '#FEF2F2' },
    success: { icon: CheckCircle2, color: '#16A34A', bg: '#F0FDF4' },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className="absolute right-0 top-12 w-80 glass-strong rounded-xl shadow-float overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/5">
        <span className="text-sm font-semibold text-slate-700 dark:text-navy-200">
          Notifications
        </span>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-navy-200">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {alerts.map((alert) => {
          const cfg = severityConfig[alert.severity];
          const Icon = cfg.icon;
          return (
            <div
              key={alert.id}
              className="flex gap-3 px-4 py-3 border-b border-slate-50 dark:border-white/5 last:border-0"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: cfg.bg }}
              >
                <Icon className="w-4 h-4" style={{ color: cfg.color }} />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-700 dark:text-navy-200">
                  {alert.title}
                </div>
                <div className="text-xs text-slate-400 dark:text-navy-400 mt-0.5">
                  {alert.message}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
