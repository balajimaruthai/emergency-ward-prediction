import { memo } from 'react';
import { motion } from 'framer-motion';
import { Users, ArrowDownRight, ArrowUpRight, ArrowRightLeft, LogIn } from 'lucide-react';
import type { PatientFlow } from '@/lib/types';
import { LineChart } from '@/components/LineChart';

interface PatientFlowSectionProps {
  flow: PatientFlow;
}

export const PatientFlowSection = memo(function PatientFlowSection({ flow }: PatientFlowSectionProps) {
  const items = [
    { label: 'Arrivals', value: flow.arrivals, icon: LogIn, color: '#0EA5E9', prefix: '+' },
    { label: 'Admissions', value: flow.admissions, icon: ArrowDownRight, color: '#2563EB', prefix: '+' },
    { label: 'Discharges', value: flow.discharges, icon: ArrowUpRight, color: '#16A34A', prefix: '-' },
    { label: 'Transfers', value: flow.transfers, icon: ArrowRightLeft, color: '#475569', prefix: '+' },
  ];

  return (
    <div className="bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/8 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-5">
        <Users className="w-4 h-4 text-accent-500" />
        <h3 className="text-base font-semibold text-slate-800 dark:text-navy-100">
          Patient Flow
        </h3>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {items.map((item) => (
          <div key={item.label}>
            <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-navy-400 mb-1">
              <item.icon className="w-3.5 h-3.5" style={{ color: item.color }} />
              {item.label}
            </div>
            <motion.div
              key={item.value}
              initial={{ opacity: 0.5, y: -3 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-bold tabular-nums"
              style={{ color: item.color }}
            >
              {item.prefix}{item.value}
            </motion.div>
          </div>
        ))}
      </div>

      <div>
        <div className="text-xs text-slate-400 dark:text-navy-400 mb-2">
          Arrivals — Last 30 Minutes
        </div>
        <LineChart data={flow.arrivalsHistory} height={72} color="#0EA5E9" />
      </div>
    </div>
  );
});
