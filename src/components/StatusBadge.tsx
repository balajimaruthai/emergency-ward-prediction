import { memo } from 'react';
import type { WardStatus } from '@/lib/types';
import { getStatusColor } from '@/lib/format';

interface StatusBadgeProps {
  status: WardStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge = memo(function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const colors = getStatusColor(status);
  const padding = size === 'sm' ? 'px-2.5 py-1' : 'px-3 py-1.5';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${padding} ${textSize}`}
      style={{
        color: colors.text,
        backgroundColor: colors.bg,
        border: `1px solid ${colors.border}`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: colors.dot }}
      />
      {status === 'FULL' ? 'FULL' : status}
    </span>
  );
});
