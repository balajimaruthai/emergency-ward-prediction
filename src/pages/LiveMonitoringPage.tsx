import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radio,
  Filter,
  ArrowUpDown,
  BedSingle,
  Users,
  TrendingUp,
  Activity,
  ArrowRight,
  AlertTriangle,
  Grid3x3,
} from 'lucide-react';
import { useRealtimeContext } from '@/hooks/realtimeContext';
import { useTick } from '@/hooks/useTick';
import { occupancyRate, formatRelativeTime } from '@/lib/format';
import { getWardStatus, STATUS_PRIORITY } from '@/lib/simulation';
import { WardIcon } from '@/components/WardIcon';
import { OccupancyBar } from '@/components/OccupancyBar';
import { StatusBadge } from '@/components/StatusBadge';
import { LineChart } from '@/components/LineChart';
import { WardDetailDrawer } from '@/components/WardDetailDrawer';
import type { Ward, WardFilter, SortMode, WardStatus } from '@/lib/types';

const FILTERS: { label: string; value: WardFilter }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Available', value: 'AVAILABLE' },
  { label: 'Moderate', value: 'MODERATE' },
  { label: 'High', value: 'HIGH' },
  { label: 'Critical', value: 'CRITICAL' },
  { label: 'Full', value: 'FULL' },
];

const SORTS: { label: string; value: SortMode }[] = [
  { label: 'Urgency', value: 'URGENCY' },
  { label: 'A–Z', value: 'ALPHABETICAL' },
  { label: 'Most Available', value: 'MOST_AVAILABLE' },
];

const STATUS_TO_FILTER: Record<WardStatus, WardFilter> = {
  AVAILABLE: 'AVAILABLE',
  MODERATE: 'MODERATE',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
  FULL: 'FULL',
};

export function LiveMonitoringPage() {
  const { data, status, lastUpdated, changedWardIds } = useRealtimeContext();
  const now = useTick(1000);
  const [filter, setFilter] = useState<WardFilter>('ALL');
  const [sort, setSort] = useState<SortMode>('URGENCY');
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);

  const filtered = data.wards
    .filter((w) => filter === 'ALL' || STATUS_TO_FILTER[getWardStatus(w.occupiedBeds, w.totalBeds)] === filter)
    .sort((a, b) => {
      if (sort === 'URGENCY') {
        const sa = STATUS_PRIORITY[getWardStatus(a.occupiedBeds, a.totalBeds)];
        const sb = STATUS_PRIORITY[getWardStatus(b.occupiedBeds, b.totalBeds)];
        return sa - sb;
      }
      if (sort === 'ALPHABETICAL') return a.name.localeCompare(b.name);
      // MOST_AVAILABLE — descending available beds
      return (b.totalBeds - b.occupiedBeds) - (a.totalBeds - a.occupiedBeds);
    });

  const liveSelectedWard = selectedWard
    ? data.wards.find((w) => w.id === selectedWard.id) ?? null
    : null;

  const fullCount = data.wards.filter((w) => w.occupiedBeds >= w.totalBeds).length;
  const criticalCount = data.wards.filter((w) => {
    const s = getWardStatus(w.occupiedBeds, w.totalBeds);
    return s === 'CRITICAL';
  }).length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Radio className="w-5 h-5 text-accent-500" />
            <h1 className="text-2xl font-bold text-slate-800 dark:text-navy-100 tracking-tight">
              Live Monitoring
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-navy-400">
            Real-time ward-by-ward monitoring and capacity heatmap.
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: status === 'SIMULATION' ? '#D97706' : '#16A34A' }}
            />
            <span className="text-slate-500 dark:text-navy-400">
              {status === 'SIMULATION' ? 'Simulation Mode' : 'Live'}
            </span>
          </div>
          <span className="text-slate-300 dark:text-navy-500">|</span>
          <span className="text-slate-400 dark:text-navy-400 tabular-nums">
            {formatRelativeTime(lastUpdated, now)}
          </span>
        </div>
      </div>

      {/* Alert banner */}
      <AnimatePresence>
        {(fullCount > 0 || criticalCount > 0) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-500/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4 text-red-500" />
              </div>
              <div className="text-sm">
                <span className="font-semibold text-red-600 dark:text-red-400">
                  {fullCount > 0 && `${fullCount} ward${fullCount > 1 ? 's' : ''} at full capacity`}
                  {fullCount > 0 && criticalCount > 0 && ' · '}
                  {criticalCount > 0 && `${criticalCount} ward${criticalCount > 1 ? 's' : ''} critical`}
                </span>
                <span className="text-red-500/70 dark:text-red-400/70 ml-2">
                  Immediate action required.
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Heatmap matrix */}
      <HeatmapMatrix wards={data.wards} onWardClick={setSelectedWard} />

      {/* Filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter className="w-4 h-4 text-slate-400 dark:text-navy-400 mr-1" />
          {FILTERS.map((f) => (
            <FilterChip
              key={f.value}
              label={f.label}
              active={filter === f.value}
              onClick={() => setFilter(f.value)}
            />
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="w-4 h-4 text-slate-400 dark:text-navy-400 mr-1" />
          {SORTS.map((s) => (
            <FilterChip
              key={s.value}
              label={s.label}
              active={sort === s.value}
              onClick={() => setSort(s.value)}
            />
          ))}
        </div>
      </div>

      {/* Ward monitoring cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((ward) => {
          const wardStatus = getWardStatus(ward.occupiedBeds, ward.totalBeds);
          const rate = occupancyRate(ward.occupiedBeds, ward.totalBeds);
          const available = ward.totalBeds - ward.occupiedBeds;
          const changed = changedWardIds.includes(ward.id);

          return (
            <motion.div
              key={ward.id}
              layout
              onClick={() => setSelectedWard(ward)}
              className="group bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/8 rounded-2xl p-5 cursor-pointer hover:border-slate-300 dark:hover:border-white/15 hover:shadow-md transition-all duration-200"
            >
              {/* Header row */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-navy-700/60 flex items-center justify-center">
                    <WardIcon iconKey={ward.icon} className="w-5 h-5 text-slate-500 dark:text-navy-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-navy-100 leading-tight">
                      {ward.name}
                    </h3>
                    <span className="text-xs text-slate-400 dark:text-navy-400">{ward.shortName}</span>
                  </div>
                </div>
                <StatusBadge status={wardStatus} />
              </div>

              {/* Occupancy bar */}
              <div className="mb-4">
                <OccupancyBar occupied={ward.occupiedBeds} total={ward.totalBeds} status={wardStatus} />
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <StatTile icon={BedSingle} label="Available" value={available} highlight={available > 0 ? 'emerald' : 'red'} changed={changed} />
                <StatTile icon={Users} label="Occupied" value={ward.occupiedBeds} />
                <StatTile icon={Activity} label="Total" value={ward.totalBeds} />
              </div>

              {/* Mini chart */}
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-navy-400 mb-1">
                    <TrendingUp className="w-3 h-3" />
                    Occupancy trend
                  </div>
                  <LineChart
                    data={ward.occupancyHistory.slice(-20)}
                    height={40}
                    color={rate >= 95 ? '#DC2626' : rate >= 80 ? '#D97706' : rate >= 70 ? '#2563EB' : '#16A34A'}
                    showArea
                    strokeWidth={2}
                  />
                </div>
                <button className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-xs text-accent-500 font-medium transition-opacity">
                  Details
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-navy-700/60 flex items-center justify-center mb-3">
            <Filter className="w-6 h-6 text-slate-300 dark:text-navy-500" />
          </div>
          <p className="text-sm text-slate-400 dark:text-navy-400">
            No wards match this filter.
          </p>
        </div>
      )}

      <WardDetailDrawer
        ward={liveSelectedWard}
        lastUpdated={lastUpdated}
        onClose={() => setSelectedWard(null)}
      />
    </div>
  );
}

