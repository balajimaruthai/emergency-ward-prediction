import {
  HeartPulse,
  Activity,
  Hospital,
  ShieldAlert,
  Baby,
  type LucideIcon,
} from 'lucide-react';
import type { WardIconKey } from '@/lib/types';

const ICON_MAP: Record<WardIconKey, LucideIcon> = {
  HeartPulse,
  Activity,
  Hospital,
  ShieldAlert,
  Baby,
};

export function WardIcon({ iconKey, className }: { iconKey: WardIconKey; className?: string }) {
  const Icon = ICON_MAP[iconKey];
  return <Icon className={className} />;
}
