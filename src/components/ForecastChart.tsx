import { memo } from 'react';
import type { ForecastPoint } from '@/lib/types';
import { getOccupancyColor } from '@/lib/format';

interface ForecastChartProps {
  data: ForecastPoint[];
  height?: number;
  className?: string;
}

export const ForecastChart = memo(function ForecastChart({
  data,
  height = 140,
  className = '',
}: ForecastChartProps) {
  if (data.length < 2) return null;

  const width = 100;
  const maxDemand = Math.max(...data.map((d) => d.demand), 1);
  const stepX = width / (data.length - 1);

  const points = data.map((d, i) => ({
    x: i * stepX,
    y: height - (d.demand / maxDemand) * (height - 20) - 10,
    demand: d.demand,
    label: d.label,
    risk: d.risk,
  }));

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(' ');

  const areaPath =
    `M 0 ${height} ` +
    points.map((p) => `L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ') +
    ` L ${width} ${height} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={`w-full ${className}`}
      style={{ height: `${height}px` }}
    >
      <defs>
        <linearGradient id="forecast-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0EA5E9" stopOpacity={0.15} />
          <stop offset="100%" stopColor="#0EA5E9" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#forecast-grad)" />
      <path
        d={linePath}
        fill="none"
        stroke="#0EA5E9"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {points.map((p, i) => {
        if (i % 4 !== 0) return null;
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={1.5}
            fill={getOccupancyColor((p.demand / 48) * 100)}
            vectorEffect="non-scaling-stroke"
          />
        );
      })}
    </svg>
  );
});