/* ---------- Heatmap Matrix ---------- */

function HeatmapMatrix({ wards, onWardClick }: { wards: Ward[]; onWardClick: (w: Ward) => void }) {
  return (
    <div className="bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/8 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Grid3x3 className="w-4 h-4 text-slate-400 dark:text-navy-400" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-navy-100">
            Capacity Heatmap
          </h3>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-navy-400">
          <LegendDot color="#16A34A" label="Available" />
          <LegendDot color="#2563EB" label="Moderate" />
          <LegendDot color="#D97706" label="High" />
          <LegendDot color="#DC2626" label="Critical/Full" />
        </div>
      </div>

      <div className="space-y-3">
        {wards.map((ward) => {
          const status = getWardStatus(ward.occupiedBeds, ward.totalBeds);
          const cellColor =
            status === 'FULL' || status === 'CRITICAL' ? '#DC2626'
              : status === 'HIGH' ? '#D97706'
              : status === 'MODERATE' ? '#2563EB'
              : '#16A34A';

          return (
            <div
              key={ward.id}
              className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-navy-700/30 rounded-lg p-1 -m-1 transition-colors"
              onClick={() => onWardClick(ward)}
            >
              <div className="w-24 shrink-0 flex items-center gap-2">
                <WardIcon iconKey={ward.icon} className="w-4 h-4 text-slate-400 dark:text-navy-400" />
                <span className="text-xs font-medium text-slate-600 dark:text-navy-300">
                  {ward.shortName}
                </span>
              </div>
              <div className="flex-1 flex gap-0.5">
                {Array.from({ length: ward.totalBeds }).map((_, i) => {
                  const occupied = i < ward.occupiedBeds;
                  return (
                    <motion.div
                      key={i}
                      initial={false}
                      animate={{
                        backgroundColor: occupied ? cellColor : 'rgba(148,163,184,0.12)',
                        opacity: occupied ? 0.85 : 0.4,
                      }}
                      transition={{ duration: 0.3 }}
                      className="flex-1 h-6 rounded-sm min-w-[6px]"
                      style={{
                        maxWidth: '14px',
                      }}
                    />
                  );
                })}
              </div>
              <div className="w-16 shrink-0 text-right">
                <span className="text-xs font-semibold tabular-nums text-slate-600 dark:text-navy-300">
                  {ward.occupiedBeds}/{ward.totalBeds}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Small components ---------- */

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
        active
          ? 'bg-accent-600 text-white shadow-sm'
          : 'bg-slate-100 dark:bg-navy-700/50 text-slate-500 dark:text-navy-400 hover:bg-slate-200 dark:hover:bg-navy-700'
      }`}
    >
      {label}
    </button>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  highlight,
  changed,
}: {
  icon: typeof BedSingle;
  label: string;
  value: number;
  highlight?: 'emerald' | 'red';
  changed?: boolean;
}) {
  const valueColor =
    highlight === 'emerald' ? 'text-emerald-600 dark:text-emerald-400'
      : highlight === 'red' ? 'text-red-500'
      : 'text-slate-800 dark:text-navy-100';

  return (
    <div className="bg-slate-50 dark:bg-navy-700/40 rounded-lg p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-3 h-3 text-slate-400 dark:text-navy-400" />
        <span className="text-[10px] font-medium text-slate-400 dark:text-navy-400 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <motion.span
        key={changed ? value : `static-${value}`}
        initial={changed ? { opacity: 0.4, y: -4 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`text-xl font-bold tabular-nums ${valueColor}`}
      >
        {value}
      </motion.span>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
      <span>{label}</span>
    </div>
  );
}


