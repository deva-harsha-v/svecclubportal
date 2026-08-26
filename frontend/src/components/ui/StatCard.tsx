import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: string;
  variant?: 'default' | 'gold' | 'teal' | 'danger';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
}) => {
  const borderColors = {
    default: 'border-white/10 bg-surface/80',
    gold: 'border-gold/30 bg-gold/5',
    teal: 'border-cyanAcc/30 bg-cyanAcc/5',
    danger: 'border-red-500/30 bg-red-500/10',
  };

  return (
    <div className={`p-5 rounded-2xl border ${borderColors[variant]} shadow-lg backdrop-blur-xl flex flex-col justify-between`}>
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs font-semibold tracking-wider text-muted uppercase">
          {title}
        </span>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>
      <div className="mt-3">
        <div className="text-3xl font-bold font-display text-slate-100 tracking-tight">
          {value}
        </div>
        {subtitle && (
          <p className="mt-1 text-xs text-subtext font-sans">{subtitle}</p>
        )}
        {trend && (
          <span className="inline-block mt-2 text-xs font-mono font-medium text-cyanAcc bg-cyanAcc/10 px-2 py-0.5 rounded-full border border-cyanAcc/20">
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};
