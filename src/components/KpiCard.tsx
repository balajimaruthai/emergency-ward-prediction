import { memo } from 'react';
import { motion } from 'framer-motion';
import { Bed, ArrowUp, ArrowDown } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string | number;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  icon: typeof Bed;
  emphasis?: boolean;
  changed?: boolean;
}

export const KpiCard = memo(function KpiCard({
  label,
  value,
  trend,
  trendDirection = 'neutral',
  icon: Icon,
  emphasis = false,
  changed = false,
}: KpiCardProps) {
  const TrendIcon = trendDirection === 'up' ? ArrowUp : trendDirection === 'down' ? ArrowDown : null;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border p-5 transition-all duration-200 ${
        emphasis
          ? 'bg-gradient-to-br from-white to-emerald-50/50 dark:from-navy-800 dark:to-navy-800/50 border-emerald-200 dark:border-emerald-500/20'
          : 'bg-white dark:bg-navy-800 border-slate-200 dark:border-white/8'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium text-slate-400 dark:text-navy-400 uppercase tracking-wider">
          {label}
        </span>
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            emphasis
              ? 'bg-emerald-100 dark:bg-emerald-500/10'
              : 'bg-slate-50 dark:bg-navy-700/60'
          }`}
        >
          <Icon
            className={`w-4 h-4 ${
              emphasis ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-navy-300'
            }`}
          />
        </div>
      </div>
      <motion.div
        key={String(value)}
        initial={changed ? { opacity: 0.4, y: -6 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`text-3xl font-bold tabular-nums ${
          emphasis ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-800 dark:text-navy-100'
        }`}
      >
        {value}
      </motion.div>
      {trend && (
        <div className="flex items-center gap-1 mt-2 text-xs">
          {TrendIcon && (
            <TrendIcon
              className={`w-3 h-3 ${
                trendDirection === 'up'
                  ? 'text-emerald-500'
                  : trendDirection === 'down'
                    ? 'text-red-500'
                    : 'text-slate-400'
              }`}
            />
          )}
          <span className="text-slate-400 dark:text-navy-400">{trend}</span>
        </div>
      )}
    </div>
  );
});
