import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import type { Ward, WardFilter, SortMode } from '@/lib/types';
import { getWardStatus, STATUS_PRIORITY } from '@/lib/simulation';
import { WardRow } from '@/components/WardRow';

interface WardCapacityProps {
  wards: Ward[];
  changedWardIds: string[];
  onWardClick: (ward: Ward) => void;
}

const FILTERS: WardFilter[] = ['ALL', 'AVAILABLE', 'MODERATE', 'HIGH', 'CRITICAL', 'FULL'];
const SORT_MODES: { label: string; value: SortMode }[] = [
  { label: 'Urgency', value: 'URGENCY' },
  { label: 'A-Z', value: 'ALPHABETICAL' },
  { label: 'Most Available', value: 'MOST_AVAILABLE' },
];

export function WardCapacity({ wards, changedWardIds, onWardClick }: WardCapacityProps) {
  const [filter, setFilter] = useState<WardFilter>('ALL');
  const [sort, setSort] = useState<SortMode>('URGENCY');

  const fullWards = wards.filter((w) => getWardStatus(w.occupiedBeds, w.totalBeds) === 'FULL');

  const sortedFiltered = useMemo(() => {
    let result = [...wards];

    if (filter !== 'ALL') {
      result = result.filter((w) => getWardStatus(w.occupiedBeds, w.totalBeds) === filter);
    }

    switch (sort) {
      case 'URGENCY':
        result.sort((a, b) => {
          const sa = STATUS_PRIORITY[getWardStatus(a.occupiedBeds, a.totalBeds)];
          const sb = STATUS_PRIORITY[getWardStatus(b.occupiedBeds, b.totalBeds)];
          if (sa !== sb) return sa - sb;
          return (b.occupiedBeds / b.totalBeds) - (a.occupiedBeds / a.totalBeds);
        });
        break;
      case 'ALPHABETICAL':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'MOST_AVAILABLE':
        result.sort((a, b) => (b.totalBeds - b.occupiedBeds) - (a.totalBeds - a.occupiedBeds));
        break;
    }

    return result;
  }, [wards, filter, sort]);

  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-navy-100">
            Ward Capacity
          </h2>
          <p className="text-sm text-slate-400 dark:text-navy-400 mt-0.5">
            Current availability across emergency units
          </p>
        </div>

        {/* Segmented filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-0.5 p-1 bg-slate-100 dark:bg-navy-700/40 rounded-lg">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`relative px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  filter === f
                    ? 'text-slate-700 dark:text-navy-100'
                    : 'text-slate-400 dark:text-navy-400 hover:text-slate-600 dark:hover:text-navy-200'
                }`}
              >
                {filter === f && (
                  <motion.div
                    layoutId="filter-active"
                    className="absolute inset-0 bg-white dark:bg-navy-800 rounded-md shadow-sm"
                    transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  />
                )}
                <span className="relative z-10">{f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}</span>
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-0.5 p-1 bg-slate-100 dark:bg-navy-700/40 rounded-lg">
            {SORT_MODES.map((m) => (
              <button
                key={m.value}
                onClick={() => setSort(m.value)}
                className={`relative px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  sort === m.value
                    ? 'text-slate-700 dark:text-navy-100'
                    : 'text-slate-400 dark:text-navy-400 hover:text-slate-600 dark:hover:text-navy-200'
                }`}
              >
                {sort === m.value && (
                  <motion.div
                    layoutId="sort-active"
                    className="absolute inset-0 bg-white dark:bg-navy-800 rounded-md shadow-sm"
                    transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  />
                )}
                <span className="relative z-10">{m.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Full ward alert */}
      <AnimatePresence>
        {fullWards.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-start gap-3 px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-red-700 dark:text-red-400">
                  Capacity Alert
                </div>
                <div className="text-sm text-red-600 dark:text-red-400/80 mt-0.5">
                  {fullWards.map((w) => w.name).join(' & ')} {fullWards.length === 1 ? 'is' : 'are'} currently full. 0 beds available.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ward list */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {sortedFiltered.map((ward) => (
            <motion.div
              key={ward.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <WardRow
                ward={ward}
                changed={changedWardIds.includes(ward.id)}
                onClick={() => onWardClick(ward)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        {sortedFiltered.length === 0 && (
          <div className="text-center py-8 text-sm text-slate-400 dark:text-navy-400">
            No wards match this filter.
          </div>
        )}
      </div>
    </div>
  );
}
