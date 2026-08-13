import { memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Clock, TrendingUp, Activity, Users } from 'lucide-react';
import type { Ward } from '@/lib/types';
import { getWardStatus } from '@/lib/simulation';
import { occupancyRate, formatTime, getStatusColor } from '@/lib/format';
import { WardIcon } from './WardIcon';
import { StatusBadge } from './StatusBadge';
import { OccupancyBar } from './OccupancyBar';
import { LineChart } from './LineChart';

interface WardDetailDrawerProps {
  ward: Ward | null;
  lastUpdated: number;
  onClose: () => void;
}

export const WardDetailDrawer = memo(function WardDetailDrawer({
  ward,
  lastUpdated,
  onClose,
}: WardDetailDrawerProps) {
  return (
    <AnimatePresence>
      {ward && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md glass-strong shadow-float z-50 overflow-y-auto"
          >
            <DrawerContent ward={ward} lastUpdated={lastUpdated} onClose={onClose} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

function DrawerContent({
  ward,
  lastUpdated,
  onClose,
}: {
  ward: Ward;
  lastUpdated: number;
  onClose: () => void;
}) {
  const status = getWardStatus(ward.occupiedBeds, ward.totalBeds);
  const rate = occupancyRate(ward.occupiedBeds, ward.totalBeds);
  const available = ward.totalBeds - ward.occupiedBeds;
  const colors = getStatusColor(status);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-navy-700/60 flex items-center justify-center">
            <WardIcon iconKey={ward.icon} className="w-6 h-6 text-slate-500 dark:text-navy-300" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-navy-100">{ward.name}</h2>
            <p className="text-sm text-slate-400 dark:text-navy-400 mt-0.5">{ward.shortName}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-navy-200 hover:bg-slate-100 dark:hover:bg-navy-700/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Summary */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="text-3xl font-bold tabular-nums text-slate-800 dark:text-navy-100">
            {ward.occupiedBeds} <span className="text-lg text-slate-400">/ {ward.totalBeds}</span>
          </div>
          <div className="text-sm text-slate-400 dark:text-navy-400 mt-1">occupied beds</div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold tabular-nums" style={{ color: colors.text }}>
            {available}
          </div>
          <div className="text-sm text-slate-400 dark:text-navy-400 mt-1">available</div>
        </div>
        <StatusBadge status={status} size="md" />
      </div>

      {/* Occupancy */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-600 dark:text-navy-300">Occupancy</span>
          <span className="font-semibold tabular-nums text-slate-700 dark:text-navy-200">
            {rate.toFixed(1)}%
          </span>
        </div>
        <OccupancyBar occupied={ward.occupiedBeds} total={ward.totalBeds} status={status} />
      </div>

      {/* Last 24 Hours */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-navy-300">
          <Activity className="w-4 h-4" />
          Occupancy — Last 24 Hours
        </div>
        <div className="bg-slate-50 dark:bg-navy-700/40 rounded-xl p-4">
          <LineChart
            data={ward.occupancyHistory.map((r) => r * 100)}
            height={100}
            color={colors.dot}
            maxOverride={100}
          />
        </div>
      </div>

      {/* Patient Flow */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-navy-300">
          <Users className="w-4 h-4" />
          Patient Arrivals — Last 30 Minutes
        </div>
        <div className="bg-slate-50 dark:bg-navy-700/40 rounded-xl p-4">
          <LineChart data={ward.arrivalsHistory} height={80} color="#0EA5E9" />
        </div>
      </div>

      {/* Prediction */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-navy-300">
          <TrendingUp className="w-4 h-4" />
          Predicted Occupancy — Next 4 Hours
        </div>
        <div className="bg-slate-50 dark:bg-navy-700/40 rounded-xl p-4">
          <LineChart
            data={[...ward.occupancyHistory.slice(-20).map((r) => r * 100), rate, rate * 0.98, rate * 1.02, rate * 0.95]}
            height={80}
            color="#D97706"
            maxOverride={100}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-navy-400 pt-4 border-t border-slate-100 dark:border-white/5">
        <Clock className="w-3.5 h-3.5" />
        Last updated {formatTime(lastUpdated)}
      </div>
    </div>
  );
}
