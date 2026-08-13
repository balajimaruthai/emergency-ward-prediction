import type { WardStatus } from './types';

export function formatRelativeTime(timestamp: number, now: number): string {
  const diffSec = Math.max(0, Math.floor((now - timestamp) / 1000));
  if (diffSec < 1) return 'just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  const min = Math.floor(diffSec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  return `${hr}h ago`;
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export function occupancyRate(occupied: number, total: number): number {
  return total > 0 ? (occupied / total) * 100 : 0;
}

export function getOccupancyColor(rate: number): string {
  if (rate >= 95) return '#DC2626';
  if (rate >= 80) return '#D97706';
  if (rate >= 70) return '#2563EB';
  return '#16A34A';
}

export function getStatusColor(status: WardStatus): {
  text: string;
  bg: string;
  border: string;
  dot: string;
} {
  switch (status) {
    case 'AVAILABLE':
      return { text: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0', dot: '#16A34A' };
    case 'MODERATE':
      return { text: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE', dot: '#2563EB' };
    case 'HIGH':
      return { text: '#D97706', bg: '#FFFBEB', border: '#FDE68A', dot: '#D97706' };
    case 'CRITICAL':
      return { text: '#DC2626', bg: '#FEF2F2', border: '#FECACA', dot: '#DC2626' };
    case 'FULL':
      return { text: '#DC2626', bg: '#FEF2F2', border: '#FCA5A5', dot: '#DC2626' };
  }
}

export function getRushLabel(score: number): { label: string; status: WardStatus } {
  if (score >= 90) return { label: 'CRITICAL', status: 'CRITICAL' };
  if (score >= 75) return { label: 'HIGH', status: 'HIGH' };
  if (score >= 50) return { label: 'MODERATE', status: 'MODERATE' };
  return { label: 'LOW', status: 'AVAILABLE' };
}
