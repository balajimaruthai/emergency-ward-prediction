import { memo } from 'react';
import { motion } from 'framer-motion';
import type { Ward } from '@/lib/types';
import { getWardStatus } from '@/lib/simulation';
import { WardIcon } from './WardIcon';
import { OccupancyBar } from './OccupancyBar';
import { StatusBadge } from './StatusBadge';

interface WardRowProps {
  ward: Ward;
  changed?: boolean;
  onClick: () => void;
}

export const WardRow = memo(function WardRow({ ward, changed, onClick }: WardRowProps) {
  const status = getWardStatus(ward.occupiedBeds, ward.totalBeds);
  const available = ward.totalBeds - ward.occupiedBeds;

  return (
    <motion.button
      layout
      onClick={onClick}
      className="group w-full flex items-center gap-4 px-4 py-4 bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/8 rounded-xl hover:border-slate-300 dark:hover:border-white/15 hover:shadow-panel-hover transition-all duration-200 text-left"
      whileHover={{ y: -1 }}
    >
      {/* Icon + Name */}
      <div className="flex items-center gap-3 w-48 min-w-0 shrink-0">
        <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-navy-700/60 flex items-center justify-center shrink-0">
          <WardIcon
            iconKey={ward.icon}
            className="w-5 h-5 text-slate-500 dark:text-navy-300"
          />
        </div>
        <div className="min-w-0">
          <div className="text-[15px] font-semibold text-slate-800 dark:text-navy-100 truncate">
            {ward.name}
          </div>
          <div className="text-xs text-slate-400 dark:text-navy-400 mt-0.5">
            {ward.shortName}
          </div>
        </div>
      </div>

      {/* Occupancy Bar */}
      <div className="flex-1 min-w-0 px-2">
        <OccupancyBar
          occupied={ward.occupiedBeds}
          total={ward.totalBeds}
          status={status}
        />
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 shrink-0">
        <div className="text-right">
          <div className="text-sm font-semibold tabular-nums text-slate-700 dark:text-navy-200">
            {ward.occupiedBeds} / {ward.totalBeds}
          </div>
          <div className="text-xs text-slate-400 dark:text-navy-400 mt-0.5">
            occupied
          </div>
        </div>
        <div className="text-right min-w-[72px]">
          <motion.div
            key={available}
            initial={changed ? { opacity: 0.5, y: -4 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-xl font-bold tabular-nums text-slate-800 dark:text-navy-100"
          >
            {available}
          </motion.div>
          <div className="text-xs text-slate-400 dark:text-navy-400 mt-0.5">
            available
          </div>
        </div>
        <div className="w-24 flex justify-end">
          <StatusBadge status={status} />
        </div>
      </div>
    </motion.button>
  );
});
