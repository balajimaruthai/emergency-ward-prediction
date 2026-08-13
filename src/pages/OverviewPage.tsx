import { useState } from 'react';
import { useRealtimeContext } from '@/hooks/realtimeContext';
import { occupancyRate } from '@/lib/format';
import type { Ward } from '@/lib/types';
import { HeroSection } from '@/components/sections/HeroSection';
import { KpiRow } from '@/components/sections/KpiRow';
import { WardCapacity } from '@/components/sections/WardCapacity';
import { AvailableNowPanel } from '@/components/sections/AvailableNowPanel';
import { CapacityWatchPanel } from '@/components/sections/CapacityWatchPanel';
import { PatientFlowSection } from '@/components/sections/PatientFlowSection';
import { ForecastSection } from '@/components/sections/ForecastSection';
import { WardDetailDrawer } from '@/components/WardDetailDrawer';
import { Bed, HeartPulse, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export function OverviewPage() {
  const { data, status, lastUpdated, changedWardIds } = useRealtimeContext();
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);

  const totalBeds = data.wards.reduce((s, w) => s + w.totalBeds, 0);
  const occupied = data.wards.reduce((s, w) => s + w.occupiedBeds, 0);
  const available = totalBeds - occupied;
  const rate = occupancyRate(occupied, totalBeds);

  const liveSelectedWard = selectedWard
    ? data.wards.find((w) => w.id === selectedWard.id) ?? null
    : null;

  return (
    <div className="space-y-8">
      <HeroSection
        rushScore={data.rushScore}
        status={status}
        lastUpdated={lastUpdated}
      />

      <KpiRow
        totalBeds={totalBeds}
        occupied={occupied}
        available={available}
        occupancyRate={rate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WardCapacity
            wards={data.wards}
            changedWardIds={changedWardIds}
            onWardClick={setSelectedWard}
          />
        </div>
        <div className="space-y-6">
          <AvailableNowPanel wards={data.wards} />
          <CapacityWatchPanel wards={data.wards} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PatientFlowSection flow={data.patientFlow} />
        </div>
        <div className="lg:col-span-1">
          <ResourcePressureSection wards={data.wards} />
        </div>
      </div>

      <ForecastSection forecast={data.forecast} />

      <WardDetailDrawer
        ward={liveSelectedWard}
        lastUpdated={lastUpdated}
        onClose={() => setSelectedWard(null)}
      />
    </div>
  );
}

function ResourcePressureSection({ wards }: { wards: Ward[] }) {
  const totalBeds = wards.reduce((s, w) => s + w.totalBeds, 0);
  const occupied = wards.reduce((s, w) => s + w.occupiedBeds, 0);
  const bedPressure = totalBeds > 0 ? Math.round((occupied / totalBeds) * 100) : 0;

  const icu = wards.find((w) => w.id === 'icu');
  const icuPressure = icu ? Math.round((icu.occupiedBeds / icu.totalBeds) * 100) : 0;

  const waitingPressure = Math.min(100, Math.round(bedPressure * 0.92 + 5));

  const cards = [
    { label: 'Bed Pressure', value: bedPressure, icon: Bed, color: '#0EA5E9' },
    { label: 'ICU Pressure', value: icuPressure, icon: HeartPulse, color: '#DC2626' },
    { label: 'Waiting Pressure', value: waitingPressure, icon: Clock, color: '#D97706' },
  ];

  return (
    <div className="bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/8 rounded-2xl p-5 h-full">
      <h3 className="text-base font-semibold text-slate-800 dark:text-navy-100 mb-5">
        Resource Pressure
      </h3>
      <div className="space-y-4">
        {cards.map((c) => (
          <div key={c.label}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <c.icon className="w-4 h-4" style={{ color: c.color }} />
                <span className="text-sm font-medium text-slate-600 dark:text-navy-300">
                  {c.label}
                </span>
              </div>
              <motion.span
                key={c.value}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-lg font-bold tabular-nums"
                style={{ color: c.color }}
              >
                {c.value}%
              </motion.span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 dark:bg-navy-700/50 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: c.color }}
                initial={false}
                animate={{ width: `${c.value}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
