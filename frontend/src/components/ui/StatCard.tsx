import React from 'react';

interface StatCardProps {
  label: string;
  value: number | string;
  change?: string;
  color?: string;
}

export default function StatCard({ label, value, color = 'text-ink' }: StatCardProps) {
  return (
    <div className="card p-5 animate-fade-up">
      <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">{label}</p>
      <p className={`text-3xl font-display font-semibold ${color}`}>{value}</p>
    </div>
  );
}
