import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import type { ConnectionStatus } from '@/lib/types';
import { getRushLabel } from '@/lib/format';
import { formatRelativeTime } from '@/lib/format';
import { useTick } from '@/hooks/useTick';

interface HeroSectionProps {
  rushScore: number;
  status: ConnectionStatus;
  lastUpdated: number;
}

export function HeroSection({ rushScore, status, lastUpdated }: HeroSectionProps) {
  const now = useTick(1000);
  const rush = getRushLabel(rushScore);
  const statusColor =
    rush.status === 'CRITICAL' ? '#DC2626'
      : rush.status === 'HIGH' ? '#D97706'
      : rush.status === 'MODERATE' ? '#2563EB'
      : '#16A34A';

  const statusLabel = status === 'SIMULATION' ? 'Simulation / Historical Data Mode' : 'Live Data';

  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
      <div className="space-y-3">
        <h1 className="text-3xl lg:text-[32px] font-bold text-slate-800 dark:text-navy-100 tracking-tight leading-tight">
          Emergency Capacity
        </h1>
        <p className="text-base text-slate-500 dark:text-navy-400 max-w-xl leading-relaxed">
          Real-time overview of emergency ward availability and operational pressure.
        </p>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: status === 'SIMULATION' ? '#D97706' : '#16A34A',
              }}
            />
            <span className="text-slate-500 dark:text-navy-400">{statusLabel}</span>
          </div>
          <span className="text-slate-300 dark:text-navy-500">|</span>
          <span className="text-slate-400 dark:text-navy-400 tabular-nums">
            Updated {formatRelativeTime(lastUpdated, now)}
          </span>
        </div>
      </div>

      {/* Rush Score — visually secondary */}
      <div className="glass rounded-2xl px-6 py-5 flex items-center gap-5 shrink-0">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 dark:text-navy-400 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Emergency Rush Score
          </div>
          <div className="flex items-baseline gap-2">
            <motion.span
              key={rushScore}
              initial={{ opacity: 0.4, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-4xl font-bold tabular-nums"
              style={{ color: statusColor }}
            >
              {rushScore}
            </motion.span>
            <span
              className="text-sm font-semibold"
              style={{ color: statusColor }}
            >
              {rush.label}
            </span>
          </div>
          <div className="text-xs text-slate-400 dark:text-navy-400 mt-0.5">
            Emergency Demand
          </div>
        </div>
        {/* Mini gauge */}
        <div className="relative w-14 h-14 shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle
              cx="18" cy="18" r="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-slate-100 dark:text-navy-700"
            />
            <motion.circle
              cx="18" cy="18" r="15"
              fill="none"
              stroke={statusColor}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${(rushScore / 100) * 94.2} 94.2`}
              initial={{ strokeDasharray: '0 94.2' }}
              animate={{ strokeDasharray: `${(rushScore / 100) * 94.2} 94.2` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
