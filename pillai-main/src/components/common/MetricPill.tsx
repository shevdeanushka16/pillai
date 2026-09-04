import React from 'react';

interface MetricPillProps {
  status: 'NORMAL' | 'MODERATE' | 'HIGH' | 'CRITICAL' | 'AVAILABLE' | 'LOW';
  label?: string;
  size?: 'sm' | 'md';
}

export const MetricPill: React.FC<MetricPillProps> = ({ status, label, size = 'md' }) => {
  const text = label || status;

  let colorClasses = 'bg-safe-subtle text-safe-text border-safe/30';
  let dotColor = 'bg-safe';

  switch (status) {
    case 'CRITICAL':
      colorClasses = 'bg-critical-subtle text-critical-text border-critical/30';
      dotColor = 'bg-critical';
      break;
    case 'HIGH':
      colorClasses = 'bg-high-subtle text-high-text border-high/30';
      dotColor = 'bg-high';
      break;
    case 'MODERATE':
    case 'AVAILABLE':
      colorClasses = 'bg-warning-subtle text-warning-text border-warning/30';
      dotColor = 'bg-warning';
      break;
    case 'NORMAL':
    case 'LOW':
    default:
      colorClasses = 'bg-safe-subtle text-safe-text border-safe/30';
      dotColor = 'bg-safe';
      break;
  }

  const paddingClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider font-medium rounded-sm border ${colorClasses} ${paddingClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {text}
    </span>
  );
};
